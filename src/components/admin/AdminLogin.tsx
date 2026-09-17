import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldAlert, Mail } from 'lucide-react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setErrorMsg("Firebase is not configured yet. Check your .env.local file.");
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      sessionStorage.setItem('parzio_admin_auth', 'true');
      onSuccess();
    } catch (err: any) {
      console.error("Login failed:", err);
      // Clean up the error message for display
      let msg = err.message || "Incorrect Credentials";
      if (msg.includes('auth/invalid-credential')) {
        msg = "Wrong Email or Password. Please try again.";
      }
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee] flex flex-col items-center justify-center p-6 text-[#1b1c1a]">
      <div className="max-w-sm w-full bg-white p-8 rounded-3xl shadow-xl border border-[#fed488]/30">
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <div className="mt-6 flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 text-rose-500 mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-center">Atelier Ops Hub</h2>
          <p className="text-xs text-center text-gray-500 mt-2">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-2 text-gray-700">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
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
            <label className="block text-xs font-semibold mb-2 text-gray-700">Admin Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-[#f9f8f6] border rounded-xl outline-none focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138] transition-all text-sm ${
                  errorMsg ? 'border-rose-500 text-rose-500 animate-shake' : 'border-[#e4ded5]'
                }`}
                placeholder="••••••••"
              />
            </div>
            {errorMsg && (
              <p className="text-rose-500 text-[10px] mt-2 font-medium flex items-start gap-1">
                <ShieldAlert className="w-3 h-3 flex-shrink-0 mt-0.5" /> 
                <span>{errorMsg}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-[#141414] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#2a2a2a] transition-colors disabled:opacity-70"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
        
        <div className="mt-8 text-center text-[10px] text-gray-400">
          <p>Protected by Firebase Authentication</p>
          <p className="mt-1">All access attempts are logged.</p>
        </div>
      </div>
    </div>
  );
};
