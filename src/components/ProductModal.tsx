import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, ShieldCheck, Droplet, ShoppingBag, Truck, RotateCcw, CheckCircle2, MapPin, AlertTriangle } from 'lucide-react';
import { HIGH_RISK_PINCODES } from '../data/adminData';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<{
    checked: boolean;
    valid: boolean;
    message: string;
    date: string;
    isHighRisk?: boolean;
  } | null>(null);

  if (!product) return null;

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!cleanPin || cleanPin.length !== 6 || isNaN(Number(cleanPin))) {
      setDeliveryResult({
        checked: true,
        valid: false,
        message: 'Please enter a valid 6-digit Indian pincode',
        date: ''
      });
      return;
    }

    const today = new Date();
    const isMetro = cleanPin.startsWith('11') || cleanPin.startsWith('40') || cleanPin.startsWith('56');
    const estDate = new Date(today);
    estDate.setDate(today.getDate() + (isMetro ? 2 : 4));
    const dateString = estDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const isHighRisk = HIGH_RISK_PINCODES.some((p) => p.pincode === cleanPin);

    setDeliveryResult({
      checked: true,
      valid: true,
      message: isHighRisk
        ? 'Serviceable via BlueDart • COD requires WhatsApp OTP'
        : 'Express Delivery & Cash On Delivery Available!',
      date: dateString,
      isHighRisk
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-[#fbf9f6] rounded-3xl overflow-hidden shadow-2xl border border-[#eae5dc] flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/95 border border-[#eae5dc] text-[#747878] hover:text-[#141414] hover:bg-[#f3efe9] flex items-center justify-center transition-colors shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image Panel */}
        <div className="md:w-1/2 bg-white p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#eae5dc] relative">
          <span className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full bg-[#141414] text-[#fed488] text-[10px] font-bold tracking-wider uppercase border border-[#8c7138]/30">
            SAVE {product.savePercent}%
          </span>
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-h-72 object-contain mix-blend-multiply drop-shadow-xs"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#8c7138] bg-[#faf8f5] px-3 py-1 rounded-full border border-[#eae5dc]">
            <ShieldCheck className="w-4 h-4 text-[#8c7138]" />
            <span>Certified 18K Anti-Tarnish Finish</span>
          </div>
        </div>

        {/* Product Info Panel */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto bg-[#fbf9f6]">
          <div>
            <div className="flex items-center gap-1 text-amber-500 mb-1 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-bold text-[#141414]">{product.rating}</span>
              <span className="text-[#747878] font-normal">({product.reviewsCount} reviews)</span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#141414]">
              {product.name}
            </h3>

            <p className="text-xs text-[#747878] mt-0.5">
              SKU: {product.sku} • {product.colorways} Colorways
            </p>

            {/* Price Row */}
            <div className="flex items-baseline gap-2 mt-3">
              <span className="font-display text-2xl font-bold text-[#141414]">
                ₹{product.price}
              </span>
              <span className="text-sm text-[#747878] line-through">
                ₹{product.originalPrice}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                SAVE {product.savePercent}%
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#444748] mt-3 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications list */}
            <div className="mt-4 space-y-2 text-xs border-t border-[#eae5dc] pt-3">
              <div className="flex justify-between py-0.5">
                <span className="text-[#747878]">Material:</span>
                <span className="font-bold text-[#141414]">{product.material}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#747878]">Water Resistance:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <Droplet className="w-3 h-3" /> 100% Shower &amp; Sweatproof
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#747878]">Warranty:</span>
                <span className="font-bold text-[#141414]">Lifetime Anti-Tarnish Guarantee</span>
              </div>
            </div>

            {/* Pincode & Delivery Checker (Authentic Indian D2C Feature) */}
            <div className="mt-4 pt-3 border-t border-[#eae5dc]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#141414] flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#8c7138]" /> Check Delivery &amp; COD
                </span>
                <span className="text-[10px] text-[#8c7138] font-bold">BlueDart Express</span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="w-3.5 h-3.5 text-[#747878] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white border border-[#eae5dc] text-xs font-mono text-[#141414] focus:outline-none focus:border-[#8c7138]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-[#141414] text-white text-xs font-bold hover:bg-[#8c7138] transition-colors shadow-xs"
                >
                  Check
                </button>
              </form>

              {deliveryResult && (
                <div className={`mt-2 p-2 rounded-xl text-xs flex items-start gap-1.5 ${
                  !deliveryResult.valid
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : deliveryResult.isHighRisk
                    ? 'bg-amber-50 text-amber-900 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {!deliveryResult.valid ? (
                    <X className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  ) : deliveryResult.isHighRisk ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold leading-tight">{deliveryResult.message}</p>
                    {deliveryResult.date && (
                      <p className={`text-[11px] mt-0.5 ${deliveryResult.isHighRisk ? 'text-amber-800' : 'text-emerald-700'}`}>
                        Expected Delivery: <strong>{deliveryResult.date}</strong>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-5 pt-3 border-t border-[#eae5dc]">
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="w-full py-3 rounded-full bg-[#141414] text-[#fed488] hover:bg-[#8c7138] hover:text-white transition-all font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              Add To Bag — ₹{product.price}
            </button>
            <p className="text-center text-[10px] text-[#747878] mt-2 font-medium">
              Free Express Shipping on orders above ₹500 • 7 Days Return
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
