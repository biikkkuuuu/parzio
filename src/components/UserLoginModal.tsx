import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, ArrowRight, RefreshCw, Clock } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber, signInAnonymously, ConfirmationResult } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { userService, UserProfile } from '../services/userService';

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  
  const [phone, setPhone] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Always reset login modal to initial clean state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setPhone('');
      setOtpValues(['', '', '', '', '', '']);
      setName('');
      setError(null);
      setInfoNotice(null);
      setExpectedOtp(null);
      setUserId(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const [expectedOtp, setExpectedOtp] = useState<string | null>(null);

  const setupRecaptcha = () => {
    // Recaptcha is no longer needed since we are not using Firebase phone auth
    return true;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setError(null);
    setInfoNotice(null);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setStep('otp');
      setResendTimer(60);

      // Customer-facing clean message (NO third-party vendor name shown)
      setInfoNotice(`📱 6-digit OTP sent to +91 ${phone}`);
    } catch (err: any) {
      console.error("Send OTP error:", err);
      let msg = err?.message || 'Failed to send SMS OTP. Try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpValues.join('');
    if (entered.length < 6) return;

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: entered })
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Invalid OTP');
      }

      // OTP verified successfully. Authenticate anonymously to secure Firestore rules.
      let authResult;
      try {
        authResult = await signInAnonymously(auth);
      } catch (e) {
        console.error("Firebase auth error", e);
        throw new Error("Authentication failed");
      }
      
      const uid = authResult.user.uid;
      
      if (uid) {
        setUserId(uid);
        // Look up by clean phone number across Firestore and local registry
        let profile = await userService.getUserProfile(phone);
        if (profile && profile.name) {
          // Returning user: verify OTP first, then login directly without asking name
          profile.uid = uid; // Update with secure anonymous UID
          await userService.saveUserProfile(uid, `+91${phone}`, profile.name);
          await userService.updateLastLogin(uid);
          localStorage.setItem('parzio_user_profile', JSON.stringify(profile));
          onSuccess(profile);
          onClose();
        } else {
          // New user: ask for name
          setInfoNotice(null);
          setStep('name');
        }
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setError('Galat OTP code hai. Kripya phone par aaya sahi 6-digit OTP enter karein.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || !userId) return;

    setIsLoading(true);
    const userProf: UserProfile = {
      uid: userId,
      phone: `+91${phone}`,
      name: name.trim()
    };

    try {
      await userService.saveUserProfile(userId, userProf.phone, userProf.name);
    } catch (err) {
      console.warn("Could not save to Firestore, saving locally:", err);
    }

    localStorage.setItem('parzio_user_profile', JSON.stringify(userProf));
    onSuccess(userProf);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-[#eae5dc] bg-[#faf8f5] flex justify-between items-center">
          <h3 className="font-bold text-lg text-[#141414]">Welcome to Parzio</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-neutral-200 text-[#747878]"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6">
          <div id="login-recaptcha"></div>
          
          {infoNotice && step === 'phone' && (
            <div className="mb-4 p-3 bg-amber-50 text-[#8c7138] text-xs font-bold rounded-xl border border-amber-200 text-center animate-fadeIn">
              {infoNotice}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl border border-rose-100 text-center">
              {error}
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4 animate-fadeIn">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#141414] text-[#fed488] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-xl text-[#141414]">Login or Signup</h4>
                <p className="text-sm text-[#747878] mt-1">Enter your mobile number to proceed</p>
              </div>

              <div>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-sm font-bold text-[#747878]">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#eae5dc] bg-white font-mono font-bold focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138] outline-none"
                    placeholder="98765 43210"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading || phone.length < 10}
                className="w-full py-3.5 rounded-xl bg-[#141414] text-[#fed488] font-bold shadow-md hover:bg-[#2a2a2a] disabled:opacity-70 flex justify-center items-center gap-2 transition-all"
              >
                {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Get OTP'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fadeIn">
              <div className="text-center">
                <h4 className="font-bold text-xl text-[#141414]">Verify Number</h4>
                <p className="text-xs text-[#747878] mt-1">Code sent to +91 {phone}</p>
                <button type="button" onClick={() => setStep('phone')} className="text-xs font-bold text-[#8c7138] hover:underline mt-1">Change Number</button>
              </div>

              <div className="flex justify-center gap-2">
                {otpValues.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      const newArr = [...otpValues];
                      newArr[idx] = val;
                      setOtpValues(newArr);
                      if (val && idx < 5) otpInputRefs.current[idx + 1]?.focus();
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !otpValues[idx] && idx > 0) otpInputRefs.current[idx - 1]?.focus();
                    }}
                    className="w-10 h-12 text-center text-xl font-bold border border-[#eae5dc] rounded-xl focus:border-[#8c7138] outline-none"
                  />
                ))}
              </div>

              <div className="text-center text-xs">
                {resendTimer > 0 ? (
                  <span className="text-[#747878] flex items-center justify-center gap-1"><Clock className="w-3 h-3"/> Resend in {resendTimer}s</span>
                ) : (
                  <button type="button" onClick={handleSendOtp} className="text-[#8c7138] font-bold hover:underline">Resend OTP</button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || otpValues.join('').length < 6}
                className="w-full py-3.5 rounded-xl bg-[#141414] text-[#fed488] font-bold shadow-md hover:bg-[#2a2a2a] disabled:opacity-70 flex justify-center items-center gap-2 transition-all"
              >
                {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
              </button>
            </form>
          )}

          {step === 'name' && (
            <form onSubmit={handleSaveName} className="space-y-4 animate-fadeIn">
              <div className="text-center mb-6">
                <h4 className="font-bold text-xl text-[#141414]">Almost Done!</h4>
                <p className="text-sm text-[#747878] mt-1">What should we call you?</p>
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-3.5 rounded-xl border border-[#eae5dc] bg-white font-bold text-center focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || name.length < 2}
                className="w-full py-3.5 rounded-xl bg-[#141414] text-[#fed488] font-bold shadow-md hover:bg-[#2a2a2a] disabled:opacity-70 flex justify-center items-center gap-2 transition-all"
              >
                {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>Complete Setup <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
