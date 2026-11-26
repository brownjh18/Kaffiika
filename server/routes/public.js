import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from '../db.js';

export const publicRouter = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let defaultsCache = null;
function getDefaults() {
  if (defaultsCache) return defaultsCache;
  try {
    const p = path.join(__dirname, '..', 'defaults.json');
    defaultsCache = JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    defaultsCache = {};
  }
  return defaultsCache;
}

const fallbackMap = {
  products: 'PRODUCTS',
  branches: 'BRANCHES',
  blogs: 'BLOG_POSTS',
  team_members: 'TEAM_MEMBERS',
};

async function all(table) {
  try {
    const { data, error } = await supabase.from(table).select('data').order('updated_at', { ascending: false });
    if (error) throw error;
    const rows = (data || []).map((r) => r.data);
    if (rows.length) return rows;
  } catch (e) {
    console.error(`DB read failed for ${table}, using defaults:`, e.message);
  }
  const defaults = getDefaults();
  return defaults[fallbackMap[table]] || [];
}

publicRouter.get('/products', async (_req, res) => { res.json(await all('products')); });
publicRouter.get('/branches', async (_req, res) => { res.json(await all('branches')); });
publicRouter.get('/blogs', async (_req, res) => { res.json(await all('blogs')); });
publicRouter.get('/team', async (_req, res) => { res.json(await all('team_members')); });
publicRouter.get('/bootstrap', async (_req, res) => {
  const [products, branches, blogs, team] = await Promise.all([all('products'), all('branches'), all('blogs'), all('team_members')]);
  res.json({ products, branches, blogs, team });
});
