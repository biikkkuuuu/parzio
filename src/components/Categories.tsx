import React, { useRef } from 'react';
import { CATEGORIES_DATA } from '../data/products';
import { CategoryItem } from '../types';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoriesProps {
  onSelectCategory: (categoryName: string) => void;
  selectedCategory: string;
  categories?: CategoryItem[];
}

export const Categories: React.FC<CategoriesProps> = ({
  onSelectCategory,
  selectedCategory,
  categories
}) => {
  const displayCategories = categories && categories.length > 0 ? categories : CATEGORIES_DATA;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollDistance = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-[#fbf9f6] border-b border-[#eae5dc] relative overflow-hidden">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8c7138] mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#8c7138]" />
            CURATED DEMI-FINE
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#141414] font-bold tracking-tight">
            New Collections
          </h2>
          <p className="text-xs sm:text-sm text-[#747878] mt-1.5 leading-relaxed">
            Explore daily silhouettes sculpted in surgical grade stainless steel and enveloped in radiant 18-karat micro-plating.
          </p>
        </div>

        {/* Carousel Container with Left/Right Scroll Controls */}
        <div className="relative group/carousel">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 rounded-full bg-white/95 border border-[#eae5dc] shadow-md items-center justify-center text-[#141414] hover:text-[#8c7138] hover:scale-105 transition-all cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Single Row Horizontal Scroll Strip */}
          <div
            ref={scrollContainerRef}
            className="flex items-center overflow-x-auto no-scrollbar flex-nowrap gap-4 sm:gap-8 lg:gap-10 pb-3 px-2 sm:px-4 snap-x snap-mandatory scroll-smooth justify-start md:justify-center"
          >
            {displayCategories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  onClick={() => onSelectCategory(cat.name)}
                  className="group flex flex-col items-center text-center focus:outline-none flex-shrink-0 snap-center min-w-[95px] sm:min-w-[130px] lg:min-w-[140px]"
                >
                  {/* Outer Circular Ring with Gold Accent */}
                  <div
                    className={`w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full p-1 transition-all duration-300 relative ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#c5a059] via-[#8c7138] to-[#59441e] ring-4 ring-[#8c7138]/20 shadow-lg scale-105'
                        : 'bg-gradient-to-b from-[#eadeca] via-[#c5a059]/40 to-[#eadeca] group-hover:from-[#c5a059] group-hover:to-[#8c7138] group-hover:shadow-xl group-hover:scale-105'
                    }`}
                  >
                    {/* Inner White Circle holding product image */}
                    <div className="w-full h-full rounded-full overflow-hidden bg-white p-1 flex items-center justify-center shadow-inner">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full rounded-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    </div>

                    {/* Active Indicator Dot */}
                    {isSelected && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#8c7138] border-2 border-white shadow-xs" />
                    )}
                  </div>

                  {/* Category Name */}
                  <h3
                    className={`mt-2 sm:mt-3 text-xs sm:text-sm font-bold tracking-wide uppercase transition-colors whitespace-nowrap ${
                      isSelected ? 'text-[#8c7138]' : 'text-[#141414] group-hover:text-[#8c7138]'
                    }`}
                  >
                    {cat.name}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-[9px] sm:text-[10px] text-[#747878] font-medium mt-0.5 whitespace-nowrap max-w-[120px] truncate">
                    {cat.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 rounded-full bg-white/95 border border-[#eae5dc] shadow-md items-center justify-center text-[#141414] hover:text-[#8c7138] hover:scale-105 transition-all cursor-pointer"
            title="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};

