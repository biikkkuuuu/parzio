import React from 'react';

interface LogoProps {
  className?: string;
  isLight?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-7 w-auto', isLight = false }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 select-none ${
        isLight ? 'text-white' : 'text-[#141414]'
      } ${className}`}
    >
      {/* Crowned Diamond Emblem */}
      <svg
        className="w-7 h-7 flex-shrink-0"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Crown peaks */}
        <path
          d="M24 40 L34 16 L50 30 L66 16 L76 40 Z"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Crown jewels */}
        <circle cx="34" cy="14" r="2.5" fill="currentColor" />
        <circle cx="50" cy="10" r="3" fill="currentColor" />
        <circle cx="66" cy="14" r="2.5" fill="currentColor" />
        {/* Crown band */}
        <path d="M22 42 L78 42" strokeWidth="4" strokeLinecap="round" />
        {/* Diamond pavilion & facets */}
        <path
          d="M16 48 L50 92 L84 48 L50 46 Z"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M16 48 L50 66 L84 48" strokeWidth="3" />
        <path d="M50 46 L50 92" strokeWidth="3" />
        <path d="M33 48 L50 92 L67 48" strokeWidth="3" />
      </svg>

      {/* Brand Wordmark: PARZIO & BEAUTY IN EVERY DETAIL */}
      <div className="flex flex-col">
        <span className="font-display text-xl sm:text-2xl font-bold tracking-[0.22em] uppercase leading-none">
          PARZIO
        </span>
        <span className="text-[7px] sm:text-[8px] font-semibold tracking-[0.32em] uppercase text-[#8c7138] mt-1 leading-none">
          BEAUTY IN EVERY DETAIL
        </span>
      </div>
    </div>
  );
};
