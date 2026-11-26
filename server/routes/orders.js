import express from 'express';
import { supabase, logAudit } from '../db.js';
import { requireAuth, makeId } from '../auth.js';

export const ordersRouter = express.Router();
ordersRouter.use(requireAuth);

ordersRouter.post('/', async (req, res, next) => {
  try {
    const o = req.body || {};
    if (!Array.isArray(o.items) || o.items.length === 0) return res.status(400).json({ error: 'Order items required' });
    const now = new Date().toISOString();
    const order = {
      ...o,
      id: o.id || makeId('ord'),
      userId: req.user.id,
      customerEmail: o.customerEmail || req.user.email,
      customerName: o.customerName || req.user.name,
      status: 'Pending',
      createdAt: o.createdAt || now,
    };
    const { error } = await supabase.from('orders').upsert({
      id: order.id,
      user_id: order.userId,
      customer_email: order.customerEmail,
      status: order.status,
      total_amount_ugx: Number(order.totalAmountUgx) || 0,
      created_at: order.createdAt,
      data: order,
      updated_at: now,
    });
    if (error) throw error;
    await logAudit({ actorUserId: req.user.id, actorEmail: req.user.email, actorRole: req.user.role, action: 'order.create', entityType: 'order', entityId: order.id, details: { totalAmountUgx: order.totalAmountUgx, items: order.items?.length }, ip: req.ip });
    res.status(201).json(order);
  } catch (e) { next(e); }
});

ordersRouter.get('/mine', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('orders').select('data').eq('user_id', req.user.id).order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map((r) => r.data));
  } catch (e) { next(e); }
});
