import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductVaultProps {
  products: Product[];
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
  onOpenProductModal: (product: Product) => void;
}

const FILTER_TABS = ['ALL (184)', 'NECKLACES', 'RINGS', 'BRACELETS', 'EARRINGS', 'ANKLETS'];

export const ProductVault: React.FC<ProductVaultProps> = ({
  products,
  activeFilter,
  onSelectFilter,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onOpenProductModal
}) => {
  return (
    <section id="vault-section" className="py-8 sm:py-12 bg-[#fbf9f6] border-b border-[#eae5dc]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 px-1">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#8c7138] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#8c7138]" />
              DIRECT FACTORY PRICE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#141414] font-bold tracking-tight">
              The ₹99 Anti-Tarnish Collection
            </h2>
            <p className="text-xs sm:text-sm text-[#747878] mt-1 max-w-xl">
              Real 18K gold plated on pure stainless steel. 100% waterproof for everyday wear.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#f2ece1] text-[#8c7138] text-xs font-bold uppercase tracking-wider border border-[#dfd7ca]">
              180+ Designs Available
            </span>
          </div>
        </div>

        {/* Filter Pills Tab Strip - Centered on desktop */}
        <div className="flex items-center sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6 px-1">
          {FILTER_TABS.map((tab) => {
            const rawCat = tab.replace(/ \(\d+\)/, '');
            const isActive =
              activeFilter.toUpperCase() === rawCat ||
              (activeFilter === 'ALL' && rawCat === 'ALL') ||
              (activeFilter === 'NEW ARRIVALS' && rawCat === 'ALL');

            return (
              <button
                key={tab}
                onClick={() => onSelectFilter(rawCat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider ${
                  isActive
                    ? 'bg-[#8c7138] text-white shadow-xs'
                    : 'bg-white text-[#747878] border border-[#eae5dc] hover:border-[#8c7138] hover:text-[#141414]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Clean E-Commerce Grid (2-col mobile, 4-col desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="bg-white border border-[#eae5dc] rounded-2xl flex flex-col justify-between overflow-hidden shadow-xs hover:border-[#8c7138]/50 hover:shadow-md transition-all duration-200"
              >
                {/* 1:1 Square Image */}
                <div
                  onClick={() => onOpenProductModal(product)}
                  className="aspect-square w-full bg-[#f8f6f2] cursor-pointer relative overflow-hidden group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Wishlist toggle button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#141414] hover:text-rose-500 shadow-xs transition-colors z-10"
                    title="Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Product Meta & Pricing Area */}
                <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    {/* Title with single line truncation */}
                    <h4
                      onClick={() => onOpenProductModal(product)}
                      className="text-[13px] sm:text-[14px] font-semibold text-[#141414] truncate cursor-pointer hover:text-[#8c7138] transition-colors leading-tight"
                      title={product.name}
                    >
                      {product.name}
                    </h4>

                    {/* Price Row: ₹99  ₹1,300  SAVE 92% */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 flex-wrap">
                      <span className="font-bold text-sm sm:text-base text-[#141414]">
                        ₹{product.price}
                      </span>
                      <span className="text-xs sm:text-sm text-[#a3a3a3] line-through font-normal">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200/70 px-1.5 py-0.5 rounded tracking-wider uppercase">
                        SAVE {product.savePercent}%
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={() => onAddToCart(product)}
                    className="w-full mt-3 py-2 px-3 rounded-full bg-[#141414] hover:bg-[#8c7138] active:scale-[0.98] transition-all text-xs sm:text-sm font-bold text-white text-center shadow-xs"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => onSelectFilter('ALL')}
            className="px-8 py-3 rounded-full bg-white border border-[#141414] text-[#141414] hover:bg-[#141414] hover:text-white transition-all text-xs sm:text-sm font-bold tracking-wider uppercase shadow-xs active:scale-95 inline-flex items-center gap-2"
          >
            <span>View All 180+ Pieces For ₹99</span>
            <Sparkles className="w-4 h-4 text-[#8c7138]" />
          </button>
        </div>

      </div>
    </section>
  );
};
