import React, { useState, useEffect, useRef } from 'react';
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
  const [isPaused, setIsPaused] = useState(false);

  // Touch swipe support for mobile devices
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Keep index within bounds if banners change
  useEffect(() => {
    if (activeBanners.length > 0 && currentSlideIndex >= activeBanners.length) {
      setCurrentSlideIndex(0);
    }
  }, [activeBanners.length, currentSlideIndex]);

  // Auto-slide every 5s if multiple banners are active (pauses on hover/touch)
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length, isPaused]);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45; // px

    if (distance > minSwipeDistance) {
      // Swiped left -> next
      handleNextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev
      handlePrevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleShopNow = () => {
    if (onScrollToVault) {
      onScrollToVault();
    } else if (onExploreVault) {
      onExploreVault();
    } else {
      document.getElementById('vault-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If no banners exist at all, provide clean fallback
  const displayBanners = activeBanners.length > 0 ? activeBanners : [
    {
      id: 'ban-default',
      title: 'Khoobsurati Aapki',
      highlightText: 'Andaz PARZIO Ka',
      subtitle: 'Aapke Shringar, Hamara Pyaar',
      description: 'Roz Khubsurat Banne ka Haq Sabka Hai.',
      badge: 'PARZIO ROYAL COLLECTION',
      priceText: 'Special Drops',
      image: '/images/parzio-hero-banner.jpg',
      buttonText: 'SHOP NOW →',
      active: true
    } as StoreBanner
  ];

  return (
    <section className="w-full bg-[#faf7f2] py-2.5 sm:py-4 border-b border-[#eae5dc]">
      <div className="w-full max-w-[1800px] mx-auto px-2.5 sm:px-6 lg:px-10">
        
        {/* Full-Width Grand Master Hero Banner Carousel */}
        <div
          onClick={handleShopNow}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-md border border-[#e8ded1] bg-white cursor-pointer group select-none"
        >
          {/* Sliding Carousel Track */}
          <div className="w-full aspect-[1024/415] relative overflow-hidden bg-[#fdfaf5]">
            <div
              className="flex w-full h-full transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
            >
              {displayBanners.map((banner, idx) => (
                <div
                  key={banner.id || idx}
                  className="w-full h-full shrink-0 relative overflow-hidden"
                >
                  <img
                    src={banner.image || '/images/parzio-hero-banner.jpg'}
                    alt={banner.title || `PARZIO Banner ${idx + 1}`}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/parzio-hero-banner.jpg';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicator Badge (Top Right) */}
          {displayBanners.length > 1 && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-none">
              <span className="bg-black/60 backdrop-blur-md text-[#fed488] text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-sm flex items-center gap-1">
                <span>SLIDE</span>
                <strong className="text-white">{currentSlideIndex + 1}</strong>
                <span className="text-white/60">/</span>
                <span>{displayBanners.length}</span>
              </span>
            </div>
          )}

          {/* Navigation Controls (If multiple banners are active) */}
          {displayBanners.length > 1 && (
            <>
              {/* Left Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevSlide();
                }}
                className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-[#8c7138] text-white border border-white/20 backdrop-blur-xs flex items-center justify-center transition-all opacity-85 sm:opacity-0 group-hover:opacity-100 shadow-md cursor-pointer active:scale-95"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              {/* Right Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextSlide();
                }}
                className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-[#8c7138] text-white border border-white/20 backdrop-blur-xs flex items-center justify-center transition-all opacity-85 sm:opacity-0 group-hover:opacity-100 shadow-md cursor-pointer active:scale-95"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              {/* Bottom Pagination Dots */}
              <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10 shadow-md">
                {displayBanners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlideIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentSlideIndex
                        ? 'w-7 bg-[#fed488] shadow-xs'
                        : 'w-2 bg-white/50 hover:bg-white/80'
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
