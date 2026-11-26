export type ApiUser = {
  id: string;
  name: string;
  email: string;
  provider: 'email' | 'google';
  photoUrl?: string;
  verified?: boolean;
  role?: 'user' | 'admin';
};

const TOKEN_KEY = 'kaffiika_auth_token';
const ADMIN_TOKEN_KEY = 'kaffiika_admin_token';
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function getToken() { return localStorage.getItem(TOKEN_KEY) || ''; }
export function setToken(t: string) { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); }
export function getAdminToken() { return localStorage.getItem(ADMIN_TOKEN_KEY) || ''; }
export function setAdminToken(t: string) { if (t) localStorage.setItem(ADMIN_TOKEN_KEY, t); else localStorage.removeItem(ADMIN_TOKEN_KEY); }

async function request(path: string, opts: RequestInit = {}, admin = false) {
  const token = admin ? getAdminToken() : getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as any || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const url = `${API_BASE}${path}`;
  let res: Response;
  try {
    res = await fetch(url, { ...opts, headers });
  } catch {
    throw new Error('Cannot reach backend API. Start the server locally or set VITE_API_URL to your deployed backend.');
  }
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const msg = (data && typeof data === 'object' && (data.error || data.message))
      || (res.status === 404 || res.status === 405 ? 'Backend API not available on this deployment. Deploy the backend and set VITE_API_URL, or run the API server locally.' : `Request failed (${res.status})`);
    throw new Error(msg);
  }
  return data;
}

export const api = {
  bootstrap: () => request('/api/bootstrap'),
  register: (body: any) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  verify: (body: any) => request('/api/auth/verify', { method: 'POST', body: JSON.stringify(body) }),
  resendCode: (body: any) => request('/api/auth/resend-code', { method: 'POST', body: JSON.stringify(body) }),
  google: (body: any) => request('/api/auth/google', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/api/auth/me'),
  updateProfile: (body: any) => request('/api/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  createOrder: (body: any) => request('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
  myOrders: () => request('/api/orders/mine'),

  adminLogin: (body: any) => request('/api/admin/login', { method: 'POST', body: JSON.stringify(body) }),
  adminUsers: () => request('/api/admin/users', {}, true),
  adminOrders: () => request('/api/admin/orders', {}, true),
  adminLogs: () => request('/api/admin/logs', {}, true),
  adminChangePassword: (body: any) => request('/api/admin/change-password', { method: 'POST', body: JSON.stringify(body) }, true),
  adminUpdateOrderStatus: (id: string, status: string) => request(`/api/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }, true),
  adminDeleteOrder: (id: string) => request(`/api/admin/orders/${id}`, { method: 'DELETE' }, true),
  adminUpsert: (entity: 'products'|'branches'|'blogs'|'team', item: any) => request(`/api/admin/${entity}`, { method: 'POST', body: JSON.stringify(item) }, true),
  adminDelete: (entity: 'products'|'branches'|'blogs'|'team', id: string) => request(`/api/admin/${entity}/${id}`, { method: 'DELETE' }, true),
  upload: (dataUrl: string, folder = 'uploads', filename = 'file', admin = false) => request('/api/uploads', { method: 'POST', body: JSON.stringify({ dataUrl, folder, filename }) }, admin),
};
