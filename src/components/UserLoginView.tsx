import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle2, Sparkles, Truck, RefreshCw, Lock, Clock, Edit2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { userService, UserProfile } from '../services/userService';

interface UserLoginViewProps {
  onBack: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export const UserLoginView: React.FC<UserLoginViewProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // OTP State
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
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

  // Setup reCAPTCHA for Login
  const setupLoginRecaptcha = () => {
    if (!auth) return null;
    try {
      if ((window as any).loginRecaptchaVerifier) {
        try {
          (window as any).loginRecaptchaVerifier.clear();
        } catch {}
      }
      (window as any).loginRecaptchaVerifier = new RecaptchaVerifier(auth, 'login-recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        }
      });
      return (window as any).loginRecaptchaVerifier;
    } catch (err) {
      console.error('Login reCAPTCHA initialization error:', err);
      return null;
    }
  };

  // Step 1: Send OTP to Mobile
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!auth) {
        throw new Error('Authentication service is initializing. Please retry in a moment.');
      }

      const appVerifier = setupLoginRecaptcha();
      if (!appVerifier) {
        throw new Error('Could not initialize security verification. Please refresh.');
      }

      const formattedPhone = `+91${cleanPhone}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
      setResendTimer(30);
      setCanResend(false);
      setOtpValues(['', '', '', '', '', '']);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 200);
    } catch (err: any) {
      console.error('Send Login OTP error:', err);
      let msg = 'Failed to send OTP code. Please check your mobile number and retry.';
      if (err.code === 'auth/invalid-phone-number') {
        msg = 'Invalid phone number. Please enter a valid 10-digit number.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many requests. Please wait a few moments before trying again.';
      } else if (err.code === 'auth/quota-exceeded') {
        msg = 'Daily SMS limit reached. Please contact support.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const appVerifier = setupLoginRecaptcha();
      if (!appVerifier) throw new Error('Security check failed');

      const formattedPhone = `+91${cleanPhone}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setResendTimer(30);
      setCanResend(false);
      setOtpValues(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      setError(err.message || 'Failed to resend code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Verify OTP and Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpValues.join('');
    if (entered.length < 6) {
      setError('Please enter all 6 digits of the OTP code.');
      return;
    }

    if (!confirmationResult) {
      setError('OTP session expired. Please request a new code.');
      setStep('phone');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await confirmationResult.confirm(entered);
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const uid = userCredential.user?.uid || `user_${cleanPhone}`;

      // Fetch or create profile in Firestore
      const existingProfile = await userService.getUserProfile(cleanPhone);
      const customerName = name.trim() || existingProfile?.name || 'Valued Customer';

      const userProf: UserProfile = {
        uid: uid,
        phone: `+91${cleanPhone}`,
        name: customerName,
        email: existingProfile?.email || '',
        address: existingProfile?.address || '',
        city: existingProfile?.city || '',
        pincode: existingProfile?.pincode || '',
        ordersCount: existingProfile?.ordersCount || 0
      };

      await userService.saveUserProfile(userProf.uid, userProf.phone, userProf.name);
      await userService.updateLastLogin(userProf.uid);

      localStorage.setItem('parzio_user_profile', JSON.stringify(userProf));
      onSuccess(userProf);
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setError('Invalid verification code. Please check the code sent to your phone and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Input Changes
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
    <div className="min-h-screen bg-[#faf8f5] text-[#141414] flex flex-col justify-between animate-fadeIn">
      {/* Invisible Recaptcha Anchor */}
      <div id="login-recaptcha-container"></div>

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
                {step === 'phone' ? 'Secure Mobile Login' : 'Enter 6-Digit OTP'}
              </h2>
              <p className="text-xs text-[#747878] leading-relaxed max-w-xs mx-auto">
                {step === 'phone'
                  ? 'Enter your mobile number to receive a secure 6-digit verification code.'
                  : `We sent a 6-digit verification code to +91 ${phone.replace(/\D/g, '').slice(-10)}`}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center animate-fadeIn">
                {error}
              </div>
            )}

            {/* STEP 1: Phone Form */}
            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
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
                    An SMS verification code will be sent to this number.
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
                      <span>Sending OTP Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Get 6-Digit OTP</span>
                      <span className="text-[#fed488]">→</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STEP 2: OTP Verification Form */
              <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fadeIn">
                {/* Phone edit banner */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] text-xs">
                  <span className="font-mono font-bold text-[#141414]">+91 {phone.replace(/\D/g, '').slice(-10)}</span>
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
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-center text-[#555] mb-3">
                    Enter Verification Code
                  </label>
                  <div className="flex justify-center gap-2 sm:gap-3">
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
                        className="w-11 h-13 text-center text-xl font-bold bg-[#faf8f5] border-2 border-[#eae5dc] rounded-2xl focus:border-[#8c7138] focus:bg-white outline-none transition-all shadow-xs"
                      />
                    ))}
                  </div>
                </div>

                {/* Resend Timer & Button */}
                <div className="text-center text-xs space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-[#747878]">
                    <Clock className="w-3.5 h-3.5 text-[#8c7138]" />
                    {resendTimer > 0 ? (
                      <span>Resend OTP code in <strong>{resendTimer}s</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="font-bold text-[#8c7138] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Resend 6-Digit Code</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-black/10 cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#fed488]" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#fed488]" />
                      <span>Verify OTP &amp; Login</span>
                    </>
                  )}
                </button>
              </form>
            )}

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
