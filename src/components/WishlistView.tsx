import React, { useState, useMemo } from 'react';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowLeft,
  Share2,
  Sparkles,
  ShieldCheck,
  Droplet,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Zap,
  ArrowRight
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
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (selectedFilter === 'ALL') return wishlistProducts;
    return wishlistProducts.filter(
      (p) => p.category.toUpperCase() === selectedFilter.toUpperCase()
    );
  }, [wishlistProducts, selectedFilter]);

  // Calculations for total value and savings
  const totalAmount = useMemo(
    () => wishlistProducts.reduce((sum, p) => sum + p.price, 0),
    [wishlistProducts]
  );
  const totalOriginalAmount = useMemo(
    () => wishlistProducts.reduce((sum, p) => sum + p.originalPrice, 0),
    [wishlistProducts]
  );
  const totalSavings = totalOriginalAmount - totalAmount;
  const overallSavePercent = totalOriginalAmount > 0
    ? Math.round((totalSavings / totalOriginalAmount) * 100)
    : 0;

  // Category counts for filter tabs
  const categoriesWithCounts = useMemo(() => {
    const cats = ['ALL', 'NECKLACES', 'BRACELETS', 'RINGS', 'EARRINGS', 'ANKLETS'];
    return cats
      .map((cat) => {
        const count =
          cat === 'ALL'
            ? wishlistProducts.length
            : wishlistProducts.filter((p) => p.category.toUpperCase() === cat).length;
        return { name: cat, count };
      })
      .filter((item) => item.name === 'ALL' || item.count > 0);
  }, [wishlistProducts]);

  // Trending recommendations for empty state
  const trendingRecommendations = useMemo(() => {
    return VAULT_PRODUCTS.slice(0, 4);
  }, []);

  const handleShareWishlist = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleMoveAllToBag = () => {
    if (onMoveAllToBag) {
      onMoveAllToBag();
    } else {
      wishlistProducts.forEach((prod) => {
        onAddToCart(prod);
      });
      if (onOpenCart) onOpenCart();
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#141414] font-sans pb-20 animate-fadeIn">
      {/* Top Breadcrumb Navigation Bar */}
      <div className="bg-white border-b border-[#eae5dc] sticky top-0 z-30 shadow-2xs">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToStore}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#141414] hover:text-[#8c7138] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Continue Shopping</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#747878] font-medium">
            <span>Home</span>
            <ChevronRight className="w-3 h-3 text-[#c4c4c4]" />
            <span className="text-[#141414] font-bold">My Wishlist</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareWishlist}
              className="flex items-center gap-1.5 text-xs font-bold text-[#747878] hover:text-[#141414] px-3 py-1.5 rounded-full border border-[#eae5dc] hover:bg-[#faf8f5] transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            {wishlistProducts.length > 0 && (
              <button
                type="button"
                onClick={handleMoveAllToBag}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold bg-[#141414] text-white hover:bg-[#8c7138] px-4 py-1.5 rounded-full transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move All to Bag</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* Wishlist Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#eae5dc]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8c7138]">
                SAVED VAULT PIECES
              </span>
            </div>

            <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141414] tracking-tight mt-1">
              My Wishlist ({wishlistProducts.length})
            </h1>

            <p className="text-xs sm:text-sm text-[#747878] mt-1 max-w-xl font-medium">
              Your handpicked 18K gold-finished pieces. 100% waterproof and guaranteed anti-tarnish.
            </p>
          </div>

          {/* Bulk Action Buttons (Visible when items exist) */}
          {wishlistProducts.length > 0 && (
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleMoveAllToBag}
                className="py-2.5 px-4 sm:px-5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>MOVE ALL TO BAG</span>
              </button>

              {onClearWishlist && (
                <button
                  type="button"
                  onClick={onClearWishlist}
                  className="py-2.5 px-3.5 rounded-full border border-[#eae5dc] bg-white text-[#747878] hover:text-rose-600 hover:border-rose-300 font-bold text-xs transition-colors cursor-pointer"
                  title="Clear all saved pieces"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Wishlist Items Content or Empty State */}
        {wishlistProducts.length === 0 ? (
          /* Empty State */
          <div className="py-16 sm:py-24 text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#f2ece1] border border-[#dfd7ca] flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Heart className="w-9 h-9 text-[#8c7138]" />
            </div>

            <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#141414] tracking-tight">
              Your Wishlist is Empty
            </h2>

            <p className="text-xs sm:text-sm text-[#747878] mt-2 leading-relaxed">
              You haven't saved any demi-fine pieces yet. Tap the heart icon on any design while exploring the collection to save your favorite jewelry here.
            </p>

            <button
              type="button"
              onClick={onBackToStore}
              className="mt-6 px-8 py-3 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#fed488]" />
              <span>Explore The ₹99 Vault</span>
            </button>

            {/* Trending Picks Carousel Below Empty State */}
            <div className="mt-16 text-left border-t border-[#eae5dc] pt-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7138] block leading-none mb-0.5">
                    POPULAR PICKS
                  </span>
                  <h3 className="font-sans text-base sm:text-lg font-bold text-[#141414] tracking-tight">
                    Trending Right Now
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {trendingRecommendations.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white border border-[#eae5dc] rounded-2xl p-2.5 flex flex-col justify-between overflow-hidden shadow-xs hover:border-[#8c7138]/50 hover:shadow-md transition-all"
                  >
                    <div
                      onClick={() => onSelectProduct(prod)}
                      className="aspect-square w-full rounded-xl overflow-hidden bg-[#faf8f5] mb-2 cursor-pointer relative group"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-1.5 left-1.5 bg-[#141414] text-[#fed488] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                        SAVE {prod.savePercent}%
                      </span>
                    </div>

                    <div>
                      <h4
                        onClick={() => onSelectProduct(prod)}
                        className="text-xs font-semibold text-[#141414] hover:text-[#8c7138] truncate cursor-pointer"
                      >
                        {prod.name}
                      </h4>
                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-xs font-bold text-[#141414]">₹{prod.price}</span>
                        <span className="text-[10px] text-[#a3a3a3] line-through">₹{prod.originalPrice}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart(prod)}
                      className="w-full mt-2.5 py-1.5 rounded-xl bg-[#141414] hover:bg-[#8c7138] text-white text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Wishlist Content */
          <>
            {/* Value & Savings Summary Ticker */}
            <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#eae5dc] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f2ece1] text-[#8c7138] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 fill-[#8c7138]" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-[#747878] font-bold uppercase">Total Wishlist Value:</span>
                    <span className="font-sans text-lg font-extrabold text-[#141414]">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#a3a3a3] line-through">
                      ₹{totalOriginalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                    You save ₹{totalSavings.toLocaleString('en-IN')} ({overallSavePercent}%) • Free Express Delivery Across India
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleMoveAllToBag}
                className="py-2.5 px-5 rounded-xl bg-[#8c7138] hover:bg-[#6e582a] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD ALL TO BAG</span>
              </button>
            </div>

            {/* Category Filter Chips Bar */}
            {categoriesWithCounts.length > 2 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-4">
                {categoriesWithCounts.map(({ name, count }) => {
                  const isActive = selectedFilter === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setSelectedFilter(name)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-[#8c7138] text-white shadow-xs'
                          : 'bg-white text-[#747878] border border-[#eae5dc] hover:border-[#8c7138] hover:text-[#141414]'
                      }`}
                    >
                      {name} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            {/* Responsive Wishlist Grid (2-col mobile, 3-col tablet, 4-col desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 mt-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#eae5dc] rounded-2xl flex flex-col justify-between overflow-hidden shadow-xs hover:border-[#8c7138]/50 hover:shadow-md transition-all duration-200 group"
                >
                  {/* Product Image Stage with Actions */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="aspect-square w-full bg-[#f8f6f2] cursor-pointer relative overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Discount Badge */}
                    <span className="absolute top-2.5 left-2.5 bg-[#141414] text-[#fed488] text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                      SAVE {product.savePercent}%
                    </span>

                    {/* Remove from Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWishlist(product.id);
                      }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-rose-500 hover:bg-rose-50 shadow-xs transition-transform active:scale-90 cursor-pointer"
                      title="Remove from saved items"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* In Stock Pill */}
                    <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      <span>In Stock • Ready to Ship</span>
                    </div>
                  </div>

                  {/* Product Details & Purchase Area */}
                  <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7138] block mb-0.5 truncate">
                        {product.category} • 316L Stainless Steel
                      </span>

                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="text-xs sm:text-sm font-semibold text-[#141414] truncate cursor-pointer hover:text-[#8c7138] transition-colors leading-tight"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      {/* Pricing Row */}
                      <div className="flex items-center justify-between gap-1.5 mt-2 pt-1.5 border-t border-[#f4efea]">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-sm sm:text-base text-[#141414]">
                            ₹{product.price}
                          </span>
                          <span className="text-[11px] sm:text-xs text-[#a3a3a3] line-through font-normal">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 rounded uppercase">
                          FLAT ₹99
                        </span>
                      </div>
                    </div>

                    {/* Primary Button: Move to Bag */}
                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart(product);
                        onRemoveFromWishlist(product.id);
                      }}
                      className="w-full mt-3 py-2.5 px-3 rounded-xl bg-[#141414] hover:bg-[#8c7138] active:scale-[0.98] transition-all text-xs font-bold text-white text-center shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>MOVE TO BAG</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Customer Assurances (Trust Ribbon) */}
        <div className="mt-14 pt-8 border-t border-[#eae5dc]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-white border border-[#eae5dc] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#8c7138]/10 text-[#8c7138] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <h4 className="text-xs font-bold text-[#141414]">316L Stainless Steel</h4>
                <p className="text-[10px] text-[#747878]">100% Anti-Tarnish Metal</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#eae5dc] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#8c7138]/10 text-[#8c7138] flex items-center justify-center shrink-0">
                <Droplet className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <h4 className="text-xs font-bold text-[#141414]">100% Waterproof</h4>
                <p className="text-[10px] text-[#747878]">Shower, Gym & Pool Safe</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#eae5dc] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#8c7138]/10 text-[#8c7138] flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <h4 className="text-xs font-bold text-[#141414]">Free Express Courier</h4>
                <p className="text-[10px] text-[#747878]">Fast 2-3 Day Dispatch</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#eae5dc] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#8c7138]/10 text-[#8c7138] flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <h4 className="text-xs font-bold text-[#141414]">7-Day Easy Exchange</h4>
                <p className="text-[10px] text-[#747878]">Hassle-free doorstep pickup</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
