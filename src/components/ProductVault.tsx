import React from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductVaultProps {
  products: Product[];
  activeFilter?: string;
  onSelectFilter?: (filter: string) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
  onOpenProductModal: (product: Product) => void;
}

const FEATURED_NEW_ARRIVALS = [
  {
    id: 'feat-bangles-1',
    title: 'Traditional Red Bangles Set',
    price: 299,
    originalPrice: 499,
    discount: '40% OFF',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80',
    category: 'BANGLES'
  },
  {
    id: 'feat-mangalsutra-1',
    title: 'Gold Plated Mangalsutra',
    price: 399,
    originalPrice: 699,
    discount: '43% OFF',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80',
    category: 'MANGALSUTRA'
  },
  {
    id: 'feat-jhumka-1',
    title: 'Premium Jhumka Earrings',
    price: 349,
    originalPrice: 699,
    discount: '43% OFF',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=500&q=80',
    category: 'EARRINGS'
  },
  {
    id: 'feat-set-1',
    title: 'Elegant Jewellery Set',
    price: 599,
    originalPrice: 999,
    discount: '40% OFF',
    image: 'https://images.unsplash.com/photo-1611591475816-43b664d4b121?auto=format&fit=crop&w=500&q=80',
    category: 'JEWELLERY SETS'
  },
  {
    id: 'feat-perfume-1',
    title: "Women's Perfume 50ml",
    price: 450,
    originalPrice: 699,
    discount: '36% OFF',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80',
    category: 'PERFUME'
  },
  {
    id: 'feat-facewash-1',
    title: 'Facewash - Glow & Fresh',
    price: 199,
    originalPrice: 299,
    discount: '33% OFF',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80',
    category: 'BEAUTY'
  }
];

export const ProductVault: React.FC<ProductVaultProps> = ({
  products,
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
    activeFilter !== 'NEW ARRIVALS'
  );

  // If a specific category is selected, prioritize filtered products
  let displayList: Product[] = [];
  if (isFiltered) {
    displayList = products;
  } else {
    // Default 6 featured arrivals merged with catalog
    const matchedFeatured = FEATURED_NEW_ARRIVALS.map((feat) => {
      const matched = products.find((p) => {
        if (!p) return false;
        if (p.id === feat.id) return true;
        const pName = (p.name || (p as unknown as { title?: string }).title || '').toLowerCase();
        return pName === feat.title.toLowerCase();
      });
      return (matched || {
        ...feat,
        name: feat.title,
        description: 'Exclusive DEMI-FINE design by PARZIO',
        isNew: true,
        inStock: true
      }) as unknown as Product;
    });

    const otherProds = products.filter(
      (p) => !matchedFeatured.some((mf) => mf.id === p.id)
    );
    displayList = [...matchedFeatured, ...otherProds];
  }

  const sectionHeading = isFiltered ? activeFilter : 'New Arrivals';

  return (
    <section id="vault-section" className="py-8 bg-white border-b border-[#eae5dc]">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14">
        
        {/* Header: "New Arrivals —" + "View All Products →" */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl sm:text-3xl text-[#1a1714] font-normal tracking-tight capitalize">
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

        {/* Product Cards Grid matching screenshot */}
        {displayList.length === 0 ? (
          <div className="text-center py-12 bg-[#faf8f5] rounded-2xl border border-[#eee7dc]">
            <p className="text-sm font-medium text-[#1a1714]">No items currently listed under "{activeFilter}".</p>
            <button
              onClick={() => onSelectFilter && onSelectFilter('ALL')}
              className="mt-3 px-5 py-2 rounded-full bg-[#9e7144] text-white text-xs font-semibold hover:bg-[#865d34] transition-all cursor-pointer"
            >
              Browse All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {displayList.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const discountTag = product.originalPrice
                ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`
                : '40% OFF';

              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between bg-white rounded-lg border border-[#eee7dc] hover:border-[#9e7144]/50 shadow-xs hover:shadow-md transition-all duration-300 p-2 sm:p-2.5"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square w-full rounded-md overflow-hidden bg-[#faf7f2] mb-2">
                    <img
                      src={product.image}
                      alt={product.name || (product as unknown as { title?: string }).title || 'PARZIO Product'}
                      onClick={() => onOpenProductModal(product)}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80';
                      }}
                    />

                    {/* Wishlist Icon Top Right matching screenshot */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-[#9e7144] transition-all cursor-pointer shadow-2xs"
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          isWishlisted ? 'fill-[#e53e3e] text-[#e53e3e]' : 'text-gray-600'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Title & Pricing */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => onOpenProductModal(product)}
                        className="font-sans text-xs sm:text-[13px] font-medium text-[#1a1714] line-clamp-1 hover:text-[#9e7144] cursor-pointer transition-colors leading-snug mb-1.5"
                        title={product.name || (product as unknown as { title?: string }).title || ''}
                      >
                        {product.name || (product as unknown as { title?: string }).title || ''}
                      </h3>

                      {/* Price Row: ₹299  ~~₹499~~  40% OFF */}
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <span className="text-xs sm:text-sm font-bold text-[#1a1714]">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[11px] text-gray-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                        <span className="bg-[#9e7144] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs">
                          {discountTag}
                        </span>
                      </div>
                    </div>

                    {/* Camel Brown Add to Cart Button matching screenshot */}
                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-full bg-[#9e7144] hover:bg-[#865d34] text-white py-1.5 px-2 rounded-xs text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer active:scale-95"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
