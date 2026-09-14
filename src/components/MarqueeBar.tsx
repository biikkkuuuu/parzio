import React from 'react';
import { MarqueeItem } from '../types';
import { Truck, ShieldCheck, Sparkles, Star, Heart, Tag, Gift } from 'lucide-react';

interface MarqueeBarProps {
  items: MarqueeItem[];
  className?: string;
  speed?: 'normal' | 'fast';
  variant?: 'dark' | 'gold' | 'light';
}

export const MarqueeBar: React.FC<MarqueeBarProps> = ({
  items,
  className = '',
  speed = 'normal',
  variant = 'dark'
}) => {
  const activeItems = items.filter((item) => item.active);
  if (activeItems.length === 0) return null;

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'truck':
        return <Truck className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'shield':
        return <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'sparkles':
        return <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'star':
        return <Star className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'heart':
        return <Heart className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'tag':
        return <Tag className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'gift':
        return <Gift className="w-3.5 h-3.5 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'gold':
        return 'bg-[#8c7138] text-white border-y border-[#c5a059]';
      case 'light':
        return 'bg-[#faf8f5] text-[#141414] border-y border-[#eae5dc]';
      case 'dark':
      default:
        return 'bg-[#141414] text-[#fed488] border-b border-[#2e3131]';
    }
  };

  const animClass = speed === 'fast' ? 'animate-marquee-rtl-fast' : 'animate-marquee-rtl';

  return (
    <div
      className={`w-full overflow-hidden py-1.5 select-none relative ${getVariantStyles()} ${className}`}
      title="Right to Left Announcements (Hover to Pause)"
    >
      <div className={`${animClass} items-center gap-8 text-[11px] sm:text-xs font-bold tracking-wider uppercase`}>
        {/* Render twice for seamless looping */}
        {[...activeItems, ...activeItems].map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center gap-2 flex-shrink-0">
            {renderIcon(item.icon)}
            <span>{item.text}</span>
            <span className="opacity-40 text-xs px-2">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
