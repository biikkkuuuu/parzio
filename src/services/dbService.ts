import {
  Product,
  CategoryItem,
  OrderItem,
  StoreBanner,
  MarqueeItem,
  Coupon
} from '../types';
import {
  VAULT_PRODUCTS,
  CATEGORIES_DATA
} from '../data/products';
import { INITIAL_ORDERS } from '../data/orders';
import { INITIAL_BANNERS, INITIAL_TOP_MARQUEE, INITIAL_BANNER_MARQUEE } from '../data/bannerData';
import { INITIAL_COUPONS } from '../data/adminData';
import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
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
};

/**
 * dbService: Unified Data Access Layer
 * Powered by Google Firebase Firestore (Pay-As-You-Go) + Local Storage Cache.
 * When Firebase credentials are provided in .env.local, it seamlessly syncs live cloud data.
 * Otherwise, it runs smoothly on local cache without throwing any errors.
 */
export const dbService = {
  isConfigured: isFirebaseConfigured(),

  // ================= PRODUCTS =================
  getProducts(): Product[] {
    try {
      const saved = localStorage.getItem(KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return VAULT_PRODUCTS;
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
      if (!snapshot.empty) {
        const products: Product[] = [];
        snapshot.forEach((docSnap) => {
          products.push(docSnap.data() as Product);
        });
        this.saveProducts(products);
        return products;
      }
    } catch (e) {
      console.warn('Firebase products fetch fallback to local cache:', e);
    }
    return null;
  },

  async upsertProduct(product: Product): Promise<Product> {
    // 1. Immediate local persistence
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    const updated = index >= 0
      ? products.map((p) => (p.id === product.id ? product : p))
      : [product, ...products];
    this.saveProducts(updated);

    // 2. Sync to Firebase Firestore
    if (db && isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'products', product.id), product);
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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return CATEGORIES_DATA;
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
      if (!snapshot.empty) {
        const categories: CategoryItem[] = [];
        snapshot.forEach((docSnap) => {
          categories.push(docSnap.data() as CategoryItem);
        });
        this.saveCategories(categories);
        return categories;
      }
    } catch (e) {
      console.warn('Firebase categories fetch fallback to local cache:', e);
    }
    return null;
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
        const catId = 'cat-' + cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        await setDoc(doc(db, 'categories', catId), cat);
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
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
      console.warn('Firebase orders fetch fallback to local cache:', e);
    }
    return null;
  },

  async createOrder(order: OrderItem): Promise<OrderItem> {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    this.saveOrders(updated);

    if (db && isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'orders', order.id), order);
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

  // ================= REALTIME SUBSCRIPTIONS =================
  subscribeToNewOrders(onNewOrder: (order: OrderItem) => void) {
    if (!db || !isFirebaseConfigured()) return null;
    try {
      const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
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
      console.error('Firebase realtime order subscription error:', e);
      return null;
    }
  },

  // ================= BANNERS & MARQUEE =================
  getBanners(): StoreBanner[] {
    try {
      const saved = localStorage.getItem(KEYS.BANNERS);
      if (saved) {
        const parsed: StoreBanner[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If first banner still has old unsplash placeholder, migrate to new official PARZIO banner
          if (parsed[0].id === 'ban-1' && parsed[0].image && parsed[0].image.includes('images.unsplash.com')) {
            parsed[0].image = '/images/parzio-hero-banner.jpg';
            parsed[0].title = 'Khoobsurati Aapki';
            parsed[0].highlightText = 'Andaz PARZIO Ka';
            parsed[0].subtitle = 'Aapke Shringar, Hamara Pyaar';
            this.saveBanners(parsed);
          }
          return parsed;
        }
      }
    } catch {}
    return INITIAL_BANNERS;
  },

  saveBanners(banners: StoreBanner[]): void {
    try {
      localStorage.setItem(KEYS.BANNERS, JSON.stringify(banners));
    } catch {}
  },

  getTopMarquee(): MarqueeItem[] {
    try {
      const saved = localStorage.getItem(KEYS.TOP_MARQUEE);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TOP_MARQUEE;
  },

  saveTopMarquee(items: MarqueeItem[]): void {
    try {
      localStorage.setItem(KEYS.TOP_MARQUEE, JSON.stringify(items));
    } catch {}
  },

  getBannerMarquee(): MarqueeItem[] {
    try {
      const saved = localStorage.getItem(KEYS.BANNER_MARQUEE);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BANNER_MARQUEE;
  },

  saveBannerMarquee(items: MarqueeItem[]): void {
    try {
      localStorage.setItem(KEYS.BANNER_MARQUEE, JSON.stringify(items));
    } catch {}
  },

  // ================= COUPONS =================
  getCoupons(): Coupon[] {
    try {
      const saved = localStorage.getItem(KEYS.COUPONS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_COUPONS;
  },

  saveCoupons(coupons: Coupon[]): void {
    try {
      localStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
    } catch {}
  },
};
