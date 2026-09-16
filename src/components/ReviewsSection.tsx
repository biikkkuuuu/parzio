import React from 'react';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: '- Priya S.',
    text: '"Amazing quality and beautiful designs. I totally love my bangles from Parzio!"',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 2,
    name: '- Neha K.',
    text: '"Super fast delivery and authentic products. Highly recommended!"',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 3,
    name: '- Anjali M.',
    text: '"The jewellery set is just wow! Perfect for special occasions."',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
  }
];

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-8 bg-white border-b border-[#eae5dc]">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14">
        
        {/* Header matching screenshot */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl sm:text-3xl text-[#1a1714] font-normal tracking-tight">
              What Our Customers Say
            </h2>
            <span className="text-xl sm:text-2xl text-[#9e7144] font-light">—</span>
          </div>

          <span className="text-xs sm:text-sm font-serif italic text-[#9e7144] tracking-wide">
            Real Stories. Real Happiness.
          </span>
        </div>

        {/* 3 Review Cards matching screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-xl p-4 border border-[#eee7dc] shadow-2xs hover:shadow-xs transition-all flex gap-3.5 items-start"
            >
              {/* Circular Avatar */}
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-11 h-11 rounded-full object-cover shrink-0 border border-[#9e7144]/30 mt-0.5"
              />

              {/* Review Content */}
              <div className="flex-1">
                {/* 5 Yellow Stars */}
                <div className="flex items-center gap-0.5 mb-1.5 text-[#eab308]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs text-[#3a3530] leading-relaxed mb-2 font-sans">
                  {rev.text}
                </p>

                {/* Author */}
                <span className="font-sans font-semibold text-xs text-[#1a1714]">
                  {rev.name}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
