import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Droplet,
  Truck,
  RotateCcw,
  ShoppingBag,
  Heart,
  Share2,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';
import { VAULT_PRODUCTS } from '../data/products';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onBuyNow: (product: Product, quantity?: number) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
  onSelectProduct
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Scroll to absolute top whenever product changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setSelectedImageIndex(0);
    setQuantity(1);
    setOpenAccordion(null);
  }, [product.id]);

  // Gallery images
  const galleryImages = [
    product.image,
    ...(product.hoverImage && product.hoverImage !== product.image ? [product.hoverImage] : []),
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1611591475179-42cd3423e89d?auto=format&fit=crop&q=80&w=800'
  ];

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 35) {
      handleNextImage(); // Swiped left -> Next
    } else if (diff < -35) {
      handlePrevImage(); // Swiped right -> Prev
    }
    setTouchStart(null);
  };

  // Related products
  const relatedProducts = VAULT_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  const finalRelated = relatedProducts.length >= 2
    ? relatedProducts
    : VAULT_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [product.image],
    "description": product.description || product.name,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": `https://parzio.in/product/${product.id}`,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": (product.stock ?? 1) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Parzio"
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#141414] pb-32 md:pb-8 font-sans">
      <Helmet>
        <title>{`${product.name} - Parzio`}</title>
        <meta name="description" content={`Buy ${product.name} at ₹${product.price}. ${product.description || product.name}`} />
        <link rel="canonical" href={`https://parzio.in/product/${product.id}`} />
        
        {/* OpenGraph Tags for Social Sharing */}
        <meta property="og:title" content={`${product.name} - Parzio`} />
        <meta property="og:description" content={`Buy ${product.name} at ₹${product.price}.`} />
        <meta property="og:image" content={(product.images || [product.image])[0]} />
        <meta property="og:url" content={`https://parzio.in/product/${product.id}`} />
        <meta property="og:type" content="product" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} - Parzio`} />
        <meta name="twitter:description" content={`Buy ${product.name} at ₹${product.price}.`} />
        <meta name="twitter:image" content={(product.images || [product.image])[0]} />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Top Compact Breadcrumb Bar */}
      <div className="bg-white border-b border-[#eae5dc] sticky top-0 z-30">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-[#141414] hover:text-[#8c7138] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Collection</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#747878] font-medium">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-[#8c7138] hover:underline cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-[#c4c4c4]" />
            <span className="capitalize">{product.category}</span>
            <ChevronRight className="w-3 h-3 text-[#c4c4c4]" />
            <span className="text-[#141414] font-semibold truncate max-w-[180px]">{product.name}</span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 text-[11px] font-bold text-[#747878] hover:text-[#141414] px-2.5 py-1 rounded-full border border-[#eae5dc] hover:bg-[#faf8f5] transition-colors cursor-pointer"
          >
            <Share2 className="w-3 h-3" />
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Compact Product Container */}
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
          
          {/* Left Column: Image Gallery with Interactive Slider & Swipe (5 Cols on Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            {/* Main Image Stage with Floating < and > Arrows and Swipe Gestures */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative aspect-square max-h-[380px] sm:max-h-[420px] lg:max-h-[440px] w-full rounded-2xl overflow-hidden bg-white border border-[#eae5dc] shadow-xs select-none group mx-auto"
            >
              {/* Image with smooth transition */}
              <img
                key={selectedImageIndex}
                src={galleryImages[selectedImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center animate-fadeIn"
                draggable={false}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';
                }}
              />

              {/* Minimal Clean Badge */}
              {product.badge && (
                <span className="absolute top-2.5 left-2.5 bg-[#141414] text-[#fed488] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs z-10">
                  {product.badge}
                </span>
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#141414] hover:text-rose-500 shadow-xs transition-transform active:scale-90 cursor-pointer z-10"
                title="Save to Wishlist"
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* Floating Left Arrow (<) */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-[#141414] shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-20 cursor-pointer border border-[#eae5dc]/80"
                  title="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              {/* Floating Right Arrow (>) */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-[#141414] shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-20 cursor-pointer border border-[#eae5dc]/80"
                  title="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* Subtle Slide Dots Indicator */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs pointer-events-none">
                  {galleryImages.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        selectedImageIndex === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Buying Information (7 Cols on Desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            
            {/* Title & Ratings */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9e7144] block mb-1">
                PARZIO DEMI-FINE • {product.category.toUpperCase()}
              </span>
              <h1 className="text-2xl sm:text-3xl text-[#141414] font-bold tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Rating Star Row */}
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-1 bg-[#141414] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                  <span>{product.rating}</span>
                  <Star className="w-2.5 h-2.5 fill-[#fed488] text-[#fed488]" />
                </div>
                <span className="text-[11px] text-[#747878] font-medium">
                  {product.reviewsCount} Verified Customer Reviews
                </span>
              </div>
            </div>

            {/* Compact Price & Quantity Box */}
            <div className="p-3 rounded-xl bg-white border border-[#eae5dc] flex items-center justify-between gap-3 shadow-xs">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-sans text-2xl sm:text-[28px] font-bold text-[#1a1714] tracking-tight leading-none">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-gray-400 line-through font-normal leading-none">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-xs bg-[#9e7144] text-white text-[10px] font-bold tracking-wider uppercase leading-none">
                    {product.savePercent}% OFF
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-1 leading-none">
                  <Check className="w-3 h-3" />
                  Inclusive of all taxes • Free Express Courier Delivery
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center border border-[#eae5dc] bg-[#faf8f5] rounded-lg overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-1 text-xs font-bold text-[#747878] hover:text-[#141414] transition-colors cursor-pointer"
                  title="Decrease"
                >
                  -
                </button>
                <span className="px-2 py-1 text-xs font-bold text-[#141414] min-w-[24px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-2.5 py-1 text-xs font-bold text-[#747878] hover:text-[#141414] transition-colors cursor-pointer"
                  title="Increase"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons (Full prominent CTAs) */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onAddToCart(product, quantity)}
                className="py-2.5 px-4 rounded-md bg-[#9e7144] hover:bg-[#865d34] text-white transition-all font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={() => onBuyNow(product, quantity)}
                className="py-2.5 px-4 rounded-md bg-[#141414] hover:bg-neutral-800 text-white transition-all font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
              >
                <Sparkles className="w-3.5 h-3.5 fill-[#fed488] text-[#fed488]" />
                <span>BUY NOW</span>
              </button>
            </div>

            {/* Sleek Single-Row Trust Ribbon (Takes only 32px vertical height) */}
            <div className="py-2 px-3 rounded-xl bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-between gap-2 text-[10px] sm:text-[11px] text-[#141414] font-medium overflow-x-auto no-scrollbar">
              <span className="flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8c7138]" /> 316L Anti-Tarnish
              </span>
              <span className="text-[#dfd7ca]">•</span>
              <span className="flex items-center gap-1 shrink-0">
                <Droplet className="w-3.5 h-3.5 text-[#8c7138]" /> 100% Waterproof
              </span>
              <span className="text-[#dfd7ca]">•</span>
              <span className="flex items-center gap-1 shrink-0">
                <Truck className="w-3.5 h-3.5 text-[#8c7138]" /> Free Delivery
              </span>
              <span className="text-[#dfd7ca]">•</span>
              <span className="flex items-center gap-1 shrink-0">
                <RotateCcw className="w-3.5 h-3.5 text-[#8c7138]" /> 7-Day Return
              </span>
            </div>

            {/* Clean Accordions (Collapsed by default so page stays compact) */}
            <div className="border border-[#eae5dc] rounded-xl overflow-hidden bg-white divide-y divide-[#eae5dc]">
              {/* Accordion 1: Description */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('description')}
                  className="w-full px-3.5 py-2.5 text-left flex items-center justify-between text-xs font-bold text-[#141414] hover:bg-[#faf8f5] transition-colors cursor-pointer"
                >
                  <span>PRODUCT DETAILS & DESCRIPTION</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#747878] transition-transform duration-200 ${openAccordion === 'description' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'description' && (
                  <div className="px-3.5 pb-3 text-xs text-[#747878] leading-relaxed">
                    <p>{product.description}</p>
                    <p className="mt-1.5 text-[#141414] font-medium text-[11px]">
                      Crafted for continuous daily wear — sweat, shower, and pool safe.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Materials & Specs */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('materials')}
                  className="w-full px-3.5 py-2.5 text-left flex items-center justify-between text-xs font-bold text-[#141414] hover:bg-[#faf8f5] transition-colors cursor-pointer"
                >
                  <span>MATERIAL & ANTI-TARNISH SPECS</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#747878] transition-transform duration-200 ${openAccordion === 'materials' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'materials' && (
                  <div className="px-3.5 pb-3 text-xs text-[#747878] leading-relaxed space-y-1">
                    <p><strong className="text-[#141414]">Base Metal:</strong> {product.material || '316L Surgical Grade Stainless Steel'}</p>
                    <p><strong className="text-[#141414]">Finish:</strong> 18K Real Gold PVD Vacuum Plating</p>
                    <p><strong className="text-[#141414]">SKU:</strong> <span className="font-mono text-[11px]">{product.sku}</span></p>
                    <p><strong className="text-[#141414]">Hypoallergenic:</strong> 100% Nickel-free & Lead-free (No green marks or skin irritation)</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Shipping & Returns */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full px-3.5 py-2.5 text-left flex items-center justify-between text-xs font-bold text-[#141414] hover:bg-[#faf8f5] transition-colors cursor-pointer"
                >
                  <span>DELIVERY & 7-DAY DOORSTEP EXCHANGE</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#747878] transition-transform duration-200 ${openAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="px-3.5 pb-3 text-xs text-[#747878] leading-relaxed space-y-1">
                    <p>• <strong>Dispatch:</strong> Packed & shipped within 24 working hours from Mumbai.</p>
                    <p>• <strong>Transit:</strong> Delivers in 2–4 business days via BlueDart / Delhivery Express.</p>
                    <p>• <strong>Exchanges:</strong> 7-day hassle-free doorstep pickup exchange service.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Complete The Look (Related Products) - Compact Spacing */}
        <div className="mt-8 sm:mt-10 border-t border-[#eae5dc] pt-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#8c7138] block leading-none mb-0.5">
                CURATED PAIRINGS
              </span>
              <h2 className="font-sans text-base sm:text-lg font-bold text-[#141414] tracking-tight">
                Complete The Look
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5">
            {finalRelated.map((rel) => (
              <div
                key={rel.id}
                className="bg-white border border-[#eae5dc] rounded-xl flex flex-col justify-between overflow-hidden shadow-xs hover:border-[#8c7138]/50 hover:shadow-md transition-all duration-200"
              >
                {/* 1:1 Compact Image */}
                <div
                  onClick={() => onSelectProduct(rel)}
                  className="aspect-square w-full bg-[#f8f6f2] cursor-pointer relative overflow-hidden group"
                >
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-[#141414] text-[#fed488] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                    SAVE {rel.savePercent}%
                  </span>
                </div>

                {/* Meta */}
                <div className="p-2.5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8c7138] block leading-none mb-0.5 truncate">
                      {rel.category} • 316L Steel
                    </span>
                    <h4
                      onClick={() => onSelectProduct(rel)}
                      className="text-[11px] sm:text-[12px] font-semibold text-[#141414] truncate cursor-pointer hover:text-[#8c7138] transition-colors leading-tight"
                      title={rel.name}
                    >
                      {rel.name}
                    </h4>

                    <div className="flex items-center justify-between gap-1 mt-1.5 pt-1 border-t border-[#f4efea]">
                      <span className="font-bold text-xs sm:text-sm text-[#141414]">
                        ₹{rel.price}
                      </span>
                      <span className="text-[10px] text-[#a3a3a3] line-through">
                        ₹{rel.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddToCart(rel)}
                    className="w-full mt-2 bg-[#9e7144] hover:bg-[#865d34] text-white py-1.5 px-2 rounded-xs text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clean Mobile Sticky Action Bar at Bottom (Positioned above BottomNav) */}
      <div className="fixed bottom-12 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eae5dc] px-3.5 py-2 md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.06)] flex items-center justify-between gap-2.5">
        <div>
          <span className="text-[8px] text-[#747878] font-bold uppercase block leading-none">TOTAL</span>
          <span className="font-sans text-sm font-extrabold text-[#141414] leading-none">
            ₹{(product.price * quantity).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-1 max-w-[240px]">
          <button
            type="button"
            onClick={() => onAddToCart(product, quantity)}
            className="flex-1 py-2 rounded-md bg-[#9e7144] hover:bg-[#865d34] text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            onClick={() => onBuyNow(product, quantity)}
            className="flex-1 py-2 rounded-md bg-[#141414] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-xs active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#fed488] text-[#fed488]" />
            <span>BUY NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
