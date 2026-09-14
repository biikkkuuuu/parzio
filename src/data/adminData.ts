import { Coupon, ExchangeRequest } from '../types';

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'PARZIO99',
    discountType: 'fixed',
    discountValue: 99,
    minOrderValue: 499,
    usageCount: 1420,
    usageLimit: 5000,
    active: true,
    expiresAt: '2026-12-31'
  },
  {
    id: 'coup-2',
    code: 'GOLD10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 399,
    usageCount: 885,
    usageLimit: 2000,
    active: true,
    expiresAt: '2026-10-15'
  },
  {
    id: 'coup-3',
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 49,
    minOrderValue: 299,
    usageCount: 312,
    usageLimit: 1000,
    active: true,
    expiresAt: '2026-11-01'
  },
  {
    id: 'coup-4',
    code: 'FESTIVE15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 699,
    usageCount: 42,
    usageLimit: 500,
    active: false,
    expiresAt: '2026-08-30'
  }
];

export const INITIAL_EXCHANGES: ExchangeRequest[] = [
  {
    id: 'EXCH-4091',
    orderId: 'PARZIO-98239',
    customerName: 'Rohan Verma',
    phone: '+91 98112 34567',
    reason: 'Ring Size Mismatch',
    productName: 'PARZIO Bypass Crystal Ring',
    requestedExchangeItem: 'PARZIO Bypass Crystal Ring (Size 18)',
    status: 'Pending Review',
    date: 'Today, 11:30 AM',
    evidencePhoto: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80',
    notes: 'Customer ordered Size 16, needs exchange to Size 18.'
  },
  {
    id: 'EXCH-4089',
    orderId: 'PARZIO-98220',
    customerName: 'Divya Sharma',
    phone: '+91 97180 99881',
    reason: 'Defective Clasp',
    productName: 'PARZIO Herringbone Gold Chain',
    requestedExchangeItem: 'PARZIO Herringbone Gold Chain (Fresh Replacement)',
    status: 'Approved & Pickup Scheduled',
    date: 'Yesterday, 04:15 PM',
    evidencePhoto: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80',
    notes: 'Clasp spring loose upon unboxing. BlueDart return airway bill assigned.'
  },
  {
    id: 'EXCH-4085',
    orderId: 'PARZIO-98188',
    customerName: 'Pooja Hegde',
    phone: '+91 94451 22334',
    reason: 'Style Exchange',
    productName: 'PARZIO Baroque Pearl Drop Earrings',
    requestedExchangeItem: 'PARZIO Emerald Baguette Bracelet',
    status: 'Replacement Dispatched',
    date: '12 Sep 2026',
    notes: 'Replacement parcel tracking: BLUEDART-AIR-778219'
  }
];

export const HIGH_RISK_PINCODES = [
  { pincode: '110085', area: 'Rohini Sec 14, Delhi', rtoRate: 48, status: 'Prepaid-Only Recommended', action: 'Require WhatsApp OTP' },
  { pincode: '400086', area: 'Ghatkopar West, Mumbai', rtoRate: 36, status: 'High Vigilance', action: 'Address re-confirm' },
  { pincode: '560068', area: 'Bommanahalli, Bengaluru', rtoRate: 29, status: 'Moderate', action: 'Courier priority routing' },
  { pincode: '700028', area: 'Dum Dum, Kolkata', rtoRate: 42, status: 'High RTO', action: 'Block fake numbers' },
  { pincode: '302017', area: 'Malviya Nagar, Jaipur', rtoRate: 31, status: 'Moderate', action: 'Address re-confirm' }
];

export const DAILY_ANALYTICS = {
  gmvToday: 248910,
  ordersToday: 241,
  avgOrderValue: 1032,
  codSharePercent: 62,
  prepaidSharePercent: 38,
  rtoShieldSavings: 18450,
  dispatchedWithin24HrPercent: 98.4,
  activeVisitors: 318
};
