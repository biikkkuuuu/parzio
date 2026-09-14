export interface Product {
  id: string;
  name: string;
  category: 'Necklaces' | 'Earrings' | 'Rings' | 'Bracelets' | 'Anklets';
  price: number;
  originalPrice: number;
  savePercent: number;
  rating: number;
  reviewsCount: number;
  colorways: number;
  image: string;
  hoverImage?: string;
  description: string;
  sku: string;
  material: string;
  isWaterproof: boolean;
  isAntiTarnish: boolean;
  badge?: string;
  quote?: string;
  stock?: number;
  isLive?: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  usageCount: number;
  usageLimit: number;
  active: boolean;
  expiresAt: string;
}

export interface ExchangeRequest {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  reason: 'Ring Size Mismatch' | 'Defective Clasp' | 'Style Exchange' | 'Transit Damage';
  productName: string;
  requestedExchangeItem: string;
  status: 'Pending Review' | 'Approved & Pickup Scheduled' | 'Replacement Dispatched' | 'Rejected';
  date: string;
  evidencePhoto?: string;
  notes?: string;
}

export interface MarqueeItem {
  id: string;
  text: string;
  icon?: 'truck' | 'shield' | 'sparkles' | 'star' | 'heart' | 'tag' | 'gift';
  active: boolean;
}

export interface StoreBanner {
  id: string;
  title: string;
  highlightText: string;
  subtitle: string;
  description: string;
  badge: string;
  subBadge?: string;
  priceText: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  image: string;
  buttonText: string;
  active: boolean;
}

export type AdminTab =
  | 'overview'
  | 'orders'
  | 'inventory'
  | 'banners'
  | 'rto-shield'
  | 'exchanges'
  | 'coupons'
  | 'settings';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  rating: number;
  quote: string;
  purchasedItem: string;
  date?: string;
}

export type OrderStatus =
  | 'COD Confirmed'
  | 'COD Pending'
  | 'Prepaid UPI'
  | 'Packed'
  | 'In Transit'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  id: string;
  customerName: string;
  phone?: string;
  location: string;
  pincode: string;
  rtoRisk: 'Low' | 'Medium' | 'High';
  rtoPercent?: number;
  amount: number;
  paymentMethod: 'COD' | 'Prepaid UPI';
  status: OrderStatus;
  productName: string;
  sku: string;
  quantity: number;
  image: string;
  tag: string;
  courier: string;
  phoneVerified: boolean;
  notes?: string;
}

export interface StorefrontConfig {
  announcementText: string;
  announcementActive: boolean;
  freeShippingThreshold: number;
  codHandlingFee: number;
  bannerHeadline?: string;
  bannerSubtext?: string;
}

export interface QCStep {
  id: number;
  title: string;
  description: string;
  standard: string;
  passed: boolean;
}

export type ActiveScreen = 'storefront' | 'atelier-ops';
export type DeviceMode = 'desktop' | 'mobile';

export interface EmergencyShutdownConfig {
  isActive: boolean;
  mode: 'full-lockdown' | 'checkout-paused';
  reason: string;
  customMessage: string;
  activatedAt?: string;
}
