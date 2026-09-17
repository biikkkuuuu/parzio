import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { Logo } from '../Logo';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const correctPin = import.meta.env.VITE_ADMIN_PIN || '202425';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === correctPin) {
      sessionStorage.setItem('parzio_admin_auth', 'true');
      onSuccess();
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 2000);
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold mb-2 text-gray-700">Enter Security PIN</label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className={`w-full p-4 text-center tracking-[0.5em] text-xl bg-[#f9f8f6] border rounded-xl outline-none focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138] transition-all ${
                error ? 'border-rose-500 text-rose-500 animate-shake' : 'border-[#e4ded5]'
              }`}
              placeholder="••••••"
              autoFocus
              maxLength={10}
            />
            {error && (
              <p className="text-rose-500 text-xs text-center mt-2 font-medium flex items-center justify-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Incorrect PIN
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#141414] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#2a2a2a] transition-colors"
          >
            Access Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        
        <div className="mt-8 text-center text-[10px] text-gray-400">
          <p>Protected by PARZIO Internal Security</p>
          <p className="mt-1">All access attempts are logged.</p>
        </div>
      </div>
    </div>
  );
};
