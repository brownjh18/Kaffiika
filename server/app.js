import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedDefaults, supabase } from './db.js';
import { publicRouter } from './routes/public.js';
import { authRouter } from './routes/auth.js';
import { adminRouter } from './routes/admin.js';
import { ordersRouter } from './routes/orders.js';
import { uploadsRouter } from './routes/uploads.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',').map(s => s.trim()).filter(Boolean) || true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

let seeded;
export async function ensureSeeded() {
  if (!seeded) {
    seeded = (async () => {
      try {
        const defaultsPath = path.join(__dirname, 'defaults.json');
        if (fs.existsSync(defaultsPath)) {
          const d = JSON.parse(fs.readFileSync(defaultsPath, 'utf8'));
          await seedDefaults({ products: d.PRODUCTS || [], branches: d.BRANCHES || [], blogs: d.BLOG_POSTS || [], team: d.TEAM_MEMBERS || [] });
        } else {
          await seedDefaults({});
        }
      } catch (e) {
        console.error('Seed failed', e);
      }
    })();
  }
  return seeded;
}

app.get('/api/health', (_req, res) => {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  res.json({
    ok: true,
    db: process.env.DATABASE_URL ? 'postgres' : 'supabase',
    supabaseUrl: process.env.SUPABASE_URL || null,
    hasKey: !!key,
    keyType: key.startsWith('sb_secret_') ? 'secret' : key.startsWith('sb_publishable_') ? 'publishable' : key ? 'other' : 'missing',
  });
});

app.get('/api/health/db', async (_req, res) => {
  const checks = {};
  for (const t of ['users', 'products', 'branches', 'blogs', 'team_members', 'orders', 'audit_logs']) {
    const { error, count } = await supabase.from(t).select('*', { count: 'exact', head: true });
    checks[t] = error ? { ok: false, message: error.message, code: error.code, details: error.details, hint: error.hint } : { ok: true, count };
  }
  res.json({ ok: Object.values(checks).every((c) => c.ok), checks });
});
app.use('/api', publicRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/uploads', uploadsRouter);

// Serve built frontend (single-deployment Node mode)
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  const message = err?.message || 'Internal server error';
  res.status(500).json({ error: message });
});
