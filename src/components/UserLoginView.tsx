import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Edit2 } from 'lucide-react';
import { smsService } from '../services/smsService';
import { userService, UserProfile } from '../services/userService';

interface UserLoginViewProps {
  onBack: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export const UserLoginView: React.FC<UserLoginViewProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [existingUser, setExistingUser] = useState<UserProfile | null>(null);
  const [pendingUid, setPendingUid] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // OTP State
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check if returning user when 10 digits are typed
  useEffect(() => {
    const clean = phone.replace(/\D/g, '').slice(-10);
    if (clean.length === 10) {
      userService.getUserProfile(clean).then((p) => {
        if (p && p.name && p.name.trim() && p.name !== 'Valued Customer' && p.name !== 'Guest User') {
          setExistingUser(p);
        } else {
          setExistingUser(null);
        }
      }).catch(() => setExistingUser(null));
    } else {
      setExistingUser(null);
    }
  }, [phone]);

  // Resend Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (step === 'otp' && resendTimer === 0) {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  // Step 1: Send OTP to Mobile (Instant Fast2SMS, Zero Captcha)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await smsService.sendOtp(cleanPhone);
    setIsLoading(false);

    if (res.success) {
      setStep('otp');
      setResendTimer(30);
      setCanResend(false);
      setOtpValues(['', '', '', '', '', '']);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } else {
      setError(res.error || 'Failed to send OTP code. Please retry.');
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setIsLoading(true);
    setError(null);

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const res = await smsService.sendOtp(cleanPhone);
    setIsLoading(false);

    if (res.success) {
      setResendTimer(30);
      setCanResend(false);
      setOtpValues(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } else {
      setError(res.error || 'Failed to resend code.');
    }
  };

  // Step 3: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpValues.join('');
    if (entered.length < 6) {
      setError('Please enter all 6 digits of the OTP code.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const verifyRes = smsService.verifyOtp(cleanPhone, entered);

    if (!verifyRes.success) {
      setIsLoading(false);
      setError(verifyRes.error || 'Incorrect OTP code. Please retry.');
      return;
    }

    // OTP Verified! Check for existing profile
    const uid = `user_${cleanPhone}`;
    let profile = existingUser;
    if (!profile) {
      try {
        profile = await Promise.race([
          userService.getUserProfile(cleanPhone),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200))
        ]);
      } catch (profileErr) {
        console.warn('Profile fetch warning:', profileErr);
      }
    }

    const hasValidExistingName =
      profile &&
      profile.name &&
      profile.name.trim() &&
      profile.name !== 'Valued Customer' &&
      profile.name !== 'Guest User';

    if (hasValidExistingName && profile) {
      // RETURNING USER: Login immediately with their existing name!
      const userProf: UserProfile = {
        ...profile,
        uid: profile.uid || uid,
        phone: `+91${cleanPhone}`,
        name: profile.name
      };

      localStorage.setItem('parzio_user_profile', JSON.stringify(userProf));
      userService.updateLastLogin(userProf.uid).catch(() => {});
      setIsLoading(false);
      onSuccess(userProf);
    } else {
      // NEW USER: Ask for Name
      setPendingUid(uid);
      setIsLoading(false);
      setStep('name');
    }
  };

  // Step 4: Save Name for New User
  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name to complete signup.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const userProf: UserProfile = {
        uid: pendingUid || `user_${cleanPhone}`,
        phone: `+91${cleanPhone}`,
        name: name.trim(),
        ordersCount: 0,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      localStorage.setItem('parzio_user_profile', JSON.stringify(userProf));
      userService.saveUserProfile(userProf.uid, userProf.phone, userProf.name).catch(() => {});
      userService.updateLastLogin(userProf.uid).catch(() => {});

      onSuccess(userProf);
    } catch (saveErr: any) {
      setError(saveErr.message || 'Could not save profile.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Input Handlers
  const handleOtpChange = (index: number, val: string) => {
    const char = val.replace(/\D/g, '').slice(-1);
    const newArr = [...otpValues];
    newArr[index] = char;
    setOtpValues(newArr);
    setError(null);

    if (char && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#141414] flex flex-col justify-between">
      {/* Clean Flipkart-Style Top Header */}
      <header className="bg-white border-b border-[#eae5dc] px-4 sm:px-8 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#666] hover:text-[#141414] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <span className="text-base font-extrabold tracking-[0.2em] uppercase font-serif text-[#141414]">
            PARZIO
          </span>

          <div className="w-12" />
        </div>
      </header>

      {/* Main Flipkart-Style Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#eae5dc] p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Header Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#141414]">
              {step === 'phone'
                ? 'Login or Signup'
                : step === 'otp'
                ? 'Verify OTP'
                : 'Welcome to PARZIO'}
            </h1>
            <p className="text-xs text-[#717478] mt-1.5 leading-relaxed">
              {step === 'phone'
                ? existingUser
                  ? `Welcome back, ${existingUser.name}! Enter your mobile number to continue.`
                  : 'Get access to your Orders, Wishlist and Member Offers'
                : step === 'otp'
                ? `Please enter the 6-digit OTP sent to +91 ${phone.replace(/\D/g, '').slice(-10)}`
                : 'Enter your full name to complete your profile'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* STEP 1: Phone Form */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#717478] mb-1.5">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-semibold text-[#141414] font-mono select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    autoFocus
                    required
                    disabled={isLoading}
                    className="w-full pl-13 pr-4 py-3 bg-white border border-[#d1ccc4] focus:border-[#141414] rounded-xl text-base font-medium font-mono text-[#141414] outline-none transition-colors placeholder:text-[#a8a39b]"
                  />
                </div>
              </div>

              <p className="text-[11px] text-[#888] leading-relaxed">
                By continuing, you agree to PARZIO&apos;s <span className="underline">Terms of Use</span> and <span className="underline">Privacy Policy</span>.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#141414] hover:bg-[#2b2b2b] text-white text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#fed488]" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <span>CONTINUE</span>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP Verification Form */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fadeIn">
              {/* Phone display with Change link */}
              <div className="flex items-center justify-between text-xs py-1">
                <span className="font-mono font-semibold text-[#141414]">+91 {phone.replace(/\D/g, '').slice(-10)}</span>
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setError(null);
                  }}
                  className="text-[#8c7138] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Change</span>
                </button>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-between gap-2">
                {otpValues.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    disabled={isLoading}
                    className="w-11 sm:w-12 h-13 text-center text-xl font-bold bg-[#faf8f5] border border-[#d1ccc4] focus:border-[#141414] focus:bg-white rounded-xl outline-none transition-all"
                  />
                ))}
              </div>

              {/* Resend Timer */}
              <div className="text-xs text-[#717478]">
                {resendTimer > 0 ? (
                  <span>Resend OTP in <strong>{resendTimer}s</strong></span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="font-bold text-[#8c7138] hover:underline cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#141414] hover:bg-[#2b2b2b] text-white text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#fed488]" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>VERIFY &amp; CONTINUE</span>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: New User Name Onboarding */}
          {step === 'name' && (
            <form onSubmit={handleSaveName} className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-medium text-[#717478] mb-1.5">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name (e.g. Vikash Rana)"
                  autoFocus
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white border border-[#d1ccc4] focus:border-[#141414] rounded-xl text-base font-medium text-[#141414] outline-none transition-colors placeholder:text-[#a8a39b]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#141414] hover:bg-[#2b2b2b] text-white text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#fed488]" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>CONTINUE</span>
                )}
              </button>
            </form>
          )}

        </div>
      </main>

      <footer className="py-4 text-center text-[11px] text-[#999]">
        PARZIO Jewellery © 2026. All rights reserved.
      </footer>
    </div>
  );
};
