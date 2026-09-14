import React from 'react';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { Logo } from './Logo';
import { MarqueeItem } from '../types';
import { MarqueeBar } from './MarqueeBar';
import { INITIAL_TOP_MARQUEE } from '../data/bannerData';

interface MobileHeaderProps {
  onOpenDrawer: () => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  cartCount: number;
  topMarqueeItems?: MarqueeItem[];
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onOpenDrawer,
  onOpenSearch,
  onOpenCart,
  cartCount,
  topMarqueeItems = INITIAL_TOP_MARQUEE
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-[#eae5dc]">
      {/* Top Announcement Bar - Cash On Delivery Available ✨ */}
      <div className="w-full bg-[#faebd7]/80 border-b border-[#ebd7be] py-2 px-3 text-center">
        <p className="text-xs sm:text-[13px] font-medium text-[#141414] tracking-wide flex items-center justify-center gap-1.5">
          <span>Cash On Delivery Available</span>
          <span className="text-[#c59a45] text-sm">✨</span>
        </p>
      </div>

      {/* Main Header Navigation Row */}
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Left: Hamburger Menu */}
        <button
          onClick={onOpenDrawer}
          className="p-1 text-[#141414] hover:text-[#8c7138] transition-colors focus:outline-none"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Center: Crown Diamond Logo */}
        <div className="flex-1 flex justify-center">
          <Logo className="h-7 w-auto" />
        </div>

        {/* Right: Search & Cart with badge */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="p-1 text-[#141414] hover:text-[#8c7138] transition-colors"
            aria-label="Search Collection"
          >
            <Search className="w-5 h-5 stroke-[2]" />
          </button>

          <button
            onClick={onOpenCart}
            className="relative p-1 text-[#141414] hover:text-[#8c7138] transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#8c7138] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
