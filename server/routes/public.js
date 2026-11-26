import express from 'express';
import { supabase } from '../db.js';

export const publicRouter = express.Router();

async function all(table) {
  const { data, error } = await supabase.from(table).select('data').order('updated_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((r) => r.data);
}

publicRouter.get('/products', async (_req, res, next) => { try { res.json(await all('products')); } catch (e) { next(e); } });
publicRouter.get('/branches', async (_req, res, next) => { try { res.json(await all('branches')); } catch (e) { next(e); } });
publicRouter.get('/blogs', async (_req, res, next) => { try { res.json(await all('blogs')); } catch (e) { next(e); } });
publicRouter.get('/team', async (_req, res, next) => { try { res.json(await all('team_members')); } catch (e) { next(e); } });
publicRouter.get('/bootstrap', async (_req, res, next) => {
  try {
    const [products, branches, blogs, team] = await Promise.all([all('products'), all('branches'), all('blogs'), all('team_members')]);
    res.json({ products, branches, blogs, team });
  } catch (e) { next(e); }
});
