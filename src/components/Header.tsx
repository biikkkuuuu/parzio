import React, { useState } from 'react';
import { Search, ShoppingBag, User, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { Logo } from './Logo';
import { ActiveScreen } from '../types';

interface HeaderProps {
  cartCount: number;
  cartTotal?: number;
  wishlistCount?: number;
  onOpenCart: () => void;
  onOpenWishlist?: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  activeTab?: string;
  onNavigateTab?: (tab: any) => void;
  activeScreen?: ActiveScreen;
  onToggleScreen?: (screen: ActiveScreen) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  topMarqueeItems?: any[];
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'shop', label: 'Shop' },
  { id: 'bangles', label: 'Bangles' },
  { id: 'mangalsutra', label: 'Mangalsutra' },
  { id: 'jewellery-sets', label: 'Jewellery Sets' },
  { id: 'perfume', label: 'Perfume' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'offers', label: 'Offers' },
];

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  activeCategory,
  onSelectCategory,
  activeTab = 'home',
  onNavigateTab,
  onToggleScreen,
  searchQuery,
  onSearchChange,
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#1b1714] text-[#fff] text-[11px] sm:text-xs py-1.5 px-4 sm:px-8 lg:px-14 flex items-center justify-between font-sans">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="text-[#c5a059]">★</span>
          <span className="text-gray-200 tracking-wide font-normal">
            Free Delivery on Orders Above ₹499 <span className="text-gray-500 mx-1">|</span> COD Available <span className="text-gray-500 mx-1">|</span> Easy Returns
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-gray-300 text-xs">
          <span className="text-gray-300 text-[11px] font-medium">Follow Us</span>
          <div className="flex items-center gap-2 text-gray-300">
            <a href="https://instagram.com/parzio.in" target="_blank" rel="noreferrer" className="w-5 h-5 rounded-full bg-white/10 hover:bg-[#c5a059] flex items-center justify-center transition-colors text-white" title="Instagram">
              <Instagram className="w-3 h-3" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-5 h-5 rounded-full bg-white/10 hover:bg-[#c5a059] flex items-center justify-center transition-colors text-white" title="Facebook">
              <Facebook className="w-3 h-3" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-5 h-5 rounded-full bg-white/10 hover:bg-[#c5a059] flex items-center justify-center transition-colors text-white" title="Twitter">
              <Twitter className="w-3 h-3" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-5 h-5 rounded-full bg-white/10 hover:bg-[#c5a059] flex items-center justify-center transition-colors text-white" title="YouTube">
              <Youtube className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <button
            onClick={() => {
              onSelectCategory('HOME');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-left focus:outline-none cursor-pointer"
          >
            <Logo className="h-8 sm:h-10 w-auto" />
          </button>
        </div>

        {/* Center: Navigation Links matching screenshot */}
        <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wide">
          {NAV_ITEMS.map((item) => {
            const isActive =
              (item.id === 'home' && activeTab === 'home' && (activeCategory === 'ALL' || activeCategory === 'HOME' || activeCategory === 'NEW ARRIVALS')) ||
              (item.id === 'shop' && activeTab === 'home' && activeCategory === 'SHOP') ||
              (item.id === 'offers' && activeTab === 'offers') ||
              (activeTab === 'home' && (activeCategory.toLowerCase() === item.label.toLowerCase() || activeCategory.toLowerCase() === item.id));
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'home') {
                    if (onNavigateTab) onNavigateTab('home');
                    onSelectCategory('HOME');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (item.id === 'shop') {
                    if (onNavigateTab) onNavigateTab('home');
                    onSelectCategory('SHOP');
                    setTimeout(() => {
                      document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 80);
                  } else if (item.id === 'offers') {
                    if (onNavigateTab) onNavigateTab('offers');
                    else onSelectCategory('OFFERS');
                  } else {
                    if (onNavigateTab) onNavigateTab('home');
                    onSelectCategory(item.label);
                    setTimeout(() => {
                      document.getElementById('vault-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 80);
                  }
                }}
                className={`py-1 relative transition-colors cursor-pointer ${
                  isActive ? 'text-[#9e7144] font-semibold' : 'text-[#2a2a2a] hover:text-[#9e7144]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#9e7144]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (Search, User, Cart with '0' badge) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className="text-[#2a2a2a] hover:text-[#9e7144] transition-colors cursor-pointer"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => onToggleScreen && onToggleScreen('atelier-ops')}
            className="text-[#2a2a2a] hover:text-[#9e7144] transition-colors cursor-pointer"
            title="Account / Operations"
          >
            <User className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenCart}
            className="text-[#2a2a2a] hover:text-[#9e7144] transition-colors relative cursor-pointer"
            title="Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 bg-[#9e7144] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Search Input */}
      {isSearchExpanded && (
        <div className="px-4 sm:px-8 lg:px-14 pb-3 bg-white border-t border-[#f0ebe3] pt-2">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search bangles, mangalsutra, jewellery sets, perfume, beauty..."
              className="w-full bg-[#faf7f2] text-[#141414] pl-10 pr-4 py-2 rounded-full text-xs sm:text-sm border border-[#eae5dc] focus:outline-none focus:border-[#9e7144] focus:bg-white transition-all"
              autoFocus
            />
            <Search className="w-4 h-4 text-[#747878] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Mobile Nav Strip */}
      <nav className="lg:hidden border-t border-[#eae5dc] bg-[#faf8f5] overflow-x-auto no-scrollbar py-2 px-4 flex gap-4 text-xs font-medium whitespace-nowrap">
        {NAV_ITEMS.map((item) => {
          const isActive =
            (item.id === 'home' && activeTab === 'home' && (activeCategory === 'ALL' || activeCategory === 'HOME' || activeCategory === 'NEW ARRIVALS')) ||
            (item.id === 'shop' && activeTab === 'home' && activeCategory === 'SHOP') ||
            (item.id === 'offers' && activeTab === 'offers') ||
            (activeTab === 'home' && (activeCategory.toLowerCase() === item.label.toLowerCase() || activeCategory.toLowerCase() === item.id));
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'home') {
                  if (onNavigateTab) onNavigateTab('home');
                  onSelectCategory('HOME');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (item.id === 'shop') {
                  if (onNavigateTab) onNavigateTab('home');
                  onSelectCategory('SHOP');
                  setTimeout(() => {
                    document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 80);
                } else if (item.id === 'offers') {
                  if (onNavigateTab) onNavigateTab('offers');
                  else onSelectCategory('OFFERS');
                } else {
                  if (onNavigateTab) onNavigateTab('home');
                  onSelectCategory(item.label);
                  setTimeout(() => {
                    document.getElementById('vault-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 80);
                }
              }}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                isActive
                  ? 'bg-[#9e7144] text-white'
                  : 'text-[#555] hover:text-[#141414]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
