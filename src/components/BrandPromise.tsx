import React from 'react';
import { Sparkles, Shield, Award, HeartHandshake } from 'lucide-react';

export const BrandPromise: React.FC = () => {
  return (
    <section className="py-14 sm:py-18 bg-white border-b border-neutral-200">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          
          {/* Atelier Team Photo Staging */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xs border border-neutral-200 aspect-[4/3] bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="PARZIO Artisans and Stylists Team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4 sm:p-6">
                <span className="px-3.5 py-1.5 rounded-full bg-neutral-900/90 backdrop-blur-md text-white text-[11px] font-semibold tracking-wider uppercase flex items-center gap-2 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
                  DESIGN TEAM • 108+ CRAFTSPEOPLE & STYLISTS
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Story */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
              The PARZIO Promise
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-neutral-900 font-semibold tracking-tight">
              316L Stainless Steel Jewellery, Fair Price
            </h2>
            <div className="text-xs sm:text-sm text-neutral-600 leading-relaxed space-y-3">
              <p>
                PARZIO is made with care and love. We believe that durable, elegant jewellery should not be kept only
                for rare special days, but enjoyed every single day with confidence.
              </p>
              <p>
                Our team crafts every piece directly in 316L Surgical Stainless Steel without any middlemen.
                This means you get 100% anti-tarnish, sweatproof stainless steel jewellery delivered directly to your doorstep for just ₹99.
              </p>
            </div>

            {/* 3 Core Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <Award className="w-4 h-4 text-neutral-800 flex-shrink-0" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-900">
                  100% In-House Design
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <Shield className="w-4 h-4 text-neutral-800 flex-shrink-0" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-900">
                  Nickel & Lead Safe
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <HeartHandshake className="w-4 h-4 text-neutral-800 flex-shrink-0" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-900">
                  Made with Pride in India
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Media Mentions Strip */}
        <div className="pt-8 border-t border-neutral-200">
          <p className="text-center text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-neutral-400 mb-6">
            RECOGNIZED & FEATURED IN NATIONAL MEDIA
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-80 text-sm sm:text-base font-serif font-bold text-neutral-700">
            <span className="tracking-widest">INDIA TODAY</span>
            <span className="tracking-widest">FOX 8</span>
            <span className="tracking-wider">YAHOO! finance</span>
            <span className="tracking-widest">NEWS CHANNEL 8</span>
            <span className="tracking-widest italic font-medium">ThePrint</span>
            <span className="tracking-widest">THE TIMES OF INDIA</span>
          </div>
        </div>

      </div>
    </section>
  );
};
