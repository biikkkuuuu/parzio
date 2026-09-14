import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ArrowUp } from 'lucide-react';

interface SalesSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onOpenProductModal: (product: Product) => void;
}

export const SalesSection: React.FC<SalesSectionProps> = ({
  products,
  onAddToCart,
  onOpenProductModal
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative bg-[#f4eee6] pb-10">
      {/* 2-Column Product Grid matching exact WhatsApp Image 2026-09-14 at 3.25.42 PM.jpeg */}
      <div className="grid grid-cols-2 gap-2 p-2 sm:p-2.5">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white flex flex-col justify-between overflow-hidden shadow-none rounded-none select-none transition-colors"
          >
            {/* 1:1 Square Image */}
            <div
              onClick={() => onOpenProductModal(product)}
              className="aspect-square w-full bg-[#f8f6f0] cursor-pointer relative overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>

            {/* Product Meta & Pricing Area */}
            <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1">
              <div>
                {/* Title with subtle truncation */}
                <h4
                  onClick={() => onOpenProductModal(product)}
                  className="text-[13px] sm:text-[14px] font-normal text-[#141414] truncate cursor-pointer hover:text-[#8c7138] transition-colors leading-tight"
                  title={product.name}
                >
                  {product.name}
                </h4>

                {/* Price Row: ₹99  ₹1,300  SAVE 92% */}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="font-medium text-sm sm:text-[15px] text-[#141414]">
                    ₹{product.price}
                  </span>
                  <span className="text-xs sm:text-[13px] text-[#141414] line-through font-normal">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] font-bold text-[#141414] bg-[#eee7dc] px-1.5 py-0.5 rounded-xs tracking-wider uppercase">
                    SAVE {product.savePercent}%
                  </span>
                </div>
              </div>

              {/* Add to Cart Pill Button matching screenshot */}
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="w-full mt-3 py-2 px-3 rounded-full bg-[#eee8dd] hover:bg-[#e2dacb] active:bg-[#d8cfbe] active:scale-[0.98] transition-all text-xs sm:text-[13px] font-normal text-[#141414] text-center shadow-none"
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Scroll-To-Top Button from WhatsApp screenshot (crisp black square with white up arrow) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-18 right-3.5 z-40 w-9 h-9 bg-[#1c1d1b] text-white flex items-center justify-center shadow-md transition-transform active:scale-90"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};
