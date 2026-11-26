import express from 'express';
import { db } from '../db.js';

export const publicRouter = express.Router();

function all(table) {
  return db.prepare(`SELECT data FROM ${table} ORDER BY rowid ASC`).all().map((r) => JSON.parse(r.data));
}

publicRouter.get('/products', (_req, res) => res.json(all('products')));
publicRouter.get('/branches', (_req, res) => res.json(all('branches')));
publicRouter.get('/blogs', (_req, res) => res.json(all('blogs')));
publicRouter.get('/team', (_req, res) => res.json(all('team_members')));

publicRouter.get('/bootstrap', (_req, res) => {
  res.json({
    products: all('products'),
    branches: all('branches'),
    blogs: all('blogs'),
    team: all('team_members'),
  });
});
