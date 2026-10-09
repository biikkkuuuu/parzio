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
import { Product, ProductColorVariant } from '../types';
import { dbService } from '../services/dbService';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity?: number, selectedColor?: string, selectedColorImage?: string) => void;
  onBuyNow: (product: Product, quantity?: number, selectedColor?: string, selectedColorImage?: string) => void;
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
  const [selectedVariant, setSelectedVariant] = useState<ProductColorVariant | null>(() => product.colorVariants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Scroll to absolute top whenever product changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setSelectedImageIndex(0);
    setSelectedVariant(product.colorVariants?.[0] || null);
    setQuantity(1);
    setOpenAccordion(null);
  }, [product.id]);

  // Gallery images: strictly use real uploaded product photos
  const rawGallery = (product.images && product.images.length > 0)
    ? product.images
    : [product.image, product.hoverImage].filter(Boolean);
  
  // Deduplicate and filter valid non-empty images
  const galleryImages = Array.from(new Set(rawGallery.filter((img): img is string => Boolean(img && img.trim()))));
  if (galleryImages.length === 0 && product.image) {
    galleryImages.push(product.image);
  }

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
  const allProducts = dbService.getProducts();
  const relatedProducts = allProducts.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  const finalRelated = relatedProducts.length >= 2
    ? relatedProducts
    : allProducts.filter((p) => p.id !== product.id).slice(0, 4);

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
      <div className="bg-white border-b border-[#eae5dc] sticky top-0 z-30 shadow-2xs">
        <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-12 py-2 sm:py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#141414] hover:text-[#8c7138] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Collection</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#747878] font-medium">
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
            <span className="text-[#141414] font-semibold truncate max-w-[240px] lg:max-w-[400px]">{product.name}</span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#747878] hover:text-[#141414] px-3 py-1.5 rounded-full border border-[#eae5dc] hover:bg-[#faf8f5] transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Luxury Full-Width Product Container (Expansive on PC, Compact on Mobile) */}
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-12 py-3 sm:py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 xl:gap-14 items-start">
          
          {/* Left Column: Image Gallery with Interactive Slider & Swipe (6 Cols on Desktop) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col gap-3 lg:gap-4">
            {/* Main Image Stage with Floating < and > Arrows and Swipe Gestures */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative aspect-square w-full rounded-2xl lg:rounded-3xl overflow-hidden bg-white border border-[#eae5dc] shadow-sm select-none group mx-auto"
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
                <span className="absolute top-3 left-3 lg:top-4 lg:left-4 bg-[#141414] text-[#fed488] text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-xs z-10">
                  {product.badge}
                </span>
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className="absolute top-3 right-3 lg:top-4 lg:right-4 w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#141414] hover:text-rose-500 shadow-md transition-transform active:scale-90 cursor-pointer z-10 border border-[#eae5dc]/80 hover:scale-105"
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 lg:w-5 lg:h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* Floating Left Arrow (<) */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#141414] shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-20 cursor-pointer border border-[#eae5dc]/80 opacity-90 group-hover:opacity-100"
                  title="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#141414] shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-20 cursor-pointer border border-[#eae5dc]/80 opacity-90 group-hover:opacity-100"
                  title="Next image"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              {/* Subtle Slide Dots Indicator */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-xs pointer-events-none">
                  {galleryImages.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        selectedImageIndex === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Row if more than 1 image */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1 pt-1 no-scrollbar">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-[#8c7138] ring-2 ring-[#8c7138]/20 shadow-sm scale-102'
                        : 'border-[#eae5dc] opacity-70 hover:opacity-100 hover:border-[#8c7138]/50'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Buying Information (6 Cols on Desktop - Sticky & Spacious) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col gap-3.5 lg:gap-5 lg:sticky lg:top-24">
            
            {/* Title & Ratings */}
            <div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#9e7144] block mb-1">
                PARZIO DEMI-FINE • {product.category.toUpperCase()}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#141414] font-bold tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating Star Row */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-[#141414] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                  <span>{product.rating}</span>
                  <Star className="w-3 h-3 fill-[#fed488] text-[#fed488]" />
                </div>
                <span className="text-xs text-[#747878] font-medium">
                  {product.reviewsCount} Verified Customer Reviews
                </span>
              </div>
            </div>

            {/* Color / Shade Variant Selector */}
            {product.colorVariants && product.colorVariants.length > 0 && (
              <div className="p-3.5 sm:p-4 rounded-xl lg:rounded-2xl bg-white border border-[#eae5dc] shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#141414] uppercase tracking-wider flex items-center gap-1.5">
                    <span>Select Shade / Finish:</span>
                    <span className="text-[#8c7138] font-extrabold">{selectedVariant?.name || product.colorVariants[0].name}</span>
                  </span>
                  <span className="text-[11px] text-[#747878] font-medium">
                    {product.colorVariants.length} Finishes Available
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {product.colorVariants.map((v, i) => {
                    const isSelected = selectedVariant?.name === v.name || (!selectedVariant && i === 0);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(v);
                          if (v.image) {
                            const idx = galleryImages.indexOf(v.image);
                            if (idx !== -1) {
                              setSelectedImageIndex(idx);
                            }
                          }
                        }}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#141414] text-white border-[#141414] shadow-xs scale-102 ring-2 ring-[#8c7138]/40'
                            : 'bg-[#faf8f5] text-[#141414] hover:bg-[#eae5dc] border-[#eae5dc]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-2xs"
                          style={{ backgroundColor: v.colorCode || '#D4AF37' }}
                        />
                        <span>{v.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Compact Price & Quantity Box */}
            <div className="p-3.5 sm:p-4 lg:p-5 rounded-xl lg:rounded-2xl bg-white border border-[#eae5dc] flex items-center justify-between gap-3 shadow-xs">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-sans text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1a1714] tracking-tight leading-none">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm sm:text-base text-gray-400 line-through font-normal leading-none">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="px-2 py-0.5 rounded-xs bg-[#9e7144] text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase leading-none">
                    {product.savePercent}% OFF
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-emerald-700 font-bold flex items-center gap-1 mt-1.5 leading-none">
                  <Check className="w-3.5 h-3.5" />
                  Inclusive of all taxes • Free Express Courier Delivery
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center border border-[#eae5dc] bg-[#faf8f5] rounded-lg lg:rounded-xl overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-xs sm:text-sm font-bold text-[#747878] hover:text-[#141414] transition-colors cursor-pointer"
                  title="Decrease"
                >
                  -
                </button>
                <span className="px-2.5 py-1.5 text-xs sm:text-sm font-bold text-[#141414] min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-xs sm:text-sm font-bold text-[#747878] hover:text-[#141414] transition-colors cursor-pointer"
                  title="Increase"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons (Full prominent CTAs) */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <button
                type="button"
                onClick={() => onAddToCart(product, quantity, selectedVariant?.name, selectedVariant?.image)}
                className="py-3 lg:py-3.5 px-4 sm:px-6 rounded-xl bg-[#9e7144] hover:bg-[#865d34] text-white transition-all font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={() => onBuyNow(product, quantity, selectedVariant?.name, selectedVariant?.image)}
                className="py-3 lg:py-3.5 px-4 sm:px-6 rounded-xl bg-[#141414] hover:bg-neutral-800 text-white transition-all font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
              >
                <Sparkles className="w-4 h-4 fill-[#fed488] text-[#fed488]" />
                <span>BUY NOW</span>
              </button>
            </div>

            {/* Sleek Single-Row Trust Ribbon */}
            <div className="py-2.5 lg:py-3 px-3.5 lg:px-5 rounded-xl lg:rounded-2xl bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-between gap-2 text-[10px] sm:text-xs text-[#141414] font-medium overflow-x-auto no-scrollbar">
              <span className="flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8c7138]" /> 316L Anti-Tarnish
              </span>
              <span className="text-[#dfd7ca]">•</span>
              <span className="flex items-center gap-1.5 shrink-0">
                <Droplet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8c7138]" /> 100% Waterproof
              </span>
              <span className="text-[#dfd7ca]">•</span>
              <span className="flex items-center gap-1.5 shrink-0">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8c7138]" /> Free Delivery
              </span>
              <span className="text-[#dfd7ca]">•</span>
              <span className="flex items-center gap-1.5 shrink-0">
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8c7138]" /> 7-Day Return
              </span>
            </div>

            {/* Clean Accordions (Collapsed by default so page stays clean & readable) */}
            <div className="border border-[#eae5dc] rounded-xl lg:rounded-2xl overflow-hidden bg-white divide-y divide-[#eae5dc] shadow-2xs">
              {/* Accordion 1: Description */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('description')}
                  className="w-full px-4 lg:px-5 py-3 lg:py-3.5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-[#141414] hover:bg-[#faf8f5] transition-colors cursor-pointer"
                >
                  <span>PRODUCT DETAILS & DESCRIPTION</span>
                  <ChevronDown className={`w-4 h-4 text-[#747878] transition-transform duration-200 ${openAccordion === 'description' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'description' && (
                  <div className="px-4 lg:px-5 pb-4 text-xs sm:text-sm text-[#555] leading-relaxed animate-fadeIn">
                    <div className="whitespace-pre-line space-y-1 font-sans">
                      {product.description}
                    </div>
                    <p className="mt-3 text-[#141414] font-semibold text-xs pt-2 border-t border-[#f4efea]">
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
                  className="w-full px-4 lg:px-5 py-3 lg:py-3.5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-[#141414] hover:bg-[#faf8f5] transition-colors cursor-pointer"
                >
                  <span>MATERIAL & ANTI-TARNISH SPECS</span>
                  <ChevronDown className={`w-4 h-4 text-[#747878] transition-transform duration-200 ${openAccordion === 'materials' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'materials' && (
                  <div className="px-4 lg:px-5 pb-4 text-xs sm:text-sm text-[#747878] leading-relaxed space-y-1.5 animate-fadeIn">
                    <p><strong className="text-[#141414]">Base Metal:</strong> {product.material || '316L Surgical Grade Stainless Steel'}</p>
                    <p><strong className="text-[#141414]">Finish:</strong> 18K Real Gold PVD Vacuum Plating</p>
                    <p><strong className="text-[#141414]">SKU:</strong> <span className="font-mono text-xs">{product.sku}</span></p>
                    <p><strong className="text-[#141414]">Hypoallergenic:</strong> 100% Nickel-free & Lead-free (No green marks or skin irritation)</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Shipping & Returns */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full px-4 lg:px-5 py-3 lg:py-3.5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-[#141414] hover:bg-[#faf8f5] transition-colors cursor-pointer"
                >
                  <span>DELIVERY & 7-DAY DOORSTEP EXCHANGE</span>
                  <ChevronDown className={`w-4 h-4 text-[#747878] transition-transform duration-200 ${openAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="px-4 lg:px-5 pb-4 text-xs sm:text-sm text-[#747878] leading-relaxed space-y-1.5 animate-fadeIn">
                    <p>• <strong>Dispatch:</strong> Packed & shipped within 24 working hours from Mumbai.</p>
                    <p>• <strong>Transit:</strong> Express insured courier delivery (2–4 business days with live doorstep tracking).</p>
                    <p>• <strong>Exchanges:</strong> 7-day hassle-free doorstep pickup exchange service.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Complete The Look (Related Products) - Expansive Full Width Grid */}
        <div className="mt-10 sm:mt-14 border-t border-[#eae5dc] pt-6 sm:pt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#8c7138] block leading-none mb-1">
                CURATED PAIRINGS
              </span>
              <h2 className="font-sans text-lg sm:text-xl font-bold text-[#141414] tracking-tight">
                Complete The Look
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {finalRelated.map((rel) => (
              <div
                key={rel.id}
                className="bg-white border border-[#eae5dc] rounded-xl lg:rounded-2xl flex flex-col justify-between overflow-hidden shadow-xs hover:border-[#8c7138]/50 hover:shadow-md transition-all duration-200 group"
              >
                {/* 1:1 Compact Image */}
                <div
                  onClick={() => onSelectProduct(rel)}
                  className="aspect-square w-full bg-[#f8f6f2] cursor-pointer relative overflow-hidden"
                >
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 bg-[#141414] text-[#fed488] text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded uppercase shadow-xs">
                    SAVE {rel.savePercent}%
                  </span>
                </div>

                {/* Meta */}
                <div className="p-3 lg:p-4 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8c7138] block leading-none mb-1 truncate">
                      {rel.category} • 316L Steel
                    </span>
                    <h4
                      onClick={() => onSelectProduct(rel)}
                      className="text-xs sm:text-sm font-semibold text-[#141414] truncate cursor-pointer hover:text-[#8c7138] transition-colors leading-tight"
                      title={rel.name}
                    >
                      {rel.name}
                    </h4>

                    <div className="flex items-center justify-between gap-1 mt-2 pt-2 border-t border-[#f4efea]">
                      <span className="font-bold text-xs sm:text-sm lg:text-base text-[#141414]">
                        ₹{rel.price}
                      </span>
                      <span className="text-[10px] sm:text-xs text-[#a3a3a3] line-through">
                        ₹{rel.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddToCart(rel)}
                    className="w-full mt-3 bg-[#9e7144] hover:bg-[#865d34] text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
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
            onClick={() => onAddToCart(product, quantity, selectedVariant?.name, selectedVariant?.image)}
            className="flex-1 py-2 rounded-md bg-[#9e7144] hover:bg-[#865d34] text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            onClick={() => onBuyNow(product, quantity, selectedVariant?.name, selectedVariant?.image)}
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
