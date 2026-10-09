import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductVaultProps {
  products: Product[];
  activeFilter?: string;
  onSelectFilter?: (filter: string) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
  onOpenProductModal: (product: Product) => void;
}

export const ProductVault: React.FC<ProductVaultProps> = ({
  products = [],
  activeFilter = 'ALL',
  onSelectFilter,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onOpenProductModal
}) => {
  const isFiltered = Boolean(
    activeFilter &&
    activeFilter !== 'ALL' &&
    activeFilter !== 'NEW ARRIVALS' &&
    activeFilter !== 'HOME'
  );

  const displayList: Product[] = isFiltered
    ? products.filter((p) => p.category?.toUpperCase() === activeFilter.toUpperCase())
    : products;

  const sectionHeading = isFiltered ? activeFilter : 'New Arrivals';

  return (
    <section id="vault-section" className="py-8 bg-white border-b border-[#eae5dc]">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14">
        
        {/* Header: "New Arrivals —" + "View All Products →" */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl text-[#141414] font-bold tracking-tight capitalize">
              {sectionHeading}
            </h2>
            <span className="text-xl sm:text-2xl text-[#9e7144] font-light">—</span>
            {isFiltered && (
              <span className="text-xs text-[#777] font-medium ml-1">
                ({displayList.length} items found)
              </span>
            )}
          </div>

          <button
            onClick={() => {
              if (onSelectFilter) onSelectFilter('ALL');
              document.getElementById('vault-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#9e7144] hover:text-[#805c30] transition-colors cursor-pointer group"
          >
            <span>{isFiltered ? 'Show All Products' : 'View All Products'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {displayList.length === 0 ? (
          <div className="text-center py-16 bg-[#faf8f5] rounded-3xl border border-[#eae5dc]">
            <p className="text-sm font-bold text-[#141414]">No products available</p>
            <p className="text-xs text-[#747878] mt-1">Add your catalog products from the Admin Panel to display them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {displayList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                onOpenProductModal={onOpenProductModal}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
