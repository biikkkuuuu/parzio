import React, { useState } from 'react';
import { OrderItem, OrderStatus, Product, CategoryItem, AdminTab, EmergencyShutdownConfig, MarqueeItem, StoreBanner, SkinSafeConfig, SaleBannerConfig, SalePoster } from '../types';
import { Logo } from './Logo';
import { AdminAnalyticsView } from './admin/AdminAnalyticsView';
import { AdminOrdersView } from './admin/AdminOrdersView';
import { AdminInventoryView } from './admin/AdminInventoryView';
import { AdminCategoriesView } from './admin/AdminCategoriesView';
import { AdminBannersView } from './admin/AdminBannersView';
import { AdminRtoShieldView } from './admin/AdminRtoShieldView';
import { AdminExchangesView } from './admin/AdminExchangesView';
import { AdminCouponsView } from './admin/AdminCouponsView';
import { AdminSettingsView } from './admin/AdminSettingsView';
import { AdminInvoiceModal } from './admin/AdminInvoiceModal';
import { AdminProductModal } from './admin/AdminProductModal';
import { AdminHamburgerDrawer } from './admin/AdminHamburgerDrawer';
import { AdminEmergencyShutdownModal } from './admin/AdminEmergencyShutdownModal';
import {
  Menu,
  BarChart3,
  Package,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Tag,
  Settings,
  ArrowLeft,
  Clock,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Plus,
  Store,
  LogOut,
  AlertOctagon,
  ChevronDown,
  Power,
  Layers
} from 'lucide-react';

interface AtelierOpsHubProps {
  orders: OrderItem[];
  products: Product[];
  categories?: CategoryItem[];
  onBackToStore: () => void;
  onLogout: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onAddOrder: (order: OrderItem) => void;
  onEditOrder: (order: OrderItem) => void;
  onDeleteOrder: (orderId: string) => void;
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddCategory?: (category: CategoryItem) => void;
  onEditCategory?: (oldName: string, updatedCategory: CategoryItem) => void;
  onDeleteCategory?: (categoryName: string) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onToggleLive: (productId: string) => void;
  emergencyConfig: EmergencyShutdownConfig;
  onUpdateEmergencyConfig: (config: EmergencyShutdownConfig) => void;
  topMarqueeItems: MarqueeItem[];
  bannerMarqueeItems: MarqueeItem[];
  banners: StoreBanner[];
  salePosters: SalePoster[];
  skinSafeConfig: SkinSafeConfig;
  saleBannerConfig: SaleBannerConfig;
  onUpdateTopMarquee: (items: MarqueeItem[]) => void;
  onUpdateBannerMarquee: (items: MarqueeItem[]) => void;
  onUpdateBanners: (banners: StoreBanner[]) => void;
  onUpdateSalePosters: (posters: SalePoster[]) => void;
  onUpdateSkinSafeConfig: (config: SkinSafeConfig) => void;
  onUpdateSaleBannerConfig: (config: SaleBannerConfig) => void;
}

export const AtelierOpsHub: React.FC<AtelierOpsHubProps> = ({
  orders,
  products,
  categories = [],
  onBackToStore,
  onLogout,
  onUpdateOrderStatus,
  onAddOrder,
  onEditOrder,
  onDeleteOrder,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onUpdateStock,
  onToggleLive,
  emergencyConfig,
  onUpdateEmergencyConfig,
  topMarqueeItems,
  bannerMarqueeItems,
  banners,
  salePosters,
  skinSafeConfig,
  saleBannerConfig,
  onUpdateTopMarquee,
  onUpdateBannerMarquee,
  onUpdateBanners,
  onUpdateSalePosters,
  onUpdateSkinSafeConfig,
  onUpdateSaleBannerConfig
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<OrderItem | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const tabLabels: Record<AdminTab, string> = {
    overview: 'Sales Overview',
    orders: 'Customer Orders',
    inventory: 'Products & Stock',
    categories: 'Categories & Collections',
    banners: 'Banners & Marquee',
    'rto-shield': 'Cash on Delivery Safety',
    exchanges: 'Exchanges & Returns',
    coupons: 'Coupons & Discounts',
    settings: 'Store Settings'
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee] text-[#1b1c1a]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#141414] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-[#8c7138] animate-bounce text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-[#fed488]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Emergency Lockdown Notice Banner (when active) */}
      {emergencyConfig.isActive && (
        <div className="bg-rose-950 text-rose-200 border-b border-rose-800 px-4 py-2.5 text-xs font-semibold flex items-center justify-between gap-4 sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              EMERGENCY SHUTDOWN ACTIVE:
            </span>
            <span className="text-white/90 hidden sm:inline">
              Storefront order flow is currently paused ({emergencyConfig.reason}).
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="px-3 py-1 rounded-full bg-white text-rose-950 hover:bg-rose-100 text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              Manage / Deactivate
            </button>
          </div>
        </div>
      )}

      {/* Top Admin App Bar */}
      <header className="sticky top-0 z-40 bg-[#141414] text-white border-b border-[#2d2c2a] px-4 sm:px-8 py-3 shadow-md">
        <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between gap-3">
          
          {/* Left: Hamburger Button & Logo Branding */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Hamburger Button */}
            <button
              onClick={() => setIsHamburgerOpen(true)}
              title="Open Atelier Ops Navigation Menu"
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#8c7138] hover:bg-[#fed488] text-white hover:text-[#141414] text-xs font-bold transition-all shadow-sm active:scale-95 group border border-[#fed488]/30 cursor-pointer"
            >
              <Menu className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="uppercase tracking-wider font-bold text-[11px]">
                Menu
              </span>
            </button>

            <div className="h-6 w-px bg-white/20 hidden sm:block" />

            {/* Branding Logo */}
            <div className="flex items-center gap-3">
              <Logo className="h-6 w-auto" isLight />
            </div>
          </div>

          {/* Right: Emergency Stop & Logout Controls Only */}
          <div className="flex items-center gap-2">
            
            {/* Emergency Shutdown Trigger */}
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              title="Pause Store Orders"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                emergencyConfig.isActive
                  ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-950'
                  : 'bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/40'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {emergencyConfig.isActive ? 'Orders Paused' : 'Emergency Stop'}
              </span>
            </button>

            {/* Admin Logout Button */}
            <button
              onClick={onLogout}
              title="Logout from Admin Panel"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-rose-950/70 hover:text-rose-300 text-white/70 text-xs font-bold transition-colors border border-white/10 hover:border-rose-800/60 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Logout</span>
            </button>

          </div>

        </div>
      </header>

      {/* Live Telemetry Ticker */}
      <div className="bg-[#1e1e1e] text-white/90 border-b border-black/40 text-xs py-2.5 px-4 sm:px-8">
        <div className="w-full max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-2 text-[#fed488]">
            <Clock className="w-3.5 h-3.5" />
            <span>LIVE SALES SPEED: 241 ORDERS/HOUR</span>
          </div>
          <div className="flex items-center gap-4 text-white/70">
            <span>TOTAL PRODUCTS: <strong className="text-white">{products.length}</strong></span>
            <span>•</span>
            <span>ACTIVE ORDERS: <strong className="text-white">{orders.length}</strong></span>
            <span>•</span>
            <span className={`${emergencyConfig.isActive ? 'text-rose-400 font-bold animate-pulse' : 'text-emerald-400'} flex items-center gap-1`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {emergencyConfig.isActive ? 'ORDERS PAUSED' : 'COD SAFETY: ON'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Admin Workspace Container */}
      <main className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
        
        {/* Module Header & Hamburger Switcher Bar */}
        <div className="mb-6 bg-white p-4 sm:p-5 rounded-3xl border border-[#eae5dc] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-center text-[#8c7138] shadow-xs flex-shrink-0">
              {activeTab === 'overview' && <BarChart3 className="w-5 h-5" />}
              {activeTab === 'orders' && <Package className="w-5 h-5" />}
              {activeTab === 'inventory' && <Sparkles className="w-5 h-5" />}
              {activeTab === 'categories' && <Layers className="w-5 h-5" />}
              {activeTab === 'banners' && <Sparkles className="w-5 h-5" />}
              {activeTab === 'rto-shield' && <ShieldCheck className="w-5 h-5" />}
              {activeTab === 'exchanges' && <RotateCcw className="w-5 h-5" />}
              {activeTab === 'coupons' && <Tag className="w-5 h-5" />}
              {activeTab === 'settings' && <Settings className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#8c7138] uppercase font-bold tracking-widest bg-[#faf8f5] border border-[#eae5dc] px-2 py-0.5 rounded-full">
                  Active Module
                </span>
                {activeTab === 'orders' && (
                  <span className="text-[10px] font-mono font-bold bg-[#141414] text-[#fed488] px-2 py-0.2 rounded-full">
                    {orders.length} in queue
                  </span>
                )}
                {activeTab === 'inventory' && (
                  <span className="text-[10px] font-mono font-bold bg-[#141414] text-[#fed488] px-2 py-0.2 rounded-full">
                    {products.length} items
                  </span>
                )}
                {activeTab === 'categories' && (
                  <span className="text-[10px] font-mono font-bold bg-[#141414] text-[#fed488] px-2 py-0.2 rounded-full">
                    {categories.length} categories
                  </span>
                )}
                {activeTab === 'banners' && (
                  <span className="text-[10px] font-mono font-bold bg-[#141414] text-[#fed488] px-2 py-0.2 rounded-full">
                    {banners.length} banners
                  </span>
                )}
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#141414] mt-0.5">
                {tabLabels[activeTab]}
              </h2>
            </div>
          </div>

          {/* Direct Tab Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 p-1 bg-[#faf8f5] border border-[#eae5dc] rounded-full text-xs">
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  activeTab === 'categories'
                    ? 'bg-[#141414] text-[#fed488] shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Categories ({categories.length})
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  activeTab === 'inventory'
                    ? 'bg-[#141414] text-[#fed488] shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Stock ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-[#141414] text-[#fed488] shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('banners')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  activeTab === 'banners'
                    ? 'bg-[#141414] text-[#fed488] shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Banners
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <AdminAnalyticsView
            orders={orders}
            products={products}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'banners' && (
          <AdminBannersView
            topMarqueeItems={topMarqueeItems}
            bannerMarqueeItems={bannerMarqueeItems}
            banners={banners}
            salePosters={salePosters}
            skinSafeConfig={skinSafeConfig}
            saleBannerConfig={saleBannerConfig}
            onUpdateTopMarquee={onUpdateTopMarquee}
            onUpdateBannerMarquee={onUpdateBannerMarquee}
            onUpdateBanners={onUpdateBanners}
            onUpdateSalePosters={onUpdateSalePosters}
            onUpdateSkinSafeConfig={onUpdateSkinSafeConfig}
            onUpdateSaleBannerConfig={onUpdateSaleBannerConfig}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'orders' && (
          <AdminOrdersView
            orders={orders}
            products={products}
            onUpdateOrderStatus={onUpdateOrderStatus}
            onAddOrder={onAddOrder}
            onEditOrder={onEditOrder}
            onDeleteOrder={onDeleteOrder}
            onPrintOrder={(order) => setSelectedOrderForInvoice(order)}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'inventory' && (
          <AdminInventoryView
            products={products}
            categories={categories}
            onOpenNewProductModal={() => setIsNewProductModalOpen(true)}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
            onUpdateStock={onUpdateStock}
            onToggleLive={onToggleLive}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'categories' && (
          <AdminCategoriesView
            categories={categories}
            products={products}
            onAddCategory={(cat) => {
              if (onAddCategory) onAddCategory(cat);
              triggerToast(`Created category "${cat.name}"!`);
            }}
            onEditCategory={(oldName, updated) => {
              if (onEditCategory) onEditCategory(oldName, updated);
              triggerToast(`Updated category "${updated.name}"!`);
            }}
            onDeleteCategory={(catName) => {
              if (onDeleteCategory) onDeleteCategory(catName);
              triggerToast(`Removed category "${catName}".`);
            }}
            onAddProduct={onAddProduct}
            onEditProduct={onEditProduct}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'rto-shield' && (
          <AdminRtoShieldView onTriggerToast={triggerToast} />
        )}

        {activeTab === 'exchanges' && (
          <AdminExchangesView onTriggerToast={triggerToast} />
        )}

        {activeTab === 'coupons' && (
          <AdminCouponsView onTriggerToast={triggerToast} />
        )}

        {activeTab === 'settings' && (
          <AdminSettingsView onTriggerToast={triggerToast} />
        )}
      </main>

      {/* Hamburger Navigation Drawer (Contains all options + Logout + Store Dekho + Emergency Shutdown) */}
      <AdminHamburgerDrawer
        isOpen={isHamburgerOpen}
        onClose={() => setIsHamburgerOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          triggerToast(`Switched to ${tabLabels[tab]}.`);
        }}
        orderCount={orders.length}
        productCount={products.length}
        categoriesCount={categories.length}
        bannerCount={banners.length}
        onViewStore={onBackToStore}
        onLogout={onLogout}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        emergencyConfig={emergencyConfig}
      />

      {/* Emergency Storefront Shutdown Modal */}
      <AdminEmergencyShutdownModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        config={emergencyConfig}
        onSaveConfig={(newConfig) => {
          onUpdateEmergencyConfig(newConfig);
          if (newConfig.isActive) {
            triggerToast('🚨 Emergency Shutdown activated for storefront!');
          } else {
            triggerToast('Live storefront resumed and online!');
          }
        }}
      />

      {/* Thermal Invoice & Airway Bill Modal */}
      <AdminInvoiceModal
        order={selectedOrderForInvoice}
        onClose={() => setSelectedOrderForInvoice(null)}
      />

      {/* New Product Drop Modal */}
      <AdminProductModal
        isOpen={isNewProductModalOpen}
        onClose={() => setIsNewProductModalOpen(false)}
        categories={categories}
        onSaveProduct={(newProd) => {
          onAddProduct(newProd);
          triggerToast(`Published "${newProd.name}" directly to live storefront!`);
        }}
        onAddNewCategory={(newCat) => {
          if (onAddCategory) {
            onAddCategory({
              name: newCat,
              subtitle: `${newCat} Collection`,
              image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80'
            });
          }
        }}
      />

    </div>
  );
};
