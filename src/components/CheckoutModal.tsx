import React, { useState, useEffect, useRef } from 'react';
import { CartItem, OrderItem } from '../types';
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
  ExternalLink
} from 'lucide-react';
import { HIGH_RISK_PINCODES } from '../data/adminData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
  onOrderPlaced: (newOrder: OrderItem) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalAmount,
  onOrderPlaced
}) => {
  // Form Fields
  const [name, setName] = useState('Pooja Sharma');
  const [phone, setPhone] = useState('9876543210');
  const [address, setAddress] = useState('Flat 402, Lotus Towers, Andheri West');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400053');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Prepaid UPI'>('COD');

  const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  // Checkout Steps: 'details' | 'otp' | 'success'
  const [step, setStep] = useState<'details' | 'otp' | 'success'>('details');

  // OTP State
  const DEMO_OTP = '4829';
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [otpSentNotification, setOtpSentNotification] = useState<boolean>(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [placedOrderData, setPlacedOrderData] = useState<OrderItem | null>(null);
  const [whatsappDispatchUrl, setWhatsappDispatchUrl] = useState<string>('');

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

  // Handle Pincode Auto-Detection
  const handlePincodeChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    setPincode(cleaned);

    if (cleaned.length === 6) {
      setDeliveryDate(getEstimatedDelivery(cleaned));
      if (cleaned.startsWith('11')) { setCity('Delhi'); setState('Delhi'); }
      else if (cleaned.startsWith('40')) { setCity('Mumbai'); setState('Maharashtra'); }
      else if (cleaned.startsWith('41')) { setCity('Pune'); setState('Maharashtra'); }
      else if (cleaned.startsWith('56')) { setCity('Bengaluru'); setState('Karnataka'); }
      else if (cleaned.startsWith('70')) { setCity('Kolkata'); setState('West Bengal'); }
      else if (cleaned.startsWith('50')) { setCity('Hyderabad'); setState('Telangana'); }
      else if (cleaned.startsWith('60')) { setCity('Chennai'); setState('Tamil Nadu'); }
      else if (cleaned.startsWith('30')) { setCity('Jaipur'); setState('Rajasthan'); }
      else if (cleaned.startsWith('38')) { setCity('Ahmedabad'); setState('Gujarat'); }
      else if (cleaned.startsWith('22')) { setCity('Lucknow'); setState('Uttar Pradesh'); }
      else if (cleaned.startsWith('14')) { setCity('Amritsar'); setState('Punjab'); }
      else if (cleaned.startsWith('80')) { setCity('Patna'); setState('Bihar'); }
      else if (cleaned.startsWith('78')) { setCity('Guwahati'); setState('Assam'); }
      else if (cleaned.startsWith('68')) { setCity('Kochi'); setState('Kerala'); }
      else if (cleaned.startsWith('46')) { setCity('Bhopal'); setState('Madhya Pradesh'); }
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

  if (!isOpen) return null;

  // Handler to Proceed from Details
  const handleProceedToNextStep = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'Prepaid UPI') {
      // Prepaid orders bypass OTP entirely (Low RTO risk guaranteed)
      finalizeOrder(true);
    } else {
      // Cash On Delivery requires 4-digit OTP verification
      setStep('otp');
      setResendTimer(30);
      setIsResendDisabled(true);
      setOtpValues(['', '', '', '']);
      setOtpError(null);
      setOtpSentNotification(true);
      setTimeout(() => setOtpSentNotification(false), 4500);
    }
  };

  // OTP Input Changes
  const handleOtpChange = (index: number, val: string) => {
    const char = val.replace(/\D/g, '').slice(-1);
    const newArr = [...otpValues];
    newArr[index] = char;
    setOtpValues(newArr);
    setOtpError(null);

    // Auto-focus next input
    if (char && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // OTP Keydown (Backspace navigation)
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Auto-fill Demo OTP
  const handleAutoFillOtp = () => {
    setOtpValues(['4', '8', '2', '9']);
    setOtpError(null);
  };

  // Verify OTP and Place Order
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpValues.join('');
    if (entered.length < 4) {
      setOtpError('Please enter all 4 digits of the OTP.');
      return;
    }

    if (entered !== DEMO_OTP) {
      setOtpError(`Invalid code. For this demo, please enter ${DEMO_OTP}.`);
      return;
    }

    finalizeOrder(true);
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (isResendDisabled) return;
    setResendTimer(30);
    setIsResendDisabled(true);
    setOtpValues(['', '', '', '']);
    setOtpError(null);
    setOtpSentNotification(true);
    setTimeout(() => setOtpSentNotification(false), 4500);
  };

  // Finalize Order
  const finalizeOrder = (isPhoneVerified: boolean) => {
    setIsSubmitting(true);
    const generatedId = `PARZIO-${Math.floor(10000 + Math.random() * 90000)}`;
    setPlacedOrderId(generatedId);

    const firstProduct = cartItems[0]?.product;
    const isHighRiskPincode = Boolean(matchedHighRisk);

    const newOrder: OrderItem = {
      id: generatedId,
      customerName: name,
      phone: `+91 ${phone}`,
      location: `${city}, ${state} (${pincode})`,
      pincode: pincode,
      rtoRisk: paymentMethod === 'Prepaid UPI' ? 'Low' : isHighRiskPincode ? 'Medium' : 'Low',
      amount: totalAmount,
      paymentMethod: paymentMethod,
      status: paymentMethod === 'COD' ? 'COD Confirmed' : 'Prepaid UPI',
      productName: `${cartItems.reduce((acc, c) => acc + c.quantity, 0)}x Jewellery Pieces (${firstProduct?.name || 'Jewellery'})`,
      sku: firstProduct?.sku || 'SKU: MIX-99',
      quantity: cartItems.reduce((acc, c) => acc + c.quantity, 0),
      image: firstProduct?.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
      tag: paymentMethod === 'COD' ? 'OTP Verified' : 'Prepaid Fast-Track',
      courier: 'BlueDart Air Express',
      phoneVerified: isPhoneVerified,
      notes: `Doorstep delivery at ${address}, ${city}, ${state} - ${pincode} • Delivery by ${deliveryDate}`
    };

    setPlacedOrderData(newOrder);

    // Business Standard Dispatch Notification to Atelier Owner WhatsApp
    const ADMIN_WHATSAPP_NUMBER = '919106694317';
    
    // Generate professional business message
    const businessMessage = [
      `💎 *PARZIO ATELIER — NEW ORDER RECEIVED*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📦 *Order Reference:* #${generatedId}`,
      `📅 *Date & Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
      ``,
      `👤 *CUSTOMER PROFILE:*`,
      `• *Name:* ${name}`,
      `• *Contact Number:* +91 ${phone}`,
      `• *Delivery Address:* ${address}`,
      `• *City / State:* ${city}, ${state}`,
      `• *PIN Code:* ${pincode}`,
      ``,
      `💍 *ORDER PARTICULARS:*`,
      ...cartItems.map((item, idx) => `  ${idx + 1}. ${item.product.name} (Qty: ${item.quantity}) — ₹${item.product.price * item.quantity}`),
      ``,
      `💳 *COMMERCIAL SUMMARY:*`,
      `• *Total Items:* ${cartItems.reduce((acc, c) => acc + c.quantity, 0)} Units`,
      `• *Payment Mode:* ${paymentMethod} (${paymentMethod === 'COD' ? 'Cash On Delivery' : 'Prepaid Fast-Track'})`,
      `• *Total Amount Payable:* ₹${totalAmount}`,
      `• *Courier Partner:* BlueDart Air Express`,
      `• *Expected Delivery:* ${deliveryDate}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🔒 *Status:* Verified & Queued for Quality Inspection.`
    ].join('\n');

    // Trigger WhatsApp notification via window.open / API
    const encodedMsg = encodeURIComponent(businessMessage);
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMsg}`;
    setWhatsappDispatchUrl(whatsappUrl);

    // Background call/dispatch & prepare direct action link
    try {
      // Open in background tab or store for instant 1-click dispatch
      window.open(whatsappUrl, '_blank');
    } catch {
      // Safe fallback if popups blocked
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      onOrderPlaced(newOrder);
    }, 650);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#eae5dc] max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#eae5dc] bg-[#faf8f5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#141414] text-[#fed488] flex items-center justify-center font-bold text-xs shadow-xs">
              P
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#141414] leading-tight">
                {step === 'otp' ? 'COD Phone Verification' : step === 'success' ? 'Order Confirmed' : 'Quick Checkout'}
              </h3>
              <p className="text-[11px] text-[#747878] font-medium">
                {step === 'otp'
                  ? 'Preventing fake orders via 4-digit code'
                  : step === 'success'
                  ? 'Dispatched from Parzio Atelier'
                  : 'Fast delivery & Anti-Tarnish Guarantee'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200 text-[#747878] hover:text-[#141414] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">

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
                  placeholder="e.g. Pooja Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138]"
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
                      placeholder="9876543210"
                      className="w-full pl-11 pr-3 py-2.5 rounded-xl bg-white border border-[#eae5dc] text-xs font-mono text-[#141414] focus:outline-none focus:border-[#8c7138] focus:ring-1 focus:ring-[#8c7138]"
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

              {/* City & State (All Indian States & UTs Enabled) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-xs font-bold text-[#141414] mb-1">
                    State / UT <span className="text-emerald-700 text-[10px] font-bold">● All India Delivery</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#eae5dc] text-xs text-[#141414] focus:outline-none focus:border-[#8c7138] cursor-pointer"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
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
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[#141414] text-[#fed488] hover:bg-[#8c7138] hover:text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                {paymentMethod === 'COD' ? (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    <span>Proceed to Verify Mobile via OTP</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Pay ₹{totalAmount} via UPI (Zero Risk)</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: COD OTP Verification (Authentic RTO Shield) */}
          {step === 'otp' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Back Button */}
              <button
                type="button"
                onClick={() => setStep('details')}
                className="flex items-center gap-1.5 text-xs text-[#747878] hover:text-[#141414] font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Mobile Number or Address</span>
              </button>

              {/* Simulated SMS Toast */}
              {otpSentNotification && (
                <div className="p-3 rounded-2xl bg-[#141414] text-white flex items-center justify-between shadow-lg animate-fadeIn border border-[#8c7138]">
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-[#fed488]" />
                    <div className="text-xs">
                      <p className="font-bold text-[#fed488]">WhatsApp &amp; SMS Sent</p>
                      <p className="text-[11px] text-white/80">
                        PARZIO Code: <strong className="text-white underline">4829</strong>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    className="px-2.5 py-1 rounded-full bg-[#8c7138] text-white text-[10px] font-bold hover:bg-[#fed488] hover:text-[#141414] transition-colors cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              {/* Main Heading & Phone indicator */}
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-[#8c7138]/10 text-[#8c7138] mx-auto flex items-center justify-center mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-display text-lg font-bold text-[#141414]">
                  Confirm Cash on Delivery Order
                </h4>
                <p className="text-xs text-[#747878] max-w-sm mx-auto">
                  To protect our courier delivery partners from fake orders, enter the 4-digit code sent to:
                </p>
                <p className="text-sm font-mono font-bold text-[#141414] pt-0.5">
                  +91 {phone}
                </p>
              </div>

              {/* Demo Helper Banner */}
              <div className="p-3 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#141414]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Demo Test OTP: <strong className="font-mono text-[#8c7138] font-bold">4829</strong></span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="text-xs font-bold text-[#8c7138] hover:underline cursor-pointer"
                >
                  Click to Fill
                </button>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex justify-center gap-3">
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
                        className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-mono font-bold rounded-2xl border transition-all ${
                          digit
                            ? 'border-[#141414] bg-white text-[#141414] shadow-sm ring-2 ring-[#8c7138]/20'
                            : 'border-[#eae5dc] bg-[#faf8f5] text-[#141414] focus:bg-white focus:border-[#8c7138]'
                        }`}
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
                        <span>Resend 4-digit code now</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('Prepaid UPI');
                        finalizeOrder(true);
                      }}
                      className="text-[11px] text-[#747878] hover:text-[#141414] underline cursor-pointer"
                    >
                      Don't want to wait? Switch to Instant Prepaid UPI
                    </button>
                  </div>
                </div>

                {/* Submit Verification */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#141414] text-[#fed488] hover:bg-[#8c7138] hover:text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verifying Phone...' : 'Verify OTP & Confirm Order'}</span>
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: Order Success Screen */}
          {step === 'success' && placedOrderData && (
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
                  {placedOrderData.paymentMethod === 'COD' ? '✓ COD PHONE VERIFIED' : '✓ 100% PREPAID UPI'}
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

              {/* Atelier WhatsApp Dispatch Status */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-left flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                  <MessageSquare className="w-4 h-4 fill-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-emerald-950">Atelier WhatsApp Alert Sent</p>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      +91 91066 94317
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800/90 mt-0.5 leading-snug">
                    Standard business order notification with customer address, product particulars and payable amount has been dispatched.
                  </p>
                  {whatsappDispatchUrl && (
                    <a
                      href={whatsappDispatchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#141414] bg-white hover:bg-emerald-100/50 border border-emerald-300 px-3 py-1.5 rounded-full transition-colors shadow-2xs"
                    >
                      <span>Open WhatsApp Thread</span>
                      <ExternalLink className="w-3 h-3 text-emerald-700" />
                    </a>
                  )}
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
      </div>
    </div>
  );
};
