import express from 'express';
import { db, logAudit } from '../db.js';
import { hashPassword, verifyPassword, signToken, makeId, makeVerificationCode, publicUser, requireAuth } from '../auth.js';

export const authRouter = express.Router();

function nowIso() { return new Date().toISOString(); }

authRouter.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!name || !normalizedEmail || !password) return res.status(400).json({ error: 'Name, email, and password are required' });
  if (String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existing) return res.status(409).json({ error: 'An account with this email already exists' });

  const code = makeVerificationCode();
  const expires = Date.now() + 15 * 60 * 1000;
  const t = nowIso();
  const user = {
    id: makeId('u'),
    name: String(name).trim(),
    email: normalizedEmail,
    password_hash: hashPassword(String(password)),
    provider: 'email',
    photo_url: null,
    verified: 0,
    verification_code: code,
    verification_expires: expires,
    role: 'user',
    created_at: t,
    updated_at: t,
  };
  db.prepare(`INSERT INTO users (id,name,email,password_hash,provider,photo_url,verified,verification_code,verification_expires,role,created_at,updated_at)
    VALUES (@id,@name,@email,@password_hash,@provider,@photo_url,@verified,@verification_code,@verification_expires,@role,@created_at,@updated_at)`).run(user);
  logAudit({ actorUserId: user.id, actorEmail: user.email, actorRole: 'user', action: 'auth.register', entityType: 'user', entityId: user.id, ip: req.ip });
  // Demo/static-friendly: return code in response. In production wire to email provider.
  res.json({ ok: true, userId: user.id, email: user.email, verificationRequired: true, demoCode: code });
});

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);
  if (!user || user.provider !== 'email' || !verifyPassword(String(password || ''), user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const code = makeVerificationCode();
  const expires = Date.now() + 15 * 60 * 1000;
  db.prepare('UPDATE users SET verification_code=?, verification_expires=?, updated_at=? WHERE id=?').run(code, expires, nowIso(), user.id);
  logAudit({ actorUserId: user.id, actorEmail: user.email, actorRole: user.role, action: 'auth.login.verification_sent', entityType: 'user', entityId: user.id, ip: req.ip });
  res.json({ ok: true, userId: user.id, email: user.email, verificationRequired: true, demoCode: code });
});

authRouter.post('/verify', (req, res) => {
  const { email, code } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);
  if (!user) return res.status(400).json({ error: 'User not found' });
  if (!user.verification_code || !user.verification_expires) return res.status(400).json({ error: 'No verification pending' });
  if (Date.now() > Number(user.verification_expires)) return res.status(400).json({ error: 'Verification code expired' });
  if (String(code || '').trim() !== String(user.verification_code)) return res.status(400).json({ error: 'Invalid verification code' });
  db.prepare('UPDATE users SET verified=1, verification_code=NULL, verification_expires=NULL, updated_at=? WHERE id=?').run(nowIso(), user.id);
  const updated = db.prepare('SELECT * FROM users WHERE id=?').get(user.id);
  const token = signToken(updated);
  logAudit({ actorUserId: updated.id, actorEmail: updated.email, actorRole: updated.role, action: 'auth.verify.success', entityType: 'user', entityId: updated.id, ip: req.ip });
  res.json({ token, user: publicUser(updated) });
});

authRouter.post('/resend-code', (req, res) => {
  const { email } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);
  if (!user) return res.status(400).json({ error: 'User not found' });
  const code = makeVerificationCode();
  const expires = Date.now() + 15 * 60 * 1000;
  db.prepare('UPDATE users SET verification_code=?, verification_expires=?, updated_at=? WHERE id=?').run(code, expires, nowIso(), user.id);
  logAudit({ actorUserId: user.id, actorEmail: user.email, actorRole: user.role, action: 'auth.verification.resent', entityType: 'user', entityId: user.id, ip: req.ip });
  res.json({ ok: true, demoCode: code });
});

authRouter.post('/google', async (req, res) => {
  const { credential } = req.body || {};
  if (!credential) return res.status(400).json({ error: 'Missing Google credential' });
  try {
    // Verify with Google
    const r = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!r.ok) return res.status(401).json({ error: 'Invalid Google credential' });
    const payload = await r.json();
    const aud = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    if (aud && payload.aud !== aud) return res.status(401).json({ error: 'Google credential audience mismatch' });
    const email = String(payload.email || '').toLowerCase().trim();
    if (!email) return res.status(401).json({ error: 'Google account email missing' });
    if (String(payload.email_verified) !== 'true' && payload.email_verified !== true) {
      return res.status(401).json({ error: 'Google email not verified' });
    }
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    const t = nowIso();
    if (!user) {
      user = {
        id: makeId('u'),
        name: String(payload.name || email),
        email,
        password_hash: null,
        provider: 'google',
        photo_url: payload.picture || null,
        verified: 1,
        verification_code: null,
        verification_expires: null,
        role: 'user',
        created_at: t,
        updated_at: t,
      };
      db.prepare(`INSERT INTO users (id,name,email,password_hash,provider,photo_url,verified,verification_code,verification_expires,role,created_at,updated_at)
        VALUES (@id,@name,@email,@password_hash,@provider,@photo_url,@verified,@verification_code,@verification_expires,@role,@created_at,@updated_at)`).run(user);
      logAudit({ actorUserId: user.id, actorEmail: user.email, actorRole: 'user', action: 'auth.google.register', entityType: 'user', entityId: user.id, ip: req.ip });
    } else {
      db.prepare('UPDATE users SET name=COALESCE(NULLIF(name,""),?), photo_url=COALESCE(photo_url,?), verified=1, updated_at=? WHERE id=?')
        .run(String(payload.name || email), payload.picture || null, t, user.id);
      user = db.prepare('SELECT * FROM users WHERE id=?').get(user.id);
      logAudit({ actorUserId: user.id, actorEmail: user.email, actorRole: user.role, action: 'auth.google.login', entityType: 'user', entityId: user.id, ip: req.ip });
    }
    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Google sign-in failed' });
  }
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

authRouter.put('/profile', requireAuth, (req, res) => {
  const { name, photoUrl, currentPassword, newPassword } = req.body || {};
  const user = db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const nextName = String(name || '').trim();
  if (!nextName) return res.status(400).json({ error: 'Name is required' });
  let passwordHash = user.password_hash;
  if (newPassword) {
    if (user.provider !== 'email') return res.status(400).json({ error: 'Password cannot be changed for this account' });
    if (!verifyPassword(String(currentPassword || ''), user.password_hash)) return res.status(400).json({ error: 'Current password is incorrect' });
    if (String(newPassword).length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });
    passwordHash = hashPassword(String(newPassword));
  }
  db.prepare('UPDATE users SET name=?, photo_url=?, password_hash=?, updated_at=? WHERE id=?')
    .run(nextName, photoUrl || null, passwordHash, nowIso(), user.id);
  const updated = db.prepare('SELECT * FROM users WHERE id=?').get(user.id);
  logAudit({ actorUserId: updated.id, actorEmail: updated.email, actorRole: updated.role, action: 'user.profile.update', entityType: 'user', entityId: updated.id, ip: req.ip });
  res.json({ user: publicUser(updated) });
});
