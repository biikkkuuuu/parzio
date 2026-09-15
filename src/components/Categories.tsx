import React from 'react';
import { CATEGORIES_DATA } from '../data/products';
import { Sparkles, ChevronRight } from 'lucide-react';

interface CategoriesProps {
  onSelectCategory: (categoryName: string) => void;
  selectedCategory: string;
}

export const Categories: React.FC<CategoriesProps> = ({
  onSelectCategory,
  selectedCategory
}) => {
  return (
    <section className="py-10 sm:py-14 bg-[#fbf9f6] border-b border-[#eae5dc]">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8c7138] mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#8c7138]" />
            CURATED DEMI-FINE
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#141414] font-bold tracking-tight">
            New Collections
          </h2>
          <p className="text-xs sm:text-sm text-[#747878] mt-2 leading-relaxed">
            Explore daily silhouettes sculpted in surgical grade stainless steel and enveloped in radiant 18-karat micro-plating.
          </p>
        </div>

        {/* Round Circular Collections Row - Horizontal Swipe on Mobile, Centered Grid on Desktop */}
        <div className="flex items-center overflow-x-auto no-scrollbar sm:flex-wrap sm:justify-center gap-5 sm:gap-10 lg:gap-14 pb-2 px-1 snap-x snap-mandatory sm:snap-none">
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className="group flex flex-col items-center text-center focus:outline-none flex-shrink-0 sm:flex-shrink snap-center min-w-[100px] sm:min-w-0"
              >
                {/* Outer Circular Ring with Gold Accent */}
                <div
                  className={`w-24 h-24 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full p-1 transition-all duration-300 relative ${
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
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#8c7138] border-2 border-white shadow-xs" />
                  )}
                </div>

                {/* Category Name */}
                <h3
                  className={`mt-2.5 sm:mt-4 text-xs sm:text-sm lg:text-base font-bold tracking-wide uppercase transition-colors whitespace-nowrap ${
                    isSelected ? 'text-[#8c7138]' : 'text-[#141414] group-hover:text-[#8c7138]'
                  }`}
                >
                  {cat.name}
                </h3>

                {/* Subtitle */}
                <p className="text-[10px] sm:text-[11px] text-[#747878] font-medium mt-0.5 whitespace-nowrap">
                  {cat.subtitle}
                </p>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
