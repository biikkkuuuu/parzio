import React from 'react';
import { Product } from '../types';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (productId: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onAddToCart,
  onRemoveFromWishlist,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#eae5dc] p-6 max-h-[85vh] flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#eae5dc]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h3 className="font-display text-lg font-bold text-[#141414]">
              Saved Pieces ({wishlistProducts.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#efeeeb] text-[#444748] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12 text-[#747878] space-y-2">
              <Heart className="w-10 h-10 mx-auto text-[#c4c7c7]" />
              <p className="text-xs">You haven't saved any items yet.</p>
            </div>
          ) : (
            wishlistProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#faf8f5] border border-[#eae5dc]"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  onClick={() => {
                    if (onSelectProduct) {
                      onSelectProduct(prod);
                      onClose();
                    }
                  }}
                  className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-[#eae5dc] cursor-pointer hover:border-[#8c7138] transition-colors"
                />
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    if (onSelectProduct) {
                      onSelectProduct(prod);
                      onClose();
                    }
                  }}
                >
                  <h4 className="font-display text-xs sm:text-sm font-bold text-[#141414] line-clamp-1 hover:text-[#8c7138] transition-colors">
                    {prod.name}
                  </h4>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="font-bold text-xs text-[#141414]">₹{prod.price}</span>
                    <span className="text-[10px] text-[#747878] line-through">₹{prod.originalPrice}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onAddToCart(prod);
                      onRemoveFromWishlist(prod.id);
                    }}
                    className="p-2 rounded-full bg-[#141414] text-white hover:bg-[#8c7138] transition-colors"
                    title="Move to Bag"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(prod.id)}
                    className="p-2 rounded-full hover:bg-red-50 text-[#747878] hover:text-red-500 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-[#eae5dc]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-[#efeeeb] text-[#141414] hover:bg-[#eae5dc] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
