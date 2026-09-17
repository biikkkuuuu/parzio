import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CategoriesProps {
  onSelectCategory: (categoryName: string) => void;
  selectedCategory?: string;
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
  onSelectCategory
}) => {
  return (
    <section id="categories-section" className="scroll-mt-24 sm:scroll-mt-28 py-8 bg-white border-b border-[#eae5dc]">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14">
        
        {/* Header: "Shop by Category —" + "View All →" matching screenshot */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl text-[#141414] font-bold tracking-tight">
              Shop by Category
            </h2>
            <span className="text-xl sm:text-2xl text-[#9e7144] font-light">—</span>
          </div>

          <button
            onClick={() => {
              onSelectCategory('ALL');
              document.getElementById('vault-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#9e7144] hover:text-[#805c30] transition-colors cursor-pointer group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES_ITEMS.map((cat) => (
            <div
              key={cat.name}
              onClick={() => {
                onSelectCategory(cat.name);
              }}
              className="group flex flex-col cursor-pointer"
            >
              {/* Rectangular Rounded Image Card */}
              <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-xl overflow-hidden bg-[#faf7f2] border border-[#ebe2d6] shadow-xs group-hover:shadow-md transition-all duration-300">
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
              <div className="mt-2.5 text-center">
                <h3 className="font-sans font-bold text-xs sm:text-sm text-[#1a1714] group-hover:text-[#9e7144] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#7a746e] mt-0.5 font-sans">
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
