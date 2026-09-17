import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Droplets,
  RotateCcw,
  Search
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

      // Mangalsutra & Necklace matching
      if (
        (target === 'MANGALSUTRA' || target === 'MANGALSUTRAS') &&
        (prodCat.includes('MANGALSUTRA') || prodName.includes('MANGALSUTRA') || prodDesc.includes('MANGALSUTRA') || prodCat.includes('NECKLACE') || prodName.includes('NECKLACE'))
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
    <div className="min-h-screen bg-white text-[#141414] flex flex-col">
      {/* Clean Category Header matching Home page exactly */}
      <section className="py-6 sm:py-8 bg-white border-b border-[#eae5dc]">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl text-[#141414] font-bold tracking-tight capitalize">
              {categoryName}
            </h1>
            <span className="text-xl sm:text-2xl text-[#9e7144] font-light">—</span>
            <span className="text-xs sm:text-sm text-[#777] font-medium ml-1">
              ({filteredAndSortedProducts.length} items found)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Clean Sort Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#747878] font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-[#faf8f5] border border-[#eae5dc] rounded-full px-3 py-1.5 text-xs font-semibold text-[#141414] focus:outline-none focus:border-[#9e7144] cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="discount">Biggest Discount %</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>

            {/* Back to Home button */}
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#9e7144] hover:text-[#805c30] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </section>

      {/* Product Grid directly underneath — exactly identical to Home page! */}
      <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 py-6 sm:py-8 w-full flex-1 bg-white">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#eae5dc] shadow-sm max-w-md mx-auto my-12">
            <div className="w-14 h-14 rounded-2xl bg-[#faf8f5] text-[#9e7144] flex items-center justify-center mx-auto mb-4 border border-[#eae5dc]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#141414]">No Designs Found</h3>
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
                        <span className="bg-[#9e7144] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs">
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
