import React, { useState, useEffect } from 'react';
import { ArrowRight, Gem, Truck, ShieldCheck, Gift } from 'lucide-react';
import { StoreBanner } from '../types';

interface HeroBannerProps {
  banners?: StoreBanner[];
  onScrollToVault?: () => void;
  onExploreVault?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  banners = [],
  onScrollToVault,
  onExploreVault
}) => {
  const activeBanners = banners.filter((b) => b.active);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-slide every 5s if multiple banners are active
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const activeBanner = activeBanners[currentSlideIndex] || activeBanners[0];
  const bannerImage = activeBanner?.image || '/images/parzio-hero-banner.jpg';

  const handleShopNow = () => {
    if (onScrollToVault) {
      onScrollToVault();
    } else {
      document.getElementById('vault-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExplore = () => {
    if (onExploreVault) {
      onExploreVault();
    } else {
      document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#ebe2d6] border-b border-[#ddcfbe]">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#f5eee4] via-[#ecdfce] to-[#dfcfba] pointer-events-none" />

      <div className="relative w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 z-10 flex flex-col justify-center text-left">
            {/* Crown + Brand Tag matching screenshot */}
            <div className="flex items-center gap-2.5 mb-3">
              <span className="h-[1px] w-6 bg-[#9e7144]" />
              <div className="flex flex-col">
                <span className="font-display font-semibold tracking-[0.25em] text-[#1b1714] text-xs uppercase">
                  PARZIO
                </span>
                <span className="text-[9px] tracking-[0.2em] text-[#9e7144] uppercase -mt-0.5">
                  BEAUTY IN EVERY DETAIL
                </span>
              </div>
            </div>

            {/* Main Headline matching screenshot */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] text-[#1a1714] font-normal leading-[1.1] tracking-tight mb-4">
              Elegance <br />
              That Speaks For You
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#5a544d] max-w-md mb-6 leading-relaxed font-sans">
              Discover timeless jewellery designed to make every moment special.
            </p>

            {/* Buttons matching screenshot */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <button
                onClick={handleShopNow}
                className="inline-flex items-center justify-center gap-2 bg-[#9e7144] hover:bg-[#865d34] text-white px-7 py-2.5 rounded-sm font-semibold text-xs tracking-wider uppercase shadow-xs transition-all cursor-pointer"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleExplore}
                className="inline-flex items-center justify-center bg-transparent hover:bg-white/40 text-[#1a1714] px-6 py-2.5 rounded-sm font-semibold text-xs tracking-wider uppercase border border-[#1a1714] transition-all cursor-pointer"
              >
                <span>EXPLORE COLLECTION</span>
              </button>
            </div>

            {/* 4 Trust Indicators in a horizontal row matching screenshot */}
            <div className="pt-4 border-t border-[#d8c8b4] flex flex-wrap items-center gap-5 sm:gap-7 text-[#2c261f]">
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-[#9e7144]" />
                <span className="text-[11px] font-medium leading-tight">Premium<br />Quality</span>
              </div>

              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#9e7144]" />
                <span className="text-[11px] font-medium leading-tight">Fast &amp; Reliable<br />Delivery</span>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#9e7144]" />
                <span className="text-[11px] font-medium leading-tight">Secure<br />Payments</span>
              </div>

              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#9e7144]" />
                <span className="text-[11px] font-medium leading-tight">Perfect for<br />Every Occasion</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Dynamic Storefront Banner (Managed & Editable from Admin Panel) */}
          <div className="lg:col-span-6 relative flex items-center justify-end">
            <div
              onClick={handleShopNow}
              className="relative w-full max-w-[580px] aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/8.8] rounded-2xl overflow-hidden shadow-lg border border-[#d8c8b4]/60 bg-white group cursor-pointer"
            >
              <img
                src={bannerImage}
                alt={activeBanner?.title || 'PARZIO Hero Banner'}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/parzio-hero-banner.jpg';
                }}
              />

              {/* Slider Dots if multiple banners are active in Admin Panel */}
              {activeBanners.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                  {activeBanners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlideIndex(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === currentSlideIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                      }`}
                      title={`Banner ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
