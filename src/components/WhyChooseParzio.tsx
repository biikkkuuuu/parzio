import React from 'react';
import { Gem, Award, Truck, ShieldCheck } from 'lucide-react';

export const WhyChooseParzio: React.FC = () => {
  return (
    <section className="py-5 sm:py-7 bg-[#f6f0e6] border-b border-[#ebdcca] overflow-hidden">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">
          
          {/* Left Column: Title + 4 Circular Badges */}
          <div className="lg:col-span-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-[#141414] font-bold tracking-tight mb-3 sm:mb-4">
              Why Choose PARZIO ?
            </h2>

            {/* 4 Circular Outline Badges horizontally in a row */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#9e7144] flex items-center justify-center text-[#9e7144] bg-transparent mb-1 sm:mb-1.5">
                  <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-sans font-medium text-[10px] sm:text-xs text-[#1a1714] leading-tight">
                  Premium<br />Designs
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#9e7144] flex items-center justify-center text-[#9e7144] bg-transparent mb-1 sm:mb-1.5">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-sans font-medium text-[10px] sm:text-xs text-[#1a1714] leading-tight">
                  Quality<br />You Can Trust
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#9e7144] flex items-center justify-center text-[#9e7144] bg-transparent mb-1 sm:mb-1.5">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-sans font-medium text-[10px] sm:text-xs text-[#1a1714] leading-tight">
                  Fast &amp; Reliable<br />Delivery
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#9e7144] flex items-center justify-center text-[#9e7144] bg-transparent mb-1 sm:mb-1.5">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-sans font-medium text-[10px] sm:text-xs text-[#1a1714] leading-tight">
                  Secure<br />Payments
                </span>
              </div>
            </div>
          </div>

          {/* Middle: Golden Vertical Divider + Calligraphy Script */}
          <div className="lg:col-span-3 flex items-center gap-3 justify-center py-2 lg:py-0">
            <div className="hidden lg:block w-[1px] h-16 bg-[#9e7144]/60" />
            <div className="text-center lg:text-left">
              <p className="font-script text-xl sm:text-2xl text-[#3d332a] leading-tight font-normal">
                "Jewellery <br />
                Made for Your Moments"
              </p>
              <div className="text-[#c53030] text-lg mt-0.5">
                ♡
              </div>
            </div>
          </div>

          {/* Right Column: Traditional Gold Bangles on Hand */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <div className="w-full max-w-[240px] sm:max-w-[260px] h-[110px] sm:h-[130px] rounded-xl overflow-hidden shadow-xs border border-[#e2d5c2]">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
                alt="PARZIO Gold Bangles"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
