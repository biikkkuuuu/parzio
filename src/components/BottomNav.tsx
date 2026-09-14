import React from 'react';
import { Home, Sparkles, LayoutGrid, RefreshCw, User } from 'lucide-react';

export type TabType = 'home' | 'sale' | 'track' | 'exchange' | 'account';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, className = '' }) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: 'Home',
      icon: <Home className="w-5 h-5 stroke-[2]" />
    },
    {
      id: 'sale' as TabType,
      label: 'Sale',
      icon: <Sparkles className="w-5 h-5 stroke-[2]" />
    },
    {
      id: 'track' as TabType,
      label: 'Track Order',
      icon: <LayoutGrid className="w-5 h-5 stroke-[2]" />
    },
    {
      id: 'exchange' as TabType,
      label: 'Exchange',
      icon: <RefreshCw className="w-5 h-5 stroke-[2]" />
    },
    {
      id: 'account' as TabType,
      label: 'Account',
      icon: <User className="w-5 h-5 stroke-[2]" />
    }
  ];

  return (
    <nav
      id="mobile-bottom-bar"
      className={`bg-white/95 backdrop-blur-md border-t border-[#eae5dc] shadow-[0_-2px_10px_rgba(0,0,0,0.04)] z-50 select-none ${className}`}
    >
      <div className="w-full max-w-md mx-auto flex items-center justify-around py-2 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => {
                onTabChange(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                isActive ? 'text-[#8c7138] font-bold' : 'text-[#747878] hover:text-[#141414]'
              }`}
            >
              <div
                className={`transition-transform duration-200 ${
                  isActive ? 'scale-110 text-[#8c7138]' : 'text-[#747878]'
                }`}
              >
                {tab.icon}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight leading-none ${
                  isActive ? 'font-bold text-[#8c7138]' : 'font-medium text-[#747878]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
