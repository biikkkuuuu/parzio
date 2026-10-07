import React, { useState } from 'react';
import { Lock, Mail, RefreshCw, ShieldAlert, ShieldCheck, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Logo } from '../Logo';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Direct Master Admin ID & Password Check (Instant & Offline-resilient)
    const allowedAdminIds = [
      'admin@parzio.in',
      'admin',
      'parzio',
      'vikashrnan6465@gmail.com',
      'jitendrapandit1764@gmail.com',
      'rana@parzio.in',
      '7033656752',
      '9106694317'
    ];

    const allowedPasswords = [
      'parzio@admin',
      'admin123',
      'Parzio#2026',
      'parzio2026',
      'admin',
      'parzio',
      '7033656752',
      '9106694317',
      'vikash123',
      'vikash@123'
    ];

    if (allowedAdminIds.includes(cleanEmail) && allowedPasswords.includes(cleanPass)) {
      sessionStorage.setItem('parzio_admin_auth', 'true');
      onSuccess();
      return;
    }

    // 2. Try Firebase Email & Password authentication if configured
    if (auth && cleanEmail.includes('@')) {
      try {
        await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
        sessionStorage.setItem('parzio_admin_auth', 'true');
        onSuccess();
        return;
      } catch (err: any) {
        console.warn("Firebase admin login:", err?.code || err?.message);
      }
    }

    setErrorMsg("Invalid Admin ID or Password. Try ID: admin@parzio.in and Pass: parzio@admin");
    setLoading(false);
  };

  const handleFillDefaults = () => {
    setEmail('admin@parzio.in');
    setPassword('parzio@admin');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] flex flex-col items-center justify-center p-6 text-[#141414]">
      <div className="max-w-sm w-full bg-white p-8 rounded-3xl shadow-xl border border-[#eae5dc]">
        
        {/* Clean Header without redundant Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl mb-3 shadow-xs bg-[#141414] text-[#fed488]">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-center">Store Admin</h2>
          <p className="text-xs text-center text-gray-500 mt-1">
            Login with Admin ID &amp; Password
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl border border-rose-100 text-center flex items-center gap-1.5 justify-center animate-fadeIn">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email/ID & Password Form (NO OTP) */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-gray-700">Admin ID / Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#f9f8f6] border border-[#e4ded5] rounded-xl outline-none focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138] transition-all text-sm font-medium"
                placeholder="admin@parzio.in"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#e4ded5] bg-[#f9f8f6] focus:border-[#141414] focus:ring-1 focus:ring-[#141414] outline-none text-[#141414] text-sm transition-all font-medium"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-[#141414] text-[#fed488] rounded-xl font-bold shadow-md hover:bg-[#2a2a2a] transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying &amp; Logging In...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Login to Admin Panel</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Helper Button */}
        <div className="mt-4 pt-4 border-t border-[#f0ede6] text-center">
          <button
            type="button"
            onClick={handleFillDefaults}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8c7138] hover:text-[#141414] bg-[#faf6ee] hover:bg-[#f3ede0] px-3 py-1.5 rounded-lg border border-[#e6dccb] transition-all cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Fill Master Credentials</span>
          </button>
        </div>
        
        <div className="mt-4 text-center text-[10px] text-gray-400">
          <p>Protected by Secure Admin Authentication</p>
          <p className="mt-1">Direct Master Access • Zero OTP Required</p>
        </div>
      </div>
    </div>
  );
};
