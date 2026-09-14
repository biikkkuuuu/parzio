import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

const MINIMUM_CART_VALUE = 500;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isMinMet = totalAmount >= MINIMUM_CART_VALUE;
  const progressPercent = Math.min(100, Math.round((totalAmount / MINIMUM_CART_VALUE) * 100));
  const remainingAmount = Math.max(0, MINIMUM_CART_VALUE - totalAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim()) {
      setPromoApplied(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
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

          {/* Minimum Cart Value Banner & Progress Bar */}
          <div className="p-4 bg-[#f2ece1] border-b border-[#dfd7ca]">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#8c7138] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                !
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#141414]">
                  Minimum Cart Value: ₹{MINIMUM_CART_VALUE}
                </p>
                <p className="text-[#747878] mt-0.5">
                  {isMinMet ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Free Express Courier Unlocked!
                    </span>
                  ) : (
                    `Add ₹${remainingAmount} more (${Math.ceil(remainingAmount / 99)} more ₹99 items) to checkout`
                  )}
                </p>
              </div>
            </div>

            {/* Progress line */}
            <div className="mt-3 w-full h-1.5 rounded-full bg-[#dfd7ca] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#8c7138] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                        onClick={() => onRemoveItem(product.id)}
                        className="text-[#a3a3a3] hover:text-rose-600 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#eae5dc] rounded-full bg-[#faf8f5] px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          className="p-1 text-[#747878] hover:text-[#141414]"
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
            <div className="p-4 sm:p-5 border-t border-[#eae5dc] bg-white space-y-3">
              {/* Promo Code Box */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. PARZIO99)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-full bg-[#faf8f5] border border-[#eae5dc] text-xs focus:outline-none focus:border-[#8c7138] text-[#141414]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[#141414] text-white text-xs font-bold uppercase hover:bg-[#8c7138] transition-colors"
                >
                  Apply
                </button>
              </form>
              {promoApplied && (
                <p className="text-[11px] text-emerald-700 font-bold">
                  ✓ Voucher applied: Free Express Courier active!
                </p>
              )}

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-[#747878] pt-2 border-t border-[#eae5dc]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#141414]">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-emerald-700">
                    {isMinMet ? 'FREE' : '₹99'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#141414] pt-1 border-t border-[#eae5dc]">
                  <span>Total Amount</span>
                  <span className="font-bold text-base text-[#141414]">₹{totalAmount}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                disabled={!isMinMet}
                onClick={onCheckout}
                className={`w-full py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
                  isMinMet
                    ? 'bg-[#141414] text-[#fed488] hover:bg-[#8c7138] hover:text-white active:scale-98 cursor-pointer shadow-md'
                    : 'bg-[#e5e0d8] text-[#a3a3a3] cursor-not-allowed'
                }`}
              >
                <span>{isMinMet ? 'Proceed to Checkout / COD' : `Add ₹${remainingAmount} More To Order`}</span>
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
    </div>
  );
};
