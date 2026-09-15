import React from 'react';
import { AdminTab, EmergencyShutdownConfig } from '../../types';
import { Logo } from '../Logo';
import {
  BarChart3,
  Package,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Tag,
  Settings,
  X,
  ExternalLink,
  LogOut,
  AlertOctagon,
  Store,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface AdminHamburgerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  orderCount: number;
  productCount: number;
  bannerCount?: number;
  onViewStore: () => void;
  onLogout: () => void;
  onOpenEmergencyModal: () => void;
  emergencyConfig: EmergencyShutdownConfig;
}

export const AdminHamburgerDrawer: React.FC<AdminHamburgerDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  orderCount,
  productCount,
  bannerCount = 2,
  onViewStore,
  onLogout,
  onOpenEmergencyModal,
  emergencyConfig
}) => {
  if (!isOpen) return null;

  const managementItems: {
    id: AdminTab;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    badge?: string;
    badgeColor?: string;
  }[] = [
    {
      id: 'banners',
      label: 'Banners & Running Marquee',
      sublabel: 'Edit hero banners, announcements & moving tickers',
      icon: <Sparkles className="w-4 h-4" />,
      badge: `${bannerCount} Active`,
      badgeColor: 'bg-[#faf8f5] text-[#8c7138] border border-[#eae5dc]'
    },
    {
      id: 'inventory',
      label: 'Products & Stock',
      sublabel: 'View all jewelry, update prices & stock count',
      icon: <Package className="w-4 h-4" />,
      badge: `${productCount} Items`,
      badgeColor: 'bg-[#faf8f5] text-[#141414] border border-[#eae5dc]'
    },
    {
      id: 'exchanges',
      label: 'Exchanges & Returns',
      sublabel: 'Check return requests & courier pickups',
      icon: <RotateCcw className="w-4 h-4" />,
      badge: '3 Open',
      badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200'
    },
    {
      id: 'rto-shield',
      label: 'Cash on Delivery Safety',
      sublabel: 'Prevent fake orders & block risky pincodes',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: 'Active',
      badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200'
    },
    {
      id: 'coupons',
      label: 'Coupons & Discounts',
      sublabel: 'Create discount codes & special offers',
      icon: <Tag className="w-4 h-4" />
    },
    {
      id: 'settings',
      label: 'Store Settings',
      sublabel: 'Online payment, COD fee & store address',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      {/* Drawer Content Panel - Warm Luxury App Theme Standard */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#fbf9f6] text-[#141414] h-full flex flex-col shadow-2xl border-r border-[#eae5dc] z-10 animate-slideRight">
        
        {/* Drawer Header - Deep Onyx with Artisan Gold Accents */}
        <div className="p-4 sm:p-5 border-b border-[#2e3131] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <Logo className="h-6 w-auto" isLight />
            <div className="h-4 w-px bg-white/20" />
            <span className="px-3 py-1 rounded-full bg-[#8c7138]/20 border border-[#8c7138]/50 text-[#fed488] font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Store Dashboard
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#222424] hover:bg-[#8c7138] text-[#fed488] hover:text-white transition-colors cursor-pointer"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin User Info Card */}
        <div className="px-5 py-3 bg-white border-b border-[#eae5dc] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#8c7138] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              VR
            </div>
            <div>
              <p className="text-xs font-bold text-[#141414] leading-none">Store Manager</p>
              <p className="text-[10px] text-[#747878] mt-0.5 font-medium">Full Access</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold">
            ONLINE
          </span>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 no-scrollbar bg-[#fbf9f6]">
          
          {/* PRIMARY SECTION: Overview & Orders (Prominently styled in Hamburger) */}
          <div className="space-y-2.5">
            <div className="px-1 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c7138] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#8c7138]" />
                Main Dashboard
              </span>
              <span className="text-[10px] font-semibold text-[#747878] bg-[#faf8f5] px-2.5 py-0.5 rounded-full border border-[#eae5dc]">
                Primary Hub
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Sales Overview Card */}
              <button
                type="button"
                onClick={() => {
                  onSelectTab('overview');
                  onClose();
                }}
                className={`w-full p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                  activeTab === 'overview'
                    ? 'bg-[#141414] text-white shadow-md border-[#8c7138]'
                    : 'bg-white text-[#141414] hover:bg-[#faf8f5] hover:border-[#8c7138]/50 border-[#eae5dc] shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-[#8c7138] text-white'
                        : 'bg-[#faf8f5] text-[#8c7138] border border-[#eae5dc]'
                    }`}>
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${activeTab === 'overview' ? 'text-[#fed488]' : 'text-[#141414]'}`}>
                          Sales Overview
                        </span>
                        {activeTab === 'overview' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#8c7138]/40 text-[#fed488] text-[9px] font-bold uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${activeTab === 'overview' ? 'text-white/80' : 'text-[#747878]'}`}>
                        Today's sales, daily graphs and revenue
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${activeTab === 'overview' ? 'text-[#fed488]' : 'text-[#747878]'}`} />
                </div>
              </button>

              {/* Customer Orders Card */}
              <button
                type="button"
                onClick={() => {
                  onSelectTab('orders');
                  onClose();
                }}
                className={`w-full p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                  activeTab === 'orders'
                    ? 'bg-[#141414] text-white shadow-md border-[#8c7138]'
                    : 'bg-white text-[#141414] hover:bg-[#faf8f5] hover:border-[#8c7138]/50 border-[#eae5dc] shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl transition-colors ${
                      activeTab === 'orders'
                        ? 'bg-[#8c7138] text-white'
                        : 'bg-[#faf8f5] text-[#8c7138] border border-[#eae5dc]'
                    }`}>
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${activeTab === 'orders' ? 'text-[#fed488]' : 'text-[#141414]'}`}>
                          Customer Orders
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#fed488] text-[#141414] text-[10px] font-mono font-bold">
                          {orderCount} Orders
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${activeTab === 'orders' ? 'text-white/80' : 'text-[#747878]'}`}>
                        Live orders, packing, shipping and slips
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${activeTab === 'orders' ? 'text-[#fed488]' : 'text-[#747878]'}`} />
                </div>
              </button>
            </div>
          </div>

          {/* SECONDARY SECTION: Store Management */}
          <div className="space-y-2">
            <div className="px-1 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#747878]">
                Store Management
              </span>
              <span className="text-[10px] text-[#747878]">
                {managementItems.length} Sections
              </span>
            </div>

            <div className="space-y-1.5">
              {managementItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[#141414] text-white font-bold shadow-md border-[#8c7138]'
                        : 'bg-white text-[#141414] hover:border-[#8c7138]/40 hover:bg-[#faf8f5] border-[#eae5dc] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-[#8c7138] text-white'
                          : 'bg-[#faf8f5] text-[#8c7138] border border-[#eae5dc]'
                      }`}>
                        {item.icon}
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isActive ? 'text-[#fed488]' : 'text-[#141414]'}`}>
                          {item.label}
                        </div>
                        <div className={`text-[10px] leading-tight line-clamp-1 ${
                          isActive ? 'text-[#c4c7c7] font-normal' : 'text-[#747878]'
                        }`}>
                          {item.sublabel}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            isActive
                              ? 'bg-[#8c7138] text-white'
                              : item.badgeColor || 'bg-[#faf8f5] text-[#141414] border border-[#eae5dc]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#fed488]' : 'text-[#747878]'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emergency Stop Card */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            emergencyConfig.isActive
              ? 'bg-rose-950/90 border-rose-600 text-white shadow-md'
              : 'bg-white border-[#eae5dc] shadow-xs hover:border-rose-300'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  emergencyConfig.isActive ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}>
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    emergencyConfig.isActive ? 'text-white' : 'text-[#141414]'
                  }`}>
                    <span>Emergency Stop</span>
                    {emergencyConfig.isActive && (
                      <span className="px-1.5 py-0.2 rounded bg-rose-500 text-white text-[9px] font-mono font-bold animate-pulse">
                        ON
                      </span>
                    )}
                  </h4>
                  <p className={`text-[10px] ${emergencyConfig.isActive ? 'text-rose-200' : 'text-[#747878]'}`}>
                    {emergencyConfig.isActive ? 'Orders Paused' : 'Pause Store Orders'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEmergencyModal();
                }}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all shadow-xs cursor-pointer ${
                  emergencyConfig.isActive
                    ? 'bg-white text-rose-950 hover:bg-rose-100'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200'
                }`}
              >
                {emergencyConfig.isActive ? 'Manage' : 'Pause'}
              </button>
            </div>
          </div>

          {/* Storefront & Session Section */}
          <div className="space-y-2 pt-2 border-t border-[#eae5dc]">
            <div className="px-1 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#747878]">
              Store &amp; Exit
            </div>

            {/* Store Dekho (View Live Storefront) Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewStore();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#faf8f5] text-[#141414] border border-[#eae5dc] hover:border-[#8c7138]/40 transition-all text-left group shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#8c7138]/10 text-[#8c7138] group-hover:scale-105 transition-transform">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#141414] flex items-center gap-1.5">
                    <span>Store Dekho (View Store)</span>
                    <ExternalLink className="w-3 h-3 text-[#8c7138]" />
                  </div>
                  <div className="text-[10px] text-[#747878]">
                    Switch to customer shopping experience
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#747878] group-hover:text-[#141414]" />
            </button>

            {/* Admin Logout Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-all text-left group shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-700 group-hover:scale-105 transition-transform">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-800">Admin Logout</div>
                  <div className="text-[10px] text-rose-600">
                    Exit admin safely
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-400 group-hover:text-rose-800" />
            </button>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#eae5dc] bg-white text-center text-[10px] text-[#747878] flex items-center justify-between font-mono">
          <span>PARZIO STORE ADMIN</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            CONNECTED
          </span>
        </div>

      </div>
    </div>
  );
};
