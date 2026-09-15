import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { SkinSafeConfig } from '../types';

interface SkinSafeBannerProps {
  config?: SkinSafeConfig;
  onExploreNewArrivals?: () => void;
}

const DEFAULT_CONFIG: SkinSafeConfig = {
  eyebrow: 'DERMATOLOGICALLY TESTED',
  title: '100% Skin Safe & Hypoallergenic Guarantee',
  item1Title: 'NICKEL FREE',
  item1Desc: 'Zero skin irritation or itching',
  item2Title: 'LEAD FREE',
  item2Desc: 'Pure non-toxic demi-fine metal',
  item3Title: 'CADMIUM FREE',
  item3Desc: 'Certified safe for daily wear',
  item4Title: '100% WATERPROOF',
  item4Desc: 'Wear in gym, shower & pool'
};

export const SkinSafeBanner: React.FC<SkinSafeBannerProps> = ({ config }) => {
  const c = config || DEFAULT_CONFIG;

  return (
    <div className="w-full bg-[#faf8f5] border-y border-[#eae5dc] py-6 sm:py-8 my-4">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="text-center mb-6">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#8c7138] block mb-1">
            {c.eyebrow}
          </span>
          <h3 className="font-display text-lg sm:text-2xl font-bold text-[#141414]">
            {c.title}
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* Item 1 */}
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-white border border-[#eae5dc] shadow-xs">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f4efea] border border-[#dfd7ca] flex items-center justify-center flex-shrink-0 text-[#8c7138] font-display font-bold text-base sm:text-lg">
              Ni
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#141414] uppercase tracking-wide">
                {c.item1Title}
              </h4>
              <p className="text-[11px] text-[#747878] leading-tight mt-0.5">
                {c.item1Desc}
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-white border border-[#eae5dc] shadow-xs">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f4efea] border border-[#dfd7ca] flex items-center justify-center flex-shrink-0 text-[#8c7138] font-display font-bold text-base sm:text-lg">
              Pb
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#141414] uppercase tracking-wide">
                {c.item2Title}
              </h4>
              <p className="text-[11px] text-[#747878] leading-tight mt-0.5">
                {c.item2Desc}
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-white border border-[#eae5dc] shadow-xs">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f4efea] border border-[#dfd7ca] flex items-center justify-center flex-shrink-0 text-[#8c7138] font-display font-bold text-base sm:text-lg">
              Cd
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#141414] uppercase tracking-wide">
                {c.item3Title}
              </h4>
              <p className="text-[11px] text-[#747878] leading-tight mt-0.5">
                {c.item3Desc}
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-white border border-[#eae5dc] shadow-xs">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f4efea] border border-[#dfd7ca] flex items-center justify-center flex-shrink-0 text-[#8c7138]">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#141414] uppercase tracking-wide">
                {c.item4Title}
              </h4>
              <p className="text-[11px] text-[#747878] leading-tight mt-0.5">
                {c.item4Desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
