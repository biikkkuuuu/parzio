import React from 'react';
import { Instagram } from 'lucide-react';

const INSTA_IMAGES = [
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1611591475816-43b664d4b121?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=400&q=80',
];

export const InstagramGrid: React.FC = () => {
  return (
    <section className="py-8 bg-white border-b border-[#eae5dc] overflow-hidden">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-14">
        
        {/* Header matching screenshot */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <h2 className="font-display text-xl sm:text-2xl text-[#1a1714] font-normal tracking-tight">
            Follow Us on Instagram
          </h2>
          <a
            href="https://instagram.com/parzio.in"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#d93c7a] hover:underline"
          >
            <Instagram className="w-4 h-4 text-[#d93c7a]" />
            <span>@parzio.in</span>
          </a>
        </div>

        {/* 8 Image Grid matching screenshot */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 sm:gap-2.5">
          {INSTA_IMAGES.map((img, idx) => (
            <a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square rounded-lg overflow-hidden bg-[#faf7f2] border border-[#eee7dc] block"
            >
              <img
                src={img}
                alt={`Instagram Tile ${idx + 1}`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
