import React, { useState, useEffect } from 'react';
import { CartItem, Coupon } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Truck, ArrowRight, CheckCircle2, Tag, Sparkles, AlertCircle } from 'lucide-react';
import { validateCoupon, calculateCouponDiscount } from '../utils/couponUtils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  coupons?: Coupon[];
  appliedCoupon?: Coupon | null;
  onApplyCoupon?: (coupon: Coupon) => void;
  onRemoveCoupon?: () => void;
}

const MINIMUM_CART_VALUE = 1;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  coupons = [],
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);
  const [itemToRemove, setItemToRemove] = useState<{ id: string; name: string } | null>(null);

  // Prevent background body scroll when CartDrawer is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isMinMet = totalAmount >= 1;
  const progressPercent = 100;
  const remainingAmount = 0;

  const couponDiscount = calculateCouponDiscount(appliedCoupon, totalAmount);
  const payableAmount = Math.max(1, totalAmount - couponDiscount);

  // If subtotal drops below coupon min requirement, remove coupon
  useEffect(() => {
    if (appliedCoupon && appliedCoupon.minOrderValue && totalAmount < appliedCoupon.minOrderValue) {
      if (onRemoveCoupon) onRemoveCoupon();
      setPromoError(
        `Coupon "${appliedCoupon.code}" removed because cart subtotal is below ₹${appliedCoupon.minOrderValue}.`
      );
      setPromoSuccess(null);
    }
  }, [totalAmount, appliedCoupon, onRemoveCoupon]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    setPromoSuccess(null);

    const result = validateCoupon(promoCode, totalAmount, coupons);
    if (!result.valid) {
      setPromoError(result.message);
      return;
    }

    if (result.coupon && onApplyCoupon) {
      onApplyCoupon(result.coupon);
    }
    setPromoSuccess(result.message);
    setPromoCode('');
  };

  const handleRemoveCoupon = () => {
    if (onRemoveCoupon) onRemoveCoupon();
    setPromoSuccess(null);
    setPromoError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#fbf9f6] shadow-2xl flex flex-col justify-between border-l border-[#eae5dc]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#eae5dc] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8c7138]" />
              <h3 className="font-display text-lg font-bold text-[#141414]">
                Your Shopping Bag ({totalCount})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#f3efe9] text-[#747878] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Express Delivery Banner */}
          <div className="p-3 sm:p-4 bg-[#f2ece1] border-b border-[#dfd7ca]">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                ✓
              </div>
              <div className="text-xs">
                <p className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Free Express Delivery Unlocked!
                </p>
                <p className="text-[#747878] text-[11px] mt-0.5">
                  100% Waterproof &amp; Anti-Tarnish Demi-Fine Guarantee
                </p>
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center text-[#747878] space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-[#c5a059]/40" />
                <p className="text-sm font-medium">Your shopping bag is empty</p>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-full bg-[#141414] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#8c7138] transition-colors"
                >
                  Explore The ₹99 Vault
                </button>
              </div>
            ) : (
              cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 rounded-2xl bg-white border border-[#eae5dc] shadow-xs"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-xl bg-[#f8f6f2] border border-[#eae5dc]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-sans text-sm font-semibold text-[#141414] leading-snug line-clamp-1">
                          {product.name}
                        </h4>
                        <span className="text-[10px] text-[#8c7138] font-bold">
                          18K Anti-Tarnish Finish
                        </span>
                      </div>
                      <button
                        onClick={() => setItemToRemove({ id: product.id, name: product.name })}
                        className="text-[#a3a3a3] hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#eae5dc] rounded-full bg-[#faf8f5] px-2 py-0.5">
                        <button
                          onClick={() => {
                            if (quantity === 1) {
                              setItemToRemove({ id: product.id, name: product.name });
                            } else {
                              onUpdateQuantity(product.id, -1);
                            }
                          }}
                          className="p-1 text-[#747878] hover:text-[#141414] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#141414]">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          className="p-1 text-[#747878] hover:text-[#141414]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-[#a3a3a3] line-through mr-1.5">
                          ₹{product.originalPrice * quantity}
                        </span>
                        <span className="font-bold text-sm text-[#141414]">
                          ₹{product.price * quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 pb-16 sm:pb-5 border-t border-[#eae5dc] bg-white space-y-3">
              {/* Promo Code Box */}
              {!appliedCoupon ? (
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code (e.g. PAR123)"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        setPromoError(null);
                      }}
                      className="flex-1 px-3.5 py-2 rounded-full bg-[#faf8f5] border border-[#eae5dc] text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#8c7138] text-[#141414]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-full bg-[#141414] text-white text-xs font-bold uppercase hover:bg-[#8c7138] transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded-xl flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>{promoError}</span>
                    </p>
                  )}
                </form>
              ) : (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="font-mono text-xs font-bold text-emerald-900 tracking-wider">
                        {appliedCoupon.code}
                      </span>
                      {appliedCoupon.isPrivateSecret && (
                        <span className="text-[9px] bg-[#141414] text-[#fed488] px-1.5 py-0.2 rounded font-bold uppercase">
                          Secret
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="p-1 rounded-full text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                      title="Remove coupon"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-emerald-800">
                    <span>Coupon Discount</span>
                    <strong className="font-bold text-emerald-900">-₹{couponDiscount}</strong>
                  </div>
                </div>
              )}

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-[#747878] pt-2 border-t border-[#eae5dc]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#141414]">₹{totalAmount}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>Coupon Discount</span>
                    </span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-emerald-700">
                    FREE
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#141414] pt-1 border-t border-[#eae5dc]">
                  <span>Total Amount</span>
                  <span className="font-bold text-base text-[#141414]">₹{payableAmount}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                disabled={cartItems.length === 0}
                onClick={onCheckout}
                className="w-full py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all bg-[#141414] text-[#fed488] hover:bg-[#8c7138] hover:text-white active:scale-98 cursor-pointer shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-[#747878] pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8c7138]" /> 100% Secure Checkout
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#8c7138]" /> Cash On Delivery
                </span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Confirmation Modal: Remove Item from Cart */}
      {itemToRemove && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-[#eae5dc] shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#141414]">Remove from Bag?</h3>
                <p className="text-xs text-[#717478] mt-1 leading-relaxed">
                  Are you sure you want to remove <span className="font-semibold text-[#141414]">"{itemToRemove.name}"</span> from your shopping bag?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#f0f1f3]">
              <button
                type="button"
                onClick={() => setItemToRemove(null)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#141414] font-semibold text-xs transition-colors cursor-pointer"
              >
                Keep in Bag
              </button>
              <button
                type="button"
                onClick={() => {
                  onRemoveItem(itemToRemove.id);
                  setItemToRemove(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
