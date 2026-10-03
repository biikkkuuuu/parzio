import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { userService, UserProfile } from '../services/userService';

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPhone('');
      setName('');
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const uid = `user_${cleanPhone}`;
      let profile = await userService.getUserProfile(cleanPhone);

      const customerName = name.trim() || profile?.name || 'Valued Customer';

      const userProf: UserProfile = {
        uid: profile?.uid || uid,
        phone: `+91${cleanPhone}`,
        name: customerName,
        email: profile?.email || '',
        address: profile?.address || '',
        city: profile?.city || '',
        pincode: profile?.pincode || '',
        ordersCount: profile?.ordersCount || 0
      };

      await userService.saveUserProfile(userProf.uid, userProf.phone, userProf.name);
      await userService.updateLastLogin(userProf.uid);

      localStorage.setItem('parzio_user_profile', JSON.stringify(userProf));
      onSuccess(userProf);
      onClose();
    } catch (err: any) {
      console.error('Instant login error:', err);
      // Fallback local login
      const fallbackProf: UserProfile = {
        uid: `user_${cleanPhone}`,
        phone: `+91${cleanPhone}`,
        name: name.trim() || 'Valued Customer'
      };
      localStorage.setItem('parzio_user_profile', JSON.stringify(fallbackProf));
      onSuccess(fallbackProf);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#eae5dc] bg-[#faf8f5] flex justify-between items-center">
          <h3 className="font-bold text-lg text-[#141414]">Welcome to Parzio</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200 text-[#747878] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl border border-rose-100 text-center animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#141414] text-[#fed488] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-xl text-[#141414]">Instant Login</h4>
              <p className="text-xs text-[#747878] mt-1">Enter your details to access your orders &amp; wishlist</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#141414] mb-1.5">Full Name (Optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pooja Sharma"
                className="w-full px-4 py-3 bg-[#f8f6f0] border border-[#eae5dc] rounded-xl text-sm font-medium text-[#141414] focus:outline-none focus:ring-2 focus:ring-[#141414] focus:border-transparent transition-all placeholder:text-[#a39e93]"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#141414] mb-1.5">Mobile Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#8a857b] font-mono text-base font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  maxLength={10}
                  className="w-full pl-14 pr-4 py-3 bg-[#f8f6f0] border border-[#eae5dc] rounded-xl text-base tracking-wider font-mono text-[#141414] focus:outline-none focus:ring-2 focus:ring-[#141414] focus:border-transparent transition-all shadow-xs placeholder:text-[#a39e93]"
                  autoFocus
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || phone.replace(/\D/g, '').length !== 10}
              className="w-full py-3.5 mt-2 rounded-xl bg-[#141414] text-[#fed488] font-bold shadow-md hover:bg-[#2a2a2a] disabled:opacity-50 flex justify-center items-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Login / Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-[#747878] mt-3">
              🔒 100% Secure &amp; Instant Access. No OTP waiting required.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
