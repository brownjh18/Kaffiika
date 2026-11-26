import express from 'express';
import bcrypt from 'bcryptjs';
import { supabase, logAudit } from '../db.js';
import { requireAdmin, publicUser, hashPassword, signToken } from '../auth.js';

export const adminRouter = express.Router();

function nowIso() { return new Date().toISOString(); }

async function readTable(table) {
  const { data, error } = await supabase.from(table).select('data').order('updated_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((r) => r.data);
}

adminRouter.post('/login', async (req, res, next) => {
  try {
    const { password, email } = req.body || {};
    const adminEmail = String(email || process.env.ADMIN_EMAIL || 'admin@kaffiikafeeds.com').toLowerCase();
    const { data: user, error } = await supabase.from('users').select('*').eq('email', adminEmail).maybeSingle();
    if (error) throw error;
    if (!user || user.role !== 'admin' || !bcrypt.compareSync(String(password || ''), user.password_hash || '')) {
      await logAudit({ actorEmail: adminEmail, actorRole: 'admin', action: 'admin.login.failed', entityType: 'user', ip: req.ip });
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    const token = signToken(user);
    await logAudit({ actorUserId: user.id, actorEmail: user.email, actorRole: 'admin', action: 'admin.login.success', entityType: 'user', entityId: user.id, ip: req.ip });
    res.json({ token, user: publicUser(user) });
  } catch (e) { next(e); }
});

adminRouter.use(requireAdmin);

// Users
adminRouter.get('/users', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id,name,email,provider,photo_url,verified,role,created_at,updated_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map(publicUser));
  } catch (e) { next(e); }
});

// Orders
adminRouter.get('/orders', async (_req, res, next) => {
  try {
    const { data, error } = await supabase.from('orders').select('data').order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map((r) => r.data));
  } catch (e) { next(e); }
});

adminRouter.put('/orders/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body || {};
    const allowed = ['Pending', 'Processing', 'Dispatched', 'Completed'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const { data: row, error } = await supabase.from('orders').select('data').eq('id', req.params.id).maybeSingle();
    if (error) throw error;
    if (!row) return res.status(404).json({ error: 'Order not found' });
    const order = { ...row.data, status };
    const { error: upErr } = await supabase.from('orders').update({ status, data: order, updated_at: nowIso() }).eq('id', req.params.id);
    if (upErr) throw upErr;
    await logAudit({ actorUserId: req.user.id, actorEmail: req.user.email, actorRole: req.user.role, action: 'order.status.update', entityType: 'order', entityId: req.params.id, details: { status }, ip: req.ip });
    res.json(order);
  } catch (e) { next(e); }
});

adminRouter.delete('/orders/:id', async (req, res, next) => {
  try {
    const { error } = await supabase.from('orders').delete().eq('id', req.params.id);
    if (error) throw error;
    await logAudit({ actorUserId: req.user.id, actorEmail: req.user.email, actorRole: req.user.role, action: 'order.delete', entityType: 'order', entityId: req.params.id, ip: req.ip });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// Generic CRUD for simple tables
function crud(table, entityType) {
  return {
    list: async (_req, res, next) => { try { res.json(await readTable(table)); } catch (e) { next(e); } },
    upsert: async (req, res, next) => {
      try {
        const item = req.body;
        if (!item || !item.id) return res.status(400).json({ error: 'id required' });
        const { error } = await supabase.from(table).upsert({ id: item.id, data: item, updated_at: nowIso() });
        if (error) throw error;
        await logAudit({ actorUserId: req.user.id, actorEmail: req.user.email, actorRole: req.user.role, action: `${entityType}.upsert`, entityType, entityId: item.id, ip: req.ip });
        res.json(item);
      } catch (e) { next(e); }
    },
    remove: async (req, res, next) => {
      try {
        const { error } = await supabase.from(table).delete().eq('id', req.params.id);
        if (error) throw error;
        await logAudit({ actorUserId: req.user.id, actorEmail: req.user.email, actorRole: req.user.role, action: `${entityType}.delete`, entityType, entityId: req.params.id, ip: req.ip });
        res.json({ ok: true });
      } catch (e) { next(e); }
    },
  };
}

for (const [routePath, table, type] of [
  ['products', 'products', 'product'],
  ['branches', 'branches', 'branch'],
  ['blogs', 'blogs', 'blog'],
  ['team', 'team_members', 'team'],
]) {
  const c = crud(table, type);
  adminRouter.get(`/${routePath}`, c.list);
  adminRouter.post(`/${routePath}`, c.upsert);
  adminRouter.put(`/${routePath}/:id`, (req, res, next) => { req.body.id = req.body.id || req.params.id; return c.upsert(req, res, next); });
  adminRouter.delete(`/${routePath}/:id`, c.remove);
}

// Audit logs
adminRouter.get('/logs', async (req, res, next) => {
  try {
    const limit = Math.min(500, Math.max(1, Number(req.query.limit) || 200));
    const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(limit);
    if (error) throw error;
    res.json((data || []).map((l) => ({ ...l, details: l.details_json ?? null })));
  } catch (e) { next(e); }
});

// Settings / admin password
adminRouter.post('/change-password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    const { data: user, error } = await supabase.from('users').select('*').eq('id', req.user.id).single();
    if (error) throw error;
    if (!bcrypt.compareSync(String(currentPassword || ''), user.password_hash || '')) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    if (String(newPassword || '').length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });
    const { error: upErr } = await supabase.from('users').update({ password_hash: hashPassword(String(newPassword)), updated_at: nowIso() }).eq('id', user.id);
    if (upErr) throw upErr;
    await logAudit({ actorUserId: user.id, actorEmail: user.email, actorRole: user.role, action: 'admin.password.change', entityType: 'user', entityId: user.id, ip: req.ip });
    res.json({ ok: true });
  } catch (e) { next(e); }
});
