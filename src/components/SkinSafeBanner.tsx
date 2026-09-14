import React from 'react';
import { Logo } from './Logo';
import { Sparkles, Globe2 } from 'lucide-react';

interface SkinSafeBannerProps {
  onExploreNewArrivals: () => void;
}

export const SkinSafeBanner: React.FC<SkinSafeBannerProps> = ({ onExploreNewArrivals }) => {
  return (
    <div className="w-full bg-[#fbf8f2] border-b border-[#ebd7be]/60 overflow-hidden">
      {/* Top Banner Card: SKIN SAFE JEWELLERY */}
      <div className="relative pt-6 px-4 pb-4 sm:px-6 max-w-lg mx-auto">
        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-center text-neutral-900 mb-5 uppercase">
          SKIN SAFE JEWELLERY
        </h2>

        <div className="grid grid-cols-12 items-center gap-2">
          {/* Left Column: 4 Circular Badges */}
          <div className="col-span-6 grid grid-cols-2 gap-x-2 gap-y-4">
            {/* Nickel Free */}
            <div className="flex flex-col items-center text-center">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-[#caa862] flex items-center justify-center bg-[#fcfbfa] shadow-xs">
                <span className="font-display font-bold text-lg sm:text-xl text-[#9b7b37]">Ni</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-neutral-900 mt-1.5 uppercase tracking-wide leading-tight">
                NICKEL FREE
              </span>
            </div>

            {/* Lead Free */}
            <div className="flex flex-col items-center text-center">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-[#caa862] flex items-center justify-center bg-[#fcfbfa] shadow-xs">
                <span className="font-display font-bold text-lg sm:text-xl text-[#9b7b37]">Pb</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-neutral-900 mt-1.5 uppercase tracking-wide leading-tight">
                LEAD FREE
              </span>
            </div>

            {/* Cadmium Free */}
            <div className="flex flex-col items-center text-center">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-[#caa862] flex items-center justify-center bg-[#fcfbfa] shadow-xs">
                <span className="font-display font-bold text-lg sm:text-xl text-[#9b7b37]">Cd</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-neutral-900 mt-1.5 uppercase tracking-wide leading-tight">
                CADMIUM FREE
              </span>
            </div>

            {/* ISO 9001:2015 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-[#caa862] flex items-center justify-center bg-[#fcfbfa] shadow-xs">
                <Globe2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#9b7b37] stroke-[1.8]" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-neutral-900 mt-1.5 uppercase tracking-tight leading-tight">
                ISO 9001:2015<br />CERTIFIED
              </span>
            </div>
          </div>

          {/* Right Column: Radiant Beauty Model with purple-blue tint */}
          <div className="col-span-6 relative flex justify-end">
            <div className="relative w-full aspect-[4/5] max-h-56 sm:max-h-64 rounded-3xl overflow-hidden shadow-xs border border-neutral-200 bg-[#e4e4ed]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80"
                alt="Radiant Skin Safe Jewellery Model"
                className="w-full h-full object-cover object-top filter contrast-[1.05] brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-blue-500/20 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Small Brand Emblem in the card */}
        <div className="mt-4 flex justify-start pl-2">
          <Logo className="h-6 w-auto" />
        </div>
      </div>

      {/* Sub-Hero Promo Box matching exact user screenshot */}
      <div className="bg-[#fbf9f6] py-6 px-4 text-center border-t border-[#eae5dc]">
        <h3 className="font-display text-2xl sm:text-3xl text-neutral-900 font-normal tracking-tight flex items-center justify-center gap-1.5">
          <span>Everything For Just ₹99</span>
          <span className="text-[#8c7138] text-xl">✨</span>
        </h3>
        
        <p className="text-xs sm:text-sm font-normal text-neutral-700 mt-1 flex items-center justify-center gap-1">
          <span>Top Quality Anti-Tarnish Jewellery</span>
          <span className="text-[#8c7138]">✨</span>
        </p>

        <div className="mt-4">
          <button
            onClick={onExploreNewArrivals}
            className="px-6 py-2 rounded-full border border-neutral-900 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-100 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            New Arrivals &gt;
          </button>
        </div>
      </div>
    </div>
  );
};
