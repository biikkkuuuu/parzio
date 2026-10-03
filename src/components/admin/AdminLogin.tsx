import React, { useState } from 'react';
import { Lock, Mail, RefreshCw, ShieldAlert, ShieldCheck } from 'lucide-react';
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

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    // 1. Try Firebase Email & Password authentication if configured
    if (auth) {
      try {
        await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
        sessionStorage.setItem('parzio_admin_auth', 'true');
        onSuccess();
        return;
      } catch (err: any) {
        console.error("Firebase admin login error:", err);
        const code = err?.code || '';
        if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
          setErrorMsg("Wrong Email or Password. Please try again.");
          setLoading(false);
          return;
        } else if (code === 'auth/user-not-found') {
          setErrorMsg("Admin account not found with this email.");
          setLoading(false);
          return;
        } else if (code === 'auth/too-many-requests') {
          setErrorMsg("Too many attempts. Please try again in 2 minutes.");
          setLoading(false);
          return;
        }
      }
    }

    // 2. Direct Master Admin ID & Password Fallback (if offline or custom admin)
    if (cleanEmail === 'admin@parzio.in' && (cleanPass === 'parzio@admin' || cleanPass === 'admin123' || cleanPass === 'Parzio#2026')) {
      sessionStorage.setItem('parzio_admin_auth', 'true');
      onSuccess();
      return;
    }

    setErrorMsg("Invalid Admin ID or Password. Please check credentials.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee] flex flex-col items-center justify-center p-6 text-[#1b1c1a]">
      <div className="max-w-sm w-full bg-white p-8 rounded-3xl shadow-xl border border-[#fed488]/30">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <Logo />
          <div className="mt-5 flex items-center justify-center w-12 h-12 rounded-2xl mb-3 shadow-xs bg-[#141414] text-[#fed488]">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-center">Atelier Ops Hub</h2>
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

        {/* Email & Password Form (NO OTP) */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-gray-700">Admin ID / Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#f9f8f6] border border-[#e4ded5] rounded-xl outline-none focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138] transition-all text-sm"
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
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e4ded5] bg-[#f9f8f6] focus:border-[#141414] focus:ring-1 focus:ring-[#141414] outline-none text-[#141414] text-sm transition-all"
                placeholder="Enter admin password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-[#141414] text-[#fed488] rounded-xl font-bold shadow-md hover:bg-[#2a2a2a] transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying &amp; Logging In...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Login to Atelier Ops</span>
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center text-[10px] text-gray-400">
          <p>Protected by PARZIO Atelier Security</p>
          <p className="mt-1">Direct ID &amp; Password Access • Zero OTP Waiting</p>
        </div>
      </div>
    </div>
  );
};
