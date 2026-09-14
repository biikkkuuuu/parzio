import React, { useState } from 'react';
import { Home, Sparkles, Search, ArrowLeft, ShoppingBag, ShieldCheck, Compass } from 'lucide-react';
import { Logo } from './Logo';

interface NotFoundProps {
  onBackToHome: () => void;
  onExploreVault: () => void;
  onSearch?: (query: string) => void;
}

export const NotFoundPage: React.FC<NotFoundProps> = ({
  onBackToHome,
  onExploreVault,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
      onBackToHome();
    } else {
      onExploreVault();
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#141414] flex flex-col justify-between selection:bg-[#fed488]/40">
      
      {/* Top Header Strip */}
      <header className="py-4 px-6 border-b border-[#eae5dc] bg-white/90 backdrop-blur-md flex items-center justify-between">
        <button onClick={onBackToHome} className="hover:opacity-85 transition-opacity">
          <Logo className="h-7 w-auto" />
        </button>
        <button
          onClick={onBackToHome}
          className="text-xs font-bold text-[#8c7138] hover:text-[#141414] transition-colors flex items-center gap-1 uppercase tracking-wider"
        >
          <Home className="w-4 h-4" />
          <span>Home Store</span>
        </button>
      </header>

      {/* Main 404 Visual Content */}
      <main className="max-w-2xl mx-auto px-4 py-12 sm:py-20 text-center flex flex-col items-center">
        
        {/* Luxury Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#f2ece1] border border-[#dfd7ca] text-[#8c7138] text-xs font-bold uppercase tracking-widest mb-6">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
          <span>VAULT ARCHIVE • ITEM UNAVAILABLE</span>
        </div>

        {/* 404 Big Display Number */}
        <div className="relative select-none mb-4">
          <h1 className="font-display text-7xl sm:text-9xl font-bold tracking-tighter text-[#141414]/90">
            4<span className="text-[#8c7138]">0</span>4
          </h1>
          <div className="absolute -top-2 -right-4 sm:-right-8">
            <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-[#8c7138] animate-pulse" />
          </div>
        </div>

        {/* Editorial Title & Description */}
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#141414] tracking-tight">
          This Demi-Fine Piece Has Moved
        </h2>
        <p className="text-xs sm:text-sm text-[#747878] mt-2.5 max-w-md leading-relaxed">
          The link you requested may have sold out, been renamed, or is currently undergoing an exclusive restock in our Mumbai Atelier.
        </p>

        {/* Interactive Search In Vault */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-md mt-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 18K necklaces, rings, pearls..."
              className="w-full pl-11 pr-24 py-3 rounded-full bg-white border border-[#eae5dc] text-xs font-semibold text-[#141414] placeholder:text-[#999] focus:outline-none focus:border-[#8c7138] shadow-sm"
            />
            <Search className="w-4 h-4 text-[#8c7138] absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              Search
            </button>
          </div>
        </form>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            onClick={onExploreVault}
            className="px-6 py-3 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-[#fed488]" />
            <span>Explore The ₹99 Vault</span>
          </button>

          <button
            onClick={onBackToHome}
            className="px-6 py-3 rounded-full bg-white border border-[#141414] text-[#141414] hover:bg-[#faf8f5] text-xs font-bold uppercase tracking-wider transition-all shadow-xs active:scale-95 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </button>
        </div>

        {/* Trust Points */}
        <div className="mt-12 pt-8 border-t border-[#eae5dc] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-[#747878] w-full max-w-lg">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#8c7138]" />
            <span>18K Real Gold Plating</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#8c7138]" />
            <span>100% Anti-Tarnish</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5">
            <span className="font-bold text-[#141414]">180+ Active Designs</span>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-[#eae5dc] text-center text-xs text-[#747878] bg-white">
        © 2026 PARZIO Demi-Fine Atelier • All collections protected by Lifetime Anti-Tarnish Warranty
      </footer>

    </div>
  );
};
