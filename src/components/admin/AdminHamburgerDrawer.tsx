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
  TrendingUp,
  Layers,
  Flame,
  LayoutGrid
} from 'lucide-react';

interface AdminHamburgerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  orderCount: number;
  productCount: number;
  leadsCount?: number;
  bannerCount?: number;
  categoriesCount?: number;
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
  leadsCount = 0,
  bannerCount = 2,
  categoriesCount = 5,
  onViewStore,
  onLogout,
  onOpenEmergencyModal,
  emergencyConfig
}) => {
  if (!isOpen) return null;

  // Primary Dashboard Items
  const primaryItems: {
    id: AdminTab;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Sales Overview',
      sublabel: "Today's sales, daily graphs & revenue analytics",
      icon: <BarChart3 className="w-4 h-4" />,
      badge: activeTab === 'overview' ? 'Active' : undefined
    },
    {
      id: 'orders',
      label: 'Customer Orders',
      sublabel: 'Live orders, packing slips & dispatch tracking',
      icon: <Package className="w-4 h-4" />,
      badge: `${orderCount} Orders`
    }
  ];

  // Store Management Navigation Items
  const managementItems: {
    id: AdminTab;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    badge?: string;
    isAlert?: boolean;
  }[] = [
    {
      id: 'leads',
      label: 'Abandoned Checkout Leads',
      sublabel: 'Recover drop-offs via WhatsApp & Fast2SMS',
      icon: <Flame className="w-4 h-4" />,
      badge: leadsCount > 0 ? `${leadsCount} Pending` : undefined,
      isAlert: leadsCount > 0
    },
    {
      id: 'inventory',
      label: 'Products & Stock',
      sublabel: 'Catalog pricing, inventory & live toggle',
      icon: <Package className="w-4 h-4" />,
      badge: `${productCount} Items`
    },
    {
      id: 'categories',
      label: 'Categories & Collections',
      sublabel: 'Jewellery classifications & navigation tabs',
      icon: <Layers className="w-4 h-4" />,
      badge: `${categoriesCount} Collections`
    },
    {
      id: 'coupons',
      label: 'Coupons & Secret Vouchers',
      sublabel: 'Create custom promo codes (PAR123)',
      icon: <Tag className="w-4 h-4" />,
      badge: 'Codes'
    },
    {
      id: 'banners',
      label: 'Banners & Running Marquee',
      sublabel: 'Hero banners & announcement tickers',
      icon: <Sparkles className="w-4 h-4" />,
      badge: `${bannerCount} Active`
    },
    {
      id: 'exchanges',
      label: 'Exchanges & Returns',
      sublabel: 'Customer replacement & pickup requests',
      icon: <RotateCcw className="w-4 h-4" />,
      badge: '3 Open',
      isAlert: true
    },
    {
      id: 'rto-shield',
      label: 'Cash on Delivery Safety',
      sublabel: 'COD verification & fraud protection',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: 'Protected'
    },
    {
      id: 'settings',
      label: 'Store Settings',
      sublabel: 'Store address, UPI & operational options',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  const renderNavRow = (item: {
    id: AdminTab;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    badge?: string;
    isAlert?: boolean;
  }) => {
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
            : 'bg-white text-[#141414] hover:border-[#8c7138]/50 hover:bg-[#faf8f5] border-[#eae5dc] shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 pr-2">
          {/* Uniform Icon Box */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isActive
                ? 'bg-[#8c7138] text-white shadow-xs'
                : 'bg-[#faf6ef] text-[#8c7138] border border-[#ebd7be]'
            }`}
          >
            {item.icon}
          </div>

          {/* Text Labels */}
          <div className="min-w-0">
            <div
              className={`text-xs font-bold truncate leading-tight ${
                isActive ? 'text-[#fed488]' : 'text-[#141414]'
              }`}
            >
              {item.label}
            </div>
            <div
              className={`text-[11px] truncate leading-tight mt-0.5 ${
                isActive ? 'text-white/70 font-normal' : 'text-[#747878]'
              }`}
            >
              {item.sublabel}
            </div>
          </div>
        </div>

        {/* Right Badge + Chevron */}
        <div className="flex items-center gap-2 shrink-0">
          {item.badge && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold tracking-wide ${
                isActive
                  ? 'bg-[#8c7138] text-white'
                  : item.isAlert
                  ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                  : 'bg-[#faf6ef] text-[#8c7138] border border-[#ebd7be]'
              }`}
            >
              {item.badge}
            </span>
          )}
          <ChevronRight
            className={`w-4 h-4 shrink-0 transition-transform ${
              isActive ? 'text-[#fed488]' : 'text-[#a2a5a5]'
            }`}
          />
        </div>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      {/* Drawer Content Panel */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#fbf9f6] text-[#141414] h-full flex flex-col shadow-2xl border-r border-[#eae5dc] z-10 animate-slideRight">
        
        {/* Drawer Header - Deep Onyx with Artisan Gold Accents */}
        <div className="p-4 sm:p-5 border-b border-[#2e3131] flex items-center justify-between bg-[#141414] text-white">
          <div className="flex items-center gap-3">
            <Logo className="h-6 w-auto" isLight />
            <div className="h-4 w-px bg-white/20" />
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#fed488]">
              Admin Operations
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#222424] hover:bg-[#8c7138] text-[#fed488] hover:text-white transition-colors cursor-pointer"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Profile Bar */}
        <div className="px-5 py-3 bg-white border-b border-[#eae5dc] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#8c7138] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              VR
            </div>
            <div>
              <p className="text-xs font-bold text-[#141414] leading-none">Store Manager</p>
              <p className="text-[10px] text-[#747878] mt-0.5">Master Access</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-bold text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online</span>
          </div>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 no-scrollbar bg-[#fbf9f6]">
          
          {/* SECTION 1: Main Hub */}
          <div className="space-y-2">
            <div className="px-1 text-[10px] font-bold uppercase tracking-wider text-[#8c7138] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#8c7138]" />
              <span>Main Dashboard</span>
            </div>
            <div className="space-y-1.5">
              {primaryItems.map((item) => renderNavRow(item))}
            </div>
          </div>

          {/* SECTION 2: Store Management */}
          <div className="space-y-2">
            <div className="px-1 text-[10px] font-bold uppercase tracking-wider text-[#747878] flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-[#747878]" />
              <span>Store Management</span>
            </div>
            <div className="space-y-1.5">
              {managementItems.map((item) => renderNavRow(item))}
            </div>
          </div>

          {/* SECTION 3: Emergency Stop Card */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            emergencyConfig.isActive
              ? 'bg-rose-950/90 border-rose-600 text-white shadow-md'
              : 'bg-white border-[#eae5dc] shadow-2xs hover:border-rose-300'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
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
                      <span className="px-1.5 py-0.2 rounded bg-rose-500 text-white text-[9px] font-bold animate-pulse">
                        ON
                      </span>
                    )}
                  </h4>
                  <p className={`text-[11px] ${emergencyConfig.isActive ? 'text-rose-200' : 'text-[#747878]'}`}>
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

          {/* SECTION 4: Storefront & Session */}
          <div className="space-y-2 pt-2 border-t border-[#eae5dc]">
            <div className="px-1 text-[10px] font-bold uppercase tracking-wider text-[#747878]">
              Storefront &amp; Exit
            </div>

            {/* Store Dekho (View Live Storefront) Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewStore();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#faf8f5] text-[#141414] border border-[#eae5dc] hover:border-[#8c7138]/40 transition-all text-left group shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#8c7138]/10 text-[#8c7138] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#141414] flex items-center gap-1.5">
                    <span>Store Dekho (View Store)</span>
                    <ExternalLink className="w-3 h-3 text-[#8c7138]" />
                  </div>
                  <div className="text-[11px] text-[#747878]">
                    Switch to customer shopping experience
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#a2a5a5] group-hover:text-[#141414]" />
            </button>

            {/* Admin Logout Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-all text-left group shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-800">Admin Logout</div>
                  <div className="text-[11px] text-rose-600">
                    Exit admin safely
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-400 group-hover:text-rose-800" />
            </button>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 border-t border-[#eae5dc] bg-white text-center text-[10px] text-[#747878] flex items-center justify-between">
          <span className="font-semibold uppercase tracking-wider">PARZIO ATELIER OPS</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            CONNECTED
          </span>
        </div>

      </div>
    </div>
  );
};
