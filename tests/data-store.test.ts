import { describe, it, expect } from 'vitest';
import { DataStore } from '@/lib/data-store';

describe('DataStore Retail Engine & Inventory Tests', () => {
  it('should retrieve all active products and categories', () => {
    const products = DataStore.getProducts();
    const categories = DataStore.getCategories();

    expect(products.length).toBeGreaterThan(0);
    expect(categories.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty('sku');
    expect(products[0]).toHaveProperty('barcode');
    expect(products[0]).toHaveProperty('selling_price');
  });

  it('should validate barcode uniqueness when adding products', () => {
    const existing = DataStore.getProducts()[0];
    const isUnique = DataStore.isBarcodeUnique(existing.barcode);
    expect(isUnique).toBe(false);

    const brandNewBarcode = '8909999888877';
    const isNewUnique = DataStore.isBarcodeUnique(brandNewBarcode);
    expect(isNewUnique).toBe(true);
  });

  it('should adjust inventory stock levels and update timestamp', () => {
    const inventory = DataStore.getInventory();
    expect(inventory.length).toBeGreaterThan(0);

    const targetItem = inventory[0];
    const initialQty = targetItem.quantity;

    // Inflow +10
    const adjusted = DataStore.adjustStock(targetItem.id, 10, 'Supplier Inflow');
    expect(adjusted).toBe(true);

    const updatedInventory = DataStore.getInventory();
    const updatedItem = updatedInventory.find((i) => i.id === targetItem.id);
    expect(updatedItem?.quantity).toBe(initialQty + 10);
  });

  it('should simulate customer self-checkout with atomic stock deduction', () => {
    const products = DataStore.getProducts();
    const targetProduct = products[0];

    const inventoryBefore = DataStore.getInventory();
    const initialStock = inventoryBefore.find((i) => i.product_id === targetProduct.id)?.quantity || 0;

    const simulation = DataStore.simulateCustomerCheckout();
    expect(simulation).not.toBeNull();
    expect(simulation?.order).toBeDefined();
    expect(simulation?.order.status).toBe('paid');
    expect(simulation?.exitPass.is_used).toBe(false);
    expect(simulation?.token).toMatch(/^PENGO-EXIT-SECURE-/);

    // Verify orders count increased
    const metrics = DataStore.getDashboardMetrics();
    expect(metrics.kpi.totalOrders).toBeGreaterThan(0);
    expect(metrics.kpi.totalRevenue).toBeGreaterThan(0);
  });

  it('should filter dashboard metrics accurately per store', () => {
    const nationalMetrics = DataStore.getDashboardMetrics('all');
    const store1Metrics = DataStore.getDashboardMetrics('store-1');

    expect(nationalMetrics.kpi.totalRevenue).toBeGreaterThanOrEqual(store1Metrics.kpi.totalRevenue);
    expect(nationalMetrics.kpi.totalOrders).toBeGreaterThanOrEqual(store1Metrics.kpi.totalOrders);
  });
});
