import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  X,
  Sparkles,
  ShieldCheck,
  Droplets,
  RotateCcw,
  Check
} from 'lucide-react';
import { Product, CategoryItem } from '../types';
import { Footer } from './Footer';

interface CategoryPageViewProps {
  categoryName: string;
  categories: CategoryItem[];
  products: Product[];
  onSelectCategory: (cat: string) => void;
  onBackToHome: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
  onSelectProduct: (product: Product) => void;
  onOpenAtelierOps?: () => void;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount' | 'newest';
type PriceFilter = 'all' | 'under-299' | '299-499' | '500-999' | 'above-999';

export const CategoryPageView: React.FC<CategoryPageViewProps> = ({
  categoryName,
  categories,
  products,
  onSelectCategory,
  onBackToHome,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onSelectProduct,
  onOpenAtelierOps
}) => {
  // Sort and Filter States
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [onlyWaterproof, setOnlyWaterproof] = useState(false);
  const [onlyAntiTarnish, setOnlyAntiTarnish] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Normalized category matching logic (supports existing and dynamic categories)
  const categoryProducts = useMemo(() => {
    const target = (categoryName || '').trim().toUpperCase();
    const liveProds = products.filter((p) => p.isLive !== false);

    if (!target || target === 'ALL' || target === 'ALL JEWELLERY' || target === 'SHOP') {
      return liveProds;
    }

    return liveProds.filter((prod) => {
      const prodCat = (prod.category || '').toUpperCase();
      const prodName = (prod.name || '').toUpperCase();
      const prodDesc = (prod.description || '').toUpperCase();

      // Exact match
      if (prodCat === target) return true;

      // Bangles & Bracelets synonym matching
      if (
        (target === 'BANGLES' || target === 'BRACELETS' || target === 'BANGLE' || target === 'BRACELET') &&
        (prodCat.includes('BANGLE') || prodCat.includes('BRACELET') || prodName.includes('BANGLE') || prodName.includes('BRACELET'))
      ) {
        return true;
      }

      // Mangalsutra matching
      if (
        target === 'MANGALSUTRA' &&
        (prodCat.includes('MANGALSUTRA') || prodName.includes('MANGALSUTRA') || prodDesc.includes('MANGALSUTRA'))
      ) {
        return true;
      }

      // Jewellery Sets matching
      if (
        (target === 'JEWELLERY SETS' || target === 'SETS' || target === 'SET') &&
        (prodCat.includes('SET') || prodName.includes('SET') || prodDesc.includes('SET'))
      ) {
        return true;
      }

      // Perfume matching
      if (
        (target === 'PERFUME' || target === 'PERFUMES') &&
        (prodCat.includes('PERFUME') || prodCat.includes('FRAGRANCE') || prodName.includes('PERFUME'))
      ) {
        return true;
      }

      // Beauty matching
      if (
        (target.includes('BEAUTY') || target.includes('CARE')) &&
        (prodCat.includes('BEAUTY') || prodCat.includes('CARE') || prodName.includes('FACEWASH') || prodName.includes('GLOW'))
      ) {
        return true;
      }

      // General substring match for any category added dynamically in admin
      if (prodCat.includes(target) || target.includes(prodCat)) {
        return true;
      }

      return false;
    });
  }, [categoryName, products]);

  // Apply User Sort & Filter controls
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...categoryProducts];

    // 1. In-category search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    // 2. Price filter
    if (priceFilter === 'under-299') {
      list = list.filter((p) => p.price < 299);
    } else if (priceFilter === '299-499') {
      list = list.filter((p) => p.price >= 299 && p.price <= 499);
    } else if (priceFilter === '500-999') {
      list = list.filter((p) => p.price >= 500 && p.price <= 999);
    } else if (priceFilter === 'above-999') {
      list = list.filter((p) => p.price > 999);
    }

    // 3. Feature filters
    if (onlyWaterproof) {
      list = list.filter((p) => p.isWaterproof);
    }
    if (onlyAntiTarnish) {
      list = list.filter((p) => p.isAntiTarnish);
    }
    if (onlyInStock) {
      list = list.filter((p) => (p.stock === undefined ? true : p.stock > 0));
    }

    // 4. Sorting
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discount':
        list.sort((a, b) => {
          const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return discB - discA;
        });
        break;
      case 'newest':
        list.reverse();
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return list;
  }, [categoryProducts, searchQuery, priceFilter, onlyWaterproof, onlyAntiTarnish, onlyInStock, sortBy]);

  // Check if any filter is active to show "Clear All"
  const isAnyFilterActive =
    priceFilter !== 'all' || onlyWaterproof || onlyAntiTarnish || onlyInStock || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setPriceFilter('all');
    setOnlyWaterproof(false);
    setOnlyAntiTarnish(false);
    setOnlyInStock(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  // Find category details for banner
  const currentCategoryMeta = categories.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#141414] flex flex-col">
      {/* 1. Breadcrumb & Back Strip */}
      <div className="bg-white border-b border-[#eae5dc] sticky top-[57px] z-20 py-2.5 px-4 sm:px-8 lg:px-14">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs font-semibold text-[#141414] hover:text-[#9e7144] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#747878] font-medium">
            <button onClick={onBackToHome} className="hover:text-[#9e7144]">
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-[#c4c4c4]" />
            <span className="text-[#747878]">Collections</span>
            <ChevronRight className="w-3 h-3 text-[#c4c4c4]" />
            <span className="text-[#9e7144] font-semibold capitalize">{categoryName}</span>
          </div>
        </div>
      </div>

      {/* 2. Category Title & Summary Bar (Clean, Light & Elegant) */}
      <section className="bg-white border-b border-[#eae5dc] py-4 sm:py-6 px-4 sm:px-8 lg:px-14">
        <div className="max-w-[1800px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl text-[#1a1714] font-normal tracking-tight capitalize">
              {categoryName}
            </h1>
            <span className="text-xl text-[#9e7144] font-light">—</span>
            <span className="text-xs sm:text-sm text-[#747878] font-medium">
              {filteredAndSortedProducts.length} Designs
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#747878]">
            <span className="inline-flex items-center gap-1 font-semibold text-[#9e7144]">
              <Sparkles className="w-3.5 h-3.5" />
              100% Waterproof &amp; Anti-Tarnish
            </span>
          </div>
        </div>
      </section>

      {/* 3. Horizontal Category Switcher Bar (Quick Navigation) */}
      <div className="bg-white border-b border-[#eae5dc] sticky top-[98px] z-15 shadow-2xs">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#747878] whitespace-nowrap mr-1 flex items-center gap-1">
            <span>Categories:</span>
          </span>

          <button
            onClick={() => onSelectCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              categoryName.toUpperCase() === 'ALL'
                ? 'bg-[#1b1714] text-white shadow-xs'
                : 'bg-[#faf8f5] text-[#555] hover:text-[#141414] hover:bg-[#f0ebe3] border border-[#eae5dc]'
            }`}
          >
            All Products
          </button>

          {categories.map((cat) => {
            const isCurrent = cat.name.toLowerCase() === categoryName.toLowerCase();
            return (
              <button
                key={cat.id || cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#9e7144] text-white shadow-xs font-bold'
                    : 'bg-[#faf8f5] text-[#555] hover:text-[#141414] hover:bg-[#f0ebe3] border border-[#eae5dc]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Filter & Sort Control Bar */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 py-4 w-full">
        <div className="bg-white rounded-2xl border border-[#eae5dc] p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Quick Search within Category */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#747878] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={`Search within ${categoryName}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#eae5dc] rounded-full pl-9 pr-8 py-1.5 text-xs text-[#141414] focus:outline-none focus:border-[#9e7144] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Center / Right: Filter Chips & Sort Selector */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Price Filter Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#747878] font-medium hidden sm:inline">Price:</span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as PriceFilter)}
                className="bg-[#faf8f5] border border-[#eae5dc] rounded-full px-3 py-1.5 text-xs font-semibold text-[#141414] focus:outline-none focus:border-[#9e7144] cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="under-299">Under ₹299</option>
                <option value="299-499">₹299 - ₹499</option>
                <option value="500-999">₹500 - ₹999</option>
                <option value="above-999">₹999+</option>
              </select>
            </div>

            {/* Quick Feature Toggles */}
            <button
              onClick={() => setOnlyWaterproof(!onlyWaterproof)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                onlyWaterproof
                  ? 'bg-[#1b1714] text-white border-[#1b1714]'
                  : 'bg-[#faf8f5] text-[#555] border-[#eae5dc] hover:border-[#9e7144]'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-[#fed488]" />
              <span>Waterproof</span>
              {onlyWaterproof && <Check className="w-3 h-3 text-[#fed488]" />}
            </button>

            <button
              onClick={() => setOnlyAntiTarnish(!onlyAntiTarnish)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                onlyAntiTarnish
                  ? 'bg-[#1b1714] text-white border-[#1b1714]'
                  : 'bg-[#faf8f5] text-[#555] border-[#eae5dc] hover:border-[#9e7144]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#fed488]" />
              <span>Anti-Tarnish</span>
              {onlyAntiTarnish && <Check className="w-3 h-3 text-[#fed488]" />}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 text-xs ml-auto md:ml-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#9e7144]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-[#faf8f5] border border-[#eae5dc] rounded-full px-3 py-1.5 text-xs font-semibold text-[#141414] focus:outline-none focus:border-[#9e7144] cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="discount">Biggest Discount %</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>

            {/* Reset Button if active */}
            {isAnyFilterActive && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 underline ml-1 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Indicators */}
        {isAnyFilterActive && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-1 text-xs">
            <span className="text-[#747878] text-[11px] font-medium">Applied Filters:</span>
            {priceFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f0ebe3] text-[#141414] text-[11px] font-semibold">
                Price: {priceFilter.replace('-', ' ')}
                <button onClick={() => setPriceFilter('all')} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {onlyWaterproof && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f0ebe3] text-[#141414] text-[11px] font-semibold">
                Waterproof
                <button onClick={() => setOnlyWaterproof(false)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {onlyAntiTarnish && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f0ebe3] text-[#141414] text-[11px] font-semibold">
                Anti-Tarnish
                <button onClick={() => setOnlyAntiTarnish(false)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f0ebe3] text-[#141414] text-[11px] font-semibold">
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* 5. Product Grid */}
      <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 pb-16 w-full flex-1">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#eae5dc] shadow-sm max-w-md mx-auto my-12">
            <div className="w-14 h-14 rounded-2xl bg-[#faf8f5] text-[#9e7144] flex items-center justify-center mx-auto mb-4 border border-[#eae5dc]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#141414]">No Designs Found</h3>
            <p className="text-xs text-[#747878] mt-2 leading-relaxed">
              We couldn't find any products in {categoryName} matching your current filters. Try changing or clearing the filters!
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#141414] hover:bg-[#9e7144] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredAndSortedProducts.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const discountTag = product.originalPrice
                ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`
                : '40% OFF';

              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between bg-white rounded-xl border border-[#eee7dc] hover:border-[#9e7144]/50 shadow-2xs hover:shadow-md transition-all duration-300 p-2 sm:p-3"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#faf7f2] mb-2.5">
                    <img
                      src={product.image}
                      alt={product.name}
                      onClick={() => onSelectProduct(product)}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80';
                      }}
                    />

                    {/* Top Badges */}
                    <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 pointer-events-none">
                      {product.isWaterproof && (
                        <span className="bg-[#141414]/90 text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-xs tracking-wider uppercase backdrop-blur-xs flex items-center gap-0.5">
                          <Droplets className="w-2.5 h-2.5 text-[#fed488]" />
                          Waterproof
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-white/85 hover:bg-white text-gray-600 hover:text-[#9e7144] transition-all cursor-pointer shadow-xs"
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
                        onClick={() => onSelectProduct(product)}
                        className="font-sans text-xs sm:text-[13px] font-medium text-[#1a1714] line-clamp-1 hover:text-[#9e7144] cursor-pointer transition-colors leading-snug mb-1"
                        title={product.name}
                      >
                        {product.name}
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
                        <span className="bg-[#1b1714] text-white text-[9px] font-bold px-1 py-0.5 rounded-xs">
                          {discountTag}
                        </span>
                      </div>
                    </div>

                    {/* Camel Brown Add to Cart Button */}
                    <button
                      onClick={() => onAddToCart(product)}
                      className="bg-[#9e7144] hover:bg-[#865d34] text-white text-xs font-semibold py-1.5 sm:py-2 rounded-md transition-colors w-full flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. Guarantee & Perks Strip */}
      <section className="bg-white border-t border-[#eae5dc] py-8 px-4 sm:px-8 lg:px-14">
        <div className="max-w-[1800px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-center text-[#9e7144]">
              <Droplets className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-[#141414]">100% Waterproof</h4>
            <p className="text-[11px] text-[#747878]">Wear in pool, shower &amp; gym safely</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-center text-[#9e7144]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-[#141414]">Anti-Tarnish Lustre</h4>
            <p className="text-[11px] text-[#747878]">18K Real Gold PVD coat guarantee</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-center text-[#9e7144]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-[#141414]">7-Day Easy Exchange</h4>
            <p className="text-[11px] text-[#747878]">Hassle-free doorstep pickup</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-center text-[#9e7144]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-[#141414]">Free Shipping Above ₹499</h4>
            <p className="text-[11px] text-[#747878]">Cash on delivery available across India</p>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <Footer
        onSelectCategory={(cat) => onSelectCategory(cat)}
        onOpenAtelierOps={onOpenAtelierOps}
      />
    </div>
  );
};
