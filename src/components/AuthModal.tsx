import React, { useEffect, useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: 'email' | 'google';
}

interface StoredUser extends AuthUser {
  password?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: AuthUser) => void;
}

const USERS_KEY = 'kaffiika_users_v1';

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function decodeJwt(token: string): any {
  try {
    const payload = token.split('.')[1];
    const base = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuth }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!isOpen || !googleClientId) return;
    const existing = document.querySelector('script[data-google-gsi]');
    const init = () => {
      const google = (window as any).google;
      if (!google?.accounts?.id) return;
      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response: any) => {
          const payload = decodeJwt(response.credential);
          if (!payload?.email) {
            setError('Google sign-in failed. Please try again.');
            return;
          }
          const users = loadUsers();
          let user = users.find((u) => u.email.toLowerCase() === String(payload.email).toLowerCase());
          if (!user) {
            user = {
              id: `u_${Date.now()}`,
              name: payload.name || payload.email,
              email: payload.email,
              provider: 'google',
            };
            users.push(user);
            saveUsers(users);
          }
          onAuth({ id: user.id, name: user.name, email: user.email, provider: user.provider });
          onClose();
        },
      });
      const el = document.getElementById('google-signin-btn');
      if (el) {
        el.innerHTML = '';
        google.accounts.id.renderButton(el, { theme: 'outline', size: 'large', width: 320 });
      }
    };
    if (existing) {
      init();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-google-gsi', 'true');
    script.onload = init;
    document.body.appendChild(script);
  }, [isOpen, googleClientId, onAuth, onClose]);

  if (!isOpen) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const users = loadUsers();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError('Email and password are required.');
      return;
    }
    if (mode === 'signup') {
      if (!name.trim()) { setError('Name is required.'); return; }
      if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
        setError('An account with this email already exists. Please sign in.');
        return;
      }
      const user: StoredUser = {
        id: `u_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
        provider: 'email',
      };
      users.push(user);
      saveUsers(users);
      onAuth({ id: user.id, name: user.name, email: user.email, provider: 'email' });
      onClose();
      return;
    }
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail && u.provider === 'email');
    if (!user || user.password !== password) {
      setError('Invalid email or password.');
      return;
    }
    onAuth({ id: user.id, name: user.name, email: user.email, provider: 'email' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#061A36]/55 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-sky-200 overflow-hidden">
        <div className="px-6 py-4 bg-[#061A36] text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">{mode === 'signin' ? 'Sign In' : 'Create Account'}</h2>
            <p className="text-xs text-sky-200">Save your quote and manage your orders.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 cursor-pointer" aria-label="Close"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          {googleClientId ? (
            <div>
              <div id="google-signin-btn" className="min-h-[44px]" />
              <div className="flex items-center gap-3 my-4"><div className="h-px bg-slate-200 flex-1" /><span className="text-xs text-slate-400">or</span><div className="h-px bg-slate-200 flex-1" /></div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-3">
              Google sign-in is available when <code>VITE_GOOGLE_CLIENT_ID</code> is configured.
              <div className="flex items-center gap-3 my-3"><div className="h-px bg-slate-200 flex-1" /><span className="text-xs text-slate-400">use email</span><div className="h-px bg-slate-200 flex-1" /></div>
            </div>
          )}

          <form onSubmit={submit} className="space-y-3">
            {mode === 'signup' && (
              <label className="block">
                <span className="text-xs font-bold text-slate-600">Full Name</span>
                <div className="mt-1 relative"><User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={name} onChange={(e)=>setName(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-200 text-sm" placeholder="Your name" /></div>
              </label>
            )}
            <label className="block">
              <span className="text-xs font-bold text-slate-600">Email</span>
              <div className="mt-1 relative"><Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-200 text-sm" placeholder="you@example.com" /></div>
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-600">Password</span>
              <div className="mt-1 relative"><Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-200 text-sm" placeholder="Password" /></div>
            </label>
            {error && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</div>}
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-sm cursor-pointer">
              {mode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
            </button>
          </form>
          <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }} className="w-full text-xs text-[#065AA7] font-bold hover:underline cursor-pointer">
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
