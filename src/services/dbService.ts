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
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Local Storage Keys for fast client-side caching
const KEYS = {
  PRODUCTS: 'parzio_products',
  CATEGORIES: 'parzio_categories',
  ORDERS: 'parzio_orders',
  BANNERS: 'parzio_banners',
  TOP_MARQUEE: 'parzio_top_marquee',
  BANNER_MARQUEE: 'parzio_banner_marquee',
  COUPONS: 'parzio_coupons',
};

// Converters between Frontend CamelCase and Supabase Snake_Case
const toSupabaseProduct = (p: Product) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.price,
  original_price: p.originalPrice,
  save_percent: p.savePercent,
  rating: p.rating,
  reviews_count: p.reviewsCount,
  colorways: p.colorways,
  sku: p.sku,
  material: p.material,
  is_waterproof: p.isWaterproof,
  is_anti_tarnish: p.isAntiTarnish,
  badge: p.badge || null,
  quote: p.quote || null,
  image: p.image,
  description: p.description,
});

const fromSupabaseProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  category: row.category,
  price: Number(row.price),
  originalPrice: Number(row.original_price ?? row.price),
  savePercent: Number(row.save_percent ?? 0),
  rating: Number(row.rating ?? 4.9),
  reviewsCount: Number(row.reviews_count ?? 500),
  colorways: Number(row.colorways ?? 40),
  sku: row.sku,
  material: row.material ?? '316L Surgical Stainless Steel',
  isWaterproof: Boolean(row.is_waterproof ?? true),
  isAntiTarnish: Boolean(row.is_anti_tarnish ?? true),
  badge: row.badge ?? undefined,
  quote: row.quote ?? undefined,
  image: row.image,
  description: row.description ?? '',
});

const toSupabaseOrder = (o: OrderItem) => ({
  id: o.id,
  customer_name: o.customerName,
  phone: o.phone,
  address: o.address,
  pincode: o.pincode,
  amount: o.amount,
  status: o.status,
  payment_method: o.paymentMethod,
  city: o.city,
  state: o.state,
  tracking_number: o.trackingNumber || null,
  items: [
    {
      productName: o.productName,
      productImage: o.productImage,
      sku: o.sku,
      amount: o.amount,
    },
  ],
});

const fromSupabaseOrder = (row: any): OrderItem => ({
  id: row.id,
  customerName: row.customer_name || 'Customer',
  phone: row.phone,
  address: row.address,
  pincode: row.pincode,
  productName: row.items?.[0]?.productName || 'PARZIO Jewellery',
  productImage: row.items?.[0]?.productImage || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
  sku: row.items?.[0]?.sku || 'SKU-PARZIO',
  amount: Number(row.amount),
  status: row.status as any,
  paymentMethod: (row.payment_method || 'COD') as any,
  date: row.created_at
    ? new Date(row.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Today',
  city: row.city || 'India',
  state: row.state || 'State',
  trackingNumber: row.tracking_number || undefined,
});

/**
 * dbService: Unified Data Access Layer
 * Supports both immediate local-cache read and real-time Supabase cloud synchronization.
 */
export const dbService = {
  isConfigured: isSupabaseConfigured(),

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
    if (!supabase || !isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        const mapped = data.map(fromSupabaseProduct);
        this.saveProducts(mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase product fetch fallback to local cache:', e);
    }
    return null;
  },

  async upsertProduct(product: Product): Promise<Product> {
    // 1. Update local cache immediately
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    const updated = index >= 0
      ? products.map((p) => (p.id === product.id ? product : p))
      : [product, ...products];
    this.saveProducts(updated);

    // 2. Sync to Supabase if configured
    if (supabase && isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('products')
          .upsert(toSupabaseProduct(product));
        if (error) console.error('Supabase product upsert error:', error);
      } catch (e) {
        console.error('Failed to sync product to cloud:', e);
      }
    }
    return product;
  },

  async deleteProduct(productId: string): Promise<void> {
    const products = this.getProducts().filter((p) => p.id !== productId);
    this.saveProducts(products);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('products').delete().eq('id', productId);
      } catch (e) {
        console.error('Failed to delete product from cloud:', e);
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
    if (!supabase || !isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        const mapped: CategoryItem[] = data.map((c) => ({
          name: c.name,
          image: c.image,
          count: c.count ?? 0,
        }));
        this.saveCategories(mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase category fetch fallback to local cache:', e);
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

    if (supabase && isSupabaseConfigured()) {
      try {
        const id = 'cat-' + cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        await supabase.from('categories').upsert({
          id,
          name: cat.name,
          image: cat.image,
          count: cat.count || 0,
        });
      } catch (e) {
        console.error('Failed to sync category to cloud:', e);
      }
    }
    return cat;
  },

  async deleteCategory(catName: string): Promise<void> {
    const categories = this.getCategories().filter(
      (c) => c.name.toLowerCase() !== catName.toLowerCase()
    );
    this.saveCategories(categories);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('categories').delete().ilike('name', catName);
      } catch (e) {
        console.error('Failed to delete category from cloud:', e);
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
    if (!supabase || !isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        const mapped = data.map(fromSupabaseOrder);
        this.saveOrders(mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase orders fetch fallback to local cache:', e);
    }
    return null;
  },

  async createOrder(order: OrderItem): Promise<OrderItem> {
    // Immediate local persistence
    const orders = this.getOrders();
    const updated = [order, ...orders];
    this.saveOrders(updated);

    // Sync to Supabase
    if (supabase && isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('orders')
          .insert(toSupabaseOrder(order));
        if (error) console.error('Supabase order creation error:', error);
      } catch (e) {
        console.error('Failed to push order to cloud:', e);
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

    if (supabase && isSupabaseConfigured()) {
      try {
        const updatePayload: any = { status, updated_at: new Date().toISOString() };
        if (trackingNumber) updatePayload.tracking_number = trackingNumber;
        await supabase.from('orders').update(updatePayload).eq('id', orderId);
      } catch (e) {
        console.error('Failed to update order in cloud:', e);
      }
    }
    return updated;
  },

  async deleteOrder(orderId: string): Promise<void> {
    const orders = this.getOrders().filter((o) => o.id !== orderId);
    this.saveOrders(orders);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('orders').delete().eq('id', orderId);
      } catch (e) {
        console.error('Failed to delete order from cloud:', e);
      }
    }
  },

  // ================= REALTIME SUBSCRIPTIONS =================
  subscribeToNewOrders(onNewOrder: (order: OrderItem) => void) {
    if (!supabase || !isSupabaseConfigured()) return null;
    try {
      const channel = supabase
        .channel('public:orders')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'orders' },
          (payload) => {
            if (payload.new) {
              const mapped = fromSupabaseOrder(payload.new);
              onNewOrder(mapped);
            }
          }
        )
        .subscribe();

      return () => {
        supabase?.removeChannel(channel);
      };
    } catch (e) {
      console.error('Realtime subscription error:', e);
      return null;
    }
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
  },
};
