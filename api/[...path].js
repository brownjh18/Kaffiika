import { app, ensureSeeded } from '../server/app.js';

export default async function handler(req, res) {
  await ensureSeeded();
  return app(req, res);
}
