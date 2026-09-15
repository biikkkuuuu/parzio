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

// Storage Keys
const KEYS = {
  PRODUCTS: 'parzio_products',
  CATEGORIES: 'parzio_categories',
  ORDERS: 'parzio_orders',
  BANNERS: 'parzio_banners',
  TOP_MARQUEE: 'parzio_top_marquee',
  BANNER_MARQUEE: 'parzio_banner_marquee',
  COUPONS: 'parzio_coupons',
  WISHLIST: 'parzio_wishlist_ids',
  CART: 'parzio_cart_items',
};

/**
 * dbService acts as the unified data access layer for Parzio.
 * Currently backed by localStorage with instant fallback to curated atelier seed data.
 * Ready to be connected to Supabase / PostgreSQL / REST API in the next step.
 */
export const dbService = {
  // ================= PRODUCTS =================
  getProducts(): Product[] {
    try {
      const saved = localStorage.getItem(KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load products from storage', e);
    }
    return VAULT_PRODUCTS;
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to storage', e);
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
    } catch (e) {
      console.error('Failed to load categories from storage', e);
    }
    return CATEGORIES_DATA;
  },

  saveCategories(categories: CategoryItem[]): void {
    try {
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to storage', e);
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
    } catch (e) {
      console.error('Failed to load orders from storage', e);
    }
    return INITIAL_ORDERS;
  },

  saveOrders(orders: OrderItem[]): void {
    try {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to storage', e);
    }
  },

  createOrder(order: OrderItem): OrderItem {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    this.saveOrders(updated);
    return order;
  },

  updateOrderStatus(orderId: string, status: OrderItem['status'], trackingNumber?: string): OrderItem[] {
    const orders = this.getOrders();
    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status,
            trackingNumber: trackingNumber || o.trackingNumber,
            updatedAt: new Date().toISOString()
          }
        : o
    );
    this.saveOrders(updated);
    return updated;
  },

  // ================= BANNERS & MARQUEE =================
  getBanners(): StoreBanner[] {
    try {
      const saved = localStorage.getItem(KEYS.BANNERS);
      if (saved) return JSON.parse(saved);
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
  }
};
