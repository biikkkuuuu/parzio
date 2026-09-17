import React from 'react';
import { Home, X, ChevronRight, Sparkles, ShieldCheck, Truck, RotateCcw, User, Phone, LayoutDashboard, Heart } from 'lucide-react';
import { Logo } from './Logo';
import { TabType } from './BottomNav';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (cat: string) => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenAtelierOps: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onNavigateTab,
  onOpenAtelierOps
}) => {
  if (!isOpen) return null;

  const categories = [
    'NEW ARRIVALS',
    'NECKLACES',
    'EARRINGS',
    'RINGS',
    'BRACELETS',
    'ANKLETS',
    'BEST SELLERS'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col justify-between border-r border-[#eae5dc] z-50">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#eae5dc] flex items-center justify-between bg-[#fbf9f6]">
          <button
            onClick={() => {
              onNavigateTab('home');
              onSelectCategory('HOME');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onClose();
            }}
            className="text-left"
          >
            <Logo className="h-6 w-auto" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#efeeeb] text-[#444748] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Home Link */}
          <button
            onClick={() => {
              onNavigateTab('home');
              onSelectCategory('HOME');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onClose();
            }}
            className="w-full p-3 rounded-2xl bg-[#faf8f5] hover:bg-[#f3efe9] border border-[#eae5dc] flex items-center gap-2.5 text-left transition-colors"
          >
            <Home className="w-4 h-4 text-[#8c7138]" />
            <span className="font-display font-bold text-sm text-[#141414]">
              Home
            </span>
          </button>

          {/* ₹99 Flash Highlight */}
          <button
            onClick={() => {
              onNavigateTab('sale');
              onClose();
            }}
            className="w-full p-3 rounded-2xl bg-[#fed488]/30 border border-[#fed488] flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8c7138]" />
              <span className="font-display font-bold text-sm text-[#141414]">
                The ₹99 Vault
              </span>
            </div>
            <span className="text-[10px] font-bold text-white bg-[#141414] px-2 py-0.5 rounded-full">
              LIVE
            </span>
          </button>

          {/* Categories List */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#747878] mb-2 px-1">
              Shop By Category
            </h4>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#faf8f5] text-xs font-semibold text-[#141414] transition-colors"
                >
                  <span>{cat}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#747878]" />
                </button>
              ))}
            </div>
          </div>

          {/* Direct Quick Services */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#747878] mb-2 px-1">
              Services &amp; Help
            </h4>
            <div className="space-y-1 text-xs font-medium text-[#444748]">
              <button
                onClick={() => {
                  onNavigateTab('track');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#faf8f5]"
              >
                <Truck className="w-4 h-4 text-[#8c7138]" />
                <span>Track Your Order</span>
              </button>
              <button
                onClick={() => {
                  onNavigateTab('exchange');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#faf8f5]"
              >
                <RotateCcw className="w-4 h-4 text-[#8c7138]" />
                <span>7-Day Easy Exchange</span>
              </button>
              <button
                onClick={() => {
                  onNavigateTab('wishlist');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#faf8f5]"
              >
                <Heart className="w-4 h-4 text-[#8c7138]" />
                <span>Wishlist</span>
              </button>
              <button
                onClick={() => {
                  onNavigateTab('account');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#faf8f5]"
              >
                <User className="w-4 h-4 text-[#8c7138]" />
                <span>My Profile &amp; Orders</span>
              </button>
            </div>
          </div>

          {/* Atelier Ops Hub (Fulfillment Switch) */}
          <div className="pt-2 border-t border-[#eae5dc]">
            <button
              onClick={() => {
                onOpenAtelierOps();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#141414] text-white hover:bg-[#8c7138] transition-colors text-xs font-bold"
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-[#fed488]" />
                <span>Atelier Ops Hub 01</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#eae5dc] bg-[#fbf9f6] text-[11px] text-[#747878] space-y-1.5">
          <p className="font-semibold text-[#141414]">PARZIO Demi-Fine Atelier</p>
          <p className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#8c7138]" /> WhatsApp: +91 98765 43210
          </p>
          <p className="text-[10px] text-[#9a9e9e]">100% Anti-Tarnish Guaranteed • ISO 9001:2015</p>
        </div>
      </div>
    </div>
  );
};
