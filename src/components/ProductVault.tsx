import React from 'react';
import { Heart, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';

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
  const cartItems = useCartStore((state) => state.cartItems);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

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
            {displayList.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const cartItem = cartItems.find((item) => item.product.id === product.id);
              const qtyInCart = cartItem?.quantity || 0;

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

                    {/* Wishlist Icon Top Right */}
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

                    {/* Quantity Selector / Add to Cart Button */}
                    {qtyInCart > 0 ? (
                      <div className="w-full bg-[#9e7144] text-white py-1 px-1.5 rounded-xs flex items-center justify-between shadow-2xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(product.id, -1);
                          }}
                          className="w-6 h-6 flex items-center justify-center rounded bg-white/20 hover:bg-white/30 text-white font-bold transition-colors cursor-pointer active:scale-90"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white px-2">
                          {qtyInCart} in bag
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(product.id, 1);
                          }}
                          className="w-6 h-6 flex items-center justify-center rounded bg-white/20 hover:bg-white/30 text-white font-bold transition-colors cursor-pointer active:scale-90"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="w-full bg-[#9e7144] hover:bg-[#865d34] text-white py-1.5 px-2 rounded-xs text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer active:scale-95"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add to Cart</span>
                      </button>
                    )}
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
