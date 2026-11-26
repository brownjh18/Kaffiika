import express from 'express';
import { db, logAudit } from '../db.js';
import { requireAuth, makeId } from '../auth.js';

export const ordersRouter = express.Router();

ordersRouter.use(requireAuth);

ordersRouter.post('/', (req, res) => {
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
  db.prepare(`INSERT INTO orders (id,user_id,customer_email,status,total_amount_ugx,created_at,data,updated_at)
    VALUES (@id,@user_id,@customer_email,@status,@total_amount_ugx,@created_at,@data,@updated_at)
    ON CONFLICT(id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at, status=excluded.status`).run({
    id: order.id,
    user_id: order.userId,
    customer_email: order.customerEmail,
    status: order.status,
    total_amount_ugx: Number(order.totalAmountUgx) || 0,
    created_at: order.createdAt,
    data: JSON.stringify(order),
    updated_at: now,
  });
  logAudit({ actorUserId: req.user.id, actorEmail: req.user.email, actorRole: req.user.role, action: 'order.create', entityType: 'order', entityId: order.id, details: { totalAmountUgx: order.totalAmountUgx, items: order.items?.length }, ip: req.ip });
  res.status(201).json(order);
});

ordersRouter.get('/mine', (req, res) => {
  const rows = db.prepare('SELECT data FROM orders WHERE user_id=? ORDER BY created_at DESC').all(req.user.id);
  res.json(rows.map((r) => JSON.parse(r.data)));
});
