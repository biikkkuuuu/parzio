import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle2, Sparkles, Truck, RefreshCw, Lock } from 'lucide-react';
import { userService, UserProfile } from '../services/userService';

interface UserLoginViewProps {
  onBack: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export const UserLoginView: React.FC<UserLoginViewProps> = ({ onBack, onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      const profile = await userService.getUserProfile(cleanPhone);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#141414] flex flex-col justify-between animate-fadeIn">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#eae5dc] px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#555] hover:text-[#141414] transition-colors cursor-pointer group"
          >
            <span className="p-1.5 rounded-full bg-[#f4efea] group-hover:bg-[#eae5dc] transition-colors">
              <ArrowLeft className="w-4 h-4 text-[#141414]" />
            </span>
            <span>Back to Store</span>
          </button>

          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-extrabold tracking-[0.2em] uppercase font-serif text-[#141414]">
              PARZIO
            </h1>
            <span className="text-[9px] uppercase tracking-widest text-[#8c7138] font-bold block -mt-0.5">
              Customer Account
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-1 rounded-full">
            <Lock className="w-3 h-3 text-emerald-700" />
            <span className="hidden sm:inline">256-Bit SSL</span>
            <span>Secured</span>
          </div>
        </div>
      </header>

      {/* Main Content Page */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-16">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white rounded-3xl border border-[#eae5dc] p-6 sm:p-9 shadow-xl shadow-black/5 space-y-6">
            
            {/* Top Badge & Intro */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#141414] to-[#2b2b2b] text-[#fed488] flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141414] pt-1">
                Instant Customer Login
              </h2>
              <p className="text-xs text-[#747878] leading-relaxed max-w-xs mx-auto">
                Enter your mobile number to instantly access your live orders, saved delivery addresses &amp; wishlist.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center animate-fadeIn">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Name Input (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#555] mb-1.5">
                  Full Name <span className="text-[10px] font-normal lowercase text-[#999]">(optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pooja Sharma"
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-[#faf8f5] border border-[#eae5dc] rounded-2xl text-xs sm:text-sm font-medium text-[#141414] focus:outline-none focus:border-[#8c7138] focus:bg-white transition-all placeholder:text-[#a8a39b]"
                />
              </div>

              {/* Phone Input (Required) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5">
                  Mobile Number <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#8c7138] font-mono text-sm font-bold select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210"
                    maxLength={10}
                    autoFocus
                    required
                    disabled={isLoading}
                    className="w-full pl-14 pr-4 py-3 bg-[#faf8f5] border border-[#eae5dc] rounded-2xl text-sm sm:text-base font-mono font-bold tracking-wider text-[#141414] focus:outline-none focus:border-[#8c7138] focus:bg-white transition-all placeholder:text-[#a8a39b]"
                  />
                </div>
                <p className="text-[10px] text-[#747878] mt-1 pl-1">
                  10-digit mobile number for order delivery updates via WhatsApp / SMS.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-black/10 cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#fed488]" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Login / Continue</span>
                    <span className="text-[#fed488]">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Instant Access Assurance Note */}
            <div className="p-3 bg-[#faf8f5] rounded-2xl border border-[#eae5dc] text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#8c7138]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant Access • No OTP Waiting Required</span>
              </div>
              <p className="text-[10px] text-[#747878]">
                Your account is automatically synced to your phone number for seamless shopping.
              </p>
            </div>

            {/* Value Highlights */}
            <div className="pt-2 border-t border-[#f4efea] grid grid-cols-2 gap-3 text-[11px] text-[#555]">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#8c7138] shrink-0" />
                <span>Live Order Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#8c7138] shrink-0" />
                <span>100% Anti-Tarnish</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="py-4 text-center text-xs text-[#8c887e] border-t border-[#eae5dc] bg-white">
        <p>© PARZIO Luxury demi-fine jewellery. 100% Skin Safe &amp; Hypoallergenic.</p>
      </footer>
    </div>
  );
};
