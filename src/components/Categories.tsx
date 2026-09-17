import React, { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { CategoryItem } from '../types';

interface CategoriesProps {
  categories?: CategoryItem[];
  onSelectCategory: (categoryName: string) => void;
  selectedCategory?: string;
  onViewAllCategories?: () => void;
}

const CATEGORIES_ITEMS = [
  {
    name: 'Bangles',
    subtitle: 'Trendy & Traditional',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Mangalsutra',
    subtitle: 'A Bond for Life',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Jewellery Sets',
    subtitle: 'Complete Your Look',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Earrings',
    subtitle: 'Grace in Every Detail',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Perfume',
    subtitle: 'Fragrance for You',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Beauty & Care',
    subtitle: 'Look Good, Feel Good',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'
  }
];

export const Categories: React.FC<CategoriesProps> = ({
  onSelectCategory,
  onViewAllCategories
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="categories-section" className="scroll-mt-24 sm:scroll-mt-28 py-6 sm:py-8 bg-white border-b border-[#eae5dc]">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14">
        
        {/* Header: "Shop by Category —" + Scroll Arrows + "View All →" */}
        <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-[#141414] font-bold tracking-tight">
              Shop by Category
            </h2>
            <span className="text-xl sm:text-2xl text-[#9e7144] font-light">—</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Scroll buttons for smooth left/right navigation */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-7 h-7 rounded-full border border-[#eae5dc] bg-[#faf8f5] hover:bg-[#9e7144] hover:text-white text-[#747878] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-7 h-7 rounded-full border border-[#eae5dc] bg-[#faf8f5] hover:bg-[#9e7144] hover:text-white text-[#747878] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                if (onViewAllCategories) {
                  onViewAllCategories();
                } else {
                  onSelectCategory('ALL_CATEGORIES');
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#9e7144] hover:text-[#805c30] transition-colors cursor-pointer group ml-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* 1 Single Line Horizontal Scrollable Strip (R to L & L to R) */}
        <div
          ref={scrollRef}
          className="flex items-start gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {CATEGORIES_ITEMS.map((cat) => (
            <div
              key={cat.name}
              onClick={() => {
                onSelectCategory(cat.name);
              }}
              className="group flex flex-col cursor-pointer shrink-0 snap-start w-[130px] sm:w-[160px] lg:w-[190px]"
            >
              {/* Rectangular Rounded Image Card */}
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#faf7f2] border border-[#ebe2d6] shadow-xs group-hover:shadow-md transition-all duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Title and Subtitle underneath */}
              <div className="mt-2 text-center">
                <h3 className="font-sans font-bold text-xs sm:text-sm text-[#1a1714] group-hover:text-[#9e7144] transition-colors truncate">
                  {cat.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-[#7a746e] mt-0.5 font-sans truncate">
                  {cat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
