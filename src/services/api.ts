// Production API Client with zero-downtime offline fallback
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : '/api';

export interface OrderPayload {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: any[];
  paymentMethod: 'COD' | 'Prepaid UPI';
  totalAmount: number;
  idempotencyKey?: string;
}

export const apiService = {
  // Fetch real-time products catalog
  async getProducts(category?: string) {
    try {
      const url = category && category !== 'ALL' && category !== 'NEW ARRIVALS'
        ? `${API_BASE_URL}/products?category=${encodeURIComponent(category)}`
        : `${API_BASE_URL}/products`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('API getProducts failed, using local vault cache:', err);
      return null;
    }
  },

  // Submit high-concurrency order with idempotency
  async createOrder(payload: OrderPayload) {
    try {
      const idempotencyKey = payload.idempotencyKey || `idem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-idempotency-key': idempotencyKey
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process order.');
      }
      return data;
    } catch (err: any) {
      console.error('Order creation error:', err);
      throw err;
    }
  },

  // Customer order tracking
  async trackOrder(orderId: string) {
    try {
      const cleanId = orderId.replace('#', '').trim();
      const res = await fetch(`${API_BASE_URL}/orders/${cleanId}`);
      if (!res.ok) throw new Error('Order not found');
      const data = await res.json();
      return data.order;
    } catch (err) {
      return null;
    }
  },

  // Admin order status update
  async updateOrderStatus(orderId: string, status: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (err) {
      console.error('Admin status update error:', err);
      return null;
    }
  },

  // Admin analytics metrics
  async getAdminAnalytics() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/analytics`);
      if (!res.ok) throw new Error('Analytics unavailable');
      const data = await res.json();
      return data.metrics;
    } catch (err) {
      return null;
    }
  }
};
