import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, OrderItem, ActiveScreen, OrderStatus, EmergencyShutdownConfig, MarqueeItem, StoreBanner } from './types';
import { HERO_PRODUCT, VAULT_PRODUCTS } from './data/products';
import { INITIAL_ORDERS } from './data/orders';
import { INITIAL_BANNERS, INITIAL_TOP_MARQUEE, INITIAL_BANNER_MARQUEE } from './data/bannerData';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MobileHeader } from './components/MobileHeader';
import { SkinSafeBanner } from './components/SkinSafeBanner';
import { BottomNav, TabType } from './components/BottomNav';
import { MobileDrawer } from './components/MobileDrawer';
import { Categories } from './components/Categories';
import { ProductVault } from './components/ProductVault';
import { QualityCheckSection } from './components/QualityCheckSection';
import { ReviewsSection } from './components/ReviewsSection';
import { BrandPromise } from './components/BrandPromise';
import { Footer } from './components/Footer';
import { TrackOrderView } from './components/TrackOrderView';
import { ExchangeView } from './components/ExchangeView';
import { AccountView } from './components/AccountView';
import { EmergencyStorefrontLockdown } from './components/EmergencyStorefrontLockdown';
import { NotFoundPage } from './components/NotFoundPage';

// Lazy-load heavy Atelier Operations Admin suite for faster storefront loading
const AtelierOpsHub = React.lazy(() => import('./components/AtelierOpsHub').then(m => ({ default: m.AtelierOpsHub })));
import { CartDrawer } from './components/CartDrawer';
import { ProductModal } from './components/ProductModal';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistModal } from './components/WishlistModal';
import { PolicyModal, PolicyTab } from './components/PolicyModal';
import { SearchModal } from './components/SearchModal';
import { SalesSection } from './components/SalesSection';
import { WhatsAppSupport } from './components/WhatsAppSupport';
import { LivePurchaseToast } from './components/LivePurchaseToast';
import { Smartphone, Monitor, ShieldCheck, AlertOctagon } from 'lucide-react';

export default function App() {
  // Screen mode: 'auto' | 'phone' | 'pc'
  const [viewMode, setViewMode] = useState<'auto' | 'phone' | 'pc'>('auto');

  // Screen width detection for responsive auto-switching
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine whether to display Phone layout or PC layout
  const isPhone = viewMode === 'phone' || (viewMode === 'auto' && isMobileScreen);

  // Screen Routing: Customer Storefront vs Atelier Operations Hub
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('storefront');

  // Mobile Bottom Tab Navigation (Home, Sale, Track, Exchange, Account)
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Products and Filtering
  const [products, setProducts] = useState<Product[]>(VAULT_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState('NEW ARRIVALS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Drawers & Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Cart & Wishlist
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: HERO_PRODUCT, quantity: 1 }
  ]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['prod-coin-bracelet']);

  // Orders State (Seeded with real demo orders for Ops & Tracking)
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);

  // Dynamic Banners and Moving Marquees (Editable via Admin Panel)
  const [banners, setBanners] = useState<StoreBanner[]>(() => {
    try {
      const saved = localStorage.getItem('parzio_banners');
      return saved ? JSON.parse(saved) : INITIAL_BANNERS;
    } catch {
      return INITIAL_BANNERS;
    }
  });

  const [topMarqueeItems, setTopMarqueeItems] = useState<MarqueeItem[]>(() => {
    try {
      const saved = localStorage.getItem('parzio_top_marquee');
      return saved ? JSON.parse(saved) : INITIAL_TOP_MARQUEE;
    } catch {
      return INITIAL_TOP_MARQUEE;
    }
  });

  const [bannerMarqueeItems, setBannerMarqueeItems] = useState<MarqueeItem[]>(() => {
    try {
      const saved = localStorage.getItem('parzio_banner_marquee');
      return saved ? JSON.parse(saved) : INITIAL_BANNER_MARQUEE;
    } catch {
      return INITIAL_BANNER_MARQUEE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('parzio_banners', JSON.stringify(banners));
    } catch (e) {
      console.error(e);
    }
  }, [banners]);

  useEffect(() => {
    try {
      localStorage.setItem('parzio_top_marquee', JSON.stringify(topMarqueeItems));
    } catch (e) {
      console.error(e);
    }
  }, [topMarqueeItems]);

  useEffect(() => {
    try {
      localStorage.setItem('parzio_banner_marquee', JSON.stringify(bannerMarqueeItems));
    } catch (e) {
      console.error(e);
    }
  }, [bannerMarqueeItems]);

  // Emergency Storefront Shutdown Configuration
  const [emergencyConfig, setEmergencyConfig] = useState<EmergencyShutdownConfig>({
    isActive: false,
    mode: 'full-lockdown',
    reason: 'Security & Gateway Audit',
    customMessage: 'Our digital vault and order processing are temporarily paused for security maintenance. Placed orders remain safe.',
    allowBrowsing: false
  });

  // Legal & Compliance Policy Modal State (Razorpay & DPDPA)
  const [isPolicyOpen, setIsPolicyOpen] = useState<boolean>(false);
  const [policyInitialTab, setPolicyInitialTab] = useState<PolicyTab>('privacy');

  const handleOpenPolicy = (tab: PolicyTab = 'privacy') => {
    setPolicyInitialTab(tab);
    setIsPolicyOpen(true);
  };

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Product Handlers for Production Admin (Full CRUD)
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Published "${newProduct.name}" to live storefront catalog!`);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    showToast(`Updated "${updatedProduct.name}" details successfully!`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    showToast('Product removed from live storefront catalog.');
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
  };

  const handleToggleLive = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isLive: p.isLive === false ? true : false } : p
      )
    );
  };

  // Cart Totals
  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );
  const cartTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [cartItems]
  );

  // Filtered Products for Vault & Sale
  const filteredProducts = useMemo(() => {
    let prods = products.filter((p) => p.isLive !== false);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      prods = prods.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (activeCategory === 'NEW ARRIVALS' || activeCategory === 'ALL' || activeCategory === 'BEST SELLERS') {
      return prods;
    }
    return prods.filter(
      (prod) => prod.category.toUpperCase() === activeCategory.toUpperCase()
    );
  }, [products, activeCategory, searchQuery]);

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to bag (₹${product.price})!`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist Handlers
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from saved wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist ✨');
        return [...prev, productId];
      }
    });
  };

  const wishlistProducts = useMemo(() => {
    return [HERO_PRODUCT, ...VAULT_PRODUCTS].filter((p) => wishlistIds.includes(p.id));
  }, [wishlistIds]);

  // Order Handlers (Full CRUD for Admin Operations)
  const handleOrderPlaced = (newOrder: OrderItem) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    showToast(`Order #${newOrder.id} placed! Dispatched to Mumbai Atelier Ops.`);
  };

  const handleAddOrder = (newOrder: OrderItem) => {
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Manual order #${newOrder.id} created successfully!`);
  };

  const handleEditOrder = (updatedOrder: OrderItem) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === updatedOrder.id ? updatedOrder : ord))
    );
    showToast(`Order #${updatedOrder.id} updated successfully!`);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    showToast(`Order #${orderId} deleted from fulfillment queue.`);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const scrollToVault = () => {
    const el = document.getElementById('vault-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If Atelier Operations Hub view is active
  if (activeScreen === 'atelier-ops') {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-[#8c7138] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="font-display tracking-widest uppercase text-xs text-[#fed488]">Loading Atelier Operations Hub...</p>
          </div>
        </div>
      }>
        <AtelierOpsHub
          orders={orders}
          products={products}
          onBackToStore={() => setActiveScreen('storefront')}
          onLogout={() => {
            setActiveScreen('storefront');
            showToast('Admin session logged out successfully.');
          }}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onAddOrder={handleAddOrder}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateStock={handleUpdateStock}
          onToggleLive={handleToggleLive}
          emergencyConfig={emergencyConfig}
          onUpdateEmergencyConfig={setEmergencyConfig}
          topMarqueeItems={topMarqueeItems}
          bannerMarqueeItems={bannerMarqueeItems}
          banners={banners}
          onUpdateTopMarquee={setTopMarqueeItems}
          onUpdateBannerMarquee={setBannerMarqueeItems}
          onUpdateBanners={setBanners}
        />
      </React.Suspense>
    );
  }

  // If 404 Page Not Found view is requested
  if (activeScreen === '404') {
    return (
      <NotFoundPage
        onBackToHome={() => setActiveScreen('storefront')}
        onExploreVault={() => {
          setActiveScreen('storefront');
          setTimeout(() => scrollToVault(), 100);
        }}
        onSearch={(q) => {
          setSearchQuery(q);
          setActiveScreen('storefront');
          setTimeout(() => scrollToVault(), 100);
        }}
      />
    );
  }

  // If Emergency Shutdown is active with Full Lockdown Mode
  if (emergencyConfig.isActive && emergencyConfig.mode === 'full-lockdown' && activeScreen === 'storefront') {
    return (
      <>
        <EmergencyStorefrontLockdown
          config={emergencyConfig}
          onOpenAdmin={() => setActiveScreen('atelier-ops')}
        />
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[100] bg-[#141414] text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-[#8c7138] text-xs font-semibold animate-fadeIn whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[#fed488]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3efe9] selection:bg-[#141414] selection:text-white text-[#141414] flex flex-col">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[100] bg-[#141414] text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-[#8c7138] text-xs font-semibold animate-fadeIn whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-[#fed488]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Emergency Broadcast Banner when active in checkout-paused mode */}
      {emergencyConfig.isActive && (
        <div className="bg-rose-950 text-rose-200 border-b border-rose-800 px-4 py-2 text-xs font-semibold flex items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
            <span className="font-bold text-white uppercase text-[10px] tracking-wider">
              EMERGENCY NOTICE:
            </span>
            <span className="text-white/90 text-xs">
              {emergencyConfig.customMessage}
            </span>
          </div>
          <button
            onClick={() => setActiveScreen('atelier-ops')}
            className="px-2.5 py-1 rounded bg-white text-rose-950 text-[10px] font-bold uppercase tracking-wider hover:bg-rose-100 flex-shrink-0"
          >
            Admin Manage
          </button>
        </div>
      )}

      {/* Top Device Mode Bar (Only visible on Desktop/PC for preview switching; Completely removed on Mobile screens) */}
      <header className="hidden md:flex bg-[#141414] text-white px-3 py-1.5 items-center justify-between border-b border-[#2e3131] z-40 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#fed488] tracking-wider uppercase text-[10px]">
            PARZIO ATELIER
          </span>
          <span className="text-[#555] hidden xs:inline">•</span>
          <span className="text-[#c4c7c7] text-[11px]">
            {isPhone ? '📱 Mobile Preview' : '💻 Desktop Storefront'}
          </span>
          {emergencyConfig.isActive && (
            <span className="px-2 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-mono font-bold animate-pulse">
              🚨 SHUTDOWN ACTIVE
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode('phone')}
            title="Switch to Mobile Phone Preview"
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
              isPhone
                ? 'bg-[#8c7138] text-white shadow-sm font-bold'
                : 'text-[#c4c7c7] hover:text-white bg-[#222424]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile View</span>
          </button>
          <button
            onClick={() => setViewMode('pc')}
            title="Switch to PC Desktop Version"
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
              !isPhone
                ? 'bg-[#8c7138] text-white shadow-sm font-bold'
                : 'text-[#c4c7c7] hover:text-white bg-[#222424]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop View</span>
          </button>

          <div className="h-4 w-px bg-[#2e3131] mx-1" />

          <button
            onClick={() => setActiveScreen('atelier-ops')}
            title="Open Full Production Admin Ops Hub"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#222424] text-[#fed488] hover:bg-[#8c7138] hover:text-white border border-[#2e3131] shadow-xs transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin Ops</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. PHONE VERSION: Responsive full-screen mobile app layout */}
      {/* ========================================================================= */}
      {isPhone ? (
        <div className="flex-1 flex justify-center items-start w-full bg-[#fbf9f6]">
          <div className="w-full max-w-md min-h-screen bg-[#fbf9f6] flex flex-col relative pb-20 md:border-x md:border-[#eae5dc] md:shadow-2xl">
            
            {/* Top Fixed Mobile Header */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#eae5dc]">
              <MobileHeader
                onOpenDrawer={() => setIsDrawerOpen(true)}
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenCart={() => setIsCartOpen(true)}
                cartCount={cartCount}
                topMarqueeItems={topMarqueeItems}
              />
            </div>

            {/* Content Area */}
            <main
              id="phone-scroll-area"
              className="flex-1 bg-[#fbf9f6]"
            >
              {/* Home Tab */}
              {activeTab === 'home' && (
                <div>
                  {/* Hero Banner with Right-to-Left Ticker & Dynamic Carousel */}
                  <HeroBanner
                    heroProduct={HERO_PRODUCT}
                    onExploreVault={scrollToVault}
                    onScrollToVault={scrollToVault}
                    onAddToCart={handleAddToCart}
                    onOpenProductModal={setSelectedProduct}
                    banners={banners}
                    bannerMarqueeItems={bannerMarqueeItems}
                  />

                  {/* Skin Safe Jewellery Banner matching Image 2 */}
                  <SkinSafeBanner
                    onExploreNewArrivals={() => {
                      setActiveCategory('NEW ARRIVALS');
                      scrollToVault();
                    }}
                  />

                  {/* Category Filter Pills */}
                  <Categories
                    onSelectCategory={(cat) => {
                      setActiveCategory(cat.toUpperCase());
                      scrollToVault();
                    }}
                    selectedCategory={activeCategory}
                  />

                  {/* The ₹99 Anti-Tarnish Vault (Exact WhatsApp Image Cards) */}
                  <ProductVault
                    products={filteredProducts}
                    activeFilter={activeCategory}
                    onSelectFilter={setActiveCategory}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    wishlistIds={wishlistIds}
                    onOpenProductModal={setSelectedProduct}
                  />

                  {/* 5-Step Quality Check Standards */}
                  <QualityCheckSection />

                  {/* Google Verified Reviews */}
                  <ReviewsSection />

                  {/* The PRAO Promise */}
                  <BrandPromise />

                  {/* Footer */}
                  <Footer
                    onSelectCategory={(cat) => {
                      setActiveCategory(cat.toUpperCase());
                      scrollToVault();
                    }}
                    onOpenQualityModal={() => {
                      const el = document.getElementById('quality-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onOpenAtelierOps={() => setActiveScreen('atelier-ops')}
                    onOpenPolicy={handleOpenPolicy}
                  />
                </div>
              )}

              {/* Sale Tab: Exact WhatsApp Image 2026-09-14 at 3.25.42 PM.jpeg 2-column view */}
              {activeTab === 'sale' && (
                <SalesSection
                  products={VAULT_PRODUCTS}
                  onAddToCart={handleAddToCart}
                  onOpenProductModal={setSelectedProduct}
                />
              )}

              {/* Track Order Tab */}
              {activeTab === 'track' && (
                <TrackOrderView orders={orders} />
              )}

              {/* Exchange Tab */}
              {activeTab === 'exchange' && (
                <ExchangeView orders={orders} />
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <AccountView
                  orders={orders}
                  onOpenWishlist={() => setIsWishlistOpen(true)}
                  onOpenAtelierOps={() => setActiveScreen('atelier-ops')}
                  onTrackOrder={() => setActiveTab('track')}
                />
              )}
            </main>

            {/* FIRMLY PINNED BOTTOM NAVIGATION BAR */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white/95 backdrop-blur-md border-t border-[#eae5dc] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
              <BottomNav
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>

          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. PC VERSION (Full Desktop Storefront — NO BOTTOM BUTTONS!)               */
        /* ========================================================================= */
        <div className="flex-1 w-full bg-[#fbf9f6]">
          {/* Full Desktop Header */}
          <Header
            cartCount={cartCount}
            cartTotal={cartTotal}
            wishlistCount={wishlistIds.length}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            activeScreen={activeScreen}
            onToggleScreen={setActiveScreen}
            deviceMode="desktop"
            onToggleDeviceMode={() => setViewMode('phone')}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            topMarqueeItems={topMarqueeItems}
          />

          <main>
            {/* Desktop Hero Section */}
            <HeroBanner
              heroProduct={HERO_PRODUCT}
              onExploreVault={scrollToVault}
              onScrollToVault={scrollToVault}
              onAddToCart={handleAddToCart}
              onOpenProductModal={setSelectedProduct}
              banners={banners}
              bannerMarqueeItems={bannerMarqueeItems}
            />

            {/* Skin Safe Quality Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <SkinSafeBanner
                onExploreNewArrivals={() => {
                  setActiveCategory('NEW ARRIVALS');
                  scrollToVault();
                }}
              />
            </div>

            {/* Category Nav */}
            <Categories
              onSelectCategory={(cat) => {
                setActiveCategory(cat.toUpperCase());
                scrollToVault();
              }}
              selectedCategory={activeCategory}
            />

            {/* The ₹99 Anti-Tarnish Vault */}
            <ProductVault
              products={filteredProducts}
              activeFilter={activeCategory}
              onSelectFilter={setActiveCategory}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              onOpenProductModal={setSelectedProduct}
            />

            {/* 5-Step Quality Check Standards */}
            <QualityCheckSection />

            {/* Google Verified Reviews */}
            <ReviewsSection />

            {/* The PRAO Promise */}
            <BrandPromise />

            {/* Desktop Footer (NO bottom buttons here!) */}
            <Footer
              onSelectCategory={(cat) => {
                setActiveCategory(cat.toUpperCase());
                scrollToVault();
              }}
              onOpenQualityModal={() => {
                const el = document.getElementById('quality-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenAtelierOps={() => setActiveScreen('atelier-ops')}
              onOpenPolicy={handleOpenPolicy}
            />
          </main>
        </div>
      )}

      {/* Global Modals & Drawers */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveTab('home');
          scrollToVault();
        }}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
        }}
        onOpenAtelierOps={() => setActiveScreen('atelier-ops')}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={setSelectedProduct}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          if (emergencyConfig.isActive) {
            showToast('🚨 Storefront is under Emergency Shutdown. Checkout is temporarily paused.');
            return;
          }
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totalAmount={cartTotal}
        onOrderPlaced={handleOrderPlaced}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleToggleWishlist}
      />

      <PolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
        initialTab={policyInitialTab}
      />

      {/* Storefront Enhancements: WhatsApp Concierge & Live Purchase Social Proof */}
      {activeScreen === 'storefront' && !emergencyConfig.isActive && (
        <>
          <LivePurchaseToast />
          <WhatsAppSupport
            onNavigateTrackOrder={() => {
              setActiveTab('track');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}
    </div>
  );
}
