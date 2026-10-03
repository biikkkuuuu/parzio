import React, { useState, useMemo } from 'react';
import { Search, ArrowLeft, X, ShoppingBag, Sparkles, Filter } from 'lucide-react';
import { Product } from '../types';

interface SearchViewProps {
  products: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const POPULAR_TAGS = ['All', 'Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Anklets', 'Under ₹99'];

export const SearchView: React.FC<SearchViewProps> = ({
  products,
  onBack,
  onSelectProduct,
  onAddToCart
}) => {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q));

      const matchesTag =
        selectedTag === 'All' ||
        (selectedTag === 'Under ₹99' ? p.price <= 99 : p.category.toLowerCase().includes(selectedTag.toLowerCase()));

      return matchesQuery && matchesTag;
    });
  }, [products, query, selectedTag]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#141414] flex flex-col animate-fadeIn">
      {/* Search Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#eae5dc] px-3 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-full hover:bg-[#faf8f5] text-[#141414] transition-colors cursor-pointer shrink-0"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Search Input Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8c7138] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search necklaces, earrings, rings, anti-tarnish..."
              className="w-full bg-[#faf8f5] pl-10 pr-9 py-2.5 rounded-full text-xs sm:text-sm font-medium text-[#141414] border border-[#eae5dc] focus:outline-none focus:border-[#8c7138] focus:bg-white transition-all placeholder:text-[#999]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#888] hover:text-[#141414] cursor-pointer"
                title="Clear query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Tag Pills */}
        <div className="max-w-6xl mx-auto flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none">
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#141414] text-white shadow-xs'
                  : 'bg-white text-[#555] border border-[#eae5dc] hover:border-[#8c7138]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </header>

      {/* Main Results View */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#747878]">
            {query.trim()
              ? `Search Results for "${query}" (${filteredProducts.length})`
              : `All Store Pieces (${filteredProducts.length})`}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#eae5dc] max-w-md mx-auto my-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#faf8f5] text-[#8c7138] flex items-center justify-center mx-auto border border-[#eae5dc]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#141414]">No pieces found</h3>
            <p className="text-xs text-[#747878]">
              We couldn't find matches for "{query}". Try checking the spelling or browse our popular categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedTag('All');
              }}
              className="px-5 py-2 rounded-full bg-[#141414] text-white text-xs font-bold cursor-pointer hover:bg-[#8c7138] transition-colors"
            >
              View All Pieces
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="bg-white rounded-2xl border border-[#eae5dc] overflow-hidden flex flex-col cursor-pointer group hover:border-[#8c7138] hover:shadow-lg transition-all duration-200"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-[#faf8f5]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <span className="absolute top-2 left-2 bg-[#141414]/90 backdrop-blur-xs text-[#fed488] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
                  {product.savePercent > 0 && (
                    <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      -{product.savePercent}%
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8c7138]">
                      {product.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#141414] line-clamp-1 group-hover:text-[#8c7138] transition-colors">
                      {product.name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-sm sm:text-base font-extrabold text-[#141414]">
                        ₹{product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-[11px] text-[#888] line-through ml-1.5">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="p-2 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white transition-colors cursor-pointer active:scale-95 shadow-xs"
                      title="Add to Bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#fed488]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
