import express from 'express';
import bcrypt from 'bcryptjs';
import { db, logAudit } from '../db.js';
import { requireAdmin, makeId, publicUser, hashPassword, signToken } from '../auth.js';

export const adminRouter = express.Router();

function nowIso() { return new Date().toISOString(); }
function readTable(table) {
  return db.prepare(`SELECT data FROM ${table} ORDER BY rowid DESC`).all().map((r) => JSON.parse(r.data));
}

adminRouter.post('/login', (req, res) => {
  const { password, email } = req.body || {};
  const adminEmail = String(email || process.env.ADMIN_EMAIL || 'admin@kaffiikafeeds.com').toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email=?').get(adminEmail);
  if (!user || user.role !== 'admin' || !bcrypt.compareSync(String(password || ''), user.password_hash || '')) {
    logAudit({ actorEmail: adminEmail, actorRole: 'admin', action: 'admin.login.failed', entityType: 'user', ip: req.ip });
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }
  const token = signToken(user);
  logAudit({ actorUserId: user.id, actorEmail: user.email, actorRole: 'admin', action: 'admin.login.success', entityType: 'user', entityId: user.id, ip: req.ip });
  res.json({ token, user: publicUser(user) });
});

adminRouter.use(requireAdmin);

// Users
adminRouter.get('/users', (req, res) => {
  const users = db.prepare('SELECT id,name,email,provider,photo_url,verified,role,created_at,updated_at FROM users ORDER BY created_at DESC').all().map(publicUser);
  res.json(users);
});

// Orders
adminRouter.get('/orders', (req, res) => {
  const rows = db.prepare('SELECT data FROM orders ORDER BY created_at DESC').all();
  res.json(rows.map((r) => JSON.parse(r.data)));
});

adminRouter.put('/orders/:id/status', (req, res) => {
  const { status } = req.body || {};
  const allowed = ['Pending', 'Processing', 'Dispatched', 'Completed'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const row = db.prepare('SELECT data FROM orders WHERE id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Order not found' });
  const order = JSON.parse(row.data);
  order.status = status;
  db.prepare('UPDATE orders SET status=?, data=?, updated_at=? WHERE id=?').run(status, JSON.stringify(order), nowIso(), req.params.id);
  logAudit({ actorUserId: req.user.id, actorEmail: req.user.email, actorRole: req.user.role, action: 'order.status.update', entityType: 'order', entityId: req.params.id, details: { status }, ip: req.ip });
  res.json(order);
});

adminRouter.delete('/orders/:id', (req, res) => {
  db.prepare('DELETE FROM orders WHERE id=?').run(req.params.id);
  logAudit({ actorUserId: req.user.id, actorEmail: req.user.email, actorRole: req.user.role, action: 'order.delete', entityType: 'order', entityId: req.params.id, ip: req.ip });
  res.json({ ok: true });
});

// Generic CRUD for simple tables
function crud(table, entityType) {
  return {
    list: (_req, res) => res.json(readTable(table)),
    upsert: (req, res) => {
      const item = req.body;
      if (!item || !item.id) return res.status(400).json({ error: 'id required' });
      db.prepare(`INSERT INTO ${table} (id,data,updated_at) VALUES (?,?,?)
        ON CONFLICT(id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at`).run(String(item.id), JSON.stringify(item), nowIso());
      logAudit({ actorUserId: req.user.id, actorEmail: req.user.email, actorRole: req.user.role, action: `${entityType}.upsert`, entityType, entityId: item.id, ip: req.ip });
      res.json(item);
    },
    remove: (req, res) => {
      db.prepare(`DELETE FROM ${table} WHERE id=?`).run(req.params.id);
      logAudit({ actorUserId: req.user.id, actorEmail: req.user.email, actorRole: req.user.role, action: `${entityType}.delete`, entityType, entityId: req.params.id, ip: req.ip });
      res.json({ ok: true });
    },
  };
}

for (const [path, table, type] of [
  ['products', 'products', 'product'],
  ['branches', 'branches', 'branch'],
  ['blogs', 'blogs', 'blog'],
  ['team', 'team_members', 'team'],
]) {
  const c = crud(table, type);
  adminRouter.get(`/${path}`, c.list);
  adminRouter.post(`/${path}`, c.upsert);
  adminRouter.put(`/${path}/:id`, (req, res) => { req.body.id = req.body.id || req.params.id; return c.upsert(req, res); });
  adminRouter.delete(`/${path}/:id`, c.remove);
}

// Audit logs
adminRouter.get('/logs', (req, res) => {
  const limit = Math.min(500, Math.max(1, Number(req.query.limit) || 200));
  const logs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?').all(limit).map((l) => ({
    ...l,
    details: l.details_json ? JSON.parse(l.details_json) : null,
  }));
  res.json(logs);
});

// Settings / admin password
adminRouter.post('/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  const user = db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id);
  if (!bcrypt.compareSync(String(currentPassword || ''), user.password_hash || '')) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }
  if (String(newPassword || '').length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });
  db.prepare('UPDATE users SET password_hash=?, updated_at=? WHERE id=?').run(hashPassword(String(newPassword)), nowIso(), user.id);
  logAudit({ actorUserId: user.id, actorEmail: user.email, actorRole: user.role, action: 'admin.password.change', entityType: 'user', entityId: user.id, ip: req.ip });
  res.json({ ok: true });
});
