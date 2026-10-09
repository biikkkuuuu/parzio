import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, CategoryItem, SaleBannerConfig, SalePoster } from '../types';
import { ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';

interface SalesSectionProps {
  products: Product[];
  categories?: CategoryItem[];
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

const PRODUCTS_PER_PAGE = 12;

export const SalesSection: React.FC<SalesSectionProps> = ({
  products,
  categories = [],
  onAddToCart,
  onOpenProductModal,
  bannerConfig = DEFAULT_SALE_CONFIG,
  salePosters = []
}) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL SALE');
  const [currentPage, setCurrentPage] = useState(1);
  const isFirstPageMount = useRef(true);

  const bConfig = bannerConfig || DEFAULT_SALE_CONFIG;

  const saleCategories = useMemo(() => {
    const set = new Set<string>();
    if (categories && categories.length > 0) {
      categories.forEach((c) => {
        if (c.name && c.name.trim()) set.add(c.name.trim().toUpperCase());
      });
    } else {
      products.forEach((p) => {
        if (p.category && p.category.trim()) set.add(p.category.trim().toUpperCase());
      });
    }
    const list = Array.from(set);
    return list.length > 0 ? ['ALL SALE', ...list] : [];
  }, [categories, products]);

  const activeCat = saleCategories.includes(selectedCategory) ? selectedCategory : 'ALL SALE';

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
  }, [activeCat]);

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
    if (activeCat === 'ALL SALE') return products;
    return products.filter(
      (p) => (p.category || '').trim().toUpperCase() === activeCat
    );
  }, [products, activeCat]);

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

      {/* Category Chips Bar (Dynamic only when categories exist) */}
      {saleCategories.length > 0 && (
        <div className="sticky top-[44px] sm:top-[56px] z-30 bg-white/95 backdrop-blur-md border-b border-[#eae5dc] px-3 py-2.5 overflow-x-auto no-scrollbar shadow-xs">
          <div className="flex items-center gap-2 min-w-max max-w-4xl mx-auto justify-start sm:justify-center">
            {saleCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCat === cat
                    ? 'bg-[#9e7144] text-white shadow-xs'
                    : 'bg-[#faf8f5] text-[#747878] hover:bg-[#eae5dc] border border-[#eae5dc]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2-Column to 4-Column Product Grid */}
      <div id="sales-product-grid" className="max-w-6xl mx-auto pt-4">
        {paginatedSaleProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white mx-3 sm:mx-4 rounded-3xl border border-[#eae5dc] shadow-xs">
            <p className="text-sm font-bold text-[#141414]">No sale products available</p>
            <p className="text-xs text-[#747878] mt-1">Add items from the Admin Panel to feature them in the sale collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 p-2 sm:p-4">
            {paginatedSaleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onOpenProductModal={onOpenProductModal}
              />
            ))}
          </div>
        )}

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
