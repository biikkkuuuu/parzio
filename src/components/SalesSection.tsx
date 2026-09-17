import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, SaleBannerConfig, SalePoster } from '../types';
import { ArrowUp, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

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
const PRODUCTS_PER_PAGE = 12;

export const SalesSection: React.FC<SalesSectionProps> = ({
  products,
  onAddToCart,
  onOpenProductModal,
  bannerConfig = DEFAULT_SALE_CONFIG,
  salePosters = []
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL SALE');
  const [currentPage, setCurrentPage] = useState(1);
  const isFirstPageMount = useRef(true);

  const bConfig = bannerConfig || DEFAULT_SALE_CONFIG;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset to page 1 whenever category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Reliable scroll to top of sales product grid whenever page changes (after DOM update)
  useEffect(() => {
    if (isFirstPageMount.current) {
      isFirstPageMount.current = false;
      return;
    }
    const scrollToGrid = () => {
      const targetEl = document.getElementById('sales-product-grid');
      if (targetEl) {
        const headerHeight = 70;
        const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth'
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const timer = setTimeout(scrollToGrid, 50);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const filteredSaleProducts = useMemo(() => {
    if (selectedCategory === 'ALL SALE') return products;
    return products.filter(
      (p) => p.category.toUpperCase() === selectedCategory.toUpperCase()
    );
  }, [products, selectedCategory]);

  const totalPages = Math.ceil(filteredSaleProducts.length / PRODUCTS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedSaleProducts = filteredSaleProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative bg-[#f4eee6] min-h-screen pb-16">

      {/* Category Chips Bar */}
      <div className="sticky top-[44px] sm:top-[56px] z-30 bg-white/95 backdrop-blur-md border-b border-[#eae5dc] px-3 py-2.5 overflow-x-auto no-scrollbar shadow-xs">
        <div className="flex items-center gap-2 min-w-max max-w-4xl mx-auto justify-start sm:justify-center">
          {SALE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#9e7144] text-white shadow-xs'
                  : 'bg-[#faf8f5] text-[#747878] hover:bg-[#eae5dc] border border-[#eae5dc]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column to 4-Column Product Grid */}
      <div id="sales-product-grid" className="max-w-6xl mx-auto pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 p-2 sm:p-4">
          {paginatedSaleProducts.map((product) => (
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
                  {/* Title with subtle truncation matching Home page */}
                  <h4
                    onClick={() => onOpenProductModal(product)}
                    className="font-sans text-xs sm:text-[13px] font-medium text-[#1a1714] line-clamp-1 hover:text-[#9e7144] cursor-pointer transition-colors leading-snug mb-1"
                    title={product.name}
                  >
                    {product.name}
                  </h4>

                  <p className="text-[10px] text-[#747878] mt-0.5 truncate font-sans">
                    {product.category} • 316L Stainless Steel
                  </p>

                  {/* Uniform Price Row matching Home page */}
                  <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-[#f4efea]">
                    <span className="text-xs sm:text-sm font-bold text-[#1a1714]">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                    <span className="bg-[#9e7144] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase shrink-0">
                      {product.savePercent}% OFF
                    </span>
                  </div>
                </div>

                {/* Add to Cart Pill Button matching Home page */}
                <button
                  type="button"
                  onClick={() => onAddToCart(product)}
                  className="w-full mt-3 py-1.5 sm:py-2 rounded-md bg-[#9e7144] hover:bg-[#865d34] active:scale-[0.98] transition-all text-xs font-semibold text-white text-center shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sales Pagination Bar: Page 1, 2, 3... */}
        {totalPages > 1 && (
          <div className="mt-8 mb-4 px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#747878] font-medium order-2 sm:order-1">
              Showing <span className="font-bold text-[#141414]">{startIndex + 1}</span>–
              <span className="font-bold text-[#141414]">{Math.min(startIndex + PRODUCTS_PER_PAGE, filteredSaleProducts.length)}</span> of{' '}
              <span className="font-bold text-[#141414]">{filteredSaleProducts.length}</span> sale pieces
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
                    : 'border-[#eae5dc] bg-white text-[#141414] hover:bg-[#9e7144] hover:text-white hover:border-[#9e7144] shadow-xs active:scale-95 cursor-pointer'
                }`}
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Numbered Page Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`min-w-9 h-9 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-[#9e7144] border-[#9e7144] text-white shadow-xs scale-105'
                        : 'bg-white border-[#eae5dc] text-[#555] hover:bg-[#faf7f2] hover:border-[#9e7144] hover:text-[#9e7144]'
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
                    : 'border-[#eae5dc] bg-white text-[#141414] hover:bg-[#9e7144] hover:text-white hover:border-[#9e7144] shadow-xs active:scale-95 cursor-pointer'
                }`}
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Scroll-To-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-18 right-3.5 z-40 w-10 h-10 rounded-full bg-[#9e7144] text-white border border-[#865d34] flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};
