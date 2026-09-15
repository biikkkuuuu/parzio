import React, { useState, useMemo } from 'react';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowLeft,
  Share2,
  X
} from 'lucide-react';
import { Product } from '../types';
import { VAULT_PRODUCTS } from '../data/products';

interface WishlistViewProps {
  wishlistProducts: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (productId: string) => void;
  onClearWishlist?: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenCart: () => void;
  onBackToStore: () => void;
  onMoveAllToBag?: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlistProducts,
  onAddToCart,
  onRemoveFromWishlist,
  onClearWishlist,
  onSelectProduct,
  onOpenCart,
  onBackToStore,
  onMoveAllToBag
}) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [copied, setCopied] = useState(false);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'ALL') return wishlistProducts;
    return wishlistProducts.filter(
      (p) => p.category.toUpperCase() === selectedCategory.toUpperCase()
    );
  }, [wishlistProducts, selectedCategory]);

  // Category filters
  const categories = useMemo(() => {
    const cats = ['ALL'];
    wishlistProducts.forEach((p) => {
      const cat = p.category.toUpperCase();
      if (!cats.includes(cat)) cats.push(cat);
    });
    return cats;
  }, [wishlistProducts]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleMoveAll = () => {
    if (onMoveAllToBag) {
      onMoveAllToBag();
    } else {
      wishlistProducts.forEach((p) => onAddToCart(p));
      if (onOpenCart) onOpenCart();
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#141414] font-sans pb-16">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#eae5dc] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToStore}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#555] hover:text-[#141414] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full text-[#777] hover:text-[#141414] hover:bg-[#faf8f5] transition-colors cursor-pointer"
              title="Share Wishlist"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copied && (
              <span className="text-[11px] text-[#8c7138] font-semibold animate-fadeIn">
                Link Copied!
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Wishlist Title Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#eae5dc]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141414] uppercase">
              Wishlist
            </h1>
            <p className="text-xs text-[#747878] mt-0.5">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {wishlistProducts.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMoveAll}
                className="px-4 py-2 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move All to Bag</span>
              </button>

              {onClearWishlist && (
                <button
                  type="button"
                  onClick={onClearWishlist}
                  className="p-2 rounded-full border border-[#eae5dc] bg-white text-[#747878] hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer"
                  title="Clear Wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Empty State */}
        {wishlistProducts.length === 0 ? (
          <div className="py-16 sm:py-20 text-center max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-white border border-[#eae5dc] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Heart className="w-7 h-7 text-[#8c7138]" />
            </div>

            <h2 className="text-lg font-bold text-[#141414]">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-[#747878] mt-1">
              Explore our demi-fine vault and save your favorite pieces here.
            </p>

            <button
              type="button"
              onClick={onBackToStore}
              className="mt-5 px-6 py-2.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <>
            {/* Category Filter Chips (Only if more than 1 category) */}
            {categories.length > 2 && (
              <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-[#141414] text-white'
                          : 'bg-white text-[#747878] border border-[#eae5dc] hover:text-[#141414]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#eae5dc] rounded-xl overflow-hidden flex flex-col justify-between group transition-shadow hover:shadow-sm"
                >
                  {/* Image Container */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="aspect-square w-full bg-[#faf8f5] relative cursor-pointer overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Remove Icon */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWishlist(product.id);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#747878] hover:text-rose-600 transition-colors shadow-xs cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="text-xs font-medium text-[#141414] truncate cursor-pointer hover:text-[#8c7138] transition-colors"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-sm font-bold text-[#141414]">
                          ₹{product.price}
                        </span>
                        <span className="text-[11px] text-[#999] line-through">
                          ₹{product.originalPrice}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart(product);
                        onRemoveFromWishlist(product.id);
                      }}
                      className="w-full mt-3 py-2 rounded-lg bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
