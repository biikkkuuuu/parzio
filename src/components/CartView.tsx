import React, { useState } from 'react';
import { CartItem } from '../types';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Tag
} from 'lucide-react';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  onBackToStore: () => void;
}

const MINIMUM_CART_VALUE = 500;

export const CartView: React.FC<CartViewProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onBackToStore
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<{ id: string; name: string } | null>(null);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const originalTotalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.originalPrice * item.quantity,
    0
  );
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const savings = Math.max(0, originalTotalAmount - totalAmount);

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
    <div className="min-h-screen bg-[#fbf9f6] text-[#141414] font-sans pb-24">
      {/* Top Header / Breadcrumb */}
      <div className="bg-white border-b border-[#eae5dc] sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToStore}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#555] hover:text-[#141414] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>

          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8c7138]" />
            <span className="font-bold text-sm sm:text-base text-[#141414]">
              Shopping Bag ({totalCount} {totalCount === 1 ? 'Item' : 'Items'})
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {cartItems.length === 0 ? (
          /* Empty Bag State */
          <div className="max-w-md mx-auto py-20 text-center space-y-5 bg-white p-8 rounded-3xl border border-[#eae5dc] shadow-xs">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-[#8c7138]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#141414]">Your Shopping Bag is Empty</h2>
              <p className="text-xs sm:text-sm text-[#747878] mt-2 leading-relaxed">
                Looks like you haven't added anything to your cart yet. Explore our handcrafted anti-tarnish jewellery vault!
              </p>
            </div>
            <button
              onClick={onBackToStore}
              className="px-6 py-3 rounded-full bg-[#141414] text-[#fed488] text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#2a2a2a] transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore The Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* 2-Column Desktop Grid */
          <div className="flex flex-col lg:flex-row items-start gap-8 xl:gap-12">
            
            {/* Left Column: Items List & Delivery Threshold */}
            <div className="flex-1 w-full min-w-0 space-y-6">
              
              {/* Minimum Cart Value Banner & Progress Bar */}
              <div className="p-4 sm:p-5 bg-[#faf8f5] rounded-2xl border border-[#dfd7ca] shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#8c7138] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    !
                  </div>
                  <div className="flex-1 text-xs sm:text-sm">
                    <p className="font-bold text-[#141414]">
                      Minimum Cart Value: ₹{MINIMUM_CART_VALUE}
                    </p>
                    <p className="text-[#747878] mt-1 text-xs leading-relaxed">
                      {isMinMet ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Free Express Courier Unlocked for this order!
                        </span>
                      ) : (
                        `Add ₹${remainingAmount} more to checkout (${Math.ceil(remainingAmount / 99)} more ₹99 items)`
                      )}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3.5 w-full h-2 rounded-full bg-[#dfd7ca] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#8c7138] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="space-y-4">
                {cartItems.map(({ product, quantity }) => (
                  <div
                    key={`${product.id}`}
                    className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-[#eae5dc] shadow-xs hover:border-[#8c7138]/30 transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#faf8f5] border border-[#eae5dc] flex-shrink-0 relative">
                      <img
                        src={product.image || (product as any).images?.[0] || ''}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h3 className="font-bold text-sm sm:text-base text-[#141414] leading-snug">
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold text-[#8c7138] bg-[#fed488]/30 px-2 py-0.5 rounded">
                                18K Anti-Tarnish
                              </span>
                              {product.category && (
                                <span className="text-[10px] text-[#747878] uppercase font-semibold">
                                  {product.category}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => setItemToRemove({ id: product.id, name: product.name })}
                            className="p-1.5 text-[#a3a3a3] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Quantity Selector & Price */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f5f2eb]">
                        <div className="flex items-center border border-[#eae5dc] rounded-full bg-[#faf8f5] px-2.5 py-1">
                          <button
                            onClick={() => {
                              if (quantity === 1) {
                                setItemToRemove({ id: product.id, name: product.name });
                              } else {
                                onUpdateQuantity(product.id, -1);
                              }
                            }}
                            className="p-1 text-[#747878] hover:text-[#141414] transition-colors cursor-pointer"
                            title="Decrease"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs sm:text-sm font-bold text-[#141414]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, 1)}
                            className="p-1 text-[#747878] hover:text-[#141414] transition-colors cursor-pointer"
                            title="Increase"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          {product.originalPrice > product.price && (
                            <span className="text-xs text-[#a3a3a3] line-through mr-2">
                              ₹{product.originalPrice * quantity}
                            </span>
                          )}
                          <span className="font-bold text-base sm:text-lg text-[#141414]">
                            ₹{product.price * quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout Card (Desktop Sticky) */}
            <div className="w-full lg:w-[420px] flex-shrink-0 self-start lg:sticky lg:top-24">
              <div className="bg-white p-6 rounded-3xl border border-[#eae5dc] shadow-xs space-y-5">
                <h3 className="font-bold text-[#141414] text-lg">Order Summary</h3>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#747878] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#faf8f5] border border-[#eae5dc] text-xs focus:outline-none focus:border-[#8c7138] text-[#141414]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#141414] text-white text-xs font-bold uppercase hover:bg-[#8c7138] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {promoApplied && (
                  <p className="text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 p-2 rounded-xl flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Coupon applied! Free express delivery active.</span>
                  </p>
                )}

                {/* Pricing Breakdown */}
                <div className="space-y-2.5 text-xs text-[#747878] pt-2 border-t border-[#eae5dc]">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-[#141414]">₹{totalAmount}</span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Total Savings</span>
                      <span className="font-bold">-₹{savings}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Express Shipping</span>
                    <span className="font-bold text-emerald-700">
                      {isMinMet ? 'FREE' : '₹99'}
                    </span>
                  </div>

                  <div className="border-t border-[#eae5dc] pt-3 flex justify-between items-end">
                    <div>
                      <span className="font-bold text-[#141414] block text-sm">Total Payable</span>
                      <span className="text-[10px] text-[#747878]">Inclusive of all taxes &amp; duties</span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-[#141414]">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA Button */}
                <button
                  disabled={!isMinMet}
                  onClick={onCheckout}
                  className={`w-full py-4 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md ${
                    isMinMet
                      ? 'bg-[#141414] text-[#fed488] hover:bg-[#2a2a2a] active:scale-98 cursor-pointer'
                      : 'bg-[#e5e0d8] text-[#a3a3a3] cursor-not-allowed'
                  }`}
                >
                  {isMinMet ? (
                    <>
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <span>Add ₹{remainingAmount} More to Checkout</span>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] grid grid-cols-2 gap-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#8c7138]" />
                    <span className="text-[10px] font-bold text-[#747878] leading-tight">100% Secure</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-[#8c7138]" />
                    <span className="text-[10px] font-bold text-[#747878] leading-tight">Cash on Delivery</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}
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
