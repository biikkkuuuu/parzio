import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
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

const FILTER_TABS = ['ALL', 'NECKLACES', 'RINGS', 'BRACELETS', 'EARRINGS', 'ANKLETS'];
const PRODUCTS_PER_PAGE = 12;

export const ProductVault: React.FC<ProductVaultProps> = ({
  products,
  activeFilter,
  onSelectFilter,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onOpenProductModal
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const isFirstMount = useRef(true);

  // Reset to page 1 whenever filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Reliable scroll to top of vault whenever page changes (after DOM update)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const scrollToVault = () => {
      const vaultElement = document.getElementById('vault-section');
      if (vaultElement) {
        const headerHeight = 70;
        const targetTop = vaultElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth'
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const timer = setTimeout(scrollToVault, 50);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <section id="vault-section" className="py-8 sm:py-12 bg-[#fbf9f6] border-b border-[#eae5dc]">
      <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-8 lg:px-12">
        
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
              Real 18K gold plated on pure surgical stainless steel. 100% waterproof for everyday wear.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#f2ece1] text-[#8c7138] text-xs font-bold uppercase tracking-wider border border-[#dfd7ca]">
              {products.length} Designs Available
            </span>
          </div>
        </div>

        {/* Filter Pills Tab Strip */}
        <div className="flex items-center sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6 px-1">
          {FILTER_TABS.map((tab) => {
            const isActive =
              activeFilter.toUpperCase() === tab ||
              (activeFilter === 'ALL' && tab === 'ALL') ||
              (activeFilter === 'NEW ARRIVALS' && tab === 'ALL');

            return (
              <button
                key={tab}
                onClick={() => onSelectFilter(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider cursor-pointer ${
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

        {/* Clean E-Commerce Grid (2-col mobile, 3-col tablet, 4-col laptop, 5/6-col desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {paginatedProducts.map((product) => {
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
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-2 left-2 bg-[#141414]/90 backdrop-blur-xs text-[#fed488] text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
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
                    {/* Category / Subtitle */}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7138] block mb-0.5 truncate">
                      {product.category} • 316L Steel
                    </span>

                    {/* Title with single line truncation */}
                    <h4
                      onClick={() => onOpenProductModal(product)}
                      className="text-[12px] sm:text-[14px] font-semibold text-[#141414] truncate cursor-pointer hover:text-[#8c7138] transition-colors leading-tight min-h-[1.25rem]"
                      title={product.name}
                    >
                      {product.name}
                    </h4>

                    {/* Uniform Price Row: Price, Strikethrough, and SAVE % Badge */}
                    <div className="flex items-center justify-between gap-1.5 mt-2 pt-1.5 border-t border-[#f4efea]">
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="font-bold text-sm sm:text-base text-[#141414]">
                          ₹{product.price}
                        </span>
                        <span className="text-[11px] sm:text-xs text-[#a3a3a3] line-through font-normal">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 rounded-md tracking-wider uppercase shrink-0 whitespace-nowrap">
                        SAVE {product.savePercent}%
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={() => onAddToCart(product)}
                    className="w-full mt-3 py-2 px-3 rounded-full bg-[#141414] hover:bg-[#8c7138] active:scale-[0.98] transition-all text-xs sm:text-sm font-bold text-white text-center shadow-xs cursor-pointer"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Luxury Pagination Bar: Page 1, 2, 3... */}
        {totalPages > 1 && (
          <div className="mt-10 pt-6 border-t border-[#eae5dc] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#747878] font-medium order-2 sm:order-1">
              Showing <span className="font-bold text-[#141414]">{startIndex + 1}</span>–
              <span className="font-bold text-[#141414]">{Math.min(startIndex + PRODUCTS_PER_PAGE, products.length)}</span> of{' '}
              <span className="font-bold text-[#141414]">{products.length}</span> designs
            </span>

            <div className="flex items-center gap-1.5 order-1 sm:order-2">
              {/* Previous Page Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-xl flex items-center justify-center border text-xs font-semibold transition-all ${
                  currentPage === 1
                    ? 'border-[#eae5dc] text-[#c4c4c4] cursor-not-allowed bg-[#faf8f5]'
                    : 'border-[#eae5dc] bg-white text-[#141414] hover:bg-[#8c7138] hover:text-white hover:border-[#8c7138] shadow-xs active:scale-95 cursor-pointer'
                }`}
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Numbered Page Buttons: 1, 2, 3... */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`min-w-9 h-9 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-[#8c7138] border-[#8c7138] text-white shadow-xs scale-105'
                        : 'bg-white border-[#eae5dc] text-[#141414] hover:bg-[#f2ece1] hover:border-[#8c7138]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Page Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-xl flex items-center justify-center border text-xs font-semibold transition-all ${
                  currentPage === totalPages
                    ? 'border-[#eae5dc] text-[#c4c4c4] cursor-not-allowed bg-[#faf8f5]'
                    : 'border-[#eae5dc] bg-white text-[#141414] hover:bg-[#8c7138] hover:text-white hover:border-[#8c7138] shadow-xs active:scale-95 cursor-pointer'
                }`}
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
