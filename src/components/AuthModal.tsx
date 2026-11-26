import React, { useEffect, useRef, useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import { api, setToken } from '../lib/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: 'email' | 'google';
  photoUrl?: string;
  verified?: boolean;
  role?: 'user' | 'admin';
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: AuthUser) => void;
}

const GOOGLE_SCRIPT_ID = 'google-gsi-script';
function getGoogleClientId(): string { const raw = import.meta.env.VITE_GOOGLE_CLIENT_ID; return typeof raw === 'string' ? raw.trim() : ''; }

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuth }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<'auth' | 'verify'>('auth');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const googleBtnRef = useRef<HTMLDivElement | null>(null);
  const onAuthRef = useRef(onAuth);
  const onCloseRef = useRef(onClose);
  const googleClientId = getGoogleClientId();

  useEffect(() => { onAuthRef.current = onAuth; onCloseRef.current = onClose; }, [onAuth, onClose]);
  useEffect(() => { if (isOpen) { setError(null); setInfo(null); setGoogleError(null); } }, [isOpen, mode, step]);

  const finish = (token: string, user: AuthUser) => {
    setToken(token);
    onAuthRef.current(user);
    setStep('auth'); setCodeInput(''); setPassword(''); setPendingEmail('');
    onCloseRef.current();
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
          callback: async (response: any) => {
            try {
              setBusy(true); setError(null);
              const data = await api.google({ credential: response?.credential });
              finish(data.token, data.user);
            } catch (e: any) { setError(e.message || 'Google sign-in failed'); }
            finally { setBusy(false); }
          },
          auto_select: false, cancel_on_tap_outside: true,
        });
        el.innerHTML = '';
        const width = Math.max(200, Math.min(360, Math.floor(el.clientWidth || 320)));
        google.accounts.id.renderButton(el, { theme: 'outline', size: 'large', width, text: mode === 'signup' ? 'signup_with' : 'signin_with', shape: 'rectangular', logo_alignment: 'left' });
        setGoogleReady(true); setGoogleError(null);
      } catch (e) { console.error(e); setGoogleReady(false); setGoogleError('Google sign-in could not be initialized. Check VITE_GOOGLE_CLIENT_ID and authorized origins.'); }
    };
    const handleScriptError = () => { if (!cancelled) { setGoogleReady(false); setGoogleError('Could not load Google sign-in.'); } };
    const existing = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
    if ((window as any).google?.accounts?.id) renderButton();
    else if (existing) { existing.addEventListener('load', renderButton); existing.addEventListener('error', handleScriptError); if ((window as any).google?.accounts?.id) renderButton(); }
    else { const s = document.createElement('script'); s.id = GOOGLE_SCRIPT_ID; s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.defer = true; s.onload = renderButton; s.onerror = handleScriptError; document.head.appendChild(s); }
    return () => { cancelled = true; const s = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null; s?.removeEventListener('load', renderButton); s?.removeEventListener('error', handleScriptError); };
  }, [isOpen, googleClientId, mode]);

  if (!isOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setInfo(null); setBusy(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Name is required');
        const r = await api.register({ name: name.trim(), email: normalizedEmail, password });
        setPendingEmail(normalizedEmail); setStep('verify'); setInfo(`Verification code sent to ${normalizedEmail}.${r.demoCode ? ` Demo code: ${r.demoCode}` : ''}`);
      } else {
        const r = await api.login({ email: normalizedEmail, password });
        setPendingEmail(normalizedEmail); setStep('verify'); setInfo(`Verification code sent to ${normalizedEmail}.${r.demoCode ? ` Demo code: ${r.demoCode}` : ''}`);
      }
    } catch (e: any) { setError(e.message || 'Authentication failed'); }
    finally { setBusy(false); }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setBusy(true);
    try {
      const r = await api.verify({ email: pendingEmail, code: codeInput.trim() });
      finish(r.token, r.user);
    } catch (e: any) { setError(e.message || 'Verification failed'); }
    finally { setBusy(false); }
  };

  const resend = async () => {
    setError(null); setBusy(true);
    try { const r = await api.resendCode({ email: pendingEmail }); setInfo(`Verification code resent.${r.demoCode ? ` Demo code: ${r.demoCode}` : ''}`); }
    catch (e: any) { setError(e.message || 'Could not resend code'); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#061A36]/55 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-sky-200 overflow-hidden">
        <div className="px-6 py-4 bg-[#061A36] text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">{step === 'verify' ? 'Verify Your Email' : mode === 'signin' ? 'Sign In' : 'Create Account'}</h2>
            <p className="text-xs text-sky-200">{step === 'verify' ? 'Enter the verification code to continue.' : 'Save your quote and manage your orders.'}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 cursor-pointer" aria-label="Close"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          {step === 'verify' ? (
            <form onSubmit={verify} className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sm text-[#0A1E3C]">
                <div className="flex items-center gap-2 font-bold text-[#065AA7] mb-1"><ShieldCheck className="w-4 h-4" /> Email Verification</div>
                <p className="text-xs text-slate-600">We sent a 6-digit code to <span className="font-semibold">{pendingEmail}</span>.</p>
                {info && <p className="text-xs mt-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">{info}</p>}
              </div>
              <label className="block">
                <span className="text-xs font-bold text-slate-600">Verification Code</span>
                <input value={codeInput} onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))} className="mt-1 w-full px-4 py-3 rounded-xl border border-sky-200 text-sm font-mono-tech tracking-[0.3em] text-center" placeholder="000000" inputMode="numeric" autoComplete="one-time-code" />
              </label>
              {error && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</div>}
              <button disabled={busy} type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-sm cursor-pointer disabled:opacity-60"><ShieldCheck className="w-4 h-4" /> Verify & Continue</button>
              <div className="flex gap-2">
                <button type="button" disabled={busy} onClick={resend} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"><RefreshCw className="w-3.5 h-3.5" /> Resend Code</button>
                <button type="button" onClick={() => { setStep('auth'); setError(null); }} className="flex-1 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer">Back</button>
              </div>
            </form>
          ) : (
            <>
              {googleClientId ? (
                <div>
                  <div ref={googleBtnRef} id="google-signin-btn" className="min-h-[44px] w-full flex justify-center" />
                  {!googleReady && !googleError && <p className="text-xs text-slate-400 mt-2 text-center">Loading Google sign-in...</p>}
                  {googleError && <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{googleError}</span></div>}
                  <div className="flex items-center gap-3 my-4"><div className="h-px bg-slate-200 flex-1" /><span className="text-xs text-slate-400">or</span><div className="h-px bg-slate-200 flex-1" /></div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p>Google sign-in is available when <code className="font-mono bg-slate-100 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> is configured.</p>
                  <div className="flex items-center gap-3 my-3"><div className="h-px bg-slate-200 flex-1" /><span className="text-xs text-slate-400">use email</span><div className="h-px bg-slate-200 flex-1" /></div>
                </div>
              )}

              <form onSubmit={submit} className="space-y-3">
                {mode === 'signup' && (
                  <label className="block"><span className="text-xs font-bold text-slate-600">Full Name</span><div className="mt-1 relative"><User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-200 text-sm" placeholder="Your name" autoComplete="name" /></div></label>
                )}
                <label className="block"><span className="text-xs font-bold text-slate-600">Email</span><div className="mt-1 relative"><Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-200 text-sm" placeholder="you@example.com" autoComplete="email" /></div></label>
                <label className="block"><span className="text-xs font-bold text-slate-600">Password</span><div className="mt-1 relative"><Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-200 text-sm" placeholder={mode === 'signup' ? 'At least 6 characters' : 'Password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} /></div></label>
                {error && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</div>}
                {info && <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5">{info}</div>}
                <button disabled={busy} type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-sm cursor-pointer disabled:opacity-60">{mode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}<span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span></button>
              </form>
              <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setInfo(null); }} className="w-full text-xs text-[#065AA7] font-bold hover:underline cursor-pointer">{mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
