import { Coupon } from '../types';

export interface CouponValidationResult {
  valid: boolean;
  message: string;
  coupon?: Coupon;
  discountAmount: number;
}

/**
 * Validates a coupon code against customer cart subtotal and active coupon rules.
 * All user feedback messages are strictly in English.
 */
export function validateCoupon(
  code: string,
  subtotal: number,
  coupons: Coupon[]
): CouponValidationResult {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return {
      valid: false,
      message: 'Please enter a coupon code.',
      discountAmount: 0
    };
  }

  const found = coupons.find((c) => c.code.toUpperCase() === cleanCode);
  if (!found) {
    return {
      valid: false,
      message: `Coupon code "${cleanCode}" is invalid or does not exist.`,
      discountAmount: 0
    };
  }

  if (!found.active) {
    return {
      valid: false,
      message: `Coupon code "${cleanCode}" has already expired or has been deactivated.`,
      discountAmount: 0
    };
  }

  if (found.usageLimit && found.usageCount >= found.usageLimit) {
    return {
      valid: false,
      message: `Coupon code "${cleanCode}" has already been used and reached its maximum usage limit.`,
      discountAmount: 0
    };
  }

  if (found.expiresAt) {
    const expiry = new Date(found.expiresAt);
    expiry.setHours(23, 59, 59, 999);
    if (new Date() > expiry) {
      return {
        valid: false,
        message: `Coupon code "${cleanCode}" has expired.`,
        discountAmount: 0
      };
    }
  }

  if (found.minOrderValue && subtotal < found.minOrderValue) {
    const shortage = found.minOrderValue - subtotal;
    return {
      valid: false,
      message: `Minimum order value of ₹${found.minOrderValue} required for coupon ${cleanCode}. Add ₹${shortage} more to cart to redeem!`,
      discountAmount: 0
    };
  }

  // Calculate discount
  let discount = 0;
  if (found.discountType === 'percentage') {
    discount = Math.round((subtotal * found.discountValue) / 100);
  } else {
    discount = Math.min(subtotal, found.discountValue);
  }

  // Ensure discount does not exceed subtotal
  discount = Math.max(0, Math.min(discount, subtotal));

  return {
    valid: true,
    message: `Coupon code "${cleanCode}" applied successfully! You saved ₹${discount}.`,
    coupon: found,
    discountAmount: discount
  };
}

/**
 * Calculates current discount amount for an applied coupon given current subtotal.
 */
export function calculateCouponDiscount(coupon: Coupon | null | undefined, subtotal: number): number {
  if (!coupon || !coupon.active) return 0;
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) return 0;

  if (coupon.discountType === 'percentage') {
    return Math.min(subtotal, Math.round((subtotal * coupon.discountValue) / 100));
  }
  return Math.min(subtotal, coupon.discountValue);
}
