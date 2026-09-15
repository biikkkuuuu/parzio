import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, OrderItem, ActiveScreen, OrderStatus, EmergencyShutdownConfig, MarqueeItem, StoreBanner, SkinSafeConfig, SaleBannerConfig, SalePoster } from './types';
import { HERO_PRODUCT, VAULT_PRODUCTS } from './data/products';
import { INITIAL_ORDERS } from './data/orders';
import { INITIAL_BANNERS, INITIAL_TOP_MARQUEE, INITIAL_BANNER_MARQUEE, INITIAL_SALE_POSTERS } from './data/bannerData';
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
import { AtelierOpsHub } from './components/AtelierOpsHub';
import { EmergencyStorefrontLockdown } from './components/EmergencyStorefrontLockdown';
import { CartDrawer } from './components/CartDrawer';
import { ProductModal } from './components/ProductModal';
import { ProductDetailView } from './components/ProductDetailView';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistModal } from './components/WishlistModal';
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
  const [selectedTrackOrderId, setSelectedTrackOrderId] = useState<string | null>(null);

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

  const [skinSafeConfig, setSkinSafeConfig] = useState<SkinSafeConfig>(() => {
    try {
      const saved = localStorage.getItem('parzio_skin_banner_config');
      return saved
        ? JSON.parse(saved)
        : {
            eyebrow: 'DERMATOLOGICALLY TESTED',
            title: '100% Skin Safe & Hypoallergenic Guarantee',
            item1Title: 'NICKEL FREE',
            item1Desc: 'Zero skin irritation or itching',
            item2Title: 'LEAD FREE',
            item2Desc: 'Pure non-toxic demi-fine metal',
            item3Title: 'CADMIUM FREE',
            item3Desc: 'Certified safe for daily wear',
            item4Title: '100% WATERPROOF',
            item4Desc: 'Wear in gym, shower & pool'
          };
    } catch {
      return {
        eyebrow: 'DERMATOLOGICALLY TESTED',
        title: '100% Skin Safe & Hypoallergenic Guarantee',
        item1Title: 'NICKEL FREE',
        item1Desc: 'Zero skin irritation or itching',
        item2Title: 'LEAD FREE',
        item2Desc: 'Pure non-toxic demi-fine metal',
        item3Title: 'CADMIUM FREE',
        item3Desc: 'Certified safe for daily wear',
        item4Title: '100% WATERPROOF',
        item4Desc: 'Wear in gym, shower & pool'
      };
    }
  });

  const [saleBannerConfig, setSaleBannerConfig] = useState<SaleBannerConfig>(() => {
    try {
      const saved = localStorage.getItem('parzio_sale_banner_config');
      return saved
        ? JSON.parse(saved)
        : {
            badge: 'FLAT ₹99 MEGA SALE',
            title: 'PARZIO',
            highlightText: 'Sale Collection',
            subtitle: '316L Surgical Grade Stainless Steel • 100% Anti-Tarnish, Waterproof & Hypoallergenic'
          };
    } catch {
      return {
        badge: 'FLAT ₹99 MEGA SALE',
        title: 'PARZIO',
        highlightText: 'Sale Collection',
        subtitle: '316L Surgical Grade Stainless Steel • 100% Anti-Tarnish, Waterproof & Hypoallergenic'
      };
    }
  });

  const [salePosters, setSalePosters] = useState<SalePoster[]>(() => {
    try {
      const saved = localStorage.getItem('parzio_sale_posters');
      return saved ? JSON.parse(saved) : INITIAL_SALE_POSTERS;
    } catch {
      return INITIAL_SALE_POSTERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('parzio_sale_posters', JSON.stringify(salePosters));
    } catch (e) {
      console.error(e);
    }
  }, [salePosters]);

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

  useEffect(() => {
    try {
      localStorage.setItem('parzio_skin_banner_config', JSON.stringify(skinSafeConfig));
    } catch (e) {
      console.error(e);
    }
  }, [skinSafeConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('parzio_sale_banner_config', JSON.stringify(saleBannerConfig));
    } catch (e) {
      console.error(e);
    }
  }, [saleBannerConfig]);

  // Emergency Storefront Shutdown Configuration
  const [emergencyConfig, setEmergencyConfig] = useState<EmergencyShutdownConfig>({
    isActive: false,
    mode: 'full-lockdown',
    reason: 'Security & Gateway Audit',
    customMessage: 'Our digital vault and order processing are temporarily paused for security maintenance. Placed orders remain safe.',
    activatedAt: undefined
  });

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

  // Browser History & Navigation Handlers (Back Button support)
  const handleSelectProduct = (product: Product) => {
    window.history.pushState({ type: 'product', id: product.id }, '');
    setSelectedProduct(product);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleCloseProduct = () => {
    if (selectedProduct) {
      window.history.back();
    }
  };

  const handleTabChange = (newTab: TabType) => {
    if (newTab === activeTab && !selectedProduct && !selectedTrackOrderId) return;
    window.history.pushState({ type: 'tab', tab: newTab }, '');
    setActiveTab(newTab);
    setSelectedProduct(null);
    setSelectedTrackOrderId(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenCart = () => {
    window.history.pushState({ modal: 'cart' }, '');
    setIsCartOpen(true);
  };

  const handleOpenWishlist = () => {
    window.history.pushState({ modal: 'wishlist' }, '');
    setIsWishlistOpen(true);
  };

  const handleOpenCheckout = () => {
    window.history.pushState({ modal: 'checkout' }, '');
    setIsCheckoutOpen(true);
  };

  const handleOpenSearch = () => {
    window.history.pushState({ modal: 'search' }, '');
    setIsSearchOpen(true);
  };

  const handleOpenDrawer = () => {
    window.history.pushState({ modal: 'drawer' }, '');
    setIsDrawerOpen(true);
  };

  const handleOpenAtelierOps = () => {
    window.history.pushState({ view: 'atelier-ops' }, '');
    setActiveScreen('atelier-ops');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectTrackOrder = (order: OrderItem) => {
    window.history.pushState({ type: 'order', id: order.id }, '');
    setSelectedTrackOrderId(order.id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackFromTrackOrder = () => {
    window.history.back();
  };

  // Global popstate event listener for hardware / browser back button
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ type: 'root', tab: 'home' }, '');
    }

    const handlePopState = () => {
      // 1. Checkout modal open? Close it
      if (isCheckoutOpen) {
        setIsCheckoutOpen(false);
        return;
      }
      // 2. Cart drawer open? Close it
      if (isCartOpen) {
        setIsCartOpen(false);
        return;
      }
      // 3. Wishlist open? Close it
      if (isWishlistOpen) {
        setIsWishlistOpen(false);
        return;
      }
      // 4. Search open? Close it
      if (isSearchOpen) {
        setIsSearchOpen(false);
        return;
      }
      // 5. Drawer open? Close it
      if (isDrawerOpen) {
        setIsDrawerOpen(false);
        return;
      }
      // 6. Product Detail View open? Return to catalog
      if (selectedProduct) {
        setSelectedProduct(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      // 7. Atelier Ops open? Return to customer storefront
      if (activeScreen === 'atelier-ops') {
        setActiveScreen('storefront');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      // 8. Order detail inside Track open? Return to orders list
      if (selectedTrackOrderId) {
        setSelectedTrackOrderId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      // 9. If on another tab, return to Home tab
      if (activeTab !== 'home') {
        setActiveTab('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    isCheckoutOpen,
    isCartOpen,
    isWishlistOpen,
    isSearchOpen,
    isDrawerOpen,
    selectedProduct,
    activeScreen,
    selectedTrackOrderId,
    activeTab
  ]);

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
      prev.map((ord) => {
        if (ord.id === orderId) {
          let tracking = ord.trackingNumber;
          if ((newStatus === 'Packed' || newStatus === 'Dispatched' || newStatus === 'In Transit') && !tracking) {
            const numPart = ord.id.replace(/[^0-9]/g, '') || Math.floor(100000 + Math.random() * 900000);
            tracking = `BD-${numPart}729`;
          }
          return { ...ord, status: newStatus, trackingNumber: tracking };
        }
        return ord;
      })
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
      <AtelierOpsHub
        orders={orders}
        products={products}
        onBackToStore={() => {
          if (activeScreen === 'atelier-ops') {
            window.history.back();
          } else {
            setActiveScreen('storefront');
          }
        }}
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
        salePosters={salePosters}
        skinSafeConfig={skinSafeConfig}
        saleBannerConfig={saleBannerConfig}
        onUpdateTopMarquee={setTopMarqueeItems}
        onUpdateBannerMarquee={setBannerMarqueeItems}
        onUpdateBanners={setBanners}
        onUpdateSalePosters={setSalePosters}
        onUpdateSkinSafeConfig={setSkinSafeConfig}
        onUpdateSaleBannerConfig={setSaleBannerConfig}
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

      {/* Full Responsive Storefront */}
      <div className="flex-1 w-full bg-[#fbf9f6]">
        {/* Full Storefront Header */}
        <Header
          cartCount={cartCount}
          cartTotal={cartTotal}
          wishlistCount={wishlistIds.length}
          onOpenCart={handleOpenCart}
          onOpenWishlist={handleOpenWishlist}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          activeScreen={activeScreen}
          onToggleScreen={handleOpenAtelierOps}
          deviceMode="desktop"
          onToggleDeviceMode={() => {}}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          topMarqueeItems={topMarqueeItems}
        />

        {selectedProduct ? (
          <ProductDetailView
            product={selectedProduct}
            onBack={handleCloseProduct}
            onAddToCart={(p, qty) => {
              for (let i = 0; i < (qty || 1); i++) {
                handleAddToCart(p);
              }
              showToast(`Added ${qty || 1} x ${p.name} to your bag!`);
            }}
            onBuyNow={(p, qty) => {
              for (let i = 0; i < (qty || 1); i++) {
                handleAddToCart(p);
              }
              setIsCartOpen(false);
              handleOpenCheckout();
            }}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            onSelectProduct={(p) => {
              handleSelectProduct(p);
            }}
          />
        ) : activeTab === 'sale' ? (
          <main className="pb-16 md:pb-0">
            <SalesSection
              products={products}
              onAddToCart={handleAddToCart}
              onOpenProductModal={handleSelectProduct}
              bannerConfig={saleBannerConfig}
              salePosters={salePosters}
            />
            <Footer
              onSelectCategory={(cat) => {
                handleTabChange('home');
                setActiveCategory(cat.toUpperCase());
                scrollToVault();
              }}
              onOpenQualityModal={() => {
                handleTabChange('home');
                setTimeout(() => {
                  const el = document.getElementById('quality-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              onOpenAtelierOps={handleOpenAtelierOps}
            />
          </main>
        ) : activeTab === 'track' ? (
          <main className="pb-16 md:pb-0">
            <TrackOrderView
              orders={orders}
              selectedOrderId={selectedTrackOrderId}
              onSelectOrder={handleSelectTrackOrder}
              onBackToOrders={handleBackFromTrackOrder}
            />
          </main>
        ) : activeTab === 'exchange' ? (
          <main className="pb-16 md:pb-0">
            <ExchangeView
              orders={orders}
            />
          </main>
        ) : activeTab === 'account' ? (
          <main className="pb-16 md:pb-0">
            <AccountView
              orders={orders}
              onOpenWishlist={handleOpenWishlist}
              onOpenAtelierOps={handleOpenAtelierOps}
              onTrackOrder={() => {
                handleTabChange('track');
              }}
            />
          </main>
        ) : (
          <main className="pb-16 md:pb-0">
            {/* Hero Section */}
            <HeroBanner
              heroProduct={HERO_PRODUCT}
              onExploreVault={scrollToVault}
              onScrollToVault={scrollToVault}
              onAddToCart={handleAddToCart}
              onOpenProductModal={handleSelectProduct}
              banners={banners}
              bannerMarqueeItems={bannerMarqueeItems}
            />

            {/* New Collections Round Categories */}
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
              onOpenProductModal={handleSelectProduct}
            />

            {/* Skin Safe Quality Guarantee Banner */}
            <SkinSafeBanner
              config={skinSafeConfig}
              onExploreNewArrivals={() => {
                setActiveCategory('NEW ARRIVALS');
                scrollToVault();
              }}
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
            />
          </main>
        )}
      </div>

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
        onClose={() => {
          if (isSearchOpen) window.history.back();
        }}
        products={products}
        onSelectProduct={handleSelectProduct}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => {
          if (isCartOpen) window.history.back();
        }}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          if (emergencyConfig.isActive) {
            showToast('🚨 Storefront is under Emergency Shutdown. Checkout is temporarily paused.');
            return;
          }
          setIsCartOpen(false);
          handleOpenCheckout();
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          if (isCheckoutOpen) window.history.back();
        }}
        cartItems={cartItems}
        totalAmount={cartTotal}
        onOrderPlaced={handleOrderPlaced}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => {
          if (isWishlistOpen) window.history.back();
        }}
        wishlistProducts={wishlistProducts}
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleToggleWishlist}
        onSelectProduct={handleSelectProduct}
      />

      {/* Storefront Enhancements: WhatsApp Concierge (Draggable) */}
      {activeScreen === 'storefront' && !emergencyConfig.isActive && (
        <>
          <WhatsAppSupport
            onNavigateTrackOrder={() => {
              handleTabChange('track');
            }}
          />
          <BottomNav
            activeTab={activeTab}
            onTabChange={handleTabChange}
            cartCount={cartCount}
            onOpenCart={handleOpenCart}
            onOpenProducts={() => {
              handleTabChange('sale');
            }}
          />
        </>
      )}
    </div>
  );
}
