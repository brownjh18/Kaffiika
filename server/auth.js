import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-change-me';
const TOKEN_TTL = '7d';

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password, hash) {
  if (!hash) return false;
  return bcrypt.compareSync(password, hash);
}

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function getAuthUser(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    const user = db.prepare('SELECT id,name,email,provider,photo_url,verified,role,created_at,updated_at FROM users WHERE id = ?').get(payload.sub);
    return user || null;
  } catch {
    return null;
  }
}

export function requireAuth(req, res, next) {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });
  req.user = user;
  next();
}

export function requireAdmin(req, res, next) {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });
  if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  req.user = user;
  next();
}

export function makeId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function makeVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function publicUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    provider: u.provider,
    photoUrl: u.photo_url || undefined,
    verified: !!u.verified,
    role: u.role,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
  };
}
