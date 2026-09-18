import React, { useState, useMemo, useEffect } from 'react';
import { Product, CategoryItem, CartItem, OrderItem, ActiveScreen, OrderStatus, EmergencyShutdownConfig, MarqueeItem, StoreBanner, SkinSafeConfig, SaleBannerConfig, SalePoster, Coupon } from './types';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { userService, UserProfile } from './services/userService';
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
import { EmergencyStorefrontLockdown } from './components/EmergencyStorefrontLockdown';
import { dbService } from './services/dbService';

import { useCartStore } from './store/useCartStore';
import { useUIStore } from './store/useUIStore';

// Lazy load non-critical full screens and modals to improve bundle size and initial load performance
const AtelierOpsHub = React.lazy(() => import('./components/AtelierOpsHub').then(m => ({ default: m.AtelierOpsHub })));
const AdminProtected = React.lazy(() => import('./components/admin/AdminProtected').then(m => ({ default: m.AdminProtected })));
const TrackOrderView = React.lazy(() => import('./components/TrackOrderView').then(m => ({ default: m.TrackOrderView })));
const ExchangeView = React.lazy(() => import('./components/ExchangeView').then(m => ({ default: m.ExchangeView })));
const AccountView = React.lazy(() => import('./components/AccountView').then(m => ({ default: m.AccountView })));
const OffersView = React.lazy(() => import('./components/OffersView').then(m => ({ default: m.OffersView })));
const CategoryPageView = React.lazy(() => import('./components/CategoryPageView').then(m => ({ default: m.CategoryPageView })));
const AllCategoriesView = React.lazy(() => import('./components/AllCategoriesView').then(m => ({ default: m.AllCategoriesView })));
const CartDrawer = React.lazy(() => import('./components/CartDrawer').then(m => ({ default: m.CartDrawer })));
const ProductModal = React.lazy(() => import('./components/ProductModal').then(m => ({ default: m.ProductModal })));
const ProductDetailView = React.lazy(() => import('./components/ProductDetailView').then(m => ({ default: m.ProductDetailView })));
const CheckoutView = React.lazy(() => import('./components/CheckoutView').then(m => ({ default: m.CheckoutView })));
const UserLoginModal = React.lazy(() => import('./components/UserLoginModal').then(m => ({ default: m.UserLoginModal })));
const WishlistView = React.lazy(() => import('./components/WishlistView').then(m => ({ default: m.WishlistView })));
const SearchModal = React.lazy(() => import('./components/SearchModal').then(m => ({ default: m.SearchModal })));

import { SalesSection } from './components/SalesSection';
import { WhatsAppSupport } from './components/WhatsAppSupport';
import { LivePurchaseToast } from './components/LivePurchaseToast';
import { Smartphone, Monitor, ShieldCheck, AlertOctagon } from 'lucide-react';

export default function App() {
  // Screen mode: 'auto' | 'phone' | 'pc'
  const [viewMode, setViewMode] = useState<'auto' | 'phone' | 'pc'>('auto');

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('parzio_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('parzio_user_profile', JSON.stringify(userProfile));
    } else {
      try {
        localStorage.removeItem('parzio_user_profile');
      } catch {}
    }
  }, [userProfile]);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Only load profile if parzio_user_profile is present in storage
        const saved = localStorage.getItem('parzio_user_profile');
        if (!saved) {
          const profile = await userService.getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

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
    let hash = window.location.hash || '';
    const path = window.location.pathname;
    
    // SEO Routing Support: Treat real URLs like /product/123 as hashes so the custom router handles them
    if ((!hash || hash === '#/') && path && path !== '/') {
      hash = '#' + path;
    }

    let savedTab: TabType = 'home';
    try {
      const t = sessionStorage.getItem('parzio_last_tab');
      if (t === 'home' || t === 'sale' || t === 'offers' || t === 'category' || t === 'track' || t === 'exchange' || t === 'account' || t === 'wishlist') {
        savedTab = t;
      }
    } catch {}

    if (hash === '#/bag' || hash === '#/cart' || hash === '#bag' || hash === '#cart') {
      return { type: 'tab', id: null, tab: savedTab, screen: 'storefront' as ActiveScreen, modal: 'cart' };
    }
    if (hash === '#/checkout' || hash === '#checkout') {
      return { type: 'tab', id: null, tab: 'checkout' as TabType, screen: 'storefront' as ActiveScreen, modal: null };
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
    if (hash === '#/categories' || hash === '#/all-categories' || hash === '#categories' || hash === '#all-categories') {
      return { type: 'tab', id: null, tab: 'all-categories' as TabType, screen: 'storefront' as ActiveScreen, modal: null };
    }
    if (hash.startsWith('#/category/') || hash.startsWith('#/collection/')) {
      const catName = decodeURIComponent(hash.replace(/^#\/(category|collection)\//, '')).trim();
      return { type: 'category', id: catName, tab: 'category' as TabType, screen: 'storefront' as ActiveScreen, modal: null };
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
    if (hash === '#/offers' || hash === '#offers') {
      return { type: 'tab', id: null, tab: 'offers' as TabType, screen: 'storefront' as ActiveScreen, modal: null };
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
  const activeScreen = useUIStore(state => state.activeScreen);
  const setActiveScreen = useUIStore(state => state.setActiveScreen);

  // Initialize activeScreen from route on first load only
  useEffect(() => {
    if (initialRoute.screen) {
      setActiveScreen(initialRoute.screen);
    }
  }, []);

  // Mobile Bottom Tab Navigation (Persistent on refresh)
  const [activeTab, setActiveTab] = useState<TabType | 'checkout'>(initialRoute.tab || 'home');

  // Products and Filtering (Unified Data Layer via dbService)
  const [products, setProducts] = useState<Product[]>(() => dbService.getProducts());

  useEffect(() => {
    dbService.saveProducts(products);
  }, [products]);

  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (initialRoute.type === 'category' && initialRoute.id) {
      return initialRoute.id;
    }
    return 'NEW ARRIVALS';
  });
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

  // Drawers & Modals (Zustand Global State)
  const isDrawerOpen = useUIStore(state => state.isDrawerOpen);
  const setIsDrawerOpen = useUIStore(state => state.setIsDrawerOpen);
  const isSearchOpen = useUIStore(state => state.isSearchOpen);
  const setIsSearchOpen = useUIStore(state => state.setIsSearchOpen);
  const isCartOpen = useUIStore(state => state.isCartOpen);
  const setIsCartOpen = useUIStore(state => state.setIsCartOpen);
  const isWishlistOpen = useUIStore(state => state.isWishlistOpen);
  const setIsWishlistOpen = useUIStore(state => state.setIsWishlistOpen);

  // Sync initial route with UI Store
  useEffect(() => {
    if (initialRoute.modal === 'drawer') setIsDrawerOpen(true);
    if (initialRoute.modal === 'search') setIsSearchOpen(true);
    if (initialRoute.modal === 'cart') setIsCartOpen(true);
    if (initialRoute.modal === 'wishlist') setIsWishlistOpen(true);
  }, []);

  const [selectedTrackOrderId, setSelectedTrackOrderId] = useState<string | null>(() => {
    if (initialRoute.type === 'order' && initialRoute.id) {
      return initialRoute.id;
    }
    return null;
  });

  // Cart (Zustand Global State)
  const cartItems = useCartStore(state => state.cartItems);
  const addToCartAction = useCartStore(state => state.addToCart);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const clearCart = useCartStore(state => state.clearCart);

  // We keep the old setCartItems wrapper for compatibility with older components passing it as a prop
  const setCartItems = (items: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    if (typeof items === 'function') {
      const result = items(cartItems);
      useCartStore.setState({ cartItems: result });
    } else {
      useCartStore.setState({ cartItems: items });
    }
  };

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

  // Coupons State (Unified Data Layer via dbService)
  const [coupons, setCoupons] = useState<Coupon[]>(() => dbService.getCoupons());

  useEffect(() => {
    try {
      localStorage.setItem('parzio_coupons', JSON.stringify(coupons));
      dbService.saveCoupons(coupons);
    } catch (e) {
      console.error(e);
    }
  }, [coupons]);

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

  const handleTabChange = (newTab: TabType | 'checkout') => {
    if (newTab !== 'checkout') {
      try {
        sessionStorage.setItem('parzio_last_tab', newTab);
      } catch {}
    }
    const hash =
      newTab === 'home'
        ? '#/'
        : newTab === 'all-categories'
        ? '#/categories'
        : newTab === 'checkout'
        ? '#/checkout'
        : `#/${newTab === 'track' ? 'orders' : newTab}`;
    window.history.pushState({ type: 'tab', tab: newTab }, '', hash);
    setActiveTab(newTab);
    setSelectedProduct(null);
    setSelectedTrackOrderId(null);
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setIsSearchOpen(false);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleUserLogout = () => {
    setUserProfile(null);
    setCurrentUser(null);
    try {
      localStorage.removeItem('parzio_user_profile');
    } catch {}
    if (auth) {
      auth.signOut().catch(() => {});
    }
    showToast('Logged out of PARZIO successfully.');
    handleTabChange('home');
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
    handleTabChange('checkout');
  };

  const handleCloseCheckout = () => {
    handleTabChange('home');
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

      if (currentRoute.type === 'category' && currentRoute.id) {
        setActiveCategory(currentRoute.id);
        setActiveTab('category');
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
      if (targetCat === 'BEAUTY' && (prodCat.includes('BEAUTY') || prodCat.includes('CARE') || prodCat.includes('FACEWASH') || prodName.includes('GLOW'))) return true;
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
    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      dbService.saveOrders(updated);
      return updated;
    });
    setCartItems([]);
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
    if (upper === 'ALL_CATEGORIES' || upper === 'ALL CATEGORIES' || upper === 'CATEGORIES') {
      handleTabChange('all-categories');
      return;
    }
    if (upper === 'OFFERS') {
      handleTabChange('offers');
      return;
    }
    if (upper === 'SHOP') {
      setActiveCategory('SHOP');
      setSelectedProduct(null);
      if (activeTab !== 'home') {
        handleTabChange('home');
      }
      setTimeout(() => {
        const el = document.getElementById('categories-section');
        if (el) {
          const headerOffset = 90;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          });
        }
      }, 100);
      return;
    }
    if (upper === 'HOME') {
      setActiveCategory('ALL');
      setSelectedProduct(null);
      if (activeTab !== 'home') {
        handleTabChange('home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Specific category selected (Bangles, Bracelets, Mangalsutra, etc.) -> Open dedicated Category Page!
    setActiveCategory(cat);
    setSelectedProduct(null);
    setActiveTab('category');
    try {
      sessionStorage.setItem('parzio_last_tab', 'category');
    } catch {}
    window.history.pushState({ type: 'category', id: cat }, '', `#/category/${encodeURIComponent(cat.toLowerCase())}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeScreen === 'atelier-ops') {
    return (
      <AdminProtected>
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
              sessionStorage.removeItem('parzio_admin_auth');
              if (auth) {
                auth.signOut().catch(() => {});
              }
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
            coupons={coupons}
            onUpdateCoupons={(updated) => {
              setCoupons(updated);
              dbService.saveCoupons(updated);
            }}
          />
        </React.Suspense>
      </AdminProtected>
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
    <React.Suspense fallback={<div className="h-screen w-full bg-[#f8f6f0] flex items-center justify-center animate-pulse"><div className="w-10 h-10 border-4 border-[#141414] border-t-transparent rounded-full animate-spin"></div></div>}>
      <div className="min-h-screen bg-[#f8f6f0] flex flex-col font-sans transition-colors duration-300">
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
        {/* Full Storefront Header - Hidden during checkout */}
        {activeTab !== 'checkout' && (
          <Header
            cartCount={cartCount}
            cartTotal={cartTotal}
            wishlistCount={wishlistIds.length}
            onOpenCart={handleOpenCart}
            onOpenWishlist={handleOpenWishlist}
            onOpenAccount={() => handleTabChange('account')}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            activeTab={activeTab}
            onNavigateTab={handleTabChange}
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
            userProfile={userProfile}
            onLoginClick={() => setIsLoginModalOpen(true)}
          />
        )}

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
        ) : activeTab === 'offers' ? (
          <main className="pb-16 md:pb-0">
            <OffersView
              coupons={coupons}
              onSelectCategory={handleSelectCategory}
              onBackToStore={() => handleTabChange('home')}
              onOpenAtelierOps={handleOpenAtelierOps}
            />
          </main>
        ) : activeTab === 'category' ? (
          <main className="pb-16 md:pb-0">
            <CategoryPageView
              categoryName={activeCategory}
              categories={categories}
              products={products}
              onSelectCategory={handleSelectCategory}
              onBackToHome={() => handleTabChange('home')}
              onAddToCart={(p) => {
                handleAddToCart(p);
                showToast(`Added ${p.name} to your bag!`);
              }}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              onSelectProduct={handleSelectProduct}
              onOpenAtelierOps={handleOpenAtelierOps}
            />
          </main>
        ) : activeTab === 'all-categories' ? (
          <main className="pb-16 md:pb-0">
            <AllCategoriesView
              categories={categories}
              products={products}
              onSelectCategory={(cat) => {
                handleSelectCategory(cat);
              }}
              onBackToHome={() => handleTabChange('home')}
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
              userProfile={userProfile}
              onLogout={handleUserLogout}
              onLoginClick={() => setIsLoginModalOpen(true)}
              onOpenWishlist={handleOpenWishlist}
              onOpenAtelierOps={handleOpenAtelierOps}
              onTrackOrder={() => {
                handleTabChange('track');
              }}
            />
          </main>
        ) : activeTab === 'checkout' ? (
          <main className="pb-16 md:pb-0">
            <CheckoutView
              cartItems={cartItems}
              totalAmount={cartTotal}
              onOrderPlaced={(order) => {
                handleOrderPlaced(order);
                handleTabChange('track');
              }}
              userProfile={userProfile}
              onBack={() => handleTabChange('home')}
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
              onViewAllCategories={() => handleTabChange('all-categories')}
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
        userProfile={userProfile}
        onLogout={handleUserLogout}
        onLoginClick={() => {
          handleCloseDrawer();
          setIsLoginModalOpen(true);
        }}
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

      {isSearchOpen && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={handleCloseSearch}
          products={products}
          onSelectProduct={handleSelectProduct}
          onAddToCart={handleAddToCart}
        />
      )}

      {isLoginModalOpen && (
        <UserLoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={(profile) => {
            setUserProfile(profile);
            showToast(`Welcome back, ${profile.name}!`);
          }}
        />
      )}

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
          handleTabChange('checkout');
        }}
      />



      {/* Storefront Enhancements: WhatsApp Concierge (Draggable) */}
      {activeScreen === 'storefront' && !emergencyConfig.isActive && (
        <>
          <WhatsAppSupport
            onNavigateTrackOrder={() => {
              handleTabChange('track');
            }}
          />
          {activeTab !== 'checkout' && (
            <BottomNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              cartCount={cartCount}
              onOpenCart={handleOpenCart}
              onCloseCart={handleCloseCart}
              isCartOpen={isCartOpen}
              onOpenProducts={() => {
                handleTabChange('sale');
              }}
            />
          )}
        </>
      )}
      </div>
    </React.Suspense>
  );
}
