import React from 'react';
import { Home, Sparkles, ShoppingBag, Truck, User } from 'lucide-react';

export type TabType = 'home' | 'sale' | 'track' | 'exchange' | 'account';

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
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eae5dc] shadow-[0_-4px_15px_rgba(0,0,0,0.06)] md:hidden select-none pb-safe ${className}`}
    >
      <div className="w-full max-w-md mx-auto flex items-center justify-around py-1.5 px-2 h-13">
        {/* Home */}
        <button
          onClick={() => {
            onTabChange('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center transition-all active:scale-95 ${
            activeTab === 'home' ? 'text-[#8c7138] font-bold' : 'text-[#747878]'
          }`}
        >
          <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-[#8c7138] scale-110' : 'text-[#747878]'}`} />
          <span className="text-[9px] mt-0.5 font-medium tracking-tight">Home</span>
        </button>

        {/* Sales / Products */}
        <button
          onClick={() => {
            onTabChange('sale');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          className={`flex-1 flex flex-col items-center justify-center transition-all active:scale-95 ${
            activeTab === 'sale' ? 'text-[#8c7138] font-bold' : 'text-[#747878]'
          }`}
        >
          <div className="relative">
            <Sparkles className={`w-4 h-4 ${activeTab === 'sale' ? 'text-[#8c7138] scale-110' : 'text-[#747878]'}`} />
            <span className="absolute -top-1 -right-2 px-1 rounded-full bg-red-600 text-white text-[7px] font-extrabold uppercase">
              HOT
            </span>
          </div>
          <span className="text-[9px] mt-0.5 font-medium tracking-tight">Sales</span>
        </button>

        {/* Cart Bag */}
        <button
          onClick={() => {
            if (onOpenCart) onOpenCart();
          }}
          className="flex-1 flex flex-col items-center justify-center relative transition-all active:scale-95 text-[#747878]"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#141414] text-[#fed488] flex items-center justify-center shadow-md -mt-3.5 border-2 border-white">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-4 -right-1 w-3.5 h-3.5 rounded-full bg-[#8c7138] text-white text-[8px] font-bold flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] mt-0.5 font-bold tracking-tight text-[#141414]">Bag</span>
        </button>

        {/* Track Order */}
        <button
          onClick={() => {
            onTabChange('track');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center transition-all active:scale-95 ${
            activeTab === 'track' ? 'text-[#8c7138] font-bold' : 'text-[#747878]'
          }`}
        >
          <Truck className={`w-4 h-4 ${activeTab === 'track' ? 'text-[#8c7138] scale-110' : 'text-[#747878]'}`} />
          <span className="text-[9px] mt-0.5 font-medium tracking-tight">Track</span>
        </button>

        {/* Account */}
        <button
          onClick={() => {
            onTabChange('account');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center transition-all active:scale-95 ${
            activeTab === 'account' ? 'text-[#8c7138] font-bold' : 'text-[#747878]'
          }`}
        >
          <User className={`w-4 h-4 ${activeTab === 'account' ? 'text-[#8c7138] scale-110' : 'text-[#747878]'}`} />
          <span className="text-[9px] mt-0.5 font-medium tracking-tight">Account</span>
        </button>
      </div>
    </nav>
  );
};
