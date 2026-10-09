import React from 'react';
import { Heart, ShoppingBag, Eye, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
  onOpenProductModal: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  onOpenProductModal,
  className = ''
}) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const qtyInCart = cartItem?.quantity || 0;

  const primaryImage = product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80';
  const secondaryImage =
    product.hoverImage ||
    (product.images && product.images.length > 1 ? product.images[1] : null) ||
    (product.colorVariants && product.colorVariants.length > 1 && product.colorVariants[1]?.image ? product.colorVariants[1].image : null);

  const discountTag = product.originalPrice && product.originalPrice > product.price
    ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`
    : product.savePercent
    ? `${product.savePercent}% OFF`
    : '40% OFF';

  return (
    <div
      onClick={() => onOpenProductModal(product)}
      className={`group flex flex-col justify-between bg-white rounded-2xl border border-[#eee7dc] hover:border-[#9e7144]/60 shadow-xs hover:shadow-xl transition-all duration-300 p-2 sm:p-2.5 cursor-pointer select-none ${className}`}
    >
      {/* Product Image Area with Hover Zoom / Flip / Action Overlay */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#faf7f2] mb-2.5">
        
        {/* Base Primary Image */}
        <img
          src={primaryImage}
          alt={product.name || 'PARZIO Luxury Jewellery'}
          className={`w-full h-full object-cover object-center transition-all duration-500 ease-out ${
            secondaryImage ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-108'
          }`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80';
          }}
        />

        {/* Secondary Hover Image (if available) */}
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
            loading="lazy"
          />
        )}

        {/* Badge Overlay (Top Left if present) */}
        {product.badge && (
          <span className="absolute top-2 left-2 z-10 bg-[#141414]/90 backdrop-blur-xs text-[#fed488] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#fed488]/30">
            {product.badge}
          </span>
        )}

        {/* Wishlist Heart Button (Top Left or below badge) */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`absolute ${product.badge ? 'top-8' : 'top-2'} left-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-rose-600 transition-all cursor-pointer shadow-sm z-20 active:scale-90`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isWishlisted ? 'fill-[#e53e3e] text-[#e53e3e]' : 'text-gray-600'
              }`}
            />
          </button>
        )}

        {/* Quick View "Eye" Button (Top Right Floating Circle) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenProductModal(product);
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-[#141414] text-[#141414] hover:text-[#fed488] shadow-md flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-[-4px] group-hover:translate-y-0 z-20 cursor-pointer active:scale-90"
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Sliding "Add to Cart" Pill Button at Bottom of Image */}
        {qtyInCart > 0 ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 w-[90%] bg-[#141414] text-white py-1 sm:py-1.5 px-2 rounded-full flex items-center justify-between shadow-lg z-20 border border-white/20 transition-all duration-300"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(product.id, -1);
              }}
              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white font-bold transition-colors cursor-pointer active:scale-90"
              title="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-[11px] sm:text-xs font-bold text-[#fed488] px-1 font-mono">
              {qtyInCart} in bag
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(product.id, 1);
              }}
              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white font-bold transition-colors cursor-pointer active:scale-90"
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
            className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 w-[90%] py-2 sm:py-2.5 rounded-full bg-white/95 hover:bg-[#141414] text-[#141414] hover:text-[#fed488] border border-[#eae5dc] shadow-md hover:shadow-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto z-20 cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to cart</span>
          </button>
        )}
      </div>

      {/* Product Title & Pricing Details */}
      <div className="flex-1 flex flex-col justify-between pt-0.5">
        <div>
          <h3
            className="font-sans text-xs sm:text-[13px] font-medium text-[#1a1714] line-clamp-1 group-hover:text-[#9e7144] transition-colors leading-snug mb-1"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-[10px] text-[#747878] truncate font-sans mb-1.5">
            {product.category || 'Demi-Fine Jewellery'} • 316L Stainless Steel
          </p>

          {/* Price Row */}
          <div className="flex items-center gap-1.5 pt-1 border-t border-[#f4efea]">
            <span className="text-xs sm:text-sm font-bold text-[#1a1714]">
              ₹{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
            <span className="bg-[#9e7144] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs shrink-0">
              {discountTag}
            </span>
          </div>
        </div>

        {/* Mobile quick-add button when below sm */}
        <div className="sm:hidden mt-2 pt-1">
          {qtyInCart === 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="w-full py-1.5 rounded-lg bg-[#faf8f5] hover:bg-[#9e7144] text-[#9e7144] hover:text-white border border-[#eae5dc] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Add to Bag</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
