import React, { useState } from 'react';
import { Search, X, Star, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onAddToCart
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = products.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex flex-col justify-start animate-fadeIn">
      <div className="w-full max-w-md mx-auto bg-white rounded-b-3xl shadow-2xl border-b border-[#eae5dc] flex flex-col max-h-[85vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#eae5dc] flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#747878] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ₹99 anti-tarnish necklaces, rings..."
              className="w-full bg-[#fbf9f6] pl-10 pr-4 py-2.5 rounded-full text-xs font-semibold text-[#141414] border border-[#eae5dc] focus:outline-none focus:border-[#8c7138]"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#efeeeb] text-[#444748]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#747878] px-1">
            {query.trim() ? `Search Results (${results.length})` : 'Popular ₹99 Anti-Tarnish Drops'}
          </p>

          {results.slice(0, 8).map((product) => (
            <div
              key={product.id}
              onClick={() => {
                onSelectProduct(product);
                onClose();
              }}
              className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] cursor-pointer hover:border-[#8c7138] transition-colors"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 object-contain rounded-xl bg-white p-1 border border-[#eae5dc]"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#141414] truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-xs text-[#141414]">₹{product.price}</span>
                  <span className="text-[10px] text-[#747878] line-through">₹{product.originalPrice}</span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                    SAVE {product.savePercent}%
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="p-2 rounded-full bg-[#141414] text-white hover:bg-[#8c7138] transition-colors"
                title="Add to Bag"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#fed488]" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
