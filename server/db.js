import pg from 'pg';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn('Missing DATABASE_URL - direct Postgres connection will fail');
}

export const pool = new Pool({
  connectionString,
  ssl: connectionString && !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1')
    ? { rejectUnauthorized: false }
    : undefined,
  max: 5,
});

// Keep Supabase client for Storage only
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseStorage = createClient(supabaseUrl || '', supabaseKey || '', {
  auth: { persistSession: false, autoRefreshToken: false },
});

function nowIso() { return new Date().toISOString(); }

function qIdent(name) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) throw new Error('Invalid identifier');
  return `"${name}"`;
}

class QueryBuilder {
  constructor(table) {
    this.table = table;
    this._op = 'select';
    this._select = '*';
    this._count = null;
    this._head = false;
    this._filters = [];
    this._order = null;
    this._limit = null;
    this._insert = null;
    this._update = null;
    this._upsert = null;
    this._delete = false;
    this._single = false;
    this._maybeSingle = false;
  }
  select(cols = '*', opts = {}) {
    if (this._op === 'insert' || this._op === 'update' || this._op === 'upsert' || this._op === 'delete') {
      this._returning = cols;
    } else {
      this._op = 'select';
      this._select = cols;
    }
    this._count = opts.count || null;
    this._head = !!opts.head;
    return this;
  }
  eq(col, val) { this._filters.push({ col, val }); return this; }
  order(col, opts = {}) { this._order = { col, ascending: opts.ascending !== false }; return this; }
  limit(n) { this._limit = n; return this; }
  insert(rows) { this._op = 'insert'; this._insert = Array.isArray(rows) ? rows : [rows]; return this; }
  update(values) { this._op = 'update'; this._update = values; return this; }
  upsert(rows) { this._op = 'upsert'; this._upsert = Array.isArray(rows) ? rows : [rows]; return this; }
  delete() { this._op = 'delete'; this._delete = true; return this; }
  single() { this._single = true; this._limit = 1; return this; }
  maybeSingle() { this._maybeSingle = true; this._limit = 1; return this; }

  async _exec() {
    const client = await pool.connect();
    try {
      const params = [];
      const where = () => {
        if (!this._filters.length) return '';
        return ' WHERE ' + this._filters.map((f) => {
          params.push(f.val);
          return `${qIdent(f.col)} = $${params.length}`;
        }).join(' AND ');
      };
      const order = () => this._order ? ` ORDER BY ${qIdent(this._order.col)} ${this._order.ascending ? 'ASC' : 'DESC'}` : '';
      const limit = () => this._limit ? ` LIMIT ${Number(this._limit)}` : '';
      let sql = '';
      if (this._op === 'select') {
        const cols = this._select === '*' ? '*' : this._select.split(',').map((c) => qIdent(c.trim())).join(', ');
        if (this._head && this._count === 'exact') {
          sql = `SELECT COUNT(*)::int AS count FROM ${qIdent(this.table)}${where()}`;
          const r = await client.query(sql, params);
          return { data: null, error: null, count: r.rows[0]?.count ?? 0 };
        }
        sql = `SELECT ${cols} FROM ${qIdent(this.table)}${where()}${order()}${limit()}`;
        const r = await client.query(sql, params);
        let data = r.rows;
        if (this._single) {
          if (data.length !== 1) return { data: null, error: { message: 'Row not found', code: 'PGRST116' } };
          return { data: data[0], error: null };
        }
        if (this._maybeSingle) return { data: data[0] || null, error: null };
        return { data, error: null, count: this._count === 'exact' ? data.length : null };
      }

      if (this._op === 'insert') {
        const rows = this._insert;
        const cols = Object.keys(rows[0]);
        const values = [];
        const groups = rows.map((row) => '(' + cols.map((c) => { params.push(row[c]); values.push(row[c]); return `$${params.length}`; }).join(', ') + ')');
        sql = `INSERT INTO ${qIdent(this.table)} (${cols.map(qIdent).join(', ')}) VALUES ${groups.join(', ')} RETURNING *`;
        const r = await client.query(sql, params);
        const data = r.rows;
        if (this._single) return { data: data[0] || null, error: null };
        if (this._maybeSingle) return { data: data[0] || null, error: null };
        return { data, error: null };
      }

      if (this._op === 'update') {
        const entries = Object.entries(this._update);
        const sets = entries.map(([k, v]) => { params.push(v); return `${qIdent(k)} = $${params.length}`; });
        sql = `UPDATE ${qIdent(this.table)} SET ${sets.join(', ')}${where()} RETURNING *`;
        const r = await client.query(sql, params);
        const data = r.rows;
        if (this._single) return { data: data[0] || null, error: null };
        if (this._maybeSingle) return { data: data[0] || null, error: null };
        return { data, error: null };
      }

      if (this._op === 'upsert') {
        const rows = this._upsert;
        const cols = Object.keys(rows[0]);
        const groups = rows.map((row) => '(' + cols.map((c) => { params.push(row[c]); return `$${params.length}`; }).join(', ') + ')');
        const updates = cols.filter((c) => c !== 'id').map((c) => `${qIdent(c)} = EXCLUDED.${qIdent(c)}`);
        sql = `INSERT INTO ${qIdent(this.table)} (${cols.map(qIdent).join(', ')}) VALUES ${groups.join(', ')} ON CONFLICT (id) DO UPDATE SET ${updates.join(', ')} RETURNING *`;
        const r = await client.query(sql, params);
        const data = r.rows;
        return { data, error: null };
      }

      if (this._op === 'delete') {
        sql = `DELETE FROM ${qIdent(this.table)}${where()} RETURNING *`;
        const r = await client.query(sql, params);
        return { data: r.rows, error: null };
      }

      return { data: null, error: { message: 'Unknown op' } };
    } catch (e) {
      return { data: null, error: { message: e.message, code: e.code, details: e.detail, hint: e.hint } };
    } finally {
      client.release();
    }
  }

  then(onfulfilled, onrejected) {
    return this._exec().then(onfulfilled, onrejected);
  }
}

// Compatibility shim: routes do supabase.from(...), uploads do supabase.storage.from(...)
export const supabase = {
  from: (table) => new QueryBuilder(table),
  storage: supabaseStorage.storage,
};

export async function logAudit({ actorUserId = null, actorEmail = null, actorRole = null, action, entityType = null, entityId = null, details = null, ip = null }) {
  try {
    await supabase.from('audit_logs').insert({
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      actor_user_id: actorUserId,
      actor_email: actorEmail,
      actor_role: actorRole,
      action,
      entity_type: entityType,
      entity_id: entityId ? String(entityId) : null,
      details_json: details ?? null,
      ip,
      created_at: nowIso(),
    });
  } catch (e) {
    console.error('Audit log failed', e.message);
  }
}

async function tableCount(table) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count || 0;
}

export async function seedDefaults({ products = [], branches = [], blogs = [], team = [] } = {}) {
  const t = nowIso();
  try {
    if ((await tableCount('products')) === 0 && products.length) {
      await supabase.from('products').upsert(products.map((p) => ({ id: p.id, data: p, updated_at: t })));
    }
    if ((await tableCount('branches')) === 0 && branches.length) {
      await supabase.from('branches').upsert(branches.map((b) => ({ id: b.id, data: b, updated_at: t })));
    }
    if ((await tableCount('blogs')) === 0 && blogs.length) {
      await supabase.from('blogs').upsert(blogs.map((b) => ({ id: b.id, data: b, updated_at: t })));
    }
    if ((await tableCount('team_members')) === 0 && team.length) {
      await supabase.from('team_members').upsert(team.map((m) => ({ id: m.id, data: m, updated_at: t })));
    }

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@kaffiikafeeds.com').toLowerCase();
    const { data: admin } = await supabase.from('users').select('id').eq('email', adminEmail).maybeSingle();
    if (!admin) {
      const password = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
      await supabase.from('users').insert({
        id: 'admin-user',
        name: 'System Admin',
        email: adminEmail,
        password_hash: bcrypt.hashSync(password, 10),
        provider: 'email',
        verified: true,
        role: 'admin',
        created_at: t,
        updated_at: t,
      });
    }
  } catch (e) {
    console.error('Seed defaults failed:', e.message);
  }
}

export function getStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || 'media';
}
