import express from 'express';
import crypto from 'crypto';
import { supabase, getStorageBucket, logAudit } from '../db.js';
import { requireAuth } from '../auth.js';

export const uploadsRouter = express.Router();
uploadsRouter.use(requireAuth);

function parseDataUrl(dataUrl) {
  const m = String(dataUrl || '').match(/^data:([^;]+);base64,(.+)$/);
  if (!m) return null;
  return { mimeType: m[1], buffer: Buffer.from(m[2], 'base64') };
}

function extFromMime(mime) {
  const map = {
    'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
    'image/svg+xml': 'svg', 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov',
  };
  return map[mime] || 'bin';
}

uploadsRouter.post('/', async (req, res, next) => {
  try {
    const { dataUrl, folder = 'uploads', filename = 'file' } = req.body || {};
    const parsed = parseDataUrl(dataUrl);
    if (!parsed) return res.status(400).json({ error: 'Invalid dataUrl' });
    if (parsed.buffer.length > 8 * 1024 * 1024) return res.status(400).json({ error: 'File too large (max 8MB)' });

    const allowed = /^(image\/(jpeg|png|webp|gif|svg\+xml)|video\/(mp4|webm|quicktime))$/;
    if (!allowed.test(parsed.mimeType)) return res.status(400).json({ error: 'Unsupported file type' });

    const safeFolder = String(folder).replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '') || 'uploads';
    const ext = extFromMime(parsed.mimeType);
    const base = String(filename).replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 60) || 'file';
    const path = `${safeFolder}/${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${base}.${ext}`;
    const bucket = getStorageBucket();

    const { error } = await supabase.storage.from(bucket).upload(path, parsed.buffer, {
      contentType: parsed.mimeType, upsert: false,
    });
    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    const url = data?.publicUrl;
    await logAudit({ actorUserId: req.user.id, actorEmail: req.user.email, actorRole: req.user.role, action: 'media.upload', entityType: 'media', entityId: path, details: { mimeType: parsed.mimeType, size: parsed.buffer.length }, ip: req.ip });
    res.json({ url, path, bucket });
  } catch (e) { next(e); }
});
