import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User } from 'lucide-react';
import { Logo } from './Logo';
import { ActiveScreen } from '../types';
import { UserProfile } from '../services/userService';

interface HeaderProps {
  cartCount: number;
  cartTotal?: number;
  wishlistCount?: number;
  onOpenCart: () => void;
  onOpenWishlist?: () => void;
  onOpenAccount?: () => void;
  onLoginClick?: () => void;
  userProfile?: UserProfile | null;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  activeTab?: string;
  onNavigateTab?: (tab: any) => void;
  activeScreen?: ActiveScreen;
  onToggleScreen?: (screen: ActiveScreen) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  topMarqueeItems?: any[];
  deviceMode?: string;
  onToggleDeviceMode?: () => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'categories', label: 'Categories' },
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
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  onLoginClick,
  userProfile,
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
      {/* Main Navigation Bar */}
      <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-8 lg:px-14 py-1.5 sm:py-2.5 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <button
            onClick={() => {
              onSelectCategory('HOME');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-left focus:outline-none cursor-pointer"
          >
            <Logo className="h-7 sm:h-9 w-auto" />
          </button>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wide">
          {NAV_ITEMS.map((item) => {
            const isActive =
              (item.id === 'home' && activeTab === 'home' && (activeCategory === 'ALL' || activeCategory === 'HOME' || activeCategory === 'NEW ARRIVALS')) ||
              (item.id === 'categories' && activeTab === 'all-categories') ||
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
                  } else if (item.id === 'categories') {
                    if (onNavigateTab) onNavigateTab('all-categories');
                    else onSelectCategory('ALL_CATEGORIES');
                  } else if (item.id === 'shop') {
                    onSelectCategory('SHOP');
                  } else if (item.id === 'offers') {
                    if (onNavigateTab) onNavigateTab('offers');
                    else onSelectCategory('OFFERS');
                  } else {
                    onSelectCategory(item.label);
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

        {/* Right: Actions (Search, Wishlist, Account, Cart with badge) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className="text-[#2a2a2a] hover:text-[#9e7144] transition-colors cursor-pointer"
            title="Search"
          >
            <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onOpenWishlist}
            className="text-[#2a2a2a] hover:text-[#9e7144] transition-colors relative cursor-pointer"
            title="Wishlist"
          >
            <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#9e7144] text-white text-[9px] sm:text-[10px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Bag */}
          <button
            onClick={onOpenCart}
            className="text-[#2a2a2a] hover:text-[#9e7144] transition-colors relative cursor-pointer"
            title="Bag"
          >
            <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            <span className="absolute -top-1 -right-1.5 bg-[#9e7144] text-white text-[9px] sm:text-[10px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Dedicated Account Button (Icon only - Sabse last me) */}
          <button
            onClick={() => {
              if (userProfile) {
                if (onOpenAccount) onOpenAccount();
                else if (onNavigateTab) onNavigateTab('account');
              } else {
                if (onLoginClick) onLoginClick();
              }
            }}
            className={`flex items-center gap-1 text-[#2a2a2a] hover:text-[#9e7144] transition-colors relative cursor-pointer ${
              activeTab === 'account' ? 'text-[#9e7144]' : ''
            }`}
            title="Account"
          >
            {userProfile ? (
              <span className="hidden sm:inline-block text-xs font-bold mr-1 truncate max-w-[80px]">
                {userProfile.name.split(' ')[0]}
              </span>
            ) : null}
            <User className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
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

    </header>
  );
};
