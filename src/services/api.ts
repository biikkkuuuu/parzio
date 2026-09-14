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
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

export interface RazorpayOrderResponse {
  success: boolean;
  order: {
    id: string;
    amount: number;
    currency: string;
    receipt?: string;
    status: string;
  };
  keyId: string;
  isSimulated?: boolean;
}

export interface RazorpayVerifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
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

  // Track order with phone IDOR protection
  async trackOrder(orderId: string, phone?: string) {
    try {
      const cleanId = orderId.replace('#', '').trim();
      const url = phone ? `${API_BASE_URL}/orders/${cleanId}?phone=${encodeURIComponent(phone)}` : `${API_BASE_URL}/orders/${cleanId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Order not found');
      const data = await res.json();
      return data.order;
    } catch (err) {
      return null;
    }
  },

  // Server-Side Cryptographic OTP Engine
  async sendOtp(phone: string): Promise<{ success: boolean; message: string; testCodeHint?: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
    return data;
  },

  async verifyOtp(phone: string, otp: string): Promise<{ success: boolean; verified: boolean }> {
    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid OTP');
    return data;
  },

  // Admin order status update (Protected with Admin Bearer Token)
  async updateOrderStatus(orderId: string, status: string, adminToken = 'parzio_master_secret_2026_atelier') {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (err) {
      console.error('Admin status update error:', err);
      return null;
    }
  },

  // Admin analytics metrics (Protected with Admin Bearer Token)
  async getAdminAnalytics(adminToken = 'parzio_master_secret_2026_atelier') {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (!res.ok) throw new Error('Analytics unavailable');
      const data = await res.json();
      return data.metrics;
    } catch (err) {
      return null;
    }
  },

  // Razorpay: Get Public Key ID
  async getRazorpayKey(): Promise<string> {
    try {
      const res = await fetch(`${API_BASE_URL}/payment/razorpay-key`);
      const data = await res.json();
      return data.keyId || 'rzp_test_51b9o4kX1sXj5e';
    } catch {
      return 'rzp_test_51b9o4kX1sXj5e';
    }
  },

  // Razorpay: Create Order on Backend
  async createRazorpayOrder(amount: number): Promise<RazorpayOrderResponse> {
    const res = await fetch(`${API_BASE_URL}/payment/razorpay-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to initiate Razorpay order');
    }
    return await res.json();
  },

  // Razorpay: Verify Signature on Backend
  async verifyRazorpayPayment(payload: RazorpayVerifyPayload): Promise<{ success: boolean; verified: boolean }> {
    const res = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Payment verification failed');
    }
    return await res.json();
  }
};
