import React, { useState } from 'react';
import { OrderItem, OrderStatus, Product, CategoryItem, AdminTab, EmergencyShutdownConfig, MarqueeItem, StoreBanner, SkinSafeConfig, SaleBannerConfig, SalePoster, Coupon, ExchangeRequest, AbandonedLead } from '../types';
import { PincodeItem, GlobalStoreSettings } from '../services/dbService';
import { AdminAnalyticsView } from './admin/AdminAnalyticsView';
import { AdminOrdersView } from './admin/AdminOrdersView';
import { AdminLeadsView } from './admin/AdminLeadsView';
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
  onDeleteAllProducts?: () => void;
  onAddCategory?: (category: CategoryItem) => void;
  onEditCategory?: (oldName: string, updatedCategory: CategoryItem) => void;
  onDeleteCategory?: (categoryName: string) => void;
  onDeleteAllCategories?: () => void;
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
  coupons?: Coupon[];
  onUpdateCoupons?: (coupons: Coupon[]) => void;
  exchanges?: ExchangeRequest[];
  onAddExchange?: (req: ExchangeRequest) => void;
  onEditExchange?: (req: ExchangeRequest) => void;
  onDeleteExchange?: (id: string) => void;
  pincodes?: PincodeItem[];
  onUpdatePincodes?: (pincodes: PincodeItem[]) => void;
  storeSettings?: GlobalStoreSettings;
  onUpdateStoreSettings?: (settings: GlobalStoreSettings) => void;
  abandonedLeads?: AbandonedLead[];
  onRefreshLeads?: () => void;
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
  onDeleteAllProducts,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onDeleteAllCategories,
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
  onUpdateSaleBannerConfig,
  coupons,
  onUpdateCoupons,
  exchanges,
  onAddExchange,
  onEditExchange,
  onDeleteExchange,
  pincodes,
  onUpdatePincodes,
  storeSettings,
  onUpdateStoreSettings,
  abandonedLeads = [],
  onRefreshLeads
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
    leads: 'Abandoned Checkout Leads',
    inventory: 'Products & Stock',
    categories: 'Categories & Collections',
    banners: 'Banners & Marquee',
    'rto-shield': 'Cash on Delivery Safety',
    exchanges: 'Exchanges & Returns',
    coupons: 'Coupons & Discounts',
    settings: 'Store Settings'
  };

  const tabDescriptions: Record<AdminTab, string> = {
    overview: 'Real-time overview of store performance, revenue, and active orders.',
    orders: 'View, process, track status, and generate packing slips for customer orders.',
    leads: 'Track and re-engage visitors who dropped off at checkout via WhatsApp & Fast2SMS.',
    inventory: 'Manage catalog products, stock quantity, price points, and live status.',
    categories: 'Organize jewellery collections, classifications, and category tags.',
    banners: 'Configure top announcement ticker and storefront promotional banners.',
    'rto-shield': 'Cash on delivery fraud prevention, customer verification, and delivery risk shield.',
    exchanges: 'Review, approve, and manage customer replacement and return requests.',
    coupons: 'Create promotional discounts and secret single-use customer vouchers.',
    settings: 'Configure store operations, WhatsApp chat number, and preferences.'
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#141414] font-sans antialiased selection:bg-[#fed488] selection:text-[#141414]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#141414] text-[#fed488] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-[#8c7138] animate-bounce text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-[#fed488]" />
          <span className="text-white">{toastMessage}</span>
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

      {/* Top Admin App Bar - Matching Storefront Clean Luxury Aesthetic */}
      <header className="sticky top-0 z-40 bg-white text-[#141414] border-b border-[#eae5dc] px-4 sm:px-8 py-3 shadow-xs">
        <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between gap-3">
          
          {/* Left: Hamburger Button & Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Hamburger Button */}
            <button
              onClick={() => setIsHamburgerOpen(true)}
              title="Open Navigation Menu"
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#141414] hover:bg-[#8c7138] text-white text-xs font-bold transition-all shadow-xs active:scale-95 group border border-black/10 cursor-pointer"
            >
              <Menu className="w-4 h-4 group-hover:scale-110 transition-transform text-[#fed488]" />
              <span className="uppercase tracking-wider font-bold text-[11px]">
                Menu
              </span>
            </button>

            <div className="h-6 w-px bg-[#eae5dc] hidden sm:block" />

            {/* Clean Admin Label (No Logo) */}
            <div className="flex items-center gap-2.5">
              <span className="font-display font-bold text-sm sm:text-base tracking-wide text-[#141414] uppercase">
                Admin Panel
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-[10px] font-bold text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
          </div>

          {/* Right: Quick Storefront Switcher, Emergency Stop & Logout Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Direct Storefront Switcher Button */}
            <button
              onClick={onBackToStore}
              title="View Live Storefront"
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#faf8f5] hover:bg-[#eae5dc] text-[#141414] border border-[#eae5dc] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <Store className="w-3.5 h-3.5 text-[#8c7138]" />
              <span className="hidden sm:inline">Storefront</span>
              <span className="text-[10px] text-[#8c7138]">↗</span>
            </button>

            {/* Emergency Shutdown Trigger */}
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              title="Pause Store Orders"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                emergencyConfig.isActive
                  ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-950'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">
                {emergencyConfig.isActive ? 'Orders Paused' : 'Emergency Stop'}
              </span>
            </button>

            {/* Admin Logout Button */}
            <button
              onClick={onLogout}
              title="Logout from Admin Panel"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-rose-50 hover:text-rose-700 text-neutral-600 border border-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Logout</span>
            </button>

          </div>

        </div>
      </header>

      {/* Live Telemetry Ticker - Warm Clean Ivory Aesthetic */}
      <div className="bg-[#faf8f5] text-[#5c5f5e] border-b border-[#eae5dc] text-xs py-2 px-4 sm:px-8">
        <div className="w-full max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] font-medium">
          <div className="flex items-center gap-2 text-[#8c7138] font-bold">
            <Clock className="w-3.5 h-3.5 text-[#8c7138]" />
            <span>LIVE SALES SPEED: {orders.length > 0 ? `${orders.length} ORDERS/HOUR` : '0 ORDERS/HOUR'}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-[#747878] font-mono text-[11px]">
            <span>TOTAL PRODUCTS: <strong className="text-[#141414]">{products.length}</strong></span>
            <span>•</span>
            <span>ACTIVE ORDERS: <strong className="text-[#141414]">{orders.length}</strong></span>
            <span>•</span>
            <span className={`${emergencyConfig.isActive ? 'text-rose-600 font-bold animate-pulse' : 'text-emerald-700'} flex items-center gap-1 font-bold`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {emergencyConfig.isActive ? 'ORDERS PAUSED' : 'COD SAFETY: ON'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Admin Workspace Container */}
      <main className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
        
        {/* Clean Page Heading */}
        <div className="mb-6 pb-2 border-b border-[#eae5dc]/80">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#141414] tracking-tight">
            {tabLabels[activeTab]}
          </h1>
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

        {activeTab === 'leads' && (
          <AdminLeadsView
            leads={abandonedLeads}
            onRefresh={onRefreshLeads}
          />
        )}

        {activeTab === 'inventory' && (
          <AdminInventoryView
            products={products}
            categories={categories}
            onOpenNewProductModal={() => setIsNewProductModalOpen(true)}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
            onDeleteAllProducts={onDeleteAllProducts}
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
            onDeleteAllCategories={onDeleteAllCategories}
            onAddProduct={onAddProduct}
            onEditProduct={onEditProduct}
            onDeleteProduct={(prodId) => {
              onDeleteProduct(prodId);
              triggerToast('Product deleted successfully from catalog.');
            }}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'rto-shield' && (
          <AdminRtoShieldView
            pincodes={pincodes}
            onUpdatePincodes={onUpdatePincodes}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'exchanges' && (
          <AdminExchangesView
            exchanges={exchanges}
            onAddExchange={onAddExchange}
            onEditExchange={onEditExchange}
            onDeleteExchange={onDeleteExchange}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'coupons' && (
          <AdminCouponsView
            coupons={coupons}
            onUpdateCoupons={onUpdateCoupons}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettingsView
            settings={storeSettings}
            onUpdateSettings={onUpdateStoreSettings}
            onTriggerToast={triggerToast}
          />
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
        leadsCount={(abandonedLeads || []).filter((l) => l.status === 'pending').length}
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
        defaultCategory={categories && categories.length > 0 ? categories[0].name : undefined}
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
