import React from 'react';
import { QC_STEPS_DATA } from '../data/reviews';
import { ShieldCheck, Sparkles, Droplets, Lock, Microscope } from 'lucide-react';

const STEP_ICONS = [
  <ShieldCheck key="1" className="w-5 h-5 text-[#8c7138]" />,
  <Sparkles key="2" className="w-5 h-5 text-[#8c7138]" />,
  <Droplets key="3" className="w-5 h-5 text-[#8c7138]" />,
  <Lock key="4" className="w-5 h-5 text-[#8c7138]" />,
  <Microscope key="5" className="w-5 h-5 text-[#8c7138]" />
];

export const QualityCheckSection: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#fbf9f6] to-[#f4efea] border-b border-[#eae5dc]">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8c7138] block mb-1">
            Guaranteed Quality
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#141414] font-medium tracking-tight">
            5-Step Quality Check
          </h2>
          <p className="text-xs sm:text-sm text-[#444748] mt-2 leading-relaxed">
            Every piece is checked by hand in our workshop for shine, durability, and skin safety before it is packed.
          </p>
        </div>

        {/* 5-Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {QC_STEPS_DATA.map((step, index) => (
            <div
              key={step.id}
              className="p-5 rounded-3xl bg-white border border-[#eae5dc] shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-3xl font-bold text-[#8c7138]/70 group-hover:text-[#8c7138] transition-colors">
                    0{step.id}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-center">
                    {STEP_ICONS[index]}
                  </div>
                </div>

                <h3 className="font-display text-base font-bold text-[#141414] mb-1">
                  {step.title}
                </h3>
                <p className="text-[11px] font-semibold text-[#8c7138] uppercase tracking-wider mb-2">
                  {step.standard}
                </p>
                <p className="text-xs text-[#444748] leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#eae5dc]/80 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Certified Standard</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
