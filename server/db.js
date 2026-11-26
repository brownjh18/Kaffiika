import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = process.env.DB_PATH || path.join(dataDir, 'app.sqlite');
export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  provider TEXT NOT NULL DEFAULT 'email',
  photo_url TEXT,
  verified INTEGER NOT NULL DEFAULT 0,
  verification_code TEXT,
  verification_expires INTEGER,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS branches (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  customer_email TEXT,
  status TEXT NOT NULL,
  total_amount_ugx INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT,
  actor_email TEXT,
  actor_role TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details_json TEXT,
  ip TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_email);
`);

function nowIso() { return new Date().toISOString(); }

export function seedDefaults({ products = [], branches = [], blogs = [], team = [] } = {}) {
  const count = (table) => db.prepare(`SELECT COUNT(*) as c FROM ${table}`).get().c;
  const insertProduct = db.prepare('INSERT OR IGNORE INTO products (id, data, updated_at) VALUES (?, ?, ?)');
  const insertBranch = db.prepare('INSERT OR IGNORE INTO branches (id, data, updated_at) VALUES (?, ?, ?)');
  const insertBlog = db.prepare('INSERT OR IGNORE INTO blogs (id, data, updated_at) VALUES (?, ?, ?)');
  const insertTeam = db.prepare('INSERT OR IGNORE INTO team_members (id, data, updated_at) VALUES (?, ?, ?)');
  const t = nowIso();

  if (count('products') === 0 && products.length) {
    const tx = db.transaction((rows) => { for (const r of rows) insertProduct.run(r.id, JSON.stringify(r), t); });
    tx(products);
  }
  if (count('branches') === 0 && branches.length) {
    const tx = db.transaction((rows) => { for (const r of rows) insertBranch.run(r.id, JSON.stringify(r), t); });
    tx(branches);
  }
  if (count('blogs') === 0 && blogs.length) {
    const tx = db.transaction((rows) => { for (const r of rows) insertBlog.run(r.id, JSON.stringify(r), t); });
    tx(blogs);
  }
  if (count('team_members') === 0 && team.length) {
    const tx = db.transaction((rows) => { for (const r of rows) insertTeam.run(r.id, JSON.stringify(r), t); });
    tx(team);
  }

  // Seed admin user
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@kaffiikafeeds.com').toLowerCase();
  const admin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  if (!admin) {
    const password = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
    db.prepare(`INSERT INTO users (id,name,email,password_hash,provider,verified,role,created_at,updated_at)
      VALUES (@id,@name,@email,@password_hash,'email',1,'admin',@created_at,@updated_at)`).run({
      id: 'admin-user',
      name: 'System Admin',
      email: adminEmail,
      password_hash: bcrypt.hashSync(password, 10),
      created_at: t,
      updated_at: t,
    });
  }
}

export function logAudit({ actorUserId = null, actorEmail = null, actorRole = null, action, entityType = null, entityId = null, details = null, ip = null }) {
  db.prepare(`INSERT INTO audit_logs (id,actor_user_id,actor_email,actor_role,action,entity_type,entity_id,details_json,ip,created_at)
    VALUES (@id,@actor_user_id,@actor_email,@actor_role,@action,@entity_type,@entity_id,@details_json,@ip,@created_at)`).run({
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    actor_user_id: actorUserId,
    actor_email: actorEmail,
    actor_role: actorRole,
    action,
    entity_type: entityType,
    entity_id: entityId ? String(entityId) : null,
    details_json: details ? JSON.stringify(details) : null,
    ip,
    created_at: nowIso(),
  });
}
