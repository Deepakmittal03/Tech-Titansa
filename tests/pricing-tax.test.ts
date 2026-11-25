import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/lib/utils';

describe('Pricing, GST Tax Slabs & Coupon Rules', () => {
  it('should correctly format currency in INR Indian Rupee standards', () => {
    expect(formatCurrency(0)).toBe('₹0.00');
    expect(formatCurrency(1250)).toBe('₹1,250.00');
    expect(formatCurrency(99999.5)).toBe('₹99,999.50');
  });

  it('should calculate GST tax amounts accurately based on statutory slabs', () => {
    const calculateLineTax = (price: number, gstRate: number) => {
      return Number(((price * gstRate) / 100).toFixed(2));
    };

    // 5% slab (Packaged staples / Milk)
    expect(calculateLineTax(100, 5)).toBe(5.00);

    // 12% slab (Processed foods / Noodles)
    expect(calculateLineTax(104, 12)).toBe(12.48);

    // 18% slab (Personal care / Chocolates)
    expect(calculateLineTax(175, 18)).toBe(31.50);
  });

  it('should enforce coupon minimum cart thresholds and maximum discount caps', () => {
    const applyCoupon = (subtotal: number, coupon: { minCart: number; discountPercent: number; maxDiscount: number }) => {
      if (subtotal < coupon.minCart) {
        return { valid: false, discount: 0, reason: `Minimum cart value of ₹${coupon.minCart} required` };
      }
      const rawDiscount = (subtotal * coupon.discountPercent) / 100;
      const discount = Math.min(rawDiscount, coupon.maxDiscount);
      return { valid: true, discount, finalTotal: subtotal - discount };
    };

    // Example PENGO20: 20% off, min cart 499, max discount 100
    const couponPENGO20 = { minCart: 499, discountPercent: 20, maxDiscount: 100 };

    // Below threshold
    const underThreshold = applyCoupon(350, couponPENGO20);
    expect(underThreshold.valid).toBe(false);
    expect(underThreshold.discount).toBe(0);

    // Above threshold without hitting cap (Subtotal 500 => 20% = 100)
    const validNoCap = applyCoupon(500, couponPENGO20);
    expect(validNoCap.valid).toBe(true);
    expect(validNoCap.discount).toBe(100);

    // Above threshold with cap applied (Subtotal 1500 => 20% is 300, capped at 100)
    const validWithCap = applyCoupon(1500, couponPENGO20);
    expect(validWithCap.valid).toBe(true);
    expect(validWithCap.discount).toBe(100);
    expect(validWithCap.finalTotal).toBe(1400);
  });
});
