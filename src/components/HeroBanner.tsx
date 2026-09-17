import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

  const activeBanner = activeBanners[currentSlideIndex] || activeBanners[0];
  const bannerImage = activeBanner?.image || '/images/parzio-hero-banner.jpg';

  const handleShopNow = () => {
    if (onScrollToVault) {
      onScrollToVault();
    } else if (onExploreVault) {
      onExploreVault();
    } else {
      document.getElementById('vault-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-[#faf7f2] py-2.5 sm:py-4 border-b border-[#eae5dc]">
      <div className="w-full max-w-[1800px] mx-auto px-2.5 sm:px-6 lg:px-10">
        
        {/* Full-Width Grand Master Hero Banner */}
        <div
          onClick={handleShopNow}
          className="relative w-full rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-md border border-[#e8ded1] bg-white cursor-pointer group"
        >
          {/* Main Image fitted to full width rectangle without cropping */}
          <div className="w-full aspect-[1024/415] relative overflow-hidden bg-[#fdfaf5]">
            <img
              src={bannerImage}
              alt={activeBanner?.title || 'PARZIO Grand Hero Banner'}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
              loading="eager"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/parzio-hero-banner.jpg';
              }}
            />
          </div>

          {/* Navigation Controls (If multiple banners are added in Admin Panel) */}
          {activeBanners.length > 1 && (
            <>
              {/* Left Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevSlide();
                }}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
                title="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Right Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextSlide();
                }}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
                title="Next Slide"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Bottom Pagination Dots */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full">
                {activeBanners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlideIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentSlideIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    title={`Go to Banner ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </section>
  );
};
