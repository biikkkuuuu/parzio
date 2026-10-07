import {
  Product,
  CategoryItem,
  OrderItem,
  StoreBanner,
  MarqueeItem,
  Coupon,
  InstagramPostItem,
  ExchangeRequest,
  SkinSafeConfig,
  SaleBannerConfig,
  SalePoster
} from '../types';
import { INITIAL_ORDERS } from '../data/orders';
import {
  INITIAL_BANNERS,
  INITIAL_TOP_MARQUEE,
  INITIAL_BANNER_MARQUEE,
  INITIAL_INSTAGRAM_POSTS,
  INITIAL_SALE_POSTERS
} from '../data/bannerData';
import { INITIAL_COUPONS, INITIAL_EXCHANGES, HIGH_RISK_PINCODES } from '../data/adminData';
import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';

// Local Storage Keys for zero-latency client-side cache
const KEYS = {
  PRODUCTS: 'parzio_products',
  CATEGORIES: 'parzio_categories',
  ORDERS: 'parzio_orders',
  BANNERS: 'parzio_banners',
  TOP_MARQUEE: 'parzio_top_marquee',
  BANNER_MARQUEE: 'parzio_banner_marquee',
  COUPONS: 'parzio_coupons',
  SALE_POSTERS: 'parzio_sale_posters',
  SKIN_SAFE: 'parzio_skin_banner_config',
  SALE_BANNER: 'parzio_sale_banner_config',
  EXCHANGES: 'parzio_exchanges',
  PINCODES: 'parzio_rto_pincodes',
  STORE_SETTINGS: 'parzio_store_settings',
  INSTAGRAM_POSTS: 'parzio_instagram_posts',
};

export interface PincodeItem {
  pincode: string;
  area: string;
  rtoRate: number;
  status: string;
  action: string;
}

export interface GlobalStoreSettings {
  freeShippingThreshold: number;
  codFee: number;
  blueDartKey: string;
  delhiveryKey: string;
  whatsappApi: string;
  allowReversePickup: boolean;
  acceptCod: boolean;
  updatedAt?: string;
}

const DEFAULT_STORE_SETTINGS: GlobalStoreSettings = {
  freeShippingThreshold: 500,
  codFee: 0,
  blueDartKey: 'BLUEDART_PROD_LIVE_88329',
  delhiveryKey: 'DELHIVERY_TOKEN_SEC_99182',
  whatsappApi: 'META_WHATSAPP_CLOUD_PROD_4412',
  allowReversePickup: true,
  acceptCod: true,
};

const DEFAULT_SKIN_SAFE: SkinSafeConfig = {
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

const DEFAULT_SALE_BANNER: SaleBannerConfig = {
  badge: 'FLAT ₹99 MEGA SALE',
  title: 'PARZIO',
  highlightText: 'FESTIVE CLEARANCE VAULT',
  subtitle: 'Flat ₹99 On Everything. 100% Anti-Tarnish. Limited Stock.'
};

/**
 * Helper to strip undefined values so Firebase Firestore setDoc never throws
 * "Unsupported field value: undefined"
 */
function sanitizeForFirestore<T>(data: T): T {
  try {
    return JSON.parse(JSON.stringify(data));
  } catch {
    return data;
  }
}

/**
 * dbService: Production-Grade Unified Data Access Layer
 * Powered by Google Cloud Firestore + Local Cache.
 * Ensures bidirectional live sync for Products, Categories, Orders, Coupons,
 * Banners, Marquee, Sale Posters, Exchanges, Pincodes, and Gateway Settings.
 */
export const dbService = {
  isConfigured: isFirebaseConfigured(),

  // ================= PRODUCTS =================
  getProducts(): Product[] {
    try {
      const saved = localStorage.getItem(KEYS.PRODUCTS);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {}
    return [];
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to cache products', e);
    }
  },

  async fetchProductsFromCloud(): Promise<Product[] | null> {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const q = query(collection(db, 'products'));
      const snapshot = await getDocs(q);
      const products: Product[] = [];
      snapshot.forEach((docSnap) => {
        products.push(docSnap.data() as Product);
      });
      this.saveProducts(products);
      return products;
    } catch (e) {
      console.warn('Firebase products fetch fallback to local cache:', e);
    }
    return null;
  },

  subscribeToProducts(onProductsChange: (products: Product[]) => void) {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const q = query(collection(db, 'products'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const products: Product[] = [];
        snapshot.forEach((docSnap) => {
          products.push(docSnap.data() as Product);
        });
        this.saveProducts(products);
        onProductsChange(products);
      }, (error) => {
        console.warn('Firebase products realtime listener warning:', error);
      });
      return unsubscribe;
    } catch (e) {
      console.error('Firebase realtime products subscription error:', e);
      return null;
    }
  },

  async upsertProduct(product: Product): Promise<Product> {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    const updated = index >= 0
      ? products.map((p) => (p.id === product.id ? product : p))
      : [product, ...products];
    this.saveProducts(updated);

    if (db && isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'products', product.id), sanitizeForFirestore(product));
      } catch (e) {
        console.error('Failed to sync product to Firebase:', e);
      }
    }
    return product;
  },

  async deleteProduct(productId: string): Promise<void> {
    const products = this.getProducts().filter((p) => p.id !== productId);
    this.saveProducts(products);

    if (db && isFirebaseConfigured()) {
      try {
        await deleteDoc(doc(db, 'products', productId));
      } catch (e) {
        console.error('Failed to delete product from Firebase:', e);
      }
    }
  },

  // ================= CATEGORIES =================
  getCategories(): CategoryItem[] {
    try {
      const saved = localStorage.getItem(KEYS.CATEGORIES);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  },

  saveCategories(categories: CategoryItem[]): void {
    try {
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to cache categories', e);
    }
  },

  async fetchCategoriesFromCloud(): Promise<CategoryItem[] | null> {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      const categories: CategoryItem[] = [];
      snapshot.forEach((docSnap) => {
        categories.push(docSnap.data() as CategoryItem);
      });
      this.saveCategories(categories);
      return categories;
    } catch (e) {
      console.warn('Firebase categories fetch fallback:', e);
    }
    return null;
  },

  subscribeToCategories(onCategoriesChange: (categories: CategoryItem[]) => void) {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
        const categories: CategoryItem[] = [];
        snapshot.forEach((docSnap) => {
          categories.push(docSnap.data() as CategoryItem);
        });
        this.saveCategories(categories);
        onCategoriesChange(categories);
      });
      return unsubscribe;
    } catch (e) {
      return null;
    }
  },

  async upsertCategory(cat: CategoryItem): Promise<CategoryItem> {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.name.toLowerCase() === cat.name.toLowerCase());
    const updated = index >= 0
      ? categories.map((c) => (c.name.toLowerCase() === cat.name.toLowerCase() ? cat : c))
      : [...categories, cat];
    this.saveCategories(updated);

    if (db && isFirebaseConfigured()) {
      try {
        const catId = cat.id || 'cat-' + cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        await setDoc(doc(db, 'categories', catId), sanitizeForFirestore({ ...cat, id: catId }));
      } catch (e) {
        console.error('Failed to sync category to Firebase:', e);
      }
    }
    return cat;
  },

  async deleteCategory(catName: string): Promise<void> {
    const categories = this.getCategories().filter(
      (c) => c.name.toLowerCase() !== catName.toLowerCase()
    );
    this.saveCategories(categories);

    if (db && isFirebaseConfigured()) {
      try {
        const catId = 'cat-' + catName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        await deleteDoc(doc(db, 'categories', catId));
      } catch (e) {
        console.error('Failed to delete category from Firebase:', e);
      }
    }
  },

  // ================= ORDERS =================
  getOrders(): OrderItem[] {
    try {
      const saved = localStorage.getItem(KEYS.ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return INITIAL_ORDERS;
  },

  saveOrders(orders: OrderItem[]): void {
    try {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to cache orders', e);
    }
  },

  async fetchOrdersFromCloud(): Promise<OrderItem[] | null> {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const q = query(collection(db, 'orders'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const orders: OrderItem[] = [];
        snapshot.forEach((docSnap) => {
          orders.push(docSnap.data() as OrderItem);
        });
        this.saveOrders(orders);
        return orders;
      }
    } catch (e) {
      console.warn('Firebase orders fetch fallback:', e);
    }
    return null;
  },

  async createOrder(order: OrderItem): Promise<OrderItem> {
    const orders = this.getOrders();
    const updatedOrders = [order, ...orders];
    this.saveOrders(updatedOrders);

    if (db && isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'orders', order.id), sanitizeForFirestore(order));
      } catch (e) {
        console.error('Failed to create order in Firebase:', e);
      }
    }
    return order;
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderItem['status'],
    trackingNumber?: string
  ): Promise<OrderItem[]> {
    const orders = this.getOrders();
    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status,
            trackingNumber: trackingNumber || o.trackingNumber,
          }
        : o
    );
    this.saveOrders(updated);

    if (db && isFirebaseConfigured()) {
      try {
        const payload: any = { status };
        if (trackingNumber) payload.trackingNumber = trackingNumber;
        await updateDoc(doc(db, 'orders', orderId), payload);
      } catch (e) {
        console.error('Failed to update order in Firebase:', e);
      }
    }
    return updated;
  },

  async deleteOrder(orderId: string): Promise<void> {
    const orders = this.getOrders().filter((o) => o.id !== orderId);
    this.saveOrders(orders);

    if (db && isFirebaseConfigured()) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
      } catch (e) {
        console.error('Failed to delete order from Firebase:', e);
      }
    }
  },

  subscribeToNewOrders(onNewOrder: (order: OrderItem) => void) {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const q = query(collection(db, 'orders'), orderBy('placedAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const newOrder = change.doc.data() as OrderItem;
            onNewOrder(newOrder);
          }
        });
      });
      return unsubscribe;
    } catch (e) {
      return null;
    }
  },

  // ================= COUPONS =================
  getCoupons(): Coupon[] {
    try {
      const saved = localStorage.getItem(KEYS.COUPONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_COUPONS;
  },

  saveCouponsLocally(coupons: Coupon[]): void {
    try {
      localStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
    } catch {}
  },

  async saveCoupons(coupons: Coupon[]): Promise<void> {
    this.saveCouponsLocally(coupons);
    if (db && isFirebaseConfigured()) {
      try {
        const batch = writeBatch(db);
        for (const c of coupons) {
          batch.set(doc(db, 'coupons', c.id), sanitizeForFirestore(c));
        }
        await batch.commit();
      } catch (e) {
        console.error('Failed to sync coupons to Firebase:', e);
      }
    }
  },

  async fetchCouponsFromCloud(): Promise<Coupon[] | null> {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const snapshot = await getDocs(collection(db, 'coupons'));
      if (!snapshot.empty) {
        const coupons: Coupon[] = [];
        snapshot.forEach((d) => coupons.push(d.data() as Coupon));
        this.saveCouponsLocally(coupons);
        return coupons;
      } else {
        await this.saveCoupons(INITIAL_COUPONS);
        return INITIAL_COUPONS;
      }
    } catch (e) {
      console.warn('Firebase coupons fetch fallback:', e);
    }
    return null;
  },

  subscribeToCoupons(onCouponsChange: (coupons: Coupon[]) => void) {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const unsubscribe = onSnapshot(collection(db, 'coupons'), (snapshot) => {
        if (!snapshot.empty) {
          const list: Coupon[] = [];
          snapshot.forEach((d) => list.push(d.data() as Coupon));
          this.saveCouponsLocally(list);
          onCouponsChange(list);
        }
      });
      return unsubscribe;
    } catch (e) {
      return null;
    }
  },

  async upsertCoupon(coupon: Coupon): Promise<Coupon> {
    const list = this.getCoupons();
    const idx = list.findIndex((c) => c.id === coupon.id || c.code.toUpperCase() === coupon.code.toUpperCase());
    const updated = idx >= 0
      ? list.map((c, i) => (i === idx ? coupon : c))
      : [coupon, ...list];
    this.saveCouponsLocally(updated);

    if (db && isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'coupons', coupon.id), sanitizeForFirestore(coupon));
      } catch (e) {
        console.error('Failed to sync coupon to Firebase:', e);
      }
    }
    return coupon;
  },

  async deleteCoupon(couponId: string): Promise<void> {
    const list = this.getCoupons().filter((c) => c.id !== couponId);
    this.saveCouponsLocally(list);

    if (db && isFirebaseConfigured()) {
      try {
        await deleteDoc(doc(db, 'coupons', couponId));
      } catch (e) {
        console.error('Failed to delete coupon in Firebase:', e);
      }
    }
  },

  // ================= BANNERS & MARQUEE =================
  getBanners(): StoreBanner[] {
    try {
      const saved = localStorage.getItem(KEYS.BANNERS);
      if (saved) {
        const parsed: StoreBanner[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_BANNERS;
  },

  saveBannersLocally(banners: StoreBanner[]): void {
    try {
      localStorage.setItem(KEYS.BANNERS, JSON.stringify(banners));
    } catch {}
  },

  async saveBanners(banners: StoreBanner[]): Promise<void> {
    this.saveBannersLocally(banners);
    if (db && isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'store_settings', 'hero_banners'), sanitizeForFirestore({
          banners,
          updatedAt: new Date().toISOString()
        }), { merge: true });
      } catch (e) {
        console.error('Failed to sync banners to Firebase:', e);
      }
    }
  },

  async fetchBannersFromCloud(): Promise<StoreBanner[] | null> {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const docSnap = await getDoc(doc(db, 'store_settings', 'hero_banners'));
      if (docSnap.exists() && docSnap.data()?.banners) {
        const cloudBanners = docSnap.data().banners as StoreBanner[];
        if (Array.isArray(cloudBanners) && cloudBanners.length > 0) {
          this.saveBannersLocally(cloudBanners);
          return cloudBanners;
        }
      } else {
        const initial = this.getBanners();
        await this.saveBanners(initial);
        return initial;
      }
    } catch (e) {
      console.warn('Firebase fetch banners fallback:', e);
    }
    return null;
  },

  subscribeToBanners(onBannersChange: (banners: StoreBanner[]) => void) {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const unsubscribe = onSnapshot(doc(db, 'store_settings', 'hero_banners'), (docSnap) => {
        if (docSnap.exists() && docSnap.data()?.banners) {
          const cloudBanners = docSnap.data().banners as StoreBanner[];
          if (Array.isArray(cloudBanners) && cloudBanners.length > 0) {
            this.saveBannersLocally(cloudBanners);
            onBannersChange(cloudBanners);
          }
        }
      });
      return unsubscribe;
    } catch (e) {
      return null;
    }
  },

  // ================= TOP MARQUEE =================
  getTopMarquee(): MarqueeItem[] {
    try {
      const saved = localStorage.getItem(KEYS.TOP_MARQUEE);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TOP_MARQUEE;
  },

  saveTopMarqueeLocally(items: MarqueeItem[]): void {
    try {
      localStorage.setItem(KEYS.TOP_MARQUEE, JSON.stringify(items));
    } catch {}
  },

  async saveTopMarquee(items: MarqueeItem[]): Promise<void> {
    this.saveTopMarqueeLocally(items);
    if (db && isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'store_settings', 'top_marquee'), sanitizeForFirestore({
          items,
          updatedAt: new Date().toISOString()
        }), { merge: true });
      } catch (e) {
        console.error('Failed to sync top marquee to Firebase:', e);
      }
    }
  },

  async fetchTopMarqueeFromCloud(): Promise<MarqueeItem[] | null> {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const docSnap = await getDoc(doc(db, 'store_settings', 'top_marquee'));
      if (docSnap.exists() && docSnap.data()?.items) {
        const list = docSnap.data().items as MarqueeItem[];
        this.saveTopMarqueeLocally(list);
        return list;
      } else {
        const initial = this.getTopMarquee();
        await this.saveTopMarquee(initial);
        return initial;
      }
    } catch (e) {
      console.warn('Firebase fetch top marquee fallback:', e);
    }
    return null;
  },

  subscribeToTopMarquee(onMarqueeChange: (items: MarqueeItem[]) => void) {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const unsubscribe = onSnapshot(doc(db, 'store_settings', 'top_marquee'), (docSnap) => {
        if (docSnap.exists() && docSnap.data()?.items) {
          const list = docSnap.data().items as MarqueeItem[];
          this.saveTopMarqueeLocally(list);
          onMarqueeChange(list);
        }
      });
      return unsubscribe;
    } catch (e) {
      return null;
    }
  },

  // ================= BANNER MARQUEE (TICKER) =================
  getBannerMarquee(): MarqueeItem[] {
    try {
      const saved = localStorage.getItem(KEYS.BANNER_MARQUEE);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BANNER_MARQUEE;
  },

  saveBannerMarqueeLocally(items: MarqueeItem[]): void {
    try {
      localStorage.setItem(KEYS.BANNER_MARQUEE, JSON.stringify(items));
    } catch {}
  },

  async saveBannerMarquee(items: MarqueeItem[]): Promise<void> {
    this.saveBannerMarqueeLocally(items);
    if (db && isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'store_settings', 'banner_marquee'), sanitizeForFirestore({
          items,
          updatedAt: new Date().toISOString()
        }), { merge: true });
      } catch (e) {
        console.error('Failed to sync banner marquee to Firebase:', e);
      }
    }
  },

  async fetchBannerMarqueeFromCloud(): Promise<MarqueeItem[] | null> {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const docSnap = await getDoc(doc(db, 'store_settings', 'banner_marquee'));
      if (docSnap.exists() && docSnap.data()?.items) {
        const list = docSnap.data().items as MarqueeItem[];
        this.saveBannerMarqueeLocally(list);
        return list;
      } else {
        const initial = this.getBannerMarquee();
        await this.saveBannerMarquee(initial);
        return initial;
      }
    } catch (e) {
      console.warn('Firebase fetch banner marquee fallback:', e);
    }
    return null;
  },

  // ================= SALE POSTERS =================
  getSalePosters(): SalePoster[] {
    try {
      const saved = localStorage.getItem(KEYS.SALE_POSTERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SALE_POSTERS;
  },

  saveSalePostersLocally(posters: SalePoster[]): void {
    try {
      localStorage.setItem(KEYS.SALE_POSTERS, JSON.stringify(posters));
    } catch {}
  },

  async saveSalePosters(posters: SalePoster[]): Promise<void> {
    this.saveSalePostersLocally(posters);
    if (db && isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'store_settings', 'sale_posters'), sanitizeForFirestore({
          posters,
          updatedAt: new Date().toISOString()
        }), { merge: true });
      } catch (e) {
        console.error('Failed to sync sale posters to Firebase:', e);
      }
    }
  },

  async fetchSalePostersFromCloud(): Promise<SalePoster[] | null> {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const docSnap = await getDoc(doc(db, 'store_settings', 'sale_posters'));
      if (docSnap.exists() && docSnap.data()?.posters) {
        const list = docSnap.data().posters as SalePoster[];
        this.saveSalePostersLocally(list);
        return list;
      } else {
        const initial = this.getSalePosters();
        await this.saveSalePosters(initial);
        return initial;
      }
    } catch (e) {
      console.warn('Firebase fetch sale posters fallback:', e);
    }
    return null;
  },

  // ================= SKIN SAFE & SALE BANNER CONFIGS =================
  getSkinSafeConfig(): SkinSafeConfig {
    try {
      const saved = localStorage.getItem(KEYS.SKIN_SAFE);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SKIN_SAFE;
  },

  async saveSkinSafeConfig(config: SkinSafeConfig): Promise<void> {
    try {
      localStorage.setItem(KEYS.SKIN_SAFE, JSON.stringify(config));
    } catch {}
    if (db && isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'store_settings', 'skin_safe_config'), sanitizeForFirestore(config));
      } catch (e) {
        console.error('Failed to sync skin safe config:', e);
      }
    }
  },

  async fetchSkinSafeConfigFromCloud(): Promise<SkinSafeConfig | null> {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const docSnap = await getDoc(doc(db, 'store_settings', 'skin_safe_config'));
      if (docSnap.exists()) {
        const data = docSnap.data() as SkinSafeConfig;
        localStorage.setItem(KEYS.SKIN_SAFE, JSON.stringify(data));
        return data;
      }
    } catch {}
    return null;
  },

  getSaleBannerConfig(): SaleBannerConfig {
    try {
      const saved = localStorage.getItem(KEYS.SALE_BANNER);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SALE_BANNER;
  },

  async saveSaleBannerConfig(config: SaleBannerConfig): Promise<void> {
    try {
      localStorage.setItem(KEYS.SALE_BANNER, JSON.stringify(config));
    } catch {}
    if (db && isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'store_settings', 'sale_banner_config'), sanitizeForFirestore(config));
      } catch (e) {
        console.error('Failed to sync sale banner config:', e);
      }
    }
  },

  async fetchSaleBannerConfigFromCloud(): Promise<SaleBannerConfig | null> {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const docSnap = await getDoc(doc(db, 'store_settings', 'sale_banner_config'));
      if (docSnap.exists()) {
        const data = docSnap.data() as SaleBannerConfig;
        localStorage.setItem(KEYS.SALE_BANNER, JSON.stringify(data));
        return data;
      }
    } catch {}
    return null;
  },

  // ================= EXCHANGES & RETURNS =================
  getExchanges(): ExchangeRequest[] {
    try {
      const saved = localStorage.getItem(KEYS.EXCHANGES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_EXCHANGES;
  },

  saveExchangesLocally(exchanges: ExchangeRequest[]): void {
    try {
      localStorage.setItem(KEYS.EXCHANGES, JSON.stringify(exchanges));
    } catch {}
  },

  async fetchExchangesFromCloud(): Promise<ExchangeRequest[] | null> {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const snapshot = await getDocs(collection(db, 'exchanges'));
      if (!snapshot.empty) {
        const list: ExchangeRequest[] = [];
        snapshot.forEach((d) => list.push(d.data() as ExchangeRequest));
        this.saveExchangesLocally(list);
        return list;
      } else {
        for (const ex of INITIAL_EXCHANGES) {
          await setDoc(doc(db, 'exchanges', ex.id), sanitizeForFirestore(ex));
        }
        this.saveExchangesLocally(INITIAL_EXCHANGES);
        return INITIAL_EXCHANGES;
      }
    } catch (e) {
      console.warn('Firebase fetch exchanges fallback:', e);
    }
    return null;
  },

  async upsertExchange(req: ExchangeRequest): Promise<ExchangeRequest> {
    const list = this.getExchanges();
    const idx = list.findIndex((e) => e.id === req.id);
    const updated = idx >= 0
      ? list.map((e, i) => (i === idx ? req : e))
      : [req, ...list];
    this.saveExchangesLocally(updated);

    if (db && isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'exchanges', req.id), sanitizeForFirestore(req));
      } catch (e) {
        console.error('Failed to sync exchange to Firebase:', e);
      }
    }
    return req;
  },

  async deleteExchange(id: string): Promise<void> {
    const list = this.getExchanges().filter((e) => e.id !== id);
    this.saveExchangesLocally(list);

    if (db && isFirebaseConfigured()) {
      try {
        await deleteDoc(doc(db, 'exchanges', id));
      } catch (e) {
        console.error('Failed to delete exchange in Firebase:', e);
      }
    }
  },

  // ================= RTO PINCODES WATCHLIST =================
  getPincodes(): PincodeItem[] {
    try {
      const saved = localStorage.getItem(KEYS.PINCODES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return HIGH_RISK_PINCODES;
  },

  savePincodesLocally(pincodes: PincodeItem[]): void {
    try {
      localStorage.setItem(KEYS.PINCODES, JSON.stringify(pincodes));
    } catch {}
  },

  async savePincodes(pincodes: PincodeItem[]): Promise<void> {
    this.savePincodesLocally(pincodes);
    if (db && isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'store_settings', 'rto_pincodes'), sanitizeForFirestore({
          pincodes,
          updatedAt: new Date().toISOString()
        }), { merge: true });
      } catch (e) {
        console.error('Failed to sync pincodes to Firebase:', e);
      }
    }
  },

  async fetchPincodesFromCloud(): Promise<PincodeItem[] | null> {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const docSnap = await getDoc(doc(db, 'store_settings', 'rto_pincodes'));
      if (docSnap.exists() && docSnap.data()?.pincodes) {
        const list = docSnap.data().pincodes as PincodeItem[];
        this.savePincodesLocally(list);
        return list;
      } else {
        await this.savePincodes(HIGH_RISK_PINCODES);
        return HIGH_RISK_PINCODES;
      }
    } catch (e) {
      console.warn('Firebase fetch pincodes fallback:', e);
    }
    return null;
  },

  // ================= GLOBAL STORE SETTINGS =================
  getStoreSettings(): GlobalStoreSettings {
    try {
      const saved = localStorage.getItem(KEYS.STORE_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_STORE_SETTINGS;
  },

  async saveStoreSettings(settings: GlobalStoreSettings): Promise<void> {
    try {
      localStorage.setItem(KEYS.STORE_SETTINGS, JSON.stringify(settings));
    } catch {}
    if (db && isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'store_settings', 'global_config'), sanitizeForFirestore({
          ...settings,
          updatedAt: new Date().toISOString()
        }));
      } catch (e) {
        console.error('Failed to sync store settings to Firebase:', e);
      }
    }
  },

  async fetchStoreSettingsFromCloud(): Promise<GlobalStoreSettings | null> {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const docSnap = await getDoc(doc(db, 'store_settings', 'global_config'));
      if (docSnap.exists()) {
        const data = docSnap.data() as GlobalStoreSettings;
        localStorage.setItem(KEYS.STORE_SETTINGS, JSON.stringify(data));
        return data;
      } else {
        await this.saveStoreSettings(DEFAULT_STORE_SETTINGS);
        return DEFAULT_STORE_SETTINGS;
      }
    } catch (e) {
      console.warn('Firebase fetch store settings fallback:', e);
    }
    return null;
  },

  // ================= INSTAGRAM POSTS =================
  getInstagramPosts(): InstagramPostItem[] {
    try {
      const saved = localStorage.getItem(KEYS.INSTAGRAM_POSTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_INSTAGRAM_POSTS;
  },

  saveInstagramPosts(posts: InstagramPostItem[]): void {
    try {
      localStorage.setItem(KEYS.INSTAGRAM_POSTS, JSON.stringify(posts));
    } catch (e) {
      console.error('Failed to cache instagram posts', e);
    }
  },
};
