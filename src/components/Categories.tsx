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
    <section className="py-12 sm:py-16 bg-neutral-50/80 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500 block mb-1">
            Handpicked Curations
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-neutral-900 font-semibold tracking-tight">
            What's New in Demi-Fine
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
            Explore daily silhouettes sculpted in surgical grade stainless steel and enveloped in radiant 18-karat micro-plating.
          </p>
        </div>

        {/* Categories Row / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-white border transition-all duration-200 group hover:shadow-md ${
                  isSelected
                    ? 'border-neutral-900 ring-2 ring-neutral-900/15 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {/* Image Frame */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-neutral-100 overflow-hidden p-1.5 mb-3 flex items-center justify-center border border-neutral-200/80 group-hover:scale-105 transition-transform duration-200">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                <h3 className="font-display text-sm sm:text-base font-semibold text-neutral-900 group-hover:text-black transition-colors flex items-center gap-1">
                  {cat.name}
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
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
