import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  Sparkles,
  Zap
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
  const [openAccordion, setOpenAccordion] = useState<string | null>('materials');

  // Scroll to absolute top whenever a product is selected
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [product.id]);

  // Curated gallery images
  const galleryImages = [
    product.image,
    ...(product.hoverImage && product.hoverImage !== product.image ? [product.hoverImage] : []),
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1611591475179-42cd3423e89d?auto=format&fit=crop&q=80&w=800'
  ];

  // Related products from vault
  const relatedProducts = VAULT_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  // Fallback if less than 4 in same category
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

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#141414] pb-24 md:pb-16 font-sans">
      {/* Top Breadcrumb Navigation */}
      <div className="bg-white border-b border-[#eae5dc] sticky top-0 z-30">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-[#141414] hover:text-[#8c7138] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Collection</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#747878] font-medium">
            <span>Home</span>
            <ChevronRight className="w-3 h-3 text-[#a3a3a3]" />
            <span className="capitalize">{product.category}</span>
            <ChevronRight className="w-3 h-3 text-[#a3a3a3]" />
            <span className="text-[#141414] font-semibold truncate max-w-[200px]">{product.name}</span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-bold text-[#747878] hover:text-[#141414] px-3 py-1.5 rounded-full border border-[#eae5dc] hover:bg-[#faf8f5] transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image Gallery (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            {/* Main Image Stage */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-[#eae5dc] shadow-xs group">
              <img
                src={galleryImages[selectedImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Minimal Clean Badge (Top-Left) */}
              {product.badge && (
                <span className="absolute top-3 left-3 bg-[#141414] text-[#fed488] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
                  {product.badge}
                </span>
              )}

              {/* Wishlist Button (Top-Right) */}
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#141414] hover:text-rose-500 shadow-xs transition-transform active:scale-90 cursor-pointer"
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Carousel */}
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-[#8c7138] ring-2 ring-[#8c7138]/20 shadow-xs'
                      : 'border-[#eae5dc] opacity-75 hover:opacity-100 hover:border-[#8c7138]/50'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Buying Information (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            
            {/* Category & Title */}
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#8c7138] block mb-1">
                PARZIO DEMI-FINE • {product.category.toUpperCase()}
              </span>
              <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#141414] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Star Ratings */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-[#141414] text-white px-2 py-0.5 rounded-md text-[11px] font-bold">
                  <span>{product.rating}</span>
                  <Star className="w-3 h-3 fill-[#fed488] text-[#fed488]" />
                </div>
                <span className="text-xs text-[#747878] font-medium">
                  {product.reviewsCount} Verified Customer Reviews
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-white border border-[#eae5dc] shadow-xs">
              <div className="flex items-baseline gap-2.5">
                <span className="font-sans text-3xl font-extrabold text-[#141414] tracking-tight">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-base text-[#a3a3a3] line-through font-normal">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold tracking-wider uppercase">
                  SAVE {product.savePercent}%
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-1.5">
                <Check className="w-3.5 h-3.5" />
                Inclusive of all taxes • Free Express Courier Delivery Across India
              </p>
            </div>

            {/* Quantity & CTAs Area */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#141414] uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#eae5dc] bg-white rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-1.5 text-sm font-bold text-[#747878] hover:text-[#141414] hover:bg-[#f3efe9] transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-[#141414] min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 py-1.5 text-sm font-bold text-[#747878] hover:text-[#141414] hover:bg-[#f3efe9] transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => onAddToCart(product, quantity)}
                  className="py-3 px-4 rounded-xl border border-[#141414] bg-[#141414] text-white hover:bg-[#8c7138] hover:border-[#8c7138] transition-all font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO BAG</span>
                </button>

                <button
                  type="button"
                  onClick={() => onBuyNow(product, quantity)}
                  className="py-3 px-4 rounded-xl bg-[#8c7138] hover:bg-[#6e582a] text-white transition-all font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4 fill-white text-white" />
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>

            {/* Clean Trust Badges (Horizontal 4-Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-2.5 rounded-xl bg-white border border-[#eae5dc] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8c7138] shrink-0" />
                <div className="leading-none">
                  <p className="text-[11px] font-bold text-[#141414]">Anti-Tarnish</p>
                  <p className="text-[9px] text-[#747878] mt-0.5">316L Steel</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#eae5dc] flex items-center gap-2">
                <Droplet className="w-4 h-4 text-[#8c7138] shrink-0" />
                <div className="leading-none">
                  <p className="text-[11px] font-bold text-[#141414]">Waterproof</p>
                  <p className="text-[9px] text-[#747878] mt-0.5">Shower & Pool</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#eae5dc] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#8c7138] shrink-0" />
                <div className="leading-none">
                  <p className="text-[11px] font-bold text-[#141414]">COD Available</p>
                  <p className="text-[9px] text-[#747878] mt-0.5">Pan-India</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#eae5dc] flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#8c7138] shrink-0" />
                <div className="leading-none">
                  <p className="text-[11px] font-bold text-[#141414]">7-Day Return</p>
                  <p className="text-[9px] text-[#747878] mt-0.5">Doorstep pickup</p>
                </div>
              </div>
            </div>

            {/* Clean Collapsible Accordions */}
            <div className="border border-[#eae5dc] rounded-2xl overflow-hidden bg-white divide-y divide-[#eae5dc] mt-2">
              {/* Accordion 1: Description */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('description')}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[#141414] hover:bg-[#faf8f5] transition-colors cursor-pointer"
                >
                  <span>PRODUCT DETAILS & DESCRIPTION</span>
                  <ChevronDown className={`w-4 h-4 text-[#747878] transition-transform duration-200 ${openAccordion === 'description' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'description' && (
                  <div className="px-4 pb-4 text-xs text-[#747878] leading-relaxed">
                    <p>{product.description}</p>
                    <p className="mt-2 text-[#141414] font-medium">
                      Designed for modern daily wear — pair with your casual daytime wardrobe or formal evening looks with effortless luxury.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Materials & Specs */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('materials')}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[#141414] hover:bg-[#faf8f5] transition-colors cursor-pointer"
                >
                  <span>MATERIAL & SPECIFICATIONS</span>
                  <ChevronDown className={`w-4 h-4 text-[#747878] transition-transform duration-200 ${openAccordion === 'materials' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'materials' && (
                  <div className="px-4 pb-4 text-xs text-[#747878] leading-relaxed space-y-1.5">
                    <p><strong className="text-[#141414]">Base Metal:</strong> {product.material || '316L Surgical Grade Stainless Steel'}</p>
                    <p><strong className="text-[#141414]">Finish:</strong> 18K Real Gold PVD Vacuum Plating (Anti-Tarnish)</p>
                    <p><strong className="text-[#141414]">SKU:</strong> <span className="font-mono text-[11px]">{product.sku}</span></p>
                    <p><strong className="text-[#141414]">Skin Safety:</strong> 100% Hypoallergenic, Nickel-free & Lead-free (No green marks or skin irritation)</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Waterproof & Care */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('waterproof')}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[#141414] hover:bg-[#faf8f5] transition-colors cursor-pointer"
                >
                  <span>WATERPROOF & CARE GUIDE</span>
                  <ChevronDown className={`w-4 h-4 text-[#747878] transition-transform duration-200 ${openAccordion === 'waterproof' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'waterproof' && (
                  <div className="px-4 pb-4 text-xs text-[#747878] leading-relaxed space-y-1.5">
                    <p>• <strong>100% Waterproof:</strong> Wear in shower, bathtub, ocean, swimming pool, and during intense workouts.</p>
                    <p>• <strong>Care:</strong> Rinse with clean lukewarm water if exposed to perfume or chlorine; dry with a soft cloth.</p>
                    <p>• <strong>Storage:</strong> Keep in your PARZIO pouch when traveling to prevent scratches.</p>
                  </div>
                )}
              </div>

              {/* Accordion 4: Shipping & Returns */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[#141414] hover:bg-[#faf8f5] transition-colors cursor-pointer"
                >
                  <span>SHIPPING & EASY EXCHANGES</span>
                  <ChevronDown className={`w-4 h-4 text-[#747878] transition-transform duration-200 ${openAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="px-4 pb-4 text-xs text-[#747878] leading-relaxed space-y-1.5">
                    <p>• <strong>Dispatch:</strong> Shipped within 24 business hours from our Mumbai atelier.</p>
                    <p>• <strong>Transit Time:</strong> Delivers in 2–4 business days via BlueDart / Delhivery Express.</p>
                    <p>• <strong>Exchanges:</strong> 7-day hassle-free doorstep pickup exchange if not satisfied.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Complete The Look (Related Products) */}
        <div className="mt-16 sm:mt-20 border-t border-[#eae5dc] pt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c7138] block mb-0.5">
                CURATED PAIRINGS
              </span>
              <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#141414] tracking-tight">
                Complete The Look
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {finalRelated.map((rel) => {
              const isRelWishlisted = false;
              return (
                <div
                  key={rel.id}
                  className="bg-white border border-[#eae5dc] rounded-2xl flex flex-col justify-between overflow-hidden shadow-xs hover:border-[#8c7138]/50 hover:shadow-md transition-all duration-200"
                >
                  {/* 1:1 Image */}
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
                    <span className="absolute top-2 left-2 bg-[#141414] text-[#fed488] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                      SAVE {rel.savePercent}%
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7138] block mb-0.5 truncate">
                        {rel.category} • 316L Steel
                      </span>
                      <h4
                        onClick={() => onSelectProduct(rel)}
                        className="text-[12px] sm:text-[13px] font-semibold text-[#141414] truncate cursor-pointer hover:text-[#8c7138] transition-colors leading-tight"
                        title={rel.name}
                      >
                        {rel.name}
                      </h4>

                      <div className="flex items-center justify-between gap-1 mt-2 pt-1.5 border-t border-[#f4efea]">
                        <span className="font-bold text-sm text-[#141414]">
                          ₹{rel.price}
                        </span>
                        <span className="text-[11px] text-[#a3a3a3] line-through">
                          ₹{rel.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart(rel)}
                      className="w-full mt-2.5 py-1.5 px-3 rounded-full bg-[#141414] hover:bg-[#8c7138] active:scale-[0.98] transition-all text-xs font-bold text-white text-center shadow-xs cursor-pointer"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clean Mobile Sticky Action Bar at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eae5dc] px-4 py-2.5 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3 pb-safe">
        <div>
          <span className="text-[9px] text-[#747878] font-bold uppercase block leading-none">TOTAL</span>
          <span className="font-sans text-base font-extrabold text-[#141414]">
            ₹{(product.price * quantity).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <button
            type="button"
            onClick={() => onAddToCart(product, quantity)}
            className="flex-1 py-2.5 rounded-xl bg-[#141414] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-xs active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ADD</span>
          </button>

          <button
            type="button"
            onClick={() => onBuyNow(product, quantity)}
            className="flex-1 py-2.5 rounded-xl bg-[#8c7138] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-xs active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
            <span>BUY NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
