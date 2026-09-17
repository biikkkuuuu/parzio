import React, { useState, useMemo, useEffect } from 'react';
import { Product, CategoryItem, CartItem, OrderItem, ActiveScreen, OrderStatus, EmergencyShutdownConfig, MarqueeItem, StoreBanner, SkinSafeConfig, SaleBannerConfig, SalePoster } from './types';
import { HERO_PRODUCT, VAULT_PRODUCTS, CATEGORIES_DATA } from './data/products';
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
import { WhyChooseParzio } from './components/WhyChooseParzio';
import { InstagramGrid } from './components/InstagramGrid';
import { BrandPromise } from './components/BrandPromise';
import { Footer } from './components/Footer';
import { TrackOrderView } from './components/TrackOrderView';
import { ExchangeView } from './components/ExchangeView';
import { AccountView } from './components/AccountView';
import { EmergencyStorefrontLockdown } from './components/EmergencyStorefrontLockdown';
import { dbService } from './services/dbService';

const AtelierOpsHub = React.lazy(() =>
  import('./components/AtelierOpsHub').then((m) => ({ default: m.AtelierOpsHub }))
);
import { CartDrawer } from './components/CartDrawer';
import { ProductModal } from './components/ProductModal';
import { ProductDetailView } from './components/ProductDetailView';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistView } from './components/WishlistView';
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

  // Helper to parse current location hash for persistent routing across page refreshes and back gestures
  const parseRoute = () => {
    if (typeof window === 'undefined') {
      return { type: 'tab', tab: 'home' as TabType, screen: 'storefront' as ActiveScreen, id: null as string | null, modal: null as string | null };
    }
    const hash = window.location.hash || '';
    let savedTab: TabType = 'home';
    try {
      const t = sessionStorage.getItem('parzio_last_tab');
      if (t === 'home' || t === 'sale' || t === 'track' || t === 'exchange' || t === 'account' || t === 'wishlist') {
        savedTab = t;
      }
    } catch {}

    if (hash === '#/bag' || hash === '#/cart' || hash === '#bag' || hash === '#cart') {
      return { type: 'tab', id: null, tab: savedTab, screen: 'storefront' as ActiveScreen, modal: 'cart' };
    }
    if (hash === '#/checkout' || hash === '#checkout') {
      return { type: 'tab', id: null, tab: savedTab, screen: 'storefront' as ActiveScreen, modal: 'checkout' };
    }
    if (hash === '#/wishlist' || hash === '#wishlist') {
      return { type: 'tab', id: null, tab: 'wishlist' as TabType, screen: 'storefront' as ActiveScreen, modal: null };
    }
    if (hash === '#/search' || hash === '#search') {
      return { type: 'tab', id: null, tab: savedTab, screen: 'storefront' as ActiveScreen, modal: 'search' };
    }
    if (hash === '#/menu' || hash === '#menu') {
      return { type: 'tab', id: null, tab: savedTab, screen: 'storefront' as ActiveScreen, modal: 'drawer' };
    }
    if (hash.startsWith('#/product/')) {
      const prodId = hash.replace('#/product/', '').trim();
      return { type: 'product', id: prodId, tab: savedTab, screen: 'storefront' as ActiveScreen, modal: null };
    }
    if (hash.startsWith('#/orders/') || hash.startsWith('#/track/')) {
      const orderId = hash.replace(/^#\/(orders|track)\//, '').trim();
      return { type: 'order', id: orderId, tab: 'track' as TabType, screen: 'storefront' as ActiveScreen, modal: null };
    }
    if (hash === '#/orders' || hash === '#/track' || hash === '#orders' || hash === '#track') {
      return { type: 'tab', id: null, tab: 'track' as TabType, screen: 'storefront' as ActiveScreen, modal: null };
    }
    if (hash === '#/sale' || hash === '#sale') {
      return { type: 'tab', id: null, tab: 'sale' as TabType, screen: 'storefront' as ActiveScreen, modal: null };
    }
    if (hash === '#/account' || hash === '#account') {
      return { type: 'tab', id: null, tab: 'account' as TabType, screen: 'storefront' as ActiveScreen, modal: null };
    }
    if (hash === '#/exchange' || hash === '#exchange') {
      return { type: 'tab', id: null, tab: 'exchange' as TabType, screen: 'storefront' as ActiveScreen, modal: null };
    }
    if (hash === '#/admin' || hash === '#admin') {
      return { type: 'screen', id: null, screen: 'atelier-ops' as ActiveScreen, tab: savedTab, modal: null };
    }
    return { type: 'tab', id: null, tab: 'home' as TabType, screen: 'storefront' as ActiveScreen, modal: null };
  };

  // Determine whether to display Phone layout or PC layout
  const isPhone = viewMode === 'phone' || (viewMode === 'auto' && isMobileScreen);

  // Parse initial route on page load/refresh
  const initialRoute = parseRoute();

  // Screen Routing: Customer Storefront vs Atelier Operations Hub (Persistent on refresh)
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(initialRoute.screen || 'storefront');

  // Mobile Bottom Tab Navigation (Persistent on refresh)
  const [activeTab, setActiveTab] = useState<TabType>(initialRoute.tab || 'home');

  // Products and Filtering (Unified Data Layer via dbService)
  const [products, setProducts] = useState<Product[]>(() => dbService.getProducts());

  useEffect(() => {
    dbService.saveProducts(products);
  }, [products]);

  const [activeCategory, setActiveCategory] = useState('NEW ARRIVALS');
  const [searchQuery, setSearchQuery] = useState('');

  // Categories State (Unified Data Layer via dbService)
  const [categories, setCategories] = useState<CategoryItem[]>(() => dbService.getCategories());

  useEffect(() => {
    dbService.saveCategories(categories);
  }, [categories]);

  // Background Cloud Sync & Realtime Listeners when Supabase is configured
  useEffect(() => {
    let isMounted = true;
    const syncFromCloud = async () => {
      if (dbService.isConfigured) {
        const [cloudProducts, cloudCategories, cloudOrders] = await Promise.all([
          dbService.fetchProductsFromCloud(),
          dbService.fetchCategoriesFromCloud(),
          dbService.fetchOrdersFromCloud(),
        ]);
        if (isMounted) {
          if (cloudProducts && cloudProducts.length > 0) setProducts(cloudProducts);
          if (cloudCategories && cloudCategories.length > 0) setCategories(cloudCategories);
          if (cloudOrders && cloudOrders.length > 0) setOrders(cloudOrders);
        }
      }
    };
    syncFromCloud();

    const unsubscribeOrders = dbService.subscribeToNewOrders((newOrder) => {
      setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
      showToast(`⚡ New Order Received: #${newOrder.id}`);
    });

    return () => {
      isMounted = false;
      if (unsubscribeOrders) unsubscribeOrders();
    };
  }, []);

  const handleAddCategory = (newCat: CategoryItem) => {
    setCategories((prev) => [...prev, newCat]);
    dbService.upsertCategory(newCat);
    showToast(`Category "${newCat.name}" created!`);
  };

  const handleEditCategory = (oldName: string, updatedCategory: CategoryItem) => {
    setCategories((prev) =>
      prev.map((c) => (c.name.toLowerCase() === oldName.toLowerCase() ? updatedCategory : c))
    );
    dbService.upsertCategory(updatedCategory);
    if (oldName.toLowerCase() !== updatedCategory.name.toLowerCase()) {
      setProducts((prev) =>
        prev.map((p) =>
          p.category.toLowerCase() === oldName.toLowerCase()
            ? { ...p, category: updatedCategory.name }
            : p
        )
      );
    }
    showToast(`Category "${updatedCategory.name}" updated!`);
  };

  const handleDeleteCategory = (catName: string) => {
    setCategories((prev) => prev.filter((c) => c.name.toLowerCase() !== catName.toLowerCase()));
    dbService.deleteCategory(catName);
    showToast(`Category "${catName}" removed.`);
  };

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    if (initialRoute.type === 'product' && initialRoute.id) {
      return [HERO_PRODUCT, ...VAULT_PRODUCTS].find((p) => p.id === initialRoute.id) || null;
    }
    return null;
  });

  // Drawers & Modals (Persistent on refresh)
  const [isDrawerOpen, setIsDrawerOpen] = useState(() => initialRoute.modal === 'drawer');
  const [isSearchOpen, setIsSearchOpen] = useState(() => initialRoute.modal === 'search');
  const [isCartOpen, setIsCartOpen] = useState(() => initialRoute.modal === 'cart');
  const [isWishlistOpen, setIsWishlistOpen] = useState(() => initialRoute.modal === 'wishlist');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(() => initialRoute.modal === 'checkout');
  const [selectedTrackOrderId, setSelectedTrackOrderId] = useState<string | null>(() => {
    if (initialRoute.type === 'order' && initialRoute.id) {
      return initialRoute.id;
    }
    return null;
  });

  // Cart & Wishlist (Persisted across sessions & refresh)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('parzio_cart_items');
      return saved ? JSON.parse(saved) : [{ product: HERO_PRODUCT, quantity: 1 }];
    } catch {
      return [{ product: HERO_PRODUCT, quantity: 1 }];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('parzio_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('parzio_wishlist_ids');
      return saved ? JSON.parse(saved) : ['prod-coin-bracelet'];
    } catch {
      return ['prod-coin-bracelet'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('parzio_wishlist_ids', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  // Orders State (Unified Data Layer via dbService)
  const [orders, setOrders] = useState<OrderItem[]>(() => dbService.getOrders());

  useEffect(() => {
    dbService.saveOrders(orders);
  }, [orders]);

  // Dynamic Banners and Moving Marquees (Unified Data Layer via dbService)
  const [banners, setBanners] = useState<StoreBanner[]>(() => dbService.getBanners());

  useEffect(() => {
    dbService.saveBanners(banners);
  }, [banners]);

  const [topMarqueeItems, setTopMarqueeItems] = useState<MarqueeItem[]>(() => dbService.getTopMarquee());

  useEffect(() => {
    dbService.saveTopMarquee(topMarqueeItems);
  }, [topMarqueeItems]);

  const [bannerMarqueeItems, setBannerMarqueeItems] = useState<MarqueeItem[]>(() => dbService.getBannerMarquee());

  useEffect(() => {
    dbService.saveBannerMarquee(bannerMarqueeItems);
  }, [bannerMarqueeItems]);

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
    dbService.upsertProduct(newProduct);
    showToast(`Published "${newProduct.name}" to live storefront catalog!`);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    dbService.upsertProduct(updatedProduct);
    showToast(`Updated "${updatedProduct.name}" details successfully!`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    dbService.deleteProduct(productId);
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

  // Browser History & Navigation Handlers (Back Button & Refresh Persistence support)
  const handleSelectProduct = (product: Product) => {
    window.history.pushState({ type: 'product', id: product.id }, '', `#/product/${product.id}`);
    setSelectedProduct(product);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleCloseProduct = () => {
    if (window.location.hash.startsWith('#/product/')) {
      window.history.back();
    } else {
      setSelectedProduct(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTabChange = (newTab: TabType) => {
    try {
      sessionStorage.setItem('parzio_last_tab', newTab);
    } catch {}
    const hash = newTab === 'home' ? '#/' : `#/${newTab === 'track' ? 'orders' : newTab}`;
    window.history.pushState({ type: 'tab', tab: newTab }, '', hash);
    setActiveTab(newTab);
    setSelectedProduct(null);
    setSelectedTrackOrderId(null);
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setIsCheckoutOpen(false);
    setIsSearchOpen(false);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenCart = () => {
    if (window.location.hash !== '#/bag' && window.location.hash !== '#/cart') {
      window.history.pushState({ modal: 'cart' }, '', '#/bag');
    }
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
    if (
      window.location.hash === '#/bag' ||
      window.location.hash === '#/cart' ||
      window.location.hash === '#bag' ||
      window.location.hash === '#cart'
    ) {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        const savedTab = (sessionStorage.getItem('parzio_last_tab') as TabType) || 'home';
        window.location.hash = savedTab === 'home' ? '#/' : `#/${savedTab === 'track' ? 'orders' : savedTab}`;
      }
    }
  };

  const handleOpenWishlist = () => {
    handleTabChange('wishlist');
  };

  const handleCloseWishlist = () => {
    setIsWishlistOpen(false);
    if (window.location.hash === '#/wishlist' || window.location.hash === '#wishlist') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        const savedTab = (sessionStorage.getItem('parzio_last_tab') as TabType) || 'home';
        window.location.hash = savedTab === 'home' ? '#/' : `#/${savedTab === 'track' ? 'orders' : savedTab}`;
      }
    }
  };

  const handleOpenCheckout = () => {
    if (window.location.hash !== '#/checkout' && window.location.hash !== '#checkout') {
      window.history.pushState({ modal: 'checkout' }, '', '#/checkout');
    }
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    if (window.location.hash === '#/checkout' || window.location.hash === '#checkout') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        const savedTab = (sessionStorage.getItem('parzio_last_tab') as TabType) || 'home';
        window.location.hash = savedTab === 'home' ? '#/' : `#/${savedTab === 'track' ? 'orders' : savedTab}`;
      }
    }
  };

  const handleOpenSearch = () => {
    if (window.location.hash !== '#/search' && window.location.hash !== '#search') {
      window.history.pushState({ modal: 'search' }, '', '#/search');
    }
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    if (window.location.hash === '#/search' || window.location.hash === '#search') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        const savedTab = (sessionStorage.getItem('parzio_last_tab') as TabType) || 'home';
        window.location.hash = savedTab === 'home' ? '#/' : `#/${savedTab === 'track' ? 'orders' : savedTab}`;
      }
    }
  };

  const handleOpenDrawer = () => {
    if (window.location.hash !== '#/menu' && window.location.hash !== '#menu') {
      window.history.pushState({ modal: 'drawer' }, '', '#/menu');
    }
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    if (window.location.hash === '#/menu' || window.location.hash === '#menu') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        const savedTab = (sessionStorage.getItem('parzio_last_tab') as TabType) || 'home';
        window.location.hash = savedTab === 'home' ? '#/' : `#/${savedTab === 'track' ? 'orders' : savedTab}`;
      }
    }
  };

  const handleOpenAtelierOps = () => {
    window.history.pushState({ view: 'atelier-ops' }, '', '#/admin');
    setActiveScreen('atelier-ops');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectTrackOrder = (order: OrderItem) => {
    window.history.pushState({ type: 'order', id: order.id }, '', `#/orders/${order.id}`);
    setSelectedTrackOrderId(order.id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackFromTrackOrder = () => {
    if (window.location.hash.includes('/orders/')) {
      window.history.back();
    } else {
      setSelectedTrackOrderId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Global popstate & hashchange event listener for hardware / browser back button and URL sync
  useEffect(() => {
    // If no initial hash on root, set it cleanly
    if (!window.location.hash) {
      window.history.replaceState({ type: 'root', tab: 'home' }, '', '#/');
    }

    const handlePopState = () => {
      const currentRoute = parseRoute();
      setActiveScreen(currentRoute.screen || 'storefront');
      setActiveTab(currentRoute.tab || 'home');

      setIsCartOpen(currentRoute.modal === 'cart');
      setIsCheckoutOpen(currentRoute.modal === 'checkout');
      setIsWishlistOpen(currentRoute.modal === 'wishlist');
      setIsSearchOpen(currentRoute.modal === 'search');
      setIsDrawerOpen(currentRoute.modal === 'drawer');

      if (currentRoute.type === 'product' && currentRoute.id) {
        const prod = [HERO_PRODUCT, ...VAULT_PRODUCTS].find((p) => p.id === currentRoute.id) || null;
        setSelectedProduct(prod);
      } else {
        setSelectedProduct(null);
      }

      if (currentRoute.type === 'order' && currentRoute.id) {
        setSelectedTrackOrderId(currentRoute.id);
      } else {
        setSelectedTrackOrderId(null);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

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
    if (activeCategory === 'NEW ARRIVALS' || activeCategory === 'ALL') {
      return prods;
    }
    if (activeCategory === 'BEST SELLERS' || activeCategory === 'BEST SELLER') {
      const best = prods.filter((p) => p.badge?.toUpperCase().includes('BEST SELLER'));
      return best.length > 0 ? best : prods.filter((p) => p.rating >= 4.9);
    }
    if (activeCategory === 'NEW LAUNCH') {
      const launched = prods.filter((p) => p.badge?.toUpperCase().includes('NEW LAUNCH') || p.badge?.toUpperCase().includes('HERO'));
      return launched.length > 0 ? launched : prods.slice(0, 12);
    }
    if (activeCategory === 'NEW COLLECTION') {
      const collection = prods.filter((p) => p.badge?.toUpperCase().includes('NEW COLLECTION') || p.badge?.toUpperCase().includes('VAULT'));
      return collection.length > 0 ? collection : prods;
    }
    if (activeCategory === 'MINIMALIST') {
      const mini = prods.filter((p) =>
        p.name.toLowerCase().includes('minimal') ||
        p.description.toLowerCase().includes('minimal') ||
        p.category.toLowerCase().includes('minimal') ||
        p.sku.toLowerCase().includes('mini')
      );
      return mini.length > 0 ? mini : prods;
    }
    const targetCat = activeCategory.toUpperCase();
    if (targetCat === 'OFFERS' || targetCat === 'SALE') {
      const discounted = prods.filter((p) => p.savePercent >= 35 || (p.originalPrice && p.originalPrice > p.price));
      return discounted.length > 0 ? discounted : prods;
    }
    const matched = prods.filter((prod) => {
      const prodCat = (prod.category || '').toUpperCase();
      const prodName = (prod.name || '').toUpperCase();
      if (prodCat === targetCat) return true;
      if (prodCat.includes(targetCat) || targetCat.includes(prodCat)) return true;
      if (targetCat === 'BANGLES' && (prodCat.includes('BRACELET') || prodName.includes('BANGLE'))) return true;
      if (targetCat === 'MANGALSUTRA' && (prodCat.includes('NECKLACE') || prodName.includes('MANGALSUTRA'))) return true;
      if (targetCat === 'JEWELLERY SETS' && (prodCat.includes('SET') || prodName.includes('SET'))) return true;
      if (targetCat === 'PERFUME' && (prodCat.includes('PERFUME') || prodCat.includes('FRAGRANCE') || prodName.includes('PERFUME'))) return true;
      if (targetCat === 'BEAUTY' && (prodCat.includes('BEAUTY') || prodCat.includes('CARE') || prodName.includes('FACEWASH') || prodName.includes('GLOW'))) return true;
      return false;
    });
    return matched.length > 0 ? matched : prods;
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

  // Order Handlers (Full CRUD for Admin Operations & Cloud Sync)
  const handleOrderPlaced = (newOrder: OrderItem) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    dbService.createOrder(newOrder);
    showToast(`Order #${newOrder.id} placed! Dispatched to Mumbai Atelier Ops.`);
  };

  const handleAddOrder = (newOrder: OrderItem) => {
    setOrders((prev) => [newOrder, ...prev]);
    dbService.createOrder(newOrder);
    showToast(`Manual order #${newOrder.id} created successfully!`);
  };

  const handleEditOrder = (updatedOrder: OrderItem) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === updatedOrder.id ? updatedOrder : ord))
    );
    dbService.updateOrderStatus(updatedOrder.id, updatedOrder.status, updatedOrder.trackingNumber);
    showToast(`Order #${updatedOrder.id} updated successfully!`);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    dbService.deleteOrder(orderId);
    showToast(`Order #${orderId} deleted from fulfillment queue.`);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    let trackingToUpdate: string | undefined;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          let tracking = ord.trackingNumber;
          if ((newStatus === 'Packed' || newStatus === 'Dispatched' || newStatus === 'In Transit') && !tracking) {
            const numPart = ord.id.replace(/[^0-9]/g, '') || Math.floor(100000 + Math.random() * 900000);
            tracking = `BD-${numPart}729`;
          }
          trackingToUpdate = tracking;
          return { ...ord, status: newStatus, trackingNumber: tracking };
        }
        return ord;
      })
    );
    dbService.updateOrderStatus(orderId, newStatus, trackingToUpdate);
  };

  const scrollToVault = () => {
    const el = document.getElementById('vault-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectCategory = (cat: string) => {
    const upper = cat.toUpperCase();
    setActiveCategory(upper === 'HOME' ? 'ALL' : upper);
    setSelectedProduct(null);
    if (window.location.hash.startsWith('#/product/')) {
      window.history.pushState({ type: 'tab', tab: 'home' }, '', '#/');
    }
    if (activeTab !== 'home') {
      setActiveTab('home');
      try {
        sessionStorage.setItem('parzio_last_tab', 'home');
      } catch {}
      window.history.pushState({ type: 'tab', tab: 'home' }, '', '#/');
    }
    // If Home is clicked, stay/scroll smoothly to top of home screen (Hero Banner)
    if (upper === 'HOME') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Specific category or 'ALL' / 'SHOP' selected -> scroll to product vault
      setTimeout(() => {
        scrollToVault();
      }, 80);
    }
  };

  // If Atelier Operations Hub view is active
  if (activeScreen === 'atelier-ops') {
    return (
      <React.Suspense
        fallback={
          <div className="min-h-screen bg-[#f4f2ee] flex items-center justify-center text-[#8c7138] font-bold text-sm">
            Loading Operations Hub...
          </div>
        }
      >
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
          categories={categories}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
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
      </React.Suspense>
    );
  }

  // If Emergency Shutdown is active with Full Lockdown Mode
  if (emergencyConfig.isActive && emergencyConfig.mode === 'full-lockdown' && activeScreen === 'storefront') {
    return (
      <>
        <EmergencyStorefrontLockdown
          config={emergencyConfig}
          onOpenAdmin={handleOpenAtelierOps}
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
            onClick={handleOpenAtelierOps}
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
          onSelectCategory={handleSelectCategory}
          activeScreen={activeScreen}
          onToggleScreen={(screen) => {
            if (screen === 'atelier-ops') {
              handleOpenAtelierOps();
            } else {
              setActiveScreen('storefront');
            }
          }}
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
        ) : activeTab === 'wishlist' ? (
          <main className="pb-16 md:pb-0">
            <WishlistView
              wishlistProducts={wishlistProducts}
              onAddToCart={handleAddToCart}
              onRemoveFromWishlist={handleToggleWishlist}
              onClearWishlist={() => {
                setWishlistIds([]);
                showToast('Wishlist cleared.');
              }}
              onSelectProduct={handleSelectProduct}
              onOpenCart={handleOpenCart}
              onBackToStore={() => handleTabChange('home')}
              onMoveAllToBag={() => {
                wishlistProducts.forEach((p) => handleAddToCart(p));
                showToast(`Moved ${wishlistProducts.length} pieces to your bag!`);
                handleOpenCart();
              }}
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
              banners={banners}
              onExploreVault={scrollToVault}
              onScrollToVault={scrollToVault}
            />

            {/* Shop by Category */}
            <Categories
              categories={categories}
              onSelectCategory={handleSelectCategory}
              selectedCategory={activeCategory}
            />

            {/* New Arrivals / Category Products */}
            <ProductVault
              products={filteredProducts}
              activeFilter={activeCategory}
              onSelectFilter={handleSelectCategory}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              onOpenProductModal={handleSelectProduct}
            />

            {/* Why Choose PARZIO */}
            <WhyChooseParzio />

            {/* What Our Customers Say */}
            <ReviewsSection />

            {/* Follow Us on Instagram */}
            <InstagramGrid />

            {/* Footer */}
            <Footer
              onSelectCategory={(cat) => {
                setActiveCategory(cat.toUpperCase());
                scrollToVault();
              }}
              onOpenAtelierOps={handleOpenAtelierOps}
            />
          </main>
        )}
      </div>

      {/* Global Modals & Drawers */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveTab('home');
          scrollToVault();
        }}
        onNavigateTab={(tab) => {
          handleTabChange(tab);
        }}
        onOpenAtelierOps={() => {
          handleCloseDrawer();
          handleOpenAtelierOps();
        }}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={handleCloseSearch}
        products={products}
        onSelectProduct={handleSelectProduct}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={handleCloseCart}
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
        onClose={handleCloseCheckout}
        cartItems={cartItems}
        totalAmount={cartTotal}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Storefront Enhancements: WhatsApp Concierge (Draggable) */}
      {activeScreen === 'storefront' && !emergencyConfig.isActive && (
        <>
          <WhatsAppSupport
            onNavigateTrackOrder={() => {
              handleTabChange('track');
            }}
          />
          {!selectedProduct && (
            <BottomNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              cartCount={cartCount}
              onOpenCart={handleOpenCart}
              onOpenProducts={() => {
                handleTabChange('sale');
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
