import React, { useEffect, useState } from 'react';
import { X, User, Mail, Lock, Camera, Save, LogOut, Shield } from 'lucide-react';
import type { AuthUser } from './AuthModal';
import { api } from '../lib/api';

interface ProfileModalProps {
  isOpen: boolean;
  user: AuthUser | null;
  onClose: () => void;
  onUpdate: (user: AuthUser) => void;
  onLogout: () => void;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, user, onClose, onUpdate, onLogout }) => {
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || ''); setPhotoUrl(user.photoUrl || '');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setError(null); setSuccess(null);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Please select an image file.');
    if (file.size > 2 * 1024 * 1024) return setError('Profile picture must be under 2MB.');
    try {
      setBusy(true);
      const dataUrl = await fileToDataUrl(file);
      const r = await api.upload(dataUrl, 'profiles', file.name, false);
      setPhotoUrl(r.url);
      setError(null);
    } catch (err: any) { setError(err.message || 'Failed to upload image.'); }
    finally { setBusy(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setSuccess(null);
    const trimmedName = name.trim();
    if (!trimmedName) return setError('Name is required.');
    if (newPassword || confirmPassword || currentPassword) {
      if (user.provider !== 'email') return setError('Password cannot be changed for this account.');
      if (!currentPassword) return setError('Enter your current password to change it.');
      if (newPassword.length < 6) return setError('New password must be at least 6 characters.');
      if (newPassword !== confirmPassword) return setError('New passwords do not match.');
    }
    setBusy(true);
    try {
      const r = await api.updateProfile({ name: trimmedName, photoUrl: photoUrl || null, currentPassword: currentPassword || undefined, newPassword: newPassword || undefined });
      onUpdate(r.user);
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setSuccess('Profile updated successfully.');
    } catch (e: any) { setError(e.message || 'Failed to update profile.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#061A36]/55 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-sky-200 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 bg-[#061A36] text-white flex items-center justify-between sticky top-0 z-10">
          <div><h2 className="text-lg font-bold">My Profile</h2><p className="text-xs text-sky-200">Manage your account details</p></div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 cursor-pointer" aria-label="Close"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              {photoUrl ? <img src={photoUrl} alt={name} className="w-20 h-20 rounded-2xl object-cover border border-sky-200 bg-slate-100" /> : <div className="w-20 h-20 rounded-2xl bg-[#E6EFF8] border border-sky-200 flex items-center justify-center text-[#065AA7]"><User className="w-8 h-8" /></div>}
              <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#065AA7] hover:bg-[#044685] text-white flex items-center justify-center cursor-pointer shadow"><Camera className="w-4 h-4" /><input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} /></label>
            </div>
            <div className="min-w-0">
              <div className="font-bold text-[#0A1E3C] truncate">{user.name}</div>
              <div className="text-xs text-slate-500 truncate">{user.email}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-[#065AA7] border border-sky-200"><Shield className="w-3 h-3" /> {user.provider === 'google' ? 'Google Account' : 'Email Account'}</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="block"><span className="text-xs font-bold text-slate-600">Full Name</span><div className="mt-1 relative"><User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-200 text-sm" /></div></label>
            <label className="block"><span className="text-xs font-bold text-slate-600">Email</span><div className="mt-1 relative"><Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={user.email} disabled className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500" /></div></label>
            {photoUrl && <button type="button" onClick={() => setPhotoUrl('')} className="text-xs text-red-600 hover:underline cursor-pointer">Remove profile picture</button>}
          </div>
          {user.provider === 'email' && (
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <h3 className="text-sm font-bold text-[#0A1E3C]">Change Password</h3>
              <label className="block"><span className="text-xs font-bold text-slate-600">Current Password</span><div className="mt-1 relative"><Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-200 text-sm" autoComplete="current-password" /></div></label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block"><span className="text-xs font-bold text-slate-600">New Password</span><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-sky-200 text-sm" autoComplete="new-password" /></label>
                <label className="block"><span className="text-xs font-bold text-slate-600">Confirm New Password</span><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-sky-200 text-sm" autoComplete="new-password" /></label>
              </div>
            </div>
          )}
          {error && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</div>}
          {success && <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg p-2.5">{success}</div>}
          <div className="flex flex-col sm:flex-row gap-3">
            <button disabled={busy} type="submit" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#065AA7] hover:bg-[#044685] text-white font-bold text-sm cursor-pointer disabled:opacity-60"><Save className="w-4 h-4" /> Save Changes</button>
            <button type="button" onClick={onLogout} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 font-bold text-sm cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</button>
          </div>
        </form>
      </div>
    </div>
  );
};
