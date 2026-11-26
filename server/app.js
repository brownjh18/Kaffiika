import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedDefaults } from './db.js';
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

app.get('/api/health', (_req, res) => res.json({ ok: true, db: 'supabase' }));
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
  res.status(500).json({ error: 'Internal server error' });
});
