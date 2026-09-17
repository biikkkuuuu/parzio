import React from 'react';

interface LogoProps {
  className?: string;
  isLight?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-9 sm:h-10 w-auto' }) => {
  return (
    <div className="inline-flex items-center gap-2 select-none">
      <img
        src="/parzio-logo.png"
        alt="PARZIO - Aapke Shringar, Hamari Pehchaan"
        className={`object-contain rounded-md ${className}`}
        loading="eager"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/favicon.png';
        }}
      />
    </div>
  );
};
