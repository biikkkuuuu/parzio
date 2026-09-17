import React, { useState } from 'react';
import {
  Tag,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Gift,
  Percent,
  ShieldCheck,
  Clock,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
  Flame
} from 'lucide-react';
import { Coupon } from '../types';
import { Footer } from './Footer';

interface OffersViewProps {
  coupons: Coupon[];
  onSelectCategory: (cat: string) => void;
  onBackToStore: () => void;
  onOpenAtelierOps?: () => void;
}

export const OffersView: React.FC<OffersViewProps> = ({
  coupons,
  onSelectCategory,
  onBackToStore,
  onOpenAtelierOps
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2400);
  };

  const handleShopWithCode = (code: string) => {
    handleCopyCode(code);
    // Take user smoothly to categories section
    onBackToStore();
    setTimeout(() => {
      const el = document.getElementById('categories-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // Only display active coupons configured from the admin panel
  const activeCoupons = coupons.filter((c) => c.active !== false);

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#141414] flex flex-col">
      {/* Top Breadcrumb & Back Bar */}
      <div className="bg-white border-b border-[#eae5dc] sticky top-[57px] z-20 py-2.5 px-4 sm:px-8 lg:px-14">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 text-xs font-semibold text-[#141414] hover:text-[#9e7144] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#747878] font-medium">
            <button onClick={onBackToStore} className="hover:text-[#9e7144]">
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-[#c4c4c4]" />
            <span className="text-[#9e7144] font-semibold">Offers &amp; Privileges</span>
          </div>
        </div>
      </div>

      {/* Clean, Light & Luxury Header */}
      <section className="bg-white border-b border-[#eae5dc] py-6 sm:py-8 px-4 sm:px-8 lg:px-14">
        <div className="max-w-[1800px] mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf7f2] border border-[#e5decb] text-[#9e7144] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#9e7144]" />
            <span>Official PARZIO Privileges</span>
          </div>

          <h1 className="text-2xl sm:text-4xl text-[#141414] font-extrabold tracking-tight">
            Curated Offers &amp; <span className="text-[#9e7144]">Luxury Privileges</span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-[#747878] max-w-xl mx-auto font-light leading-relaxed">
            Directly from our atelier. Enjoy complimentary express delivery, flat discounts, and seasonal privileges on 18K anti-tarnish waterproof jewellery.
          </p>
        </div>
      </section>

      {/* Active Offers Grid */}
      <section className="py-12 px-4 sm:px-8 lg:px-14 max-w-[1800px] mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl text-[#141414] font-bold tracking-tight">
              Active Promo Deals ({activeCoupons.length})
            </h2>
            <p className="text-xs text-[#747878] mt-1 font-medium">
              Tap 'Copy Code' to claim your discount instantly at checkout
            </p>
          </div>

          <button
            onClick={() => {
              onBackToStore();
              setTimeout(() => {
                const el = document.getElementById('categories-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 120);
            }}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#9e7144] hover:text-[#141414] transition-colors"
          >
            <span>Shop by Category</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeCoupons.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#eae5dc] shadow-sm max-w-md mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-[#faf8f5] text-[#9e7144] flex items-center justify-center mx-auto mb-4 border border-[#eae5dc]">
              <Gift className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#141414]">New Offers Launching Soon</h3>
            <p className="text-xs text-[#747878] mt-2 leading-relaxed">
              Our bespoke atelier promotions are being updated. Check back shortly or explore our current collection!
            </p>
            <button
              onClick={onBackToStore}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#9e7144] hover:bg-[#865d34] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCoupons.map((coupon) => {
              const isCopied = copiedCode === coupon.code;
              const isPercentage = coupon.discountType === 'percentage';
              const discountText = isPercentage
                ? `${coupon.discountValue}% OFF`
                : `FLAT ₹${coupon.discountValue} OFF`;

              return (
                <div
                  key={coupon.id}
                  className="bg-white rounded-3xl p-6 border border-[#eae5dc] shadow-sm hover:shadow-xl hover:border-[#c5a059] transition-all flex flex-col justify-between relative group overflow-hidden"
                >
                  {/* Top Badge & Expiry */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#faf7f2] border border-[#e5decb] text-[10px] font-bold tracking-wider text-[#9e7144] uppercase">
                      <Flame className="w-3 h-3 text-[#9e7144]" />
                      {coupon.badge || 'EXCLUSIVE OFFER'}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] text-[#747878] font-medium">
                      <Clock className="w-3 h-3 text-[#c4c4c4]" />
                      <span>{coupon.expiresAt ? `Till ${coupon.expiresAt}` : 'Active Today'}</span>
                    </span>
                  </div>

                  {/* Main Value Banner */}
                  <div className="my-2">
                    <div className="text-2xl sm:text-3xl font-black text-[#141414] tracking-tight group-hover:text-[#9e7144] transition-colors">
                      {discountText}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#141414] mt-1">
                      {coupon.title || `Special Privilege on Orders Above ₹${coupon.minOrderValue}`}
                    </h3>
                    <p className="text-xs text-[#747878] mt-1.5 leading-relaxed">
                      {coupon.description || `Apply this exclusive promo code at checkout on minimum order value of ₹${coupon.minOrderValue}.`}
                    </p>
                  </div>

                  {/* Min Cart Value Pill */}
                  <div className="my-3 pt-3 border-t border-[#f0ebe3] flex items-center justify-between text-xs text-[#555]">
                    <span>Minimum Order Value:</span>
                    <span className="font-bold text-[#141414]">₹{coupon.minOrderValue}</span>
                  </div>

                  {/* Coupon Code Strip with 1-Click Copy */}
                  <div className="bg-[#faf8f5] border-2 border-dashed border-[#e5decb] rounded-2xl p-2.5 flex items-center justify-between gap-2 my-2">
                    <div className="flex items-center gap-2 pl-2">
                      <Tag className="w-4 h-4 text-[#9e7144]" />
                      <span className="font-mono font-black text-sm tracking-widest text-[#141414]">
                        {coupon.code}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyCode(coupon.code)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isCopied
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#9e7144] hover:bg-[#865d34] text-white shadow-xs'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Shop Button */}
                  <button
                    onClick={() => handleShopWithCode(coupon.code)}
                    className="w-full mt-3 py-2.5 rounded-full bg-[#9e7144] hover:bg-[#865d34] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Shop With This Code</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* 3 Steps: How to Redeem */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-10 border border-[#eae5dc] shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-bold text-[#9e7144] uppercase tracking-widest">
              Simple 3-Step Redemption
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#141414] mt-1">
              How to Claim Your Savings
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#141414] text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h4 className="font-bold text-sm text-[#141414]">Pick Your Jewellery</h4>
              <p className="text-xs text-[#747878] leading-relaxed">
                Explore our waterproof bangles, mangalsutra, necklaces, and rings, and add your favorites to your bag.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#141414] text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h4 className="font-bold text-sm text-[#141414]">Copy Promo Code</h4>
              <p className="text-xs text-[#747878] leading-relaxed">
                Tap the 'Copy' button on any active coupon above that matches your order total.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#141414] text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h4 className="font-bold text-sm text-[#141414]">Instant Deduction</h4>
              <p className="text-xs text-[#747878] leading-relaxed">
                Paste the promo code on the checkout page to see the final price instantly slashed!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          onBackToStore();
          onSelectCategory(cat);
        }}
        onOpenAtelierOps={onOpenAtelierOps}
      />
    </div>
  );
};
