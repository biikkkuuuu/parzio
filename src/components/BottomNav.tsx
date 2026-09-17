import React from 'react';
import { Home, Sparkles, ShoppingBag, Truck, User } from 'lucide-react';

export type TabType = 'home' | 'sale' | 'offers' | 'category' | 'track' | 'exchange' | 'account' | 'wishlist';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenProducts?: () => void;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  cartCount = 0,
  onOpenCart,
  onOpenProducts,
  className = ''
}) => {
  return (
    <nav
      id="mobile-bottom-bar"
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eae5dc] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden select-none ${className}`}
    >
      <div className="w-full max-w-md mx-auto flex items-center justify-around px-1 h-12">
        {/* Home */}
        <button
          onClick={() => {
            onTabChange('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors active:scale-95 cursor-pointer ${
            activeTab === 'home' ? 'text-[#9e7144] font-bold' : 'text-[#747878]'
          }`}
        >
          <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-[#9e7144]' : 'text-[#747878]'}`} />
          <span className="text-[10px] mt-0.5 leading-none">Home</span>
        </button>

        {/* Sales / Products */}
        <button
          onClick={() => {
            onTabChange('sale');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors active:scale-95 cursor-pointer ${
            activeTab === 'sale' ? 'text-[#9e7144] font-bold' : 'text-[#747878]'
          }`}
        >
          <div className="relative">
            <Sparkles className={`w-4 h-4 ${activeTab === 'sale' ? 'text-[#9e7144]' : 'text-[#747878]'}`} />
            <span className="absolute -top-1 -right-2 px-1 rounded-full bg-red-600 text-white text-[7px] font-extrabold uppercase leading-tight">
              HOT
            </span>
          </div>
          <span className="text-[10px] mt-0.5 leading-none">Sales</span>
        </button>

        {/* Cart Bag */}
        <button
          onClick={() => {
            if (onOpenCart) onOpenCart();
          }}
          className="flex-1 flex flex-col items-center justify-center py-1 relative transition-colors active:scale-95 cursor-pointer text-[#747878]"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-[#747878]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-3.5 h-3.5 px-1 rounded-full bg-[#9e7144] text-white text-[8px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 leading-none font-medium text-[#141414]">Bag</span>
        </button>

        {/* Orders / Track */}
        <button
          onClick={() => {
            onTabChange('track');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors active:scale-95 cursor-pointer ${
            activeTab === 'track' ? 'text-[#9e7144] font-bold' : 'text-[#747878]'
          }`}
        >
          <Truck className={`w-4 h-4 ${activeTab === 'track' ? 'text-[#9e7144]' : 'text-[#747878]'}`} />
          <span className="text-[10px] mt-0.5 leading-none">Orders</span>
        </button>

        {/* Account */}
        <button
          onClick={() => {
            onTabChange('account');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors active:scale-95 cursor-pointer ${
            activeTab === 'account' ? 'text-[#9e7144] font-bold' : 'text-[#747878]'
          }`}
        >
          <User className={`w-4 h-4 ${activeTab === 'account' ? 'text-[#9e7144]' : 'text-[#747878]'}`} />
          <span className="text-[10px] mt-0.5 leading-none">Account</span>
        </button>
      </div>
    </nav>
  );
};
