import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Sparkles, ChevronRight, Layers } from 'lucide-react';
import { Product, CategoryItem } from '../types';
import { Footer } from './Footer';

interface AllCategoriesViewProps {
  categories: CategoryItem[];
  products: Product[];
  onSelectCategory: (categoryName: string) => void;
  onBackToHome: () => void;
  onOpenAtelierOps?: () => void;
}

interface CategoryCardData {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  tag?: string;
  type: 'jewellery' | 'fragrance' | 'beauty' | 'all';
}

const CURATED_CATEGORIES: CategoryCardData[] = [
  {
    id: 'cat-bangles',
    name: 'Bangles',
    subtitle: 'Traditional Red, Velvet & Gold Kadas',
    image: 'https://images.unsplash.com/photo-1611591475883-9b884179379e?auto=format&fit=crop&w=600&q=80',
    tag: 'Trending',
    type: 'jewellery'
  },
  {
    id: 'cat-mangalsutra',
    name: 'Mangalsutra',
    subtitle: 'Sacred Black Beads & 18K Gold Plated',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    tag: 'Best Seller',
    type: 'jewellery'
  },
  {
    id: 'cat-jewellery-sets',
    name: 'Jewellery Sets',
    subtitle: 'Bridal & Festive Chokers With Earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    tag: 'Royal Pick',
    type: 'jewellery'
  },
  {
    id: 'cat-earrings',
    name: 'Earrings',
    subtitle: 'Jhumkas, Chandbalis & Daily Studs',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    tag: 'Popular',
    type: 'jewellery'
  },
  {
    id: 'cat-necklaces',
    name: 'Necklaces',
    subtitle: 'Layered Pearls, Pendants & Chokers',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    tag: 'Daily Wear',
    type: 'jewellery'
  },
  {
    id: 'cat-bracelets',
    name: 'Bracelets',
    subtitle: '316L Stainless Steel & Charm Links',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ6KsGvMmDre3vW1DrMsKt5qGEuc3sAKPferGJypreLxK_7Y67atNQ4xomNX3mXsafI8KxVgwwIxAuSGRAMdU1nptUgdRG2egH30oAiQJPAMja-A9D7cmeTOcTjB4K4xMDXO1Jh0lOUQbTjY6ag3AcMy_FFMlynYLgIWldQSQ-kXA73U-4qhTyvLZlIuztQX18XRXyVMQVw4OkFAABmM7kQLZaJmDFCQgfCVkrUX-3u1FG5lCyJEWr',
    tag: '₹99 Drop',
    type: 'jewellery'
  },
  {
    id: 'cat-perfume',
    name: 'Perfume',
    subtitle: 'Luxury Long-Lasting French Artisan EDP',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
    tag: 'Luxury',
    type: 'fragrance'
  },
  {
    id: 'cat-beauty',
    name: 'Beauty & Care',
    subtitle: 'Skin Brightening Cleansers & Glow Elixirs',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    tag: 'Ayurvedic',
    type: 'beauty'
  }
];

export const AllCategoriesView: React.FC<AllCategoriesViewProps> = ({
  categories = [],
  products = [],
  onSelectCategory,
  onBackToHome,
  onOpenAtelierOps
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'jewellery' | 'fragrance' | 'beauty'>('all');

  // Merge dynamic admin categories with curated categories
  const allCategoryList = useMemo(() => {
    const list: CategoryCardData[] = [...CURATED_CATEGORIES];
    
    // Add any categories from DB/Admin that are not in curated list
    categories.forEach((cat) => {
      const exists = list.some((c) => c.name.toLowerCase() === cat.name.toLowerCase());
      if (!exists) {
        list.push({
          id: cat.id || `cat-${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: cat.name,
          subtitle: cat.subtitle || 'Explore our exclusive collection',
          image: cat.image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
          tag: 'New Collection',
          type: 'jewellery'
        });
      }
    });

    return list;
  }, [categories]);

  // Product count calculator per category
  const getProductCount = (categoryName: string) => {
    const target = categoryName.toUpperCase();
    return products.filter((p) => {
      if (p.isLive === false) return false;
      const prodCat = (p.category || '').toUpperCase();
      const prodName = (p.name || '').toUpperCase();
      if (prodCat === target) return true;
      if (prodCat.includes(target) || target.includes(prodCat)) return true;
      if (target === 'BANGLES' && (prodCat.includes('BRACELET') || prodName.includes('BANGLE'))) return true;
      if (target === 'MANGALSUTRA' && (prodCat.includes('NECKLACE') || prodName.includes('MANGALSUTRA'))) return true;
      if (target === 'JEWELLERY SETS' && (prodCat.includes('SET') || prodName.includes('SET'))) return true;
      if (target === 'PERFUME' && (prodCat.includes('PERFUME') || prodCat.includes('FRAGRANCE') || prodName.includes('PERFUME'))) return true;
      if (target.includes('BEAUTY') && (prodCat.includes('BEAUTY') || prodCat.includes('CARE') || prodName.includes('FACEWASH'))) return true;
      return false;
    }).length;
  };

  // Filter categories based on search & tab
  const filteredCategories = useMemo(() => {
    let result = allCategoryList;

    if (activeFilter !== 'all') {
      result = result.filter((c) => c.type === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          (c.tag && c.tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allCategoryList, activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#141414] flex flex-col">
      {/* Top Sticky Header */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#eae5dc] shadow-2xs">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 py-3.5 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onBackToHome}
                className="w-8 h-8 rounded-full border border-[#eae5dc] bg-[#faf8f5] hover:bg-[#9e7144] hover:text-white text-[#141414] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
                title="Back to Home"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base sm:text-xl font-bold text-[#141414] leading-tight">
                    All Categories
                  </h1>
                  <span className="text-sm sm:text-base text-[#9e7144] font-light">—</span>
                </div>
                <p className="text-[10px] sm:text-xs text-[#747878] hidden sm:block">
                  Explore our complete anti-tarnish jewellery & luxury fragrance collections
                </p>
              </div>
            </div>

            {/* In-page Category Search */}
            <div className="relative flex-1 max-w-[280px] sm:max-w-xs">
              <Search className="w-3.5 h-3.5 text-[#747878] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#faf8f5] border border-[#eae5dc] rounded-full text-[#141414] placeholder-[#a0a3a8] focus:outline-none focus:border-[#9e7144] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#747878] hover:text-[#141414] font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar pt-1">
            {[
              { key: 'all', label: 'All Collections' },
              { key: 'jewellery', label: 'Jewellery' },
              { key: 'fragrance', label: 'Perfumes' },
              { key: 'beauty', label: 'Beauty & Care' }
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key as any)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-tight transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeFilter === tab.key
                    ? 'bg-[#9e7144] text-white shadow-2xs'
                    : 'bg-[#faf8f5] border border-[#eae5dc] text-[#747878] hover:text-[#141414] hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid (Flipkart Inspired) */}
      <main className="flex-1 w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 py-6 sm:py-8">
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#eae5dc] shadow-sm max-w-md mx-auto my-12">
            <div className="w-12 h-12 rounded-2xl bg-[#faf8f5] text-[#9e7144] flex items-center justify-center mx-auto mb-3 border border-[#eae5dc]">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#141414]">No Categories Found</h3>
            <p className="text-xs text-[#747878] mt-1.5 leading-relaxed">
              No categories match "{searchQuery}". Try a different keyword or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-full bg-[#9e7144] text-white text-xs font-semibold hover:bg-[#805c30] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredCategories.map((cat) => {
              const count = getProductCount(cat.name);
              return (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.name)}
                  className="group bg-white rounded-2xl border border-[#eae5dc] hover:border-[#9e7144] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col active:scale-[0.98]"
                >
                  {/* Category Image Box */}
                  <div className="relative w-full aspect-square sm:aspect-[4/3] overflow-hidden bg-[#f4f2ee]">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Tag badge (e.g. Best Seller, Trending) */}
                    {cat.tag && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#141414]/80 backdrop-blur-xs text-[#fed488] text-[9px] font-bold tracking-wider uppercase border border-[#fed488]/30">
                        {cat.tag}
                      </span>
                    )}

                    {/* Product count badge */}
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white text-[9px] font-semibold">
                      {count} {count === 1 ? 'Design' : 'Designs'}
                    </span>
                  </div>

                  {/* Category Details */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-xs sm:text-sm font-bold text-[#141414] group-hover:text-[#9e7144] transition-colors line-clamp-1">
                          {cat.name}
                        </h3>
                        <ChevronRight className="w-3.5 h-3.5 text-[#a0a3a8] group-hover:text-[#9e7144] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                      <p className="text-[10px] sm:text-xs text-[#747878] mt-1 line-clamp-1 leading-normal">
                        {cat.subtitle}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#f0f1f3] flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#9e7144] group-hover:underline flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Explore Collection
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => onSelectCategory(cat.toUpperCase())}
        onOpenAtelierOps={onOpenAtelierOps}
      />
    </div>
  );
};
