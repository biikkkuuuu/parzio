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
  Sparkles,
  MapPin,
  Clock,
  ThumbsUp,
  Award,
  Lock
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
  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<string | null>(null);
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'waterproof' | 'shipping' | 'care'>('details');

  // Scroll to absolute top of page whenever a product is selected
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setSelectedImageIndex(0);
    setQuantity(1);
    setDeliveryResult(null);
  }, [product.id]);

  // Simulated gallery images
  const galleryImages = [
    product.image,
    product.hoverImage || product.image,
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1611591475179-42cd3423e89d?auto=format&fit=crop&q=80&w=800'
  ];

  // Related products in same category or overall vault
  const relatedProducts = VAULT_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || Math.random() > 0.5)
  ).slice(0, 4);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length < 6) {
      setDeliveryResult('Please enter a valid 6-digit Pincode');
      return;
    }
    setCheckingPincode(true);
    setTimeout(() => {
      setCheckingPincode(false);
      // Generate estimated delivery date (2-3 days from today)
      const d = new Date();
      d.setDate(d.getDate() + 3);
      const formattedDate = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
      setDeliveryResult(`✅ Delivered by ${formattedDate} via Express Courier. Cash on Delivery Available.`);
    }, 600);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#141414] pb-24 md:pb-16 animate-fadeIn">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-[#eae5dc] sticky top-0 z-30 shadow-2xs">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#141414] hover:text-[#8c7138] transition-colors group focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Storefront</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#747878] font-medium">
            <span>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span>{product.category}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#8c7138] font-bold truncate max-w-xs">{product.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-bold text-[#747878] hover:text-[#141414] px-3 py-1.5 rounded-full border border-[#eae5dc] hover:bg-[#faf8f5] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Product Display Area */}
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            
            {/* Thumbnail Strip */}
            <div className="flex md:flex-col gap-3 overflow-x-auto no-scrollbar md:overflow-visible flex-shrink-0">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 relative ${
                    selectedImageIndex === idx
                      ? 'border-[#8c7138] ring-2 ring-[#8c7138]/20 scale-105 shadow-sm'
                      : 'border-[#eae5dc] opacity-70 hover:opacity-100 hover:border-[#8c7138]/50'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image Stage */}
            <div className="flex-1 relative rounded-3xl overflow-hidden bg-white border border-[#eae5dc] shadow-sm aspect-square max-h-[600px] group">
              <img
                src={galleryImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className="px-3 py-1 rounded-full bg-[#141414] text-[#fed488] text-xs font-bold uppercase tracking-wider shadow-sm">
                    {product.badge}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-bold tracking-wider shadow-sm flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Anti-Tarnish
                </span>
              </div>

              {/* Wishlist Floating Button */}
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-md text-[#141414] hover:text-[#8c7138] shadow-md transition-transform active:scale-90"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              {/* Waterproof Stamp */}
              <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold border border-white/10">
                <Droplet className="w-3.5 h-3.5 text-[#fed488]" />
                Showerproof & Sweatproof
              </div>
            </div>
          </div>

          {/* Right Column: Buying Details & Specs (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Title & Ratings */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#8c7138] uppercase tracking-wider mb-1">
                <span>PARZIO ATELIER</span>
                <span>•</span>
                <span>{product.category}</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#141414] tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mt-2.5">
                <div className="flex items-center gap-1 bg-[#141414] text-white px-2.5 py-0.5 rounded-md text-xs font-bold">
                  <span>{product.rating}</span>
                  <Star className="w-3 h-3 fill-[#fed488] text-[#fed488]" />
                </div>
                <span className="text-xs text-[#747878] font-medium">
                  Based on {product.reviewsCount} Verified Customer Reviews
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#eae5dc] shadow-2xs flex flex-col gap-2">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-extrabold text-[#141414]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-lg text-[#747878] line-through font-medium">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#8c7138]/15 text-[#8c7138] text-xs font-extrabold tracking-wide uppercase">
                  SAVE {product.savePercent}%
                </span>
              </div>
              <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Inclusive of all taxes + Free Express Delivery Across India
              </p>
            </div>

            {/* Guarantees Quad */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white border border-[#eae5dc] flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#8c7138]/10 text-[#8c7138]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#141414]">316L Stainless Steel</h4>
                  <p className="text-[10px] text-[#747878]">100% Anti-Tarnish Base</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#eae5dc] flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#8c7138]/10 text-[#8c7138]">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#141414]">100% Waterproof</h4>
                  <p className="text-[10px] text-[#747878]">Shower & Gym Safe</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#eae5dc] flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#8c7138]/10 text-[#8c7138]">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#141414]">COD Available</h4>
                  <p className="text-[10px] text-[#747878]">Pay at your doorstep</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#eae5dc] flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#8c7138]/10 text-[#8c7138]">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#141414]">7-Day Exchange</h4>
                  <p className="text-[10px] text-[#747878]">Easy doorstep pickup</p>
                </div>
              </div>
            </div>

            {/* Quantity & Buy Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-[#141414] uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-[#eae5dc] bg-white rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-sm font-bold text-[#141414] hover:bg-[#faf8f5] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-[#141414] min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 text-sm font-bold text-[#141414] hover:bg-[#faf8f5] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  onClick={() => onAddToCart(product, quantity)}
                  className="w-full py-3.5 px-4 rounded-xl border-2 border-[#141414] bg-white text-[#141414] hover:bg-[#141414] hover:text-white transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-xs active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO BAG</span>
                </button>

                <button
                  onClick={() => onBuyNow(product, quantity)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#8c7138] hover:bg-[#6e582a] text-white transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98"
                >
                  <Sparkles className="w-4 h-4 fill-white text-white" />
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>

            {/* Pincode Delivery Checker */}
            <div className="p-4 rounded-2xl bg-white border border-[#eae5dc] flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#141414]">
                <MapPin className="w-4 h-4 text-[#8c7138]" />
                <span>Check Delivery & Cash on Delivery Date</span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode (e.g. 110001)"
                  className="flex-1 bg-[#faf8f5] text-xs px-3.5 py-2.5 rounded-xl border border-[#eae5dc] focus:outline-none focus:border-[#8c7138]"
                />
                <button
                  type="submit"
                  disabled={checkingPincode}
                  className="px-4 py-2.5 rounded-xl bg-[#141414] text-white text-xs font-bold hover:bg-[#8c7138] transition-colors disabled:opacity-50"
                >
                  {checkingPincode ? 'Checking...' : 'Check'}
                </button>
              </form>

              {deliveryResult && (
                <p className="text-xs font-bold text-[#141414] mt-1 bg-[#faf8f5] p-2.5 rounded-xl border border-[#eae5dc]">
                  {deliveryResult}
                </p>
              )}
            </div>

            {/* Product Specifications & Care Tabs */}
            <div className="border border-[#eae5dc] rounded-2xl overflow-hidden bg-white">
              <div className="flex border-b border-[#eae5dc] text-xs font-bold">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 py-3 px-2 text-center transition-colors border-b-2 ${
                    activeTab === 'details'
                      ? 'border-[#8c7138] text-[#8c7138] bg-[#faf8f5]'
                      : 'border-transparent text-[#747878] hover:text-[#141414]'
                  }`}
                >
                  Material
                </button>
                <button
                  onClick={() => setActiveTab('waterproof')}
                  className={`flex-1 py-3 px-2 text-center transition-colors border-b-2 ${
                    activeTab === 'waterproof'
                      ? 'border-[#8c7138] text-[#8c7138] bg-[#faf8f5]'
                      : 'border-transparent text-[#747878] hover:text-[#141414]'
                  }`}
                >
                  Waterproof
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`flex-1 py-3 px-2 text-center transition-colors border-b-2 ${
                    activeTab === 'care'
                      ? 'border-[#8c7138] text-[#8c7138] bg-[#faf8f5]'
                      : 'border-transparent text-[#747878] hover:text-[#141414]'
                  }`}
                >
                  Care
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`flex-1 py-3 px-2 text-center transition-colors border-b-2 ${
                    activeTab === 'shipping'
                      ? 'border-[#8c7138] text-[#8c7138] bg-[#faf8f5]'
                      : 'border-transparent text-[#747878] hover:text-[#141414]'
                  }`}
                >
                  Shipping
                </button>
              </div>

              <div className="p-4 text-xs text-[#141414] leading-relaxed">
                {activeTab === 'details' && (
                  <div className="space-y-2">
                    <p><strong>Base Metal:</strong> 316L Surgical Grade Stainless Steel (100% Rust-Proof, Nickel & Lead Free)</p>
                    <p><strong>Finish:</strong> Premium Anti-Tarnish PVD Vacuum Coating on Surgical Steel</p>
                    <p><strong>SKU:</strong> {product.sku}</p>
                    <p><strong>Skin Safety:</strong> 100% Hypoallergenic, zero skin discoloration, perfect for sensitive skin.</p>
                  </div>
                )}
                {activeTab === 'waterproof' && (
                  <div className="space-y-2">
                    <p>✨ <strong>Lifetime Anti-Tarnish Guarantee:</strong> Will never turn green or black.</p>
                    <p>🚿 <strong>Shower & Bath Safe:</strong> Wear directly under warm water, soap, and shampoo.</p>
                    <p>🏊 <strong>Pool & Sweat Proof:</strong> Resistant to saltwater and intense workout sweat.</p>
                  </div>
                )}
                {activeTab === 'care' && (
                  <div className="space-y-2">
                    <p>• Clean periodically with gentle lukewarm water and micro-fiber drying cloth.</p>
                    <p>• Store in the complimentary PARZIO anti-tarnish velvet pouch when not in use.</p>
                    <p>• Avoid harsh industrial solvents or chemical dips.</p>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p>🚀 <strong>Dispatch:</strong> Orders are packed and shipped within 24 working hours.</p>
                    <p>📦 <strong>Delivery:</strong> Express Air Shipping delivers in 2-4 business days.</p>
                    <p>🔄 <strong>Exchanges:</strong> Easy 7-day hassle-free doorstep pickup exchange service.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Complete The Look / Related Products Section */}
        <div className="mt-16 sm:mt-20 border-t border-[#eae5dc] pt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#141414] tracking-tight">
                COMPLETE THE LOOK
              </h2>
              <p className="text-xs text-[#747878] font-medium mt-1">
                Handpicked matching anti-tarnish pieces to pair with {product.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProduct(rel)}
                className="group bg-white rounded-2xl p-3 border border-[#eae5dc] hover:border-[#8c7138] transition-all cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#faf8f5] mb-3">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#141414] text-[#fed488] text-[10px] font-bold">
                    SAVE {rel.savePercent}%
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#141414] group-hover:text-[#8c7138] transition-colors truncate">
                    {rel.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-extrabold text-[#141414]">
                      ₹{rel.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#747878] line-through">
                      ₹{rel.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(rel);
                  }}
                  className="mt-3 w-full py-2 rounded-xl bg-[#faf8f5] hover:bg-[#8c7138] hover:text-white text-[#141414] text-xs font-bold border border-[#eae5dc] transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>ADD TO BAG</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Buy Bar on Phone Screens */}
      <div className="fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eae5dc] p-3 md:hidden shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-[#747878] font-bold block leading-none">TOTAL PRICE</span>
          <span className="font-display text-lg font-extrabold text-[#141414]">
            ₹{(product.price * quantity).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <button
            onClick={() => onAddToCart(product, quantity)}
            className="flex-1 py-3 rounded-xl bg-white text-[#141414] border border-[#141414] font-bold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ADD TO BAG</span>
          </button>

          <button
            onClick={() => onBuyNow(product, quantity)}
            className="flex-1 py-3 rounded-xl bg-[#8c7138] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
            <span>BUY NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
