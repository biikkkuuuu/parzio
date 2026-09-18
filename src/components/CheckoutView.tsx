import React, { useState, useEffect, useRef } from 'react';
import { CartItem, OrderItem } from '../types';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserProfile } from '../services/userService';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  MessageSquare,
  AlertTriangle,
  Phone,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Clock,
  Check,
  Copy
} from 'lucide-react';
import { HIGH_RISK_PINCODES } from '../data/adminData';
import { lookupPincode } from '../services/postalService';

interface CheckoutViewProps {
  cartItems: CartItem[];
  totalAmount: number;
  onOrderPlaced: (newOrder: OrderItem) => void;
  userProfile?: UserProfile | null;
  onBack?: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  totalAmount,
  onOrderPlaced,
  userProfile,
  onBack
}) => {
  // Form Fields
  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone?.replace('+91', '') || '');
  const [address, setAddress] = useState('Flat 402, Lotus Towers, Andheri West');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('400053');
  const [postOffice, setPostOffice] = useState('');
  const [postOfficeList, setPostOfficeList] = useState<string[]>([]);
  const [isLoadingPostal, setIsLoadingPostal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Prepaid UPI'>('COD');

  // Checkout Steps: 'details' | 'upi_payment' | 'otp' | 'success'
  const [step, setStep] = useState<'details' | 'upi_payment' | 'otp' | 'success'>('details');
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // OTP State
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']); // Firebase OTP is 6 digits usually
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [otpSentNotification, setOtpSentNotification] = useState<boolean>(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Firebase Phone Auth State
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [placedOrderData, setPlacedOrderData] = useState<OrderItem | null>(null);

  // Delivery Date & City Inference
  const getEstimatedDelivery = (pin: string) => {
    const today = new Date();
    // Fast metro delivery: 2 to 3 days
    const deliveryDays = pin.startsWith('11') || pin.startsWith('40') || pin.startsWith('56') ? 2 : 4;
    const estDate = new Date(today.setDate(today.getDate() + deliveryDays));
    return estDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const [deliveryDate, setDeliveryDate] = useState(() => getEstimatedDelivery('400053'));

  // Pincode lookup & Risk Assessment
  const matchedHighRisk = HIGH_RISK_PINCODES.find((item) => item.pincode === pincode.trim());

  // Handle Pincode Auto-Detection & Post Office Fetch
  const handlePincodeChange = async (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    setPincode(cleaned);

    if (cleaned.length === 6) {
      setDeliveryDate(getEstimatedDelivery(cleaned));
      setIsLoadingPostal(true);
      const info = await lookupPincode(cleaned);
      setIsLoadingPostal(false);
      if (info) {
        if (info.district) setCity(info.district);
        if (info.postOffices && info.postOffices.length > 0) {
          setPostOfficeList(info.postOffices);
          setPostOffice(info.postOffices[0]);
        } else {
          setPostOfficeList([]);
          setPostOffice('');
        }
      } else {
        if (cleaned.startsWith('11')) setCity('Delhi');
        else if (cleaned.startsWith('40')) setCity('Mumbai');
        else if (cleaned.startsWith('56')) setCity('Bengaluru');
        else if (cleaned.startsWith('70')) setCity('Kolkata');
        else if (cleaned.startsWith('50')) setCity('Hyderabad');
        else if (cleaned.startsWith('60')) setCity('Chennai');
        else if (cleaned.startsWith('30')) setCity('Jaipur');
        else if (cleaned.startsWith('38')) setCity('Ahmedabad');
        else if (cleaned.startsWith('22')) setCity('Lucknow');
        else if (cleaned.startsWith('41')) setCity('Pune');
      }
    } else {
      setPostOfficeList([]);
      setPostOffice('');
    }
  };

  // Timer Countdown Effect for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);



  // Setup Recaptcha
  const setupRecaptcha = () => {
    if (!auth) return null;
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          }
        });
      } catch (err) {
        console.error("Recaptcha init error", err);
      }
    }
    return window.recaptchaVerifier;
  };

  // Recalculate verified total from live product database (Fixes SEC-04)
  const getVerifiedTotal = () => {
    try {
      const catalog = dbService.getProducts();
      return cartItems.reduce((acc, item) => {
        const live = catalog.find((p) => p.id === item.product.id);
        const price = live ? live.price : item.product.price;
        return acc + price * item.quantity;
      }, 0);
    } catch {
      return totalAmount;
    }
  };

  const verifiedAmount = getVerifiedTotal();

  // Handler to Proceed from Details
  const handleProceedToNextStep = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userProfile && onLoginClick) {
      onLoginClick();
      return;
    }

    // 1. Stock check before allowing any order (Fixes INV-01)
    const catalog = dbService.getProducts();
    for (const item of cartItems) {
      const liveProd = catalog.find((p) => p.id === item.product.id);
      if (liveProd && typeof liveProd.stock === 'number' && liveProd.stock < item.quantity) {
        alert(`Maafi chahte hain! "${item.product.name}" ka stock khatam ho chuka hai (Available: ${liveProd.stock}). Kripya cart update karein.`);
        return;
      }
    }

    // 2. Prepaid UPI Flow: Transition to UPI verification screen (Fixes SEC-01)
    if (paymentMethod === 'Prepaid UPI') {
      setStep('upi_payment');
      return;
    }

    // 3. Cash on Delivery
    finalizeOrder(true);
  };

  // OTP Input Changes
  const handleOtpChange = (index: number, val: string) => {
    const char = val.replace(/\D/g, '').slice(-1);
    const newArr = [...otpValues];
    newArr[index] = char;
    setOtpValues(newArr);
    setOtpError(null);

    // Auto-focus next input
    if (char && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // OTP Keydown (Backspace navigation)
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Auto-fill Demo OTP (Removed for Real OTP, but keep handler empty to avoid errors if called)
  const handleAutoFillOtp = () => {
    // Demo auto-fill disabled
  };

  // Verify OTP and Place Order
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpValues.join('');
    if (entered.length < 6) {
      setOtpError('Please enter all 6 digits of the OTP.');
      return;
    }

    if (!confirmationResult) {
      setOtpError('OTP session expired. Please resend.');
      return;
    }

    setIsSubmitting(true);
    setOtpError(null);

    try {
      await confirmationResult.confirm(entered);
      // Phone is verified!
      finalizeOrder(true);
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      setOtpError('Invalid OTP code. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (isResendDisabled) return;
    
    setIsSendingOtp(true);
    setOtpError(null);
    
    try {
      const appVerifier = setupRecaptcha();
      if (!appVerifier) throw new Error("Recaptcha failed");
      
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      
      setConfirmationResult(result);
      setResendTimer(30);
      setIsResendDisabled(true);
      setOtpValues(['', '', '', '', '', '']);
      setOtpError(null);
      setOtpSentNotification(true);
      setTimeout(() => setOtpSentNotification(false), 4500);
    } catch (error: any) {
      console.error("Resend OTP error", error);
      setOtpError(error.message || "Failed to resend OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Finalize Order
  const finalizeOrder = async (isPhoneVerified: boolean, utr?: string) => {
    // Basic Rate Limiting: Prevent more than 1 order per minute to stop spam/bots
    const lastOrderTime = localStorage.getItem('parzio_last_order_time');
    const now = Date.now();
    if (lastOrderTime && now - parseInt(lastOrderTime) < 60000) {
      alert('You are placing orders too quickly. Please wait a minute before trying again.');
      return;
    }
    localStorage.setItem('parzio_last_order_time', now.toString());

    setIsSubmitting(true);

    try {
      let token = '';
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken(true);
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          items: cartItems.map(c => ({ id: c.product.id, quantity: c.quantity })),
          paymentMethod,
          utr,
          address: `${address}${postOffice ? ` (${postOffice})` : ''}`,
          city,
          pincode,
          phone: phone.replace(/\D/g, ''),
          name,
          deliveryDate
        })
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      setPlacedOrderId(data.order.id);
      setPlacedOrderData(data.order);
      setIsSubmitting(false);
      setStep('success');
      onOrderPlaced(data.order);
    } catch (err: any) {
      setIsSubmitting(false);
      alert(err.message || 'Error placing order. Please try again.');
    }
  };

  // Handle "Back" navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.hash = '#/';
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col font-sans animate-fadeIn">
      {/* Hidden element for Firebase Recaptcha */}
      <div id="recaptcha-container" className="hidden"></div>

      {/* Full-Width Header */}
      <div className="w-full border-b border-[#eae5dc] bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-neutral-100 text-[#141414] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#141414] text-[#fed488]">
              <span className="font-serif font-black text-sm tracking-tighter">P</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-[#141414] tracking-tight leading-none">
                {step === 'otp' 
                  ? 'Verify Identity' 
                  : step === 'upi_payment'
                  ? 'Secure Payment'
                  : 'Checkout'}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout Body */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-32">
        <div className="flex flex-col lg:flex-row items-start gap-10 xl:gap-16">
          
          {/* Left Column: Checkout Steps */}
          <div className="flex-1 w-full max-w-2xl min-w-0">

          {/* STEP 1: Details & Address */}
          {step === 'details' && (
            <form onSubmit={handleProceedToNextStep} className="space-y-4">
              
              {/* High-Risk Pincode Alert Banner */}
              {matchedHighRisk && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5 animate-fadeIn">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold">Notice for Pincode {matchedHighRisk.pincode}:</p>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">
                      High delivery return rate in this area. Cash on Delivery requires quick 4-digit OTP verification. You can also select <strong>Prepaid UPI</strong> for priority dispatch.
                    </p>
                  </div>
                </div>
              )}

              {/* Personal Info */}
              <div>
                <label className="block text-xs font-bold text-[#141414] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  readOnly={!!userProfile}
                  placeholder="e.g. Pooja Sharma"
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138] ${userProfile ? 'bg-neutral-100 cursor-not-allowed' : 'bg-white'}`}
                />
              </div>

              {/* Mobile & Pincode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#141414] mb-1">
                    Mobile Number <span className="text-[#8c7138]">(for delivery updates)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-[#747878] font-bold">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      readOnly={!!userProfile}
                      placeholder="9876543210"
                      className={`w-full pl-11 pr-3 py-2.5 rounded-xl border border-[#eae5dc] text-xs font-mono text-[#141414] focus:outline-none focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138] ${userProfile ? 'bg-neutral-100 cursor-not-allowed' : 'bg-white'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141414] mb-1 flex items-center justify-between">
                    <span>Pincode</span>
                    {pincode.length === 6 && (
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Serviceable
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-[#747878] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      placeholder="6-digit Pincode"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#eae5dc] text-xs font-mono text-[#141414] focus:outline-none focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138]"
                    />
                  </div>

                  {/* Post Office Selector if available */}
                  {(postOfficeList.length > 0 || isLoadingPostal) && (
                    <div className="mt-2 text-xs">
                      <label className="block text-[10px] font-bold text-[#747878] uppercase mb-1">
                        Post Office / Area
                      </label>
                      {postOfficeList.length > 0 ? (
                        <select
                          value={postOffice}
                          onChange={(e) => setPostOffice(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#8c7138] text-xs font-semibold text-[#141414] focus:outline-none cursor-pointer"
                        >
                          {postOfficeList.map((po) => (
                            <option key={po} value={po}>
                              {po}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-[10px] text-[#8c7138] font-bold animate-pulse py-1">
                          Detecting Post Office...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-[#141414] mb-1">Delivery Address</label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Flat No., Apartment, Street, Landmark"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138]"
                />
              </div>

              {/* City & State */}
              <div>
                <label className="block text-xs font-bold text-[#141414] mb-1">City / Town</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138]"
                />
              </div>

              {/* Dynamic Pincode Delivery Estimator Badge */}
              <div className="p-3 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#747878]">
                      BlueDart Air Express
                    </span>
                    <p className="text-xs font-bold text-[#141414]">
                      Expected Delivery: <span className="text-emerald-700">{deliveryDate}</span>
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  FREE
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-1">
                <label className="block text-xs font-bold text-[#141414] mb-2">Select Payment Method</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Cash on Delivery Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'COD'
                        ? 'border-[#8c7138] bg-[#faf8f5] ring-2 ring-[#8c7138]/20 shadow-xs'
                        : 'border-[#eae5dc] bg-white hover:border-[#8c7138]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-[#141414]">
                        <Truck className="w-4 h-4 text-[#8c7138]" />
                        <span>Cash on Delivery</span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#8c7138] bg-[#fed488]/30 px-1.5 py-0.2 rounded">
                        Requires OTP
                      </span>
                    </div>
                    <p className="text-[11px] text-[#747878] mt-1.5 leading-snug">
                      Pay cash at your doorstep upon parcel arrival.
                    </p>
                  </button>

                  {/* Prepaid UPI Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Prepaid UPI')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'Prepaid UPI'
                        ? 'border-[#8c7138] bg-[#faf8f5] ring-2 ring-[#8c7138]/20 shadow-xs'
                        : 'border-[#eae5dc] bg-white hover:border-[#8c7138]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-[#141414]">
                        <CreditCard className="w-4 h-4 text-[#8c7138]" />
                        <span>Prepaid UPI</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        Fast-Track
                      </span>
                    </div>
                    <p className="text-[11px] text-[#747878] mt-1.5 leading-snug">
                      Instant 1-Click order. Zero verification needed.
                    </p>
                  </button>
                </div>
              </div>

              {/* Order Total Row */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#eae5dc] flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[11px] text-[#747878]">Total Order Value</span>
                  <p className="font-display text-lg font-bold text-[#141414]">₹{totalAmount}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    Includes All Taxes &amp; Courier
                  </span>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type={!userProfile ? "button" : "submit"}
                onClick={!userProfile ? onLoginClick : undefined}
                disabled={isSendingOtp}
                className="w-full py-4 rounded-xl bg-[#141414] text-[#fed488] font-bold text-sm shadow-[0_4px_12px_rgba(20,20,20,0.15)] flex items-center justify-center gap-2 hover:bg-[#2a2a2a] transition-all disabled:opacity-70"
              >
                {isSendingOtp ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-white" /> Sending OTP...
                  </span>
                ) : !userProfile ? (
                  'Login to Continue'
                ) : paymentMethod === 'COD' ? (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    <span>Proceed to Confirm Order</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Pay ₹{verifiedAmount} via UPI</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Prepaid UPI Payment & UTR Verification */}
          {step === 'upi_payment' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Back Button */}
              <button
                type="button"
                onClick={() => setStep('details')}
                className="flex items-center gap-1.5 text-xs text-[#747878] hover:text-[#141414] font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Order Details</span>
              </button>

              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf8f5] border border-[#eae5dc] text-xs font-semibold text-[#8c7138] mb-2">
                  <CreditCard className="w-3.5 h-3.5" /> Scan &amp; Pay via any UPI App
                </div>
                <h3 className="text-base font-bold text-[#141414]">Complete Your UPI Payment</h3>
                <p className="text-xs text-[#747878] mt-0.5">Pay exactly <strong className="text-[#141414]">₹{verifiedAmount}</strong> to confirm your order</p>
              </div>

              {/* QR Code Card */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] flex flex-col items-center text-center">
                <div className="bg-white p-3 rounded-xl border border-[#eae5dc] shadow-xs mb-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      `upi://pay?pa=7033656752@ybl&pn=PARZIO&am=${verifiedAmount}&cu=INR&tn=PARZIO Order`
                    )}`}
                    alt="UPI QR Code"
                    className="w-40 h-40 object-contain mx-auto"
                  />
                </div>

                {/* UPI ID with copy */}
                <div className="w-full flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#eae5dc] text-xs">
                  <div className="text-left">
                    <span className="text-[10px] text-[#747878] block">UPI ID</span>
                    <span className="font-mono font-bold text-[#141414]">7033656752@ybl</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('7033656752@ybl');
                      setCopiedUpi(true);
                      setTimeout(() => setCopiedUpi(false), 2000);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#141414] text-[#fed488] font-bold text-[11px] hover:bg-[#2a2a2a] transition-all cursor-pointer flex items-center gap-1"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* UTR Input Form */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-[#141414] mb-1">
                    Enter 12-Digit UPI Reference / UTR Number *
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={utrNumber}
                    onChange={(e) => {
                      setUtrNumber(e.target.value.replace(/\D/g, '').slice(0, 12));
                      setUtrError(null);
                    }}
                    placeholder="e.g. 423589123456"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#eae5dc] text-xs font-mono font-bold tracking-wider text-[#141414] focus:outline-none focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138]"
                  />
                  <p className="text-[10px] text-[#747878] mt-1">
                    Found in Google Pay / PhonePe / Paytm payment receipt as "UPI Transaction ID" or "UTR"
                  </p>
                  {utrError && <p className="text-xs text-rose-600 font-bold mt-1">{utrError}</p>}
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    const cleanUtr = utrNumber.trim();
                    if (!/^[0-9]{12}$/.test(cleanUtr)) {
                      setUtrError('Please enter a valid 12-digit numeric UPI UTR number.');
                      return;
                    }
                    finalizeOrder(true, cleanUtr);
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#141414] text-[#fed488] font-bold text-xs uppercase tracking-wider hover:bg-[#2a2a2a] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Confirming Order...' : 'Submit UTR & Place Order'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: COD OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fadeIn">
              <div id="recaptcha-container"></div>
              
              {/* Back Button */}
              <button
                type="button"
                onClick={() => setStep('details')}
                className="flex items-center gap-1.5 text-xs text-[#747878] hover:text-[#141414] font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Mobile Number or Address</span>
              </button>

              {/* Main Heading & Phone indicator */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#141414]">Verify your Number</h3>
                <p className="text-xs text-[#747878] mt-1.5">
                  We've sent a 6-digit code to <strong>+91 {phone}</strong>
                </p>
              </div>

              {/* OTP Form */}
              <div className="space-y-4">
                <div>
                  {/* OTP Inputs */}
                  <div className="flex justify-center gap-2 mb-6">
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
                        className="w-10 h-12 text-center text-lg font-bold bg-white border border-[#eae5dc] rounded-xl focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138] outline-none transition-colors"
                      />
                    ))}
                  </div>

                  {otpError && (
                    <p className="text-xs text-rose-600 font-bold text-center mt-2.5">
                      {otpError}
                    </p>
                  )}
                </div>

                {/* Resend Timer & Actions */}
                <div className="text-center text-xs space-y-2">
                  <div className="flex items-center justify-center gap-1 text-[#747878]">
                    <Clock className="w-3.5 h-3.5 text-[#8c7138]" />
                    {resendTimer > 0 ? (
                      <span>Resend OTP available in <strong>{resendTimer}s</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="font-bold text-[#8c7138] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Resend 6-digit code now</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('Prepaid UPI');
                        setStep('upi_payment');
                      }}
                      className="text-[11px] text-[#747878] hover:text-[#141414] underline cursor-pointer"
                    >
                      Don't want to wait? Switch to Instant Prepaid UPI
                    </button>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-full bg-[#141414] text-[#fed488] hover:bg-[#8c7138] hover:text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? 'Verifying Phone...' : 'Verify OTP & Confirm Order'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: Order Success Screen */}
          {step === 'success' && placedOrderData && (
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
                  {placedOrderData.paymentMethod === 'COD'
                    ? '✓ COD PHONE VERIFIED'
                    : placedOrderData.status === 'Pending Verification'
                    ? '⏳ PREPAID UPI • PENDING VERIFICATION'
                    : '✓ 100% PREPAID UPI'}
                </span>
                <h3 className="font-display text-2xl font-bold text-[#141414] mt-2">
                  Order Successfully Placed!
                </h3>
                <p className="text-xs text-[#747878] mt-1 max-w-sm mx-auto">
                  Thank you, <strong className="text-[#141414]">{placedOrderData.customerName}</strong>. Your parcel has been queued for quality check and express dispatch.
                </p>
              </div>

              {/* Order Details Card */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#eae5dc]">
                  <span className="text-[#747878]">Order Reference:</span>
                  <span className="font-mono font-bold text-[#141414] text-sm">#{placedOrderId}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#747878]">Verified Phone:</span>
                  <span className="font-mono font-bold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {placedOrderData.phone}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#747878]">Delivery Location:</span>
                  <span className="font-bold text-[#141414]">{placedOrderData.location}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#747878]">Expected Arrival:</span>
                  <span className="font-bold text-emerald-700">{deliveryDate}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#eae5dc]">
                  <span className="text-[#747878]">Total Payable:</span>
                  <span className="font-display text-base font-bold text-[#141414]">₹{placedOrderData.amount}</span>
                </div>
              </div>

              {/* Quality & Anti-Tarnish Assurance Badge */}
              <div className="p-3 rounded-xl bg-white border border-[#eae5dc] flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-[#8c7138]/10 text-[#8c7138] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#141414]">Lifetime Anti-Tarnish Guarantee</p>
                  <p className="text-[10px] text-[#747878]">
                    Your package includes our official authentic warranty card and blue velvet jewellery pouch.
                  </p>
                </div>
              </div>

              {/* Back to store CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 rounded-full bg-[#141414] text-white hover:bg-[#8c7138] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  Back to Jewellery Store
                </button>
              </div>
            </div>
          )}

          </div>

          {/* Right Column: Order Summary (Visible on Desktop) */}
          <div className="hidden lg:block w-[420px] flex-shrink-0 self-start sticky top-6">
            <div className="bg-[#faf8f5] p-6 rounded-3xl border border-[#eae5dc] shadow-xs">
              <h3 className="font-bold text-[#141414] text-lg mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl border border-[#eae5dc] overflow-hidden flex-shrink-0 relative">
                      <img 
                        src={item.product.image || (item.product as any).images?.[0] || ''} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-[#141414] text-[#fed488] text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 text-sm pt-1">
                      <p className="font-bold text-[#141414] line-clamp-2 leading-snug">{item.product.name}</p>
                      <p className="text-[11px] text-[#747878] mt-1 font-semibold uppercase tracking-wider">Size: {item.size}</p>
                    </div>
                    <div className="font-bold text-[#141414] pt-1">₹{item.product.price * item.quantity}</div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-[#eae5dc] pt-5 space-y-3 text-sm">
                <div className="flex justify-between text-[#747878] font-medium">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-[#747878] font-medium">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
              </div>
              
              <div className="border-t border-[#eae5dc] mt-5 pt-5 flex justify-between items-end">
                <div>
                  <span className="font-bold text-[#141414] block">Total</span>
                  <span className="text-[10px] text-[#747878] font-medium">Includes all taxes</span>
                </div>
                <span className="text-3xl font-black text-[#141414]">₹{totalAmount}</span>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 p-4 rounded-2xl bg-white border border-[#eae5dc] grid grid-cols-2 gap-4">
                 <div className="flex flex-col items-center text-center gap-1.5">
                   <ShieldCheck className="w-5 h-5 text-[#8c7138]" />
                   <span className="text-[10px] font-bold text-[#747878] leading-tight">Secure Payment</span>
                 </div>
                 <div className="flex flex-col items-center text-center gap-1.5">
                   <Truck className="w-5 h-5 text-[#8c7138]" />
                   <span className="text-[10px] font-bold text-[#747878] leading-tight">Express Delivery</span>
                 </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
