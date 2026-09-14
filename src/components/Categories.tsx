import React from 'react';
import { CATEGORIES_DATA } from '../data/products';
import { ChevronRight } from 'lucide-react';

interface CategoriesProps {
  onSelectCategory: (categoryName: string) => void;
  selectedCategory: string;
}

export const Categories: React.FC<CategoriesProps> = ({
  onSelectCategory,
  selectedCategory
}) => {
  return (
    <section className="py-8 sm:py-12 bg-white border-b border-[#eae5dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#8c7138] block">
              CURATED STYLES
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-neutral-900 font-bold tracking-tight">
              Collections
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#8c7138] uppercase tracking-wider hidden sm:block">
            Swipe to explore →
          </span>
        </div>

        {/* Horizontal Smooth Scrollable Categories Row (L to R & R to L) */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-3 pt-1 scroll-smooth snap-x snap-mandatory">
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex-shrink-0 flex flex-col items-center text-center p-3 rounded-3xl transition-all duration-300 group snap-start cursor-pointer ${
                  isSelected
                    ? 'bg-[#faf6ef] scale-105'
                    : 'hover:bg-neutral-50 active:scale-95'
                }`}
              >
                {/* Round Circular Avatar Frame */}
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden p-1 flex items-center justify-center transition-all duration-300 shadow-sm ${
                    isSelected
                      ? 'border-2 border-[#8c7138] ring-4 ring-[#8c7138]/20 shadow-md scale-105'
                      : 'border-2 border-[#eae5dc] group-hover:border-[#8c7138] group-hover:scale-105'
                  } bg-[#fbf9f6]`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Collection Title */}
                <h3 className={`font-display text-xs sm:text-sm mt-2.5 font-bold uppercase tracking-wide transition-colors ${
                  isSelected ? 'text-[#8c7138]' : 'text-neutral-900 group-hover:text-[#8c7138]'
                }`}>
                  {cat.name}
                </h3>
                <p className="text-[10px] text-neutral-500 tracking-tight leading-tight max-w-[90px] truncate">
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
