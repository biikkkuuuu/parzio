import React, { useState, useEffect, useMemo } from 'react';
import { Product, SaleBannerConfig, SalePoster } from '../types';
import { ArrowUp, Sparkles, Tag, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface SalesSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onOpenProductModal: (product: Product) => void;
  bannerConfig?: SaleBannerConfig;
  salePosters?: SalePoster[];
}

const DEFAULT_SALE_CONFIG: SaleBannerConfig = {
  badge: 'FLAT ₹99 MEGA SALE',
  title: 'PARZIO',
  highlightText: 'Sale Collection',
  subtitle: '316L Surgical Grade Stainless Steel • 100% Anti-Tarnish, Waterproof & Hypoallergenic'
};

const SALE_CATEGORIES = ['ALL SALE', 'NECKLACES', 'BRACELETS', 'EARRINGS', 'RINGS', 'ANKLETS'];

export const SalesSection: React.FC<SalesSectionProps> = ({
  products,
  onAddToCart,
  onOpenProductModal,
  bannerConfig = DEFAULT_SALE_CONFIG,
  salePosters = []
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL SALE');

  const bConfig = bannerConfig || DEFAULT_SALE_CONFIG;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredSaleProducts = useMemo(() => {
    if (selectedCategory === 'ALL SALE') return products;
    return products.filter(
      (p) => p.category.toUpperCase() === selectedCategory.toUpperCase()
    );
  }, [products, selectedCategory]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative bg-[#f4eee6] min-h-screen pb-16">
      {/* Sales Header Banner */}
      <div className="bg-[#141414] text-white py-6 px-4 sm:px-8 border-b border-[#eae5dc] relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-2 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8c7138] text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-widest">
            <Zap className="w-3 h-3 fill-white" />
            {bConfig.badge}
          </span>
          
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
            {bConfig.title} <span className="text-[#fed488]">{bConfig.highlightText}</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg font-medium">
            {bConfig.subtitle}
          </p>

          <div className="flex items-center gap-4 text-[11px] text-[#fed488] font-semibold pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Waterproof
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Up to 92% Off
            </span>
          </div>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="sticky top-[53px] z-30 bg-white/95 backdrop-blur-md border-b border-[#eae5dc] px-3 py-2.5 overflow-x-auto no-scrollbar shadow-xs">
        <div className="flex items-center gap-2 min-w-max max-w-4xl mx-auto justify-start sm:justify-center">
          {SALE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#141414] text-[#fed488] shadow-xs'
                  : 'bg-[#faf8f5] text-[#747878] hover:bg-[#eae5dc] border border-[#eae5dc]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Active Sale Posters & Promo Graphics Section */}
      {salePosters.filter((p) => p.active).length > 0 && (
        <div className="max-w-6xl mx-auto px-3 sm:px-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {salePosters
              .filter((poster) => poster.active)
              .map((poster) => (
                <div
                  key={poster.id}
                  className="relative rounded-2xl overflow-hidden shadow-md border border-[#eae5dc] group aspect-[16/8] sm:aspect-[21/9] bg-[#141414] flex flex-col justify-end"
                >
                  <img
                    src={poster.image}
                    alt={poster.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  <div className="relative p-4 sm:p-5 z-10 flex flex-col justify-end h-full">
                    <span className="inline-self-start px-2.5 py-0.5 rounded-full bg-[#8c7138] text-white text-[10px] font-extrabold uppercase tracking-wider mb-2 w-max">
                      {poster.badge}
                    </span>
                    <h3 className="font-display font-bold text-white text-base sm:text-xl leading-tight">
                      {poster.title}
                    </h3>
                    {poster.subtitle && (
                      <p className="text-neutral-200 text-xs mt-1 line-clamp-2 max-w-lg">
                        {poster.subtitle}
                      </p>
                    )}

                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (poster.linkCategory) {
                            setSelectedCategory(poster.linkCategory.toUpperCase());
                          }
                        }}
                        className="px-4 py-2 rounded-full bg-[#fed488] text-[#141414] hover:bg-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{poster.buttonText || 'SHOP OFFER'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 2-Column Product Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 p-2 sm:p-4">
          {filteredSaleProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white flex flex-col justify-between overflow-hidden shadow-xs rounded-xl border border-[#eae5dc] select-none transition-all hover:shadow-md"
            >
              {/* 1:1 Square Image */}
              <div
                onClick={() => onOpenProductModal(product)}
                className="aspect-square w-full bg-[#f8f6f0] cursor-pointer relative overflow-hidden group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                  FLAT ₹{product.price}
                </span>
              </div>

              {/* Product Meta & Pricing Area */}
              <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1">
                <div>
                  {/* Title with subtle truncation */}
                  <h4
                    onClick={() => onOpenProductModal(product)}
                    className="text-[12px] sm:text-[14px] font-semibold text-[#141414] truncate cursor-pointer hover:text-[#8c7138] transition-colors leading-tight"
                    title={product.name}
                  >
                    {product.name}
                  </h4>

                  <p className="text-[10px] text-neutral-500 mt-0.5 truncate">
                    316L Stainless Steel
                  </p>

                  {/* Uniform Price Row: Price, Strikethrough, and SAVE % Badge aligned on one row */}
                  <div className="flex items-center justify-between gap-1 mt-2 pt-1.5 border-t border-[#f4efea]">
                    <div className="flex items-baseline gap-1.5 min-w-0">
                      <span className="font-bold text-sm sm:text-[15px] text-[#141414]">
                        ₹{product.price}
                      </span>
                      <span className="text-[11px] text-[#747878] line-through font-normal">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-200/80 uppercase shrink-0 whitespace-nowrap">
                      SAVE {product.savePercent}%
                    </span>
                  </div>
                </div>

                {/* Add to Cart Pill Button */}
                <button
                  type="button"
                  onClick={() => onAddToCart(product)}
                  className="w-full mt-3 py-2 px-3 rounded-xl bg-[#141414] hover:bg-neutral-800 active:bg-black active:scale-[0.98] transition-all text-xs font-semibold text-white text-center shadow-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#fed488]" />
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Scroll-To-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-18 right-3.5 z-40 w-10 h-10 rounded-full bg-[#141414] text-[#fed488] border border-[#8c7138] flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};
