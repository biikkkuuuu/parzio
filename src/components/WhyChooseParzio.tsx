import React from 'react';
import { Gem, Award, Truck, ShieldCheck } from 'lucide-react';

export const WhyChooseParzio: React.FC = () => {
  return (
    <section className="py-10 sm:py-12 bg-[#f6f0e6] border-b border-[#ebdcca] overflow-hidden">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Title + 4 Circular Badges */}
          <div className="lg:col-span-6">
            <h2 className="text-2xl sm:text-3xl text-[#141414] font-bold tracking-tight mb-6">
              Why Choose PARZIO ?
            </h2>

            {/* 4 Circular Outline Badges horizontally in a row matching screenshot */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-[#9e7144] flex items-center justify-center text-[#9e7144] bg-transparent mb-2">
                  <Gem className="w-5 h-5" />
                </div>
                <span className="font-sans font-medium text-xs text-[#1a1714] leading-tight">
                  Premium<br />Designs
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-[#9e7144] flex items-center justify-center text-[#9e7144] bg-transparent mb-2">
                  <Award className="w-5 h-5" />
                </div>
                <span className="font-sans font-medium text-xs text-[#1a1714] leading-tight">
                  Quality<br />You Can Trust
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-[#9e7144] flex items-center justify-center text-[#9e7144] bg-transparent mb-2">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="font-sans font-medium text-xs text-[#1a1714] leading-tight">
                  Fast &amp; Reliable<br />Delivery
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-[#9e7144] flex items-center justify-center text-[#9e7144] bg-transparent mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-sans font-medium text-xs text-[#1a1714] leading-tight">
                  Secure<br />Payments
                </span>
              </div>
            </div>
          </div>

          {/* Middle: Golden Vertical Divider + Calligraphy Script matching screenshot */}
          <div className="lg:col-span-3 flex items-center gap-4 justify-center py-4 lg:py-0">
            <div className="hidden lg:block w-[1px] h-20 bg-[#9e7144]/60" />
            <div className="text-center lg:text-left">
              <p className="font-script text-2xl sm:text-3xl text-[#3d332a] leading-tight font-normal">
                "Jewellery <br />
                Made for Your Moments"
              </p>
              <div className="text-[#c53030] text-2xl mt-1">
                ♡
              </div>
            </div>
          </div>

          {/* Right Column: Traditional Gold Bangles on Hand matching screenshot */}
          <div className="lg:col-span-3 flex justify-end">
            <div className="w-full max-w-[280px] h-[160px] sm:h-[180px] rounded-2xl overflow-hidden shadow-sm border border-[#e2d5c2]">
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
