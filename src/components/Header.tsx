import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, ShieldCheck, Droplet, Truck, LayoutDashboard, Store, Smartphone, Monitor } from 'lucide-react';
import { Logo } from './Logo';
import { ActiveScreen, DeviceMode, MarqueeItem } from '../types';
import { MarqueeBar } from './MarqueeBar';
import { INITIAL_TOP_MARQUEE } from '../data/bannerData';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  activeScreen: ActiveScreen;
  onToggleScreen: (screen: ActiveScreen) => void;
  deviceMode: DeviceMode;
  onToggleDeviceMode: (mode: DeviceMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  topMarqueeItems?: MarqueeItem[];
}

const CATEGORIES = [
  'NEW ARRIVALS',
  'NECKLACES',
  'EARRINGS',
  'RINGS',
  'BRACELETS',
  'ANKLETS',
  'MINIMALIST',
  'BEST SELLERS'
];

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  activeCategory,
  onSelectCategory,
  activeScreen,
  onToggleScreen,
  deviceMode,
  onToggleDeviceMode,
  searchQuery,
  onSearchChange,
  topMarqueeItems = INITIAL_TOP_MARQUEE
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#eae5dc]">
      {/* Top Multi-Marquee Bar with Right-to-Left Continuous Movement */}
      <div className="bg-[#141414] text-[#fed488] flex items-center justify-between overflow-hidden border-b border-[#2e3131]">
        <div className="flex-1 overflow-hidden">
          <MarqueeBar items={topMarqueeItems} variant="dark" />
        </div>

        {/* Screen / Perspective Switcher */}
        <div className="flex items-center gap-2 px-3 py-1 bg-[#141414] border-l border-[#2e3131] text-[11px] z-10 flex-shrink-0">
          <div className="flex bg-[#222424] border border-[#2e3131] rounded-full p-0.5">
            <button
              onClick={() => onToggleScreen('storefront')}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-all ${
                activeScreen === 'storefront'
                  ? 'bg-[#8c7138] text-white font-bold shadow-xs'
                  : 'text-[#c4c7c7] hover:text-white'
              }`}
              title="Customer Storefront"
            >
              <Store className="w-3 h-3" />
              <span className="hidden sm:inline">Store</span>
            </button>
            <button
              onClick={() => onToggleScreen('atelier-ops')}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-all ${
                activeScreen === 'atelier-ops'
                  ? 'bg-[#8c7138] text-white font-bold shadow-xs'
                  : 'text-[#c4c7c7] hover:text-white'
              }`}
              title="Admin Panel"
            >
              <LayoutDashboard className="w-3 h-3" />
              <span className="hidden sm:inline">Admin</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          </div>

          {activeScreen === 'storefront' && (
            <div className="hidden sm:flex bg-[#222424] border border-[#2e3131] rounded-full p-0.5">
              <button
                onClick={() => onToggleDeviceMode('desktop')}
                className={`p-1 rounded-full transition-all ${
                  deviceMode === 'desktop' ? 'bg-[#8c7138] text-white' : 'text-[#c4c7c7] hover:text-white'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3 h-3" />
              </button>
              <button
                onClick={() => onToggleDeviceMode('mobile')}
                className={`p-1 rounded-full transition-all ${
                  deviceMode === 'mobile' ? 'bg-[#8c7138] text-white' : 'text-[#c4c7c7] hover:text-white'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onToggleScreen('storefront');
              onSelectCategory('NEW ARRIVALS');
            }}
            className="text-left focus:outline-none"
          >
            <Logo className="h-7 sm:h-9 w-auto" />
          </button>
        </div>

        {/* Center: Search & Value Badges */}
        <div className="flex-1 max-w-xl hidden md:flex flex-col gap-1.5">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search anti-tarnish necklaces, earrings, rings..."
              className="w-full bg-[#faf8f5] text-[#141414] pl-10 pr-4 py-2 rounded-full text-xs sm:text-sm border border-[#eae5dc] focus:border-[#8c7138] focus:outline-none focus:bg-white transition-all placeholder:text-[#747878]"
            />
            <Search className="w-4 h-4 text-[#747878] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#747878] font-bold px-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#8c7138]" /> 18K Gold Finish
            </span>
            <span className="flex items-center gap-1">
              <Droplet className="w-3 h-3 text-[#8c7138]" /> 100% Waterproof
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3 text-[#8c7138]" /> COD Available
            </span>
          </div>
        </div>

        {/* Right Actions: Search Mobile, Wishlist, Account, Cart */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className="md:hidden p-2 rounded-full text-[#141414] hover:bg-[#faf8f5] transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenWishlist}
            className="relative p-2 rounded-full text-[#141414] hover:bg-[#faf8f5] transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8c7138] text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onToggleScreen('atelier-ops')}
            className="p-2 rounded-full text-[#141414] hover:bg-[#faf8f5] transition-colors hidden sm:block"
            title="Account & Admin"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Cart Bag Pill */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#141414] text-white hover:bg-[#8c7138] transition-colors duration-200 group shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-[#fed488] group-hover:scale-105 transition-transform" />
            <span className="text-xs sm:text-sm font-bold tracking-tight">
              ₹{cartTotal.toLocaleString('en-IN')}
            </span>
            <span className="w-5 h-5 rounded-full bg-[#8c7138] text-white text-[11px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Expandable */}
      {isSearchExpanded && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search anti-tarnish necklaces, rings..."
              className="w-full bg-[#faf8f5] text-[#141414] pl-10 pr-4 py-2 rounded-full text-xs border border-[#eae5dc] focus:outline-none focus:bg-white"
              autoFocus
            />
            <Search className="w-4 h-4 text-[#747878] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Category Navigation Bar */}
      <nav className="border-t border-[#eae5dc] bg-white overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center sm:justify-start gap-4 sm:gap-8 py-2.5 whitespace-nowrap text-xs font-bold tracking-[0.06em] text-[#747878]">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`py-1 transition-all relative ${
                  isActive
                    ? 'text-[#8c7138] font-bold'
                    : 'hover:text-[#141414]'
                }`}
              >
                {cat}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8c7138] rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
