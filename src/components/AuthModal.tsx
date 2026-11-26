import React, { useEffect, useRef, useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle, ShieldCheck, RefreshCw } from 'lucide-react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: 'email' | 'google';
  photoUrl?: string;
  verified?: boolean;
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

function makeCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuth }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<'auth' | 'verify'>('auth');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingUser, setPendingUser] = useState<StoredUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
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
    setInfo(null);
    setGoogleError(null);
  }, [isOpen, mode, step]);

  const completeAuth = (user: StoredUser) => {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    const verifiedUser: StoredUser = { ...user, verified: true };
    if (idx >= 0) users[idx] = { ...users[idx], ...verifiedUser };
    else users.push(verifiedUser);
    saveUsers(users);
    onAuth({
      id: verifiedUser.id,
      name: verifiedUser.name,
      email: verifiedUser.email,
      provider: verifiedUser.provider,
      photoUrl: verifiedUser.photoUrl,
      verified: true,
    });
    setStep('auth');
    setPendingUser(null);
    setVerificationCode('');
    setCodeInput('');
    setPassword('');
    onClose();
  };

  const sendVerificationCode = (user: StoredUser) => {
    const code = makeCode();
    setVerificationCode(code);
    setPendingUser(user);
    setCodeInput('');
    setStep('verify');
    setError(null);
    // Static/demo app has no email backend. Show code clearly so the flow is testable.
    setInfo(`Verification code sent to ${user.email}. Demo code: ${code}`);
  };

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
                photoUrl: payload.picture ? String(payload.picture) : undefined,
                verified: true,
              };
              users.push(user);
              saveUsers(users);
            } else {
              user = {
                ...user,
                name: user.name || String(payload.name || emailValue),
                photoUrl: user.photoUrl || (payload.picture ? String(payload.picture) : undefined),
                verified: true,
              };
              const idx = users.findIndex((u) => u.id === user!.id);
              if (idx >= 0) users[idx] = user;
              saveUsers(users);
            }

            onAuthRef.current({
              id: user.id,
              name: user.name,
              email: user.email,
              provider: user.provider,
              photoUrl: user.photoUrl,
              verified: true,
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
    setInfo(null);
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
        verified: false,
      };
      users.push(user);
      saveUsers(users);
      sendVerificationCode(user);
      return;
    }

    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail && u.provider === 'email');
    if (!user || user.password !== password) {
      setError('Invalid email or password.');
      return;
    }
    sendVerificationCode(user);
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!pendingUser) {
      setError('No pending verification. Please sign in again.');
      setStep('auth');
      return;
    }
    if (codeInput.trim() !== verificationCode) {
      setError('Invalid verification code. Please try again.');
      return;
    }
    completeAuth(pendingUser);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#061A36]/55 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-sky-200 overflow-hidden">
        <div className="px-6 py-4 bg-[#061A36] text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {step === 'verify' ? 'Verify Your Email' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-xs text-sky-200">
              {step === 'verify' ? 'Enter the verification code to continue.' : 'Save your quote and manage your orders.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 cursor-pointer" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {step === 'verify' ? (
            <form onSubmit={verify} className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sm text-[#0A1E3C]">
                <div className="flex items-center gap-2 font-bold text-[#065AA7] mb-1">
                  <ShieldCheck className="w-4 h-4" /> Email Verification
                </div>
                <p className="text-xs text-slate-600">
                  We sent a 6-digit verification code to <span className="font-semibold">{pendingUser?.email}</span>.
                </p>
                {info && <p className="text-xs mt-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">{info}</p>}
              </div>
              <label className="block">
                <span className="text-xs font-bold text-slate-600">Verification Code</span>
                <input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-sky-200 text-sm font-mono-tech tracking-[0.3em] text-center"
                  placeholder="000000"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              </label>
              {error && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</div>}
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-sm cursor-pointer">
                <ShieldCheck className="w-4 h-4" /> Verify & Continue
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => pendingUser && sendVerificationCode(pendingUser)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Resend Code
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('auth'); setError(null); setInfo(null); }}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Back
                </button>
              </div>
            </form>
          ) : (
            <>
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
                {info && <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5">{info}</div>}
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
                  setInfo(null);
                }}
                className="w-full text-xs text-[#065AA7] font-bold hover:underline cursor-pointer"
              >
                {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
