import React, { useState, useEffect } from 'react';
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

  const activeBanners = banners.filter((b) => b.active);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const activeBanner: StoreBanner = activeBanners[currentSlideIndex] || activeBanners[0] || INITIAL_BANNERS[0];

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeBanners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

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
    <section className="relative overflow-hidden bg-white pt-2 pb-6 border-b border-[#eae5dc]">
      <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Full-Width Visual Hero Card Slider */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#141414] shadow-md border border-[#eae5dc] min-h-[300px] sm:min-h-[380px] lg:min-h-[420px] flex items-center group">
          
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={activeBanner.image || currentHero.image}
              alt={activeBanner.title}
              className="w-full h-full object-cover object-center filter brightness-90 transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark contrast gradient for 100% text readability */}
            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/90 via-black/75 to-black/30 sm:to-transparent z-10" />
          </div>

          {/* Top-Right Carousel Navigation Controls (Never overlaps text) */}
          {activeBanners.length > 1 && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              <button
                onClick={handlePrevSlide}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {activeBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentSlideIndex ? 'w-4 bg-[#fed488]' : 'w-1.5 bg-white/40'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextSlide}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Banner Content Layer */}
          <div className="relative z-20 w-full p-4 sm:p-8 lg:p-12 max-w-2xl flex flex-col justify-center gap-2 sm:gap-4 text-white">
            
            {/* Top Offer Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#8c7138] text-white text-[9px] sm:text-xs font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-white fill-white" />
                {activeBanner.badge || 'SPECIAL SALE • FLAT ₹99'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-[9px] sm:text-xs font-bold uppercase tracking-wider">
                ⚡ 316L STAINLESS STEEL
              </span>
            </div>

            {/* Banner Main Title */}
            <div>
              <h1 className="font-display text-xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
                {activeBanner.title}{' '}
                <span className="text-[#fed488] block sm:inline font-bold">
                  {activeBanner.highlightText}
                </span>
              </h1>
              <p className="text-[11px] sm:text-base text-neutral-200 mt-1 font-medium tracking-wide">
                {activeBanner.subtitle}
              </p>
            </div>

            {/* Description (Desktop / Tablet) */}
            <p className="text-xs sm:text-sm text-neutral-300 max-w-lg hidden sm:block leading-relaxed">
              {activeBanner.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2.5 pt-1 sm:pt-3 flex-wrap">
              <button
                onClick={handleScroll}
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#8c7138] hover:bg-[#a38443] text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>{activeBanner.buttonText || 'SHOP ₹99 VAULT NOW'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenProductModal && onOpenProductModal(currentHero)}
                className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/40 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#fed488]" />
                <span>Featured (₹{currentHero.price})</span>
              </button>
            </div>

            {/* Trust Micro Indicators */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] sm:text-xs text-neutral-300 font-medium pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                100% Anti-Tarnish
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Droplet className="w-3 h-3 text-sky-400" />
                Showerproof Steel
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3 text-amber-300" />
                COD Available
              </span>
            </div>

          </div>

        </div>

        {/* 3-Column Quick USP Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#eae5dc] flex items-center justify-center flex-shrink-0 text-[#8c7138] shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-sans text-xs sm:text-sm font-bold text-[#141414]">
                Free Express Delivery
              </h4>
              <p className="text-[11px] text-[#747878] leading-tight">
                Dispatched across 26,000+ Pincodes on orders ₹500+
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#eae5dc] flex items-center justify-center flex-shrink-0 text-[#8c7138] shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-sans text-xs sm:text-sm font-bold text-[#141414]">
                Cash On Delivery (COD)
              </h4>
              <p className="text-[11px] text-[#747878] leading-tight">
                Pay cash at your doorstep when your package arrives
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#eae5dc] flex items-center justify-center flex-shrink-0 text-[#8c7138] shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-sans text-xs sm:text-sm font-bold text-[#141414]">
                316L Stainless Steel
              </h4>
              <p className="text-[11px] text-[#747878] leading-tight">
                100% Anti-Tarnish, Sweatproof & Hypoallergenic
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

