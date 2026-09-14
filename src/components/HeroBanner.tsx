import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Droplet, Star, ShoppingBag, ArrowRight, Truck, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, StoreBanner, MarqueeItem } from '../types';
import { HERO_PRODUCT } from '../data/products';
import { INITIAL_BANNERS, INITIAL_BANNER_MARQUEE } from '../data/bannerData';
import { MarqueeBar } from './MarqueeBar';

interface HeroBannerProps {
  heroProduct?: Product;
  onAddToCart: (product: Product) => void;
  onScrollToVault?: () => void;
  onExploreVault?: () => void;
  onOpenProductModal?: (product: Product) => void;
  banners?: StoreBanner[];
  bannerMarqueeItems?: MarqueeItem[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  heroProduct = HERO_PRODUCT,
  onAddToCart,
  onScrollToVault,
  onExploreVault,
  onOpenProductModal,
  banners = INITIAL_BANNERS,
  bannerMarqueeItems = INITIAL_BANNER_MARQUEE
}) => {
  const currentHero = heroProduct || HERO_PRODUCT;
  const handleScroll = onScrollToVault || onExploreVault || (() => {
    document.getElementById('vault-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Active banners filtered
  const activeBanners = banners.filter((b) => b.active);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Fallback to initial banner if none active
  const activeBanner: StoreBanner = activeBanners[currentSlideIndex] || activeBanners[0] || INITIAL_BANNERS[0];

  const handleNextSlide = () => {
    if (activeBanners.length > 1) {
      setCurrentSlideIndex((prev) => (prev + 1) % activeBanners.length);
    }
  };

  const handlePrevSlide = () => {
    if (activeBanners.length > 1) {
      setCurrentSlideIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
    }
  };

  return (
    <section className="relative overflow-hidden bg-white pt-4 pb-8 sm:pb-12 border-b border-neutral-200">
      
      {/* 2nd Marquee Ticker: Right-to-Left Continuous Scrolling */}
      <div className="mb-4 sm:mb-6">
        <MarqueeBar items={bannerMarqueeItems} variant="gold" speed="fast" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Slide Navigation Bar if multiple banners active */}
        {activeBanners.length > 1 && (
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-150 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Featured Campaign ({currentSlideIndex + 1} of {activeBanners.length})
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevSlide}
                className="p-1 rounded-full border border-neutral-200 hover:bg-neutral-100 text-neutral-700"
                aria-label="Previous Banner Slide"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1 px-1">
                {activeBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentSlideIndex ? 'w-5 bg-neutral-900' : 'w-1.5 bg-neutral-300'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={handleNextSlide}
                className="p-1 rounded-full border border-neutral-200 hover:bg-neutral-100 text-neutral-700"
                aria-label="Next Banner Slide"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Description & Metrics */}
          <div className="lg:col-span-7 flex flex-col items-start gap-4 sm:gap-6">
            
            {/* Pill Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-[11px] font-semibold tracking-wider uppercase">
                <Sparkles className="w-3 h-3 text-neutral-300" />
                {activeBanner.badge}
              </span>
              {activeBanner.subBadge && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 text-[11px] font-medium tracking-wider uppercase">
                  <Droplet className="w-3 h-3 text-neutral-600" />
                  {activeBanner.subBadge}
                </span>
              )}
            </div>

            {/* Display Headline */}
            <div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-neutral-950 font-semibold tracking-tight leading-[1.12]">
                {activeBanner.title} <br />
                <span className="font-bold text-[#8c7138] relative inline-block">
                  {activeBanner.highlightText}
                </span>
              </h1>
              <p className="font-sans text-base sm:text-lg text-neutral-600 mt-2 font-medium">
                {activeBanner.subtitle}
              </p>
            </div>

            {/* Editorial Description */}
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl font-normal">
              {activeBanner.description}
            </p>

            {/* Stat Counters Row */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-lg pt-2 pb-2 border-y border-neutral-200">
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-neutral-900">
                  {activeBanner.stat1Value}
                </p>
                <p className="text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-neutral-500">
                  {activeBanner.stat1Label}
                </p>
              </div>
              <div className="border-l border-neutral-200 pl-3 sm:pl-6">
                <p className="font-display text-2xl sm:text-3xl font-bold text-neutral-900">
                  {activeBanner.stat2Value}
                </p>
                <p className="text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-neutral-500">
                  {activeBanner.stat2Label}
                </p>
              </div>
              <div className="border-l border-neutral-200 pl-3 sm:pl-6">
                <p className="font-display text-2xl sm:text-3xl font-bold text-neutral-900">
                  {activeBanner.stat3Value}
                </p>
                <p className="text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-neutral-500">
                  {activeBanner.stat3Label}
                </p>
              </div>
            </div>

            {/* Assurance Bullet Tags */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-neutral-600">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-neutral-800" />
                Free Shipping On ₹500+
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-neutral-800" />
                COD Available Nationwide
              </span>
            </div>

            {/* CTA Button Group */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleScroll}
                className="px-6 py-3 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-all font-medium text-xs sm:text-sm tracking-wide uppercase flex items-center gap-2 shadow-xs active:scale-95 cursor-pointer"
              >
                {activeBanner.buttonText}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Hero Spotlight Drop with Banner Image & Featured Piece */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-neutral-200 relative group hover:border-neutral-350 transition-all duration-200">
              
              {/* Badges on card */}
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-semibold tracking-wider uppercase">
                  {activeBanner.badge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#faf8f5] text-[#8c7138] text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 border border-[#eae5dc]">
                  <Sparkles className="w-3 h-3 text-[#8c7138]" />
                  SPECIAL DROP
                </span>
              </div>

              {/* Product Image Frame */}
              <div
                onClick={() => onOpenProductModal && onOpenProductModal(currentHero)}
                className="relative aspect-square w-full rounded-xl bg-neutral-100/70 overflow-hidden flex items-center justify-center p-3 my-2 cursor-pointer"
              >
                <img
                  src={activeBanner.image || currentHero.image}
                  alt={activeBanner.title}
                  className="w-full h-full object-cover rounded-lg filter drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/95 border border-neutral-200 text-[10px] font-semibold text-neutral-800 flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  4.9 Rating
                </div>
              </div>

              {/* Product Details & Pricing */}
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      onClick={() => onOpenProductModal && onOpenProductModal(currentHero)}
                      className="font-display text-lg sm:text-xl font-bold text-neutral-900 cursor-pointer hover:text-[#8c7138] transition-colors"
                    >
                      {currentHero.name}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      18K Gold Plated • Waterproof Paperclip Link
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-1.5 justify-end">
                      <span className="font-display text-xl sm:text-2xl font-bold text-neutral-900">
                        {activeBanner.priceText || `₹${currentHero.price}`}
                      </span>
                      <span className="text-xs text-neutral-400 line-through">
                        ₹{currentHero.originalPrice}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 px-1.5 py-0.5 rounded">
                      SAVE {currentHero.savePercent}%
                    </span>
                  </div>
                </div>

                {/* Verified Customer Quote Box */}
                {currentHero.quote && (
                  <div className="mt-2 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 italic flex items-start gap-2">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>
                      "{currentHero.quote}"
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 mt-3">
                  <button
                    onClick={() => onAddToCart(currentHero)}
                    className="w-full py-2.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-none active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-white" />
                    Add To Bag
                  </button>
                  <button
                    onClick={handleScroll}
                    className="w-full py-2.5 rounded-lg bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 transition-colors text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                  >
                    Explore ₹99
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 3-Column USP Strip directly matching standard clean e-commerce */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 sm:mt-14 pt-8 border-t border-neutral-200">
          
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-neutral-200 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0 text-neutral-900">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-sans text-sm font-semibold text-neutral-900">
                Free Express Delivery
              </h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Complimentary tracked courier dispatched for all orders ₹500 and above across 26,000+ pin codes.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-white border border-neutral-200 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0 text-neutral-900">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-sans text-sm font-semibold text-neutral-900">
                Cash On Delivery (COD)
              </h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Verify your jewelry at your doorstep before final payment. Zero upfront payment required.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-white border border-neutral-200 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0 text-neutral-900">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-sans text-sm font-semibold text-neutral-900">
                5-Step Quality Check
              </h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Each piece endures 100-hour saline immersion, hypoallergenic skin tolerance testing, and gemstone clasp checks.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

