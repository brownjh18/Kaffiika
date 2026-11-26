import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.warn('Missing SUPABASE_URL or SUPABASE_SECRET_KEY/SUPABASE_SERVICE_ROLE_KEY');
}

export const supabase = createClient(url || '', key || '', {
  auth: { persistSession: false, autoRefreshToken: false },
});

function nowIso() { return new Date().toISOString(); }

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
}

export function getStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || 'media';
}
