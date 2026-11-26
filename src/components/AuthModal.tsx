import React, { useEffect, useRef, useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';

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
const GOOGLE_SCRIPT_ID = 'google-gsi-script';

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
    if (!payload) return null;
    const base = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base.padEnd(base.length + ((4 - (base.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getGoogleClientId(): string {
  const raw = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return typeof raw === 'string' ? raw.trim() : '';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuth }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const googleBtnRef = useRef<HTMLDivElement | null>(null);
  const onAuthRef = useRef(onAuth);
  const onCloseRef = useRef(onClose);

  const googleClientId = getGoogleClientId();

  useEffect(() => {
    onAuthRef.current = onAuth;
    onCloseRef.current = onClose;
  }, [onAuth, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setGoogleError(null);
  }, [isOpen, mode]);

  useEffect(() => {
    if (!isOpen || !googleClientId) return;

    let cancelled = false;

    const renderButton = () => {
      if (cancelled) return;
      const google = (window as any).google;
      const el = googleBtnRef.current;
      if (!google?.accounts?.id || !el) return;

      try {
        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response: any) => {
            const credential = response?.credential;
            if (!credential) {
              setError('Google sign-in did not return a credential. Please try again.');
              return;
            }
            const payload = decodeJwt(credential);
            const emailValue = String(payload?.email || '').toLowerCase().trim();
            if (!payload || !emailValue) {
              setError('Google sign-in failed. Please try again.');
              return;
            }
            if (payload.email_verified === false) {
              setError('Your Google email is not verified. Please use a verified Google account.');
              return;
            }

            const users = loadUsers();
            let user = users.find((u) => u.email.toLowerCase() === emailValue);
            if (!user) {
              user = {
                id: `u_${Date.now()}`,
                name: String(payload.name || payload.given_name || emailValue),
                email: emailValue,
                provider: 'google',
              };
              users.push(user);
              saveUsers(users);
            }

            onAuthRef.current({
              id: user.id,
              name: user.name,
              email: user.email,
              provider: user.provider,
            });
            onCloseRef.current();
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        el.innerHTML = '';
        const width = Math.max(200, Math.min(360, Math.floor(el.clientWidth || 320)));
        google.accounts.id.renderButton(el, {
          theme: 'outline',
          size: 'large',
          width,
          text: mode === 'signup' ? 'signup_with' : 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        });
        setGoogleReady(true);
        setGoogleError(null);
      } catch (e) {
        console.error('Google sign-in initialization failed', e);
        setGoogleReady(false);
        setGoogleError('Google sign-in could not be initialized. Check your VITE_GOOGLE_CLIENT_ID and authorized origins.');
      }
    };

    const handleScriptError = () => {
      if (cancelled) return;
      setGoogleReady(false);
      setGoogleError('Could not load Google sign-in. Check your internet connection or ad/script blocker.');
    };

    const existing = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
    if ((window as any).google?.accounts?.id) {
      renderButton();
    } else if (existing) {
      existing.addEventListener('load', renderButton);
      existing.addEventListener('error', handleScriptError);
      // In case it loaded between check and listener attachment
      if ((window as any).google?.accounts?.id) renderButton();
    } else {
      const script = document.createElement('script');
      script.id = GOOGLE_SCRIPT_ID;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = renderButton;
      script.onerror = handleScriptError;
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      const script = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
      script?.removeEventListener('load', renderButton);
      script?.removeEventListener('error', handleScriptError);
    };
  }, [isOpen, googleClientId, mode]);

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
      if (!name.trim()) {
        setError('Name is required.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
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
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 cursor-pointer" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {googleClientId ? (
            <div>
              <div ref={googleBtnRef} id="google-signin-btn" className="min-h-[44px] w-full flex justify-center" />
              {!googleReady && !googleError && (
                <p className="text-xs text-slate-400 mt-2 text-center">Loading Google sign-in...</p>
              )}
              {googleError && (
                <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{googleError}</span>
                </div>
              )}
              <div className="flex items-center gap-3 my-4">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-xs text-slate-400">or</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p>
                Google sign-in is available when <code className="font-mono bg-slate-100 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> is configured.
              </p>
              <p className="mt-1 text-slate-400">
                Add it to your environment and redeploy. See README for setup.
              </p>
              <div className="flex items-center gap-3 my-3">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-xs text-slate-400">use email</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>
            </div>
          )}

          <form onSubmit={submit} className="space-y-3">
            {mode === 'signup' && (
              <label className="block">
                <span className="text-xs font-bold text-slate-600">Full Name</span>
                <div className="mt-1 relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-200 text-sm"
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>
              </label>
            )}
            <label className="block">
              <span className="text-xs font-bold text-slate-600">Email</span>
              <div className="mt-1 relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-200 text-sm"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-600">Password</span>
              <div className="mt-1 relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-200 text-sm"
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
              </div>
            </label>
            {error && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</div>}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-sm cursor-pointer"
            >
              {mode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
            </button>
          </form>

          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError(null);
            }}
            className="w-full text-xs text-[#065AA7] font-bold hover:underline cursor-pointer"
          >
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
