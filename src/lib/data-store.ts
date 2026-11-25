// ============================================================================
// peNgo Smart Retail Command Center – Universal Data & Transaction Engine
// Supports both Supabase Cloud PostgreSQL and Local In-Memory / LocalStorage
// ============================================================================

import {
  Product,
  Category,
  Store,
  InventoryItem,
  StockMovement,
  Order,
  OrderItem,
  Customer,
  Coupon,
  ExitPass,
  Payment,
  AuditLog,
  Notification,
  User,
} from '@/types/database';
import { v4 as uuidv4 } from 'uuid';

// ─── Initial High-Fidelity Seed Data ──────────────────────────────────────────

export const INITIAL_STORES: Store[] = [
  {
    id: 'store-1',
    name: 'peNgo Flagship – Connaught Place',
    code: 'PGO-DEL-01',
    address: 'Block A, Inner Circle, Connaught Place, New Delhi, Delhi 110001',
    phone: '+91 11 4152 7890',
    email: 'cp.delhi@pengo.retail',
    gstin: '07AAAAA0000A1Z5',
    is_active: true,
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 'store-2',
    name: 'peNgo CyberHub – DLF Phase 2',
    code: 'PGO-GUR-02',
    address: 'DLF CyberHub, Building 8, DLF Phase 2, Gurugram, Haryana 122002',
    phone: '+91 124 456 7890',
    email: 'cyberhub@pengo.retail',
    gstin: '06AAAAA0000A1Z6',
    is_active: true,
    created_at: '2024-02-01T08:00:00Z',
    updated_at: '2024-02-01T08:00:00Z',
  },
  {
    id: 'store-3',
    name: 'peNgo Indiranagar – 100ft Road',
    code: 'PGO-BLR-03',
    address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    phone: '+91 80 2520 1234',
    email: 'indiranagar@pengo.retail',
    gstin: '29AAAAA0000A1Z7',
    is_active: true,
    created_at: '2024-03-10T08:00:00Z',
    updated_at: '2024-03-10T08:00:00Z',
  },
  {
    id: 'store-4',
    name: 'peNgo Powai Galleria',
    code: 'PGO-MUM-04',
    address: 'Central Avenue, Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076',
    phone: '+91 22 2570 9876',
    email: 'powai@pengo.retail',
    gstin: '27AAAAA0000A1Z8',
    is_active: true,
    created_at: '2024-04-05T08:00:00Z',
    updated_at: '2024-04-05T08:00:00Z',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Beverages & Juices', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-2', name: 'Snacks & Munchies', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-3', name: 'Dairy, Bread & Eggs', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-4', name: 'Personal Care & Hygiene', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-5', name: 'Instant & Frozen Food', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-6', name: 'Chocolates & Sweets', is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Red Bull Energy Drink (250ml)',
    description: 'Vitalizes body and mind with premium taurine and caffeine blend.',
    sku: 'BEV-RB-250',
    barcode: '8901234567890',
    category_id: 'cat-1',
    brand: 'Red Bull',
    mrp: 125,
    selling_price: 115,
    gst_rate: 18,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Doritos Nacho Cheese Tortilla Chips (150g)',
    description: 'Tooth-rattling crunch and intense nacho cheese flavor.',
    sku: 'SNK-DOR-150',
    barcode: '8901234567891',
    category_id: 'cat-2',
    brand: 'PepsiCo',
    mrp: 60,
    selling_price: 50,
    gst_rate: 12,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=400',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'prod-3',
    name: 'Amul Taaza Homogenised Milk (1L Tetra)',
    description: 'Fresh toned milk, sterilized and homogenised for long shelf life.',
    sku: 'DAR-AML-1000',
    barcode: '8901234567892',
    category_id: 'cat-3',
    brand: 'Amul',
    mrp: 74,
    selling_price: 72,
    gst_rate: 5,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'prod-4',
    name: 'Dettol Original Germ Protection Soap (Pack of 4)',
    description: 'Antibacterial bath soap with pine fragrance for everyday hygiene.',
    sku: 'PC-DET-4X125',
    barcode: '8901234567893',
    category_id: 'cat-4',
    brand: 'Reckitt',
    mrp: 198,
    selling_price: 175,
    gst_rate: 18,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1607006310488-8250005d5c0b?auto=format&fit=crop&q=80&w=400',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'prod-5',
    name: 'Maggi 2-Minute Masala Noodles (Pack of 8)',
    description: 'Favorite Indian instant noodles enriched with Iron and signature spices.',
    sku: 'INST-MAG-8X70',
    barcode: '8901234567894',
    category_id: 'cat-5',
    brand: 'Nestle',
    mrp: 112,
    selling_price: 104,
    gst_rate: 12,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=400',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'prod-6',
    name: 'Cadbury Dairy Milk Silk Roast Almond (143g)',
    description: 'Silky smooth milk chocolate infused with whole roasted California almonds.',
    sku: 'SWT-CAD-143',
    barcode: '8901234567895',
    category_id: 'cat-6',
    brand: 'Cadbury',
    mrp: 190,
    selling_price: 175,
    gst_rate: 18,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=400',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'prod-7',
    name: 'Coca-Cola Zero Sugar Can (300ml)',
    description: 'Classic Coca-Cola taste with zero sugar and zero calories.',
    sku: 'BEV-CCZ-300',
    barcode: '8901234567896',
    category_id: 'cat-1',
    brand: 'Coca-Cola',
    mrp: 40,
    selling_price: 38,
    gst_rate: 18,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'prod-8',
    name: 'Epigamia Greek Yogurt Natural (100g)',
    description: 'High protein, thick and creamy natural greek yogurt without preservatives.',
    sku: 'DAR-EPI-100',
    barcode: '8901234567897',
    category_id: 'cat-3',
    brand: 'Epigamia',
    mrp: 50,
    selling_price: 45,
    gst_rate: 5,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'prod-9',
    name: 'Nivea Men Dark Spot Reduction Face Wash (100g)',
    description: 'Whitanat vita complex formula helps reduce 99% bacteria and dark spots.',
    sku: 'PC-NIV-100',
    barcode: '8901234567898',
    category_id: 'cat-4',
    brand: 'Nivea',
    mrp: 225,
    selling_price: 195,
    gst_rate: 18,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'prod-10',
    name: 'Ferrero Rocher Hazelnut Chocolates (16 Pieces)',
    description: 'Crispy wafer coated with hazelnut chocolate and delicate cocoa cream.',
    sku: 'SWT-FER-16P',
    barcode: '8901234567899',
    category_id: 'cat-6',
    brand: 'Ferrero',
    mrp: 599,
    selling_price: 529,
    gst_rate: 18,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&q=80&w=400',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'prod-11',
    name: 'Lays Gourmet Vintage Cheese & Paprika (55g)',
    description: 'Handcrafted slow-cooked kettle potato chips with exquisite European spices.',
    sku: 'SNK-LAY-55G',
    barcode: '8901234567810',
    category_id: 'cat-2',
    brand: 'PepsiCo',
    mrp: 50,
    selling_price: 45,
    gst_rate: 12,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?auto=format&fit=crop&q=80&w=400',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'prod-12',
    name: 'Tata Tea Gold Leaf & Dust Blend (500g)',
    description: 'Exquisite aroma and rich liquor tea with gently rolled long leaves.',
    sku: 'BEV-TAT-500',
    barcode: '8901234567811',
    category_id: 'cat-1',
    brand: 'Tata Consumer',
    mrp: 340,
    selling_price: 310,
    gst_rate: 5,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', product_id: 'prod-1', store_id: 'store-1', quantity: 84, min_threshold: 20, batch_number: 'RB2024-09B', expiry_date: '2025-08-30', created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' },
  { id: 'inv-2', product_id: 'prod-2', store_id: 'store-1', quantity: 120, min_threshold: 25, batch_number: 'DR2024-11A', expiry_date: '2025-05-15', created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' },
  { id: 'inv-3', product_id: 'prod-3', store_id: 'store-1', quantity: 18, min_threshold: 25, batch_number: 'AM2024-12C', expiry_date: '2025-01-20', created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' }, // Low stock
  { id: 'inv-4', product_id: 'prod-4', store_id: 'store-1', quantity: 45, min_threshold: 15, batch_number: 'DT2024-08X', expiry_date: '2026-07-31', created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' },
  { id: 'inv-5', product_id: 'prod-5', store_id: 'store-1', quantity: 5, min_threshold: 30, batch_number: 'MG2024-10K', expiry_date: '2025-06-30', created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' }, // Low stock
  { id: 'inv-6', product_id: 'prod-6', store_id: 'store-1', quantity: 0, min_threshold: 15, batch_number: 'CB2024-09Z', expiry_date: '2025-04-10', created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' }, // Out of stock
  { id: 'inv-7', product_id: 'prod-7', store_id: 'store-1', quantity: 65, min_threshold: 20, batch_number: 'CC2024-11D', expiry_date: '2025-09-30', created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' },
  { id: 'inv-8', product_id: 'prod-8', store_id: 'store-1', quantity: 8, min_threshold: 15, batch_number: 'EP2024-12A', expiry_date: '2024-12-15', created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' }, // Low stock & near expiry
  { id: 'inv-9', product_id: 'prod-9', store_id: 'store-1', quantity: 38, min_threshold: 10, batch_number: 'NV2024-07J', expiry_date: '2026-11-30', created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' },
  { id: 'inv-10', product_id: 'prod-10', store_id: 'store-1', quantity: 24, min_threshold: 10, batch_number: 'FR2024-10P', expiry_date: '2025-08-15', created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' },
  { id: 'inv-11', product_id: 'prod-11', store_id: 'store-1', quantity: 50, min_threshold: 15, batch_number: 'LY2024-11W', expiry_date: '2025-05-30', created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' },
  { id: 'inv-12', product_id: 'prod-12', store_id: 'store-1', quantity: 32, min_threshold: 12, batch_number: 'TT2024-09H', expiry_date: '2025-12-31', created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'cust-1', name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', phone: '+91 98101 23456', total_purchases: 18, total_spent: 12450, loyalty_points: 620, segment: 'VIP', created_at: '2024-01-20T10:00:00Z', updated_at: '2024-11-20T10:00:00Z' },
  { id: 'cust-2', name: 'Rohan Mehra', email: 'rohan.mehra@outlook.com', phone: '+91 98202 34567', total_purchases: 9, total_spent: 6840, loyalty_points: 340, segment: 'Regular', created_at: '2024-02-15T11:00:00Z', updated_at: '2024-11-22T11:00:00Z' },
  { id: 'cust-3', name: 'Priya Iyer', email: 'priya.iyer@gmail.com', phone: '+91 98303 45678', total_purchases: 27, total_spent: 24150, loyalty_points: 1200, segment: 'VIP', created_at: '2024-01-10T09:00:00Z', updated_at: '2024-11-24T09:00:00Z' },
  { id: 'cust-4', name: 'Neha Singhania', email: 'neha.s@zomato.com', phone: '+91 98404 56789', total_purchases: 4, total_spent: 2950, loyalty_points: 140, segment: 'New', created_at: '2024-11-01T14:00:00Z', updated_at: '2024-11-23T14:00:00Z' },
  { id: 'cust-5', name: 'Vikramaditya Roy', email: 'vikram.roy@swiggy.in', phone: '+91 98505 67890', total_purchases: 14, total_spent: 9800, loyalty_points: 490, segment: 'Regular', created_at: '2024-03-05T16:00:00Z', updated_at: '2024-11-21T16:00:00Z' },
  { id: 'cust-6', name: 'Ananya Deshmukh', email: 'ananya.d@tcs.com', phone: '+91 98606 78901', total_purchases: 32, total_spent: 31200, loyalty_points: 1560, segment: 'VIP', created_at: '2024-01-05T12:00:00Z', updated_at: '2024-11-24T12:00:00Z' },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'PENGO20',
    type: 'percentage',
    discount_value: 20,
    min_cart_value: 499,
    max_discount: 100,
    usage_limit: 1000,
    used_count: 342,
    valid_from: '2024-11-01T00:00:00Z',
    valid_until: '2025-12-31T23:59:59Z',
    is_active: true,
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-11-01T00:00:00Z',
  },
  {
    id: 'coup-2',
    code: 'WELCOME50',
    type: 'fixed',
    discount_value: 50,
    min_cart_value: 299,
    max_discount: 50,
    usage_limit: 500,
    used_count: 189,
    valid_from: '2024-10-01T00:00:00Z',
    valid_until: '2025-12-31T23:59:59Z',
    is_active: true,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z',
  },
  {
    id: 'coup-3',
    code: 'SUPERBUY100',
    type: 'fixed',
    discount_value: 100,
    min_cart_value: 999,
    max_discount: 100,
    usage_limit: 300,
    used_count: 145,
    valid_from: '2024-11-15T00:00:00Z',
    valid_until: '2024-12-15T23:59:59Z',
    is_active: true,
    created_at: '2024-11-15T00:00:00Z',
    updated_at: '2024-11-15T00:00:00Z',
  },
  {
    id: 'coup-4',
    code: 'FESTIVE15',
    type: 'percentage',
    discount_value: 15,
    min_cart_value: 699,
    max_discount: 150,
    usage_limit: 200,
    used_count: 200,
    valid_from: '2024-10-15T00:00:00Z',
    valid_until: '2024-11-10T23:59:59Z',
    is_active: false, // Expired
    created_at: '2024-10-15T00:00:00Z',
    updated_at: '2024-11-10T23:59:59Z',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    order_number: 'PGO-20241124-9841',
    customer_id: 'cust-1',
    store_id: 'store-1',
    subtotal: 515,
    tax: 62.4,
    discount: 50,
    total: 527.4,
    status: 'completed',
    payment_id: 'pay-1001',
    created_at: '2024-11-24T17:45:00Z',
    updated_at: '2024-11-24T17:52:00Z',
  },
  {
    id: 'ord-1002',
    order_number: 'PGO-20241124-9842',
    customer_id: 'cust-3',
    store_id: 'store-1',
    subtotal: 819,
    tax: 110.5,
    discount: 100,
    total: 829.5,
    status: 'exit_verification',
    payment_id: 'pay-1002',
    created_at: '2024-11-24T18:10:00Z',
    updated_at: '2024-11-24T18:15:00Z',
  },
  {
    id: 'ord-1003',
    order_number: 'PGO-20241124-9843',
    customer_id: 'cust-2',
    store_id: 'store-1',
    subtotal: 265,
    tax: 31.8,
    discount: 0,
    total: 296.8,
    status: 'paid',
    payment_id: 'pay-1003',
    created_at: '2024-11-24T18:22:00Z',
    updated_at: '2024-11-24T18:25:00Z',
  },
  {
    id: 'ord-1004',
    order_number: 'PGO-20241124-9844',
    customer_id: 'cust-4',
    store_id: 'store-1',
    subtotal: 390,
    tax: 46.8,
    discount: 0,
    total: 436.8,
    status: 'payment_pending',
    payment_id: undefined,
    created_at: '2024-11-24T18:30:00Z',
    updated_at: '2024-11-24T18:30:00Z',
  },
  {
    id: 'ord-1005',
    order_number: 'PGO-20241124-9840',
    customer_id: 'cust-6',
    store_id: 'store-1',
    subtotal: 1240,
    tax: 168.2,
    discount: 100,
    total: 1308.2,
    status: 'completed',
    payment_id: 'pay-1005',
    created_at: '2024-11-24T16:15:00Z',
    updated_at: '2024-11-24T16:22:00Z',
  },
  {
    id: 'ord-1006',
    order_number: 'PGO-20241124-9839',
    customer_id: 'cust-5',
    store_id: 'store-2',
    subtotal: 780,
    tax: 93.6,
    discount: 50,
    total: 823.6,
    status: 'completed',
    payment_id: 'pay-1006',
    created_at: '2024-11-24T15:00:00Z',
    updated_at: '2024-11-24T15:10:00Z',
  },
  {
    id: 'ord-1007',
    order_number: 'PGO-20241124-9838',
    customer_id: 'cust-1',
    store_id: 'store-3',
    subtotal: 1540,
    tax: 215.6,
    discount: 100,
    total: 1655.6,
    status: 'completed',
    payment_id: 'pay-1007',
    created_at: '2024-11-24T14:10:00Z',
    updated_at: '2024-11-24T14:18:00Z',
  },
];

export const INITIAL_ORDER_ITEMS: OrderItem[] = [
  { id: 'item-1', order_id: 'ord-1001', product_id: 'prod-1', quantity: 2, unit_price: 115, total_price: 230, tax_amount: 41.4, created_at: '2024-11-24T17:45:00Z' },
  { id: 'item-2', order_id: 'ord-1001', product_id: 'prod-2', quantity: 3, unit_price: 50, total_price: 150, tax_amount: 18.0, created_at: '2024-11-24T17:45:00Z' },
  { id: 'item-3', order_id: 'ord-1001', product_id: 'prod-6', quantity: 1, unit_price: 175, total_price: 175, tax_amount: 31.5, created_at: '2024-11-24T17:45:00Z' },
  { id: 'item-4', order_id: 'ord-1002', product_id: 'prod-10', quantity: 1, unit_price: 529, total_price: 529, tax_amount: 95.2, created_at: '2024-11-24T18:10:00Z' },
  { id: 'item-5', order_id: 'ord-1002', product_id: 'prod-1', quantity: 2, unit_price: 115, total_price: 230, tax_amount: 41.4, created_at: '2024-11-24T18:10:00Z' },
  { id: 'item-6', order_id: 'ord-1003', product_id: 'prod-5', quantity: 2, unit_price: 104, total_price: 208, tax_amount: 24.96, created_at: '2024-11-24T18:22:00Z' },
  { id: 'item-7', order_id: 'ord-1003', product_id: 'prod-7', quantity: 1, unit_price: 38, total_price: 38, tax_amount: 6.84, created_at: '2024-11-24T18:22:00Z' },
];

export const INITIAL_PAYMENTS: Payment[] = [
  { id: 'pay-1001', order_id: 'ord-1001', amount: 527.4, method: 'upi', gateway: 'razorpay', transaction_id: 'pay_RAZOR10019841', status: 'success', created_at: '2024-11-24T17:46:00Z', updated_at: '2024-11-24T17:46:00Z' },
  { id: 'pay-1002', order_id: 'ord-1002', amount: 829.5, method: 'card', gateway: 'razorpay', transaction_id: 'pay_RAZOR10029842', status: 'success', created_at: '2024-11-24T18:11:00Z', updated_at: '2024-11-24T18:11:00Z' },
  { id: 'pay-1003', order_id: 'ord-1003', amount: 296.8, method: 'upi', gateway: 'razorpay', transaction_id: 'pay_RAZOR10039843', status: 'success', created_at: '2024-11-24T18:23:00Z', updated_at: '2024-11-24T18:23:00Z' },
  { id: 'pay-1005', order_id: 'ord-1005', amount: 1308.2, method: 'upi', gateway: 'razorpay', transaction_id: 'pay_RAZOR10059840', status: 'success', created_at: '2024-11-24T16:16:00Z', updated_at: '2024-11-24T16:16:00Z' },
  { id: 'pay-1006', order_id: 'ord-1006', amount: 823.6, method: 'wallet', gateway: 'razorpay', transaction_id: 'pay_RAZOR10069839', status: 'success', created_at: '2024-11-24T15:02:00Z', updated_at: '2024-11-24T15:02:00Z' },
  { id: 'pay-1007', order_id: 'ord-1007', amount: 1655.6, method: 'card', gateway: 'razorpay', transaction_id: 'pay_RAZOR10079838', status: 'success', created_at: '2024-11-24T14:12:00Z', updated_at: '2024-11-24T14:12:00Z' },
];

export const INITIAL_EXIT_PASSES: ExitPass[] = [
  {
    id: 'exit-1001',
    order_id: 'ord-1001',
    qr_token: 'PENGO-EXIT-SECURE-9841-A8F1',
    is_used: true,
    verified_by: 'staff-01',
    verified_at: '2024-11-24T17:52:00Z',
    expires_at: '2024-11-24T18:45:00Z',
    created_at: '2024-11-24T17:46:00Z',
  },
  {
    id: 'exit-1002',
    order_id: 'ord-1002',
    qr_token: 'PENGO-EXIT-SECURE-9842-B4K9',
    is_used: false, // Ready to be scanned by Exit Verification Staff!
    verified_by: undefined,
    verified_at: undefined,
    expires_at: '2024-11-24T20:10:00Z',
    created_at: '2024-11-24T18:11:00Z',
  },
  {
    id: 'exit-1003',
    order_id: 'ord-1003',
    qr_token: 'PENGO-EXIT-SECURE-9843-C3X7',
    is_used: false, // Ready to be scanned
    verified_by: undefined,
    verified_at: undefined,
    expires_at: '2024-11-24T20:22:00Z',
    created_at: '2024-11-24T18:23:00Z',
  },
  {
    id: 'exit-1005',
    order_id: 'ord-1005',
    qr_token: 'PENGO-EXIT-SECURE-9840-E2D4',
    is_used: true,
    verified_by: 'staff-01',
    verified_at: '2024-11-24T16:22:00Z',
    expires_at: '2024-11-24T17:15:00Z',
    created_at: '2024-11-24T16:16:00Z',
  },
];

export interface FraudAlert {
  id: string;
  type: 'duplicate_qr' | 'payment_failure' | 'cart_manipulation' | 'invalid_barcode' | 'multiple_failed_verification';
  title: string;
  description: string;
  risk_level: 'low' | 'medium' | 'high';
  order_id?: string;
  customer_name?: string;
  store_id: string;
  status: 'pending_review' | 'resolved' | 'dismissed';
  created_at: string;
}

export const INITIAL_FRAUD_ALERTS: FraudAlert[] = [
  {
    id: 'fraud-1',
    type: 'duplicate_qr',
    title: 'Duplicate QR Pass Scan Detected',
    description: 'Exit pass PENGO-EXIT-SECURE-9841-A8F1 was attempted a 2nd time at Connaught Place gate 2 after being cleared.',
    risk_level: 'high',
    order_id: 'ord-1001',
    customer_name: 'Aarav Sharma',
    store_id: 'store-1',
    status: 'pending_review',
    created_at: '2024-11-24T18:05:00Z',
  },
  {
    id: 'fraud-2',
    type: 'cart_manipulation',
    title: 'Suspicious Quantity Alteration Prior to Payment',
    description: 'Cart total dropped from ₹3,490 to ₹290 within 4 seconds while 5 items were removed rapidly.',
    risk_level: 'medium',
    order_id: 'ord-1004',
    customer_name: 'Neha Singhania',
    store_id: 'store-1',
    status: 'pending_review',
    created_at: '2024-11-24T18:28:00Z',
  },
  {
    id: 'fraud-3',
    type: 'invalid_barcode',
    title: 'Repeated Unrecognized Barcode Scans',
    description: 'Customer app reported 6 consecutive invalid barcode scans (code: 9999999999999) in snack aisle.',
    risk_level: 'low',
    store_id: 'store-1',
    status: 'resolved',
    created_at: '2024-11-24T17:10:00Z',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    email: 'admin@pengo.retail',
    full_name: 'Vikram Malhotra',
    role: 'super_admin',
    store_id: undefined,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-2',
    email: 'owner@pengo.retail',
    full_name: 'Rajesh Mittal',
    role: 'store_owner',
    store_id: 'store-1',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-3',
    email: 'manager.cp@pengo.retail',
    full_name: 'Suresh Kumar',
    role: 'store_manager',
    store_id: 'store-1',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-4',
    email: 'inventory@pengo.retail',
    full_name: 'Amit Verma',
    role: 'inventory_manager',
    store_id: 'store-1',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-5',
    email: 'exit.staff@pengo.retail',
    full_name: 'Ramesh Singh',
    role: 'cashier',
    store_id: 'store-1',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-6',
    email: 'analyst@pengo.retail',
    full_name: 'Tanvi Agarwal',
    role: 'analyst',
    store_id: undefined,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// ─── LocalStorage Key Identifiers ─────────────────────────────────────────────

const STORAGE_KEYS = {
  STORES: 'pengo_stores',
  CATEGORIES: 'pengo_categories',
  PRODUCTS: 'pengo_products',
  INVENTORY: 'pengo_inventory',
  CUSTOMERS: 'pengo_customers',
  ORDERS: 'pengo_orders',
  ORDER_ITEMS: 'pengo_order_items',
  PAYMENTS: 'pengo_payments',
  EXIT_PASSES: 'pengo_exit_passes',
  COUPONS: 'pengo_coupons',
  FRAUD_ALERTS: 'pengo_fraud_alerts',
};

// ─── Browser Storage Helper ──────────────────────────────────────────────────

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

// ─── Universal Store Engine ───────────────────────────────────────────────────

export class DataStore {
  // Products
  static getProducts(): Product[] {
    return getStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  static addProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: `prod-${uuidv4().slice(0, 8)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    setStored(STORAGE_KEYS.PRODUCTS, updated);

    // Automatically create initial inventory entry for default store
    const inventory = this.getInventory();
    const newInventoryItem: InventoryItem = {
      id: `inv-${uuidv4().slice(0, 8)}`,
      product_id: newProduct.id,
      store_id: 'store-1',
      quantity: 50,
      min_threshold: 15,
      batch_number: `BATCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      expiry_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.INVENTORY, [newInventoryItem, ...inventory]);

    return newProduct;
  }

  static updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.PRODUCTS, products);
    return products[index];
  }

  static deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    setStored(STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  }

  // Categories
  static getCategories(): Category[] {
    return getStored(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  static addCategory(name: string, description?: string): Category {
    const categories = this.getCategories();
    const newCat: Category = {
      id: `cat-${uuidv4().slice(0, 8)}`,
      name,
      description,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.CATEGORIES, [...categories, newCat]);
    return newCat;
  }

  // Stores
  static getStores(): Store[] {
    return getStored(STORAGE_KEYS.STORES, INITIAL_STORES);
  }

  static addStore(store: Omit<Store, 'id' | 'created_at' | 'updated_at'>): Store {
    const stores = this.getStores();
    const newStore: Store = {
      ...store,
      id: `store-${uuidv4().slice(0, 8)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.STORES, [...stores, newStore]);
    return newStore;
  }

  // Inventory
  static getInventory(storeId?: string): (InventoryItem & { product?: Product })[] {
    const inventory = getStored<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
    const products = this.getProducts();

    const filtered = storeId && storeId !== 'all'
      ? inventory.filter((item) => item.store_id === storeId)
      : inventory;

    return filtered.map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.product_id),
    }));
  }

  static adjustStock(inventoryId: string, delta: number, reason: string): boolean {
    const inventory = getStored<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
    const item = inventory.find((i) => i.id === inventoryId);
    if (!item) return false;

    item.quantity = Math.max(0, item.quantity + delta);
    item.updated_at = new Date().toISOString();
    setStored(STORAGE_KEYS.INVENTORY, inventory);
    return true;
  }

  // Orders
  static getOrders(storeId?: string): (Order & { customer?: Customer; items?: (OrderItem & { product?: Product })[]; payment?: Payment })[] {
    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const customers = this.getCustomers();
    const items = getStored<OrderItem[]>(STORAGE_KEYS.ORDER_ITEMS, INITIAL_ORDER_ITEMS);
    const products = this.getProducts();
    const payments = getStored<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);

    const filtered = storeId && storeId !== 'all'
      ? orders.filter((o) => o.store_id === storeId)
      : orders;

    return filtered.map((order) => {
      const orderItems = items
        .filter((it) => it.order_id === order.id)
        .map((it) => ({
          ...it,
          product: products.find((p) => p.id === it.product_id),
        }));

      return {
        ...order,
        customer: customers.find((c) => c.id === order.customer_id),
        items: orderItems,
        payment: payments.find((p) => p.order_id === order.id),
      };
    });
  }

  static getOrderById(id: string) {
    const orders = this.getOrders();
    return orders.find((o) => o.id === id || o.order_number === id);
  }

  // Smart Exit Verification Core Engine
  static verifyExitPass(qrToken: string, staffName: string = 'Staff Member'): {
    success: boolean;
    message: string;
    order?: Order & { customer?: Customer; items?: (OrderItem & { product?: Product })[] };
    exitPass?: ExitPass;
    riskStatus?: 'verified' | 'already_used' | 'invalid_token' | 'payment_pending';
  } {
    const exitPasses = getStored<ExitPass[]>(STORAGE_KEYS.EXIT_PASSES, INITIAL_EXIT_PASSES);
    const orders = this.getOrders();

    const pass = exitPasses.find((p) => p.qr_token.trim().toLowerCase() === qrToken.trim().toLowerCase());

    if (!pass) {
      // Log suspicious activity
      this.addFraudAlert({
        type: 'invalid_barcode',
        title: 'Unknown / Tampered QR Code Scanned at Exit',
        description: `Token scanned: ${qrToken}. No matching exit pass found in server registry.`,
        risk_level: 'high',
        store_id: 'store-1',
        status: 'pending_review',
      });

      return {
        success: false,
        message: 'Invalid Exit Pass! Token not found or tampered.',
        riskStatus: 'invalid_token',
      };
    }

    const order = orders.find((o) => o.id === pass.order_id);

    if (pass.is_used) {
      // Security warning: Double exit attempt!
      this.addFraudAlert({
        type: 'duplicate_qr',
        title: 'SECURITY ALERT: Duplicate Exit Pass Presentation',
        description: `Exit Pass for Order ${order?.order_number || pass.order_id} was already used at ${pass.verified_at} by ${pass.verified_by}. Repeated exit blocked.`,
        risk_level: 'high',
        order_id: pass.order_id,
        customer_name: order?.customer?.name,
        store_id: order?.store_id || 'store-1',
        status: 'pending_review',
      });

      return {
        success: false,
        message: `ALREADY USED! This pass was verified on ${pass.verified_at} by ${pass.verified_by}. Exit denied.`,
        order,
        exitPass: pass,
        riskStatus: 'already_used',
      };
    }

    if (order && order.status !== 'paid' && order.status !== 'exit_verification') {
      return {
        success: false,
        message: `Order payment status is ${order.status}. Exit only authorized for paid orders.`,
        order,
        exitPass: pass,
        riskStatus: 'payment_pending',
      };
    }

    // Mark exit pass as used
    pass.is_used = true;
    pass.verified_by = staffName;
    pass.verified_at = new Date().toISOString();
    setStored(STORAGE_KEYS.EXIT_PASSES, exitPasses);

    // Update order status to completed
    if (order) {
      const allOrders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      const oIdx = allOrders.findIndex((o) => o.id === order.id);
      if (oIdx !== -1) {
        allOrders[oIdx].status = 'completed';
        allOrders[oIdx].updated_at = new Date().toISOString();
        setStored(STORAGE_KEYS.ORDERS, allOrders);
      }
    }

    return {
      success: true,
      message: 'Verified! Exit Authorized. Have a great day!',
      order,
      exitPass: pass,
      riskStatus: 'verified',
    };
  }

  static getExitPasses(): ExitPass[] {
    return getStored(STORAGE_KEYS.EXIT_PASSES, INITIAL_EXIT_PASSES);
  }

  // Customers
  static getCustomers(): Customer[] {
    return getStored(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  }

  // Coupons
  static getCoupons(): Coupon[] {
    return getStored(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  }

  static addCoupon(coupon: Omit<Coupon, 'id' | 'used_count' | 'created_at' | 'updated_at'>): Coupon {
    const coupons = this.getCoupons();
    const newCoupon: Coupon = {
      ...coupon,
      id: `coup-${uuidv4().slice(0, 8)}`,
      used_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.COUPONS, [newCoupon, ...coupons]);
    return newCoupon;
  }

  // Fraud Alerts
  static getFraudAlerts(): FraudAlert[] {
    return getStored(STORAGE_KEYS.FRAUD_ALERTS, INITIAL_FRAUD_ALERTS);
  }

  static addFraudAlert(alert: Omit<FraudAlert, 'id' | 'created_at'>): FraudAlert {
    const alerts = this.getFraudAlerts();
    const newAlert: FraudAlert = {
      ...alert,
      id: `fraud-${uuidv4().slice(0, 8)}`,
      created_at: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.FRAUD_ALERTS, [newAlert, ...alerts]);
    return newAlert;
  }

  // Dashboard Aggregates (100% computed from real records)
  static getDashboardMetrics(storeId?: string) {
    const orders = this.getOrders(storeId);
    const inventory = this.getInventory(storeId);
    const customers = this.getCustomers();
    const products = this.getProducts();

    const completedOrders = orders.filter((o) => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

    // Today's orders
    const todayStr = typeof window !== 'undefined' ? new Date().toISOString().split('T')[0] : '2024-11-24';
    const todayOrders = orders.filter((o) => o.created_at.startsWith(todayStr));
    const todaySales = todayOrders.reduce((sum, o) => sum + (o.status === 'completed' || o.status === 'paid' ? o.total : 0), 0);

    const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    const lowStockCount = inventory.filter((item) => item.quantity <= item.min_threshold && item.quantity > 0).length;
    const outOfStockCount = inventory.filter((item) => item.quantity === 0).length;

    // Payment distribution
    const payments = getStored<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    const methodCounts: Record<string, number> = { UPI: 0, Card: 0, Wallet: 0, Cash: 0 };
    payments.forEach((p) => {
      const key = p.method === 'upi' ? 'UPI' : p.method === 'card' ? 'Card' : p.method === 'wallet' ? 'Wallet' : 'Cash';
      methodCounts[key] = (methodCounts[key] || 0) + 1;
    });

    const totalPayments = payments.length || 1;
    const paymentDistribution = Object.entries(methodCounts).map(([method, count]) => ({
      method,
      count,
      percentage: Math.round((count / totalPayments) * 100),
    }));

    // Top selling products calculated from real order items
    const productSoldCounts: Record<string, number> = {};
    orders.forEach((o) => {
      o.items?.forEach((it) => {
        const pName = it.product?.name || 'Product';
        productSoldCounts[pName] = (productSoldCounts[pName] || 0) + it.quantity;
      });
    });

    const topProducts = Object.entries(productSoldCounts)
      .map(([name, units]) => ({ name: name.length > 20 ? name.slice(0, 18) + '...' : name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    // Category Sales Distribution
    const categoryTotals: Record<string, number> = {};
    const categories = this.getCategories();
    categories.forEach((c) => { categoryTotals[c.name] = 0; });

    orders.forEach((o) => {
      o.items?.forEach((it) => {
        const cat = categories.find((c) => c.id === it.product?.category_id);
        const catName = cat?.name || 'Other';
        categoryTotals[catName] = (categoryTotals[catName] || 0) + it.total_price;
      });
    });

    const categoryDistribution = Object.entries(categoryTotals)
      .filter(([_, val]) => val > 0)
      .map(([name, value]) => ({ name, value }));

    return {
      kpi: {
        totalRevenue,
        todaySales,
        totalOrders: orders.length,
        activeCustomers: customers.length,
        avgOrderValue,
        totalProducts: products.length,
        lowStockProducts: lowStockCount,
        outOfStockProducts: outOfStockCount,
        successfulTransactions: completedOrders.length,
      },
      paymentDistribution,
      topProducts,
      categoryDistribution,
      recentOrders: orders.slice(0, 8),
      alerts: this.getFraudAlerts().slice(0, 5),
    };
  }

  // 1-Click Simulator for Live Demos and Hackathon Reviews
  static simulateCustomerCheckout(storeId = 'store-1') {
    const products = this.getProducts().filter((p) => p.is_active);
    const customers = this.getCustomers();
    if (products.length === 0 || customers.length === 0) return null;

    // Pick a random customer and 2 products
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffled.slice(0, Math.min(2, shuffled.length));

    const orderId = `ord-${Date.now().toString().slice(-6)}`;
    const orderNumber = `PGO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    let subtotal = 0;
    let taxTotal = 0;
    const orderItems: OrderItem[] = [];

    const currentInventory = getStored<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);

    selectedProducts.forEach((p, idx) => {
      const qty = Math.floor(Math.random() * 2) + 1;
      const linePrice = p.selling_price * qty;
      const lineTax = Number(((linePrice * p.gst_rate) / 100).toFixed(2));
      subtotal += linePrice;
      taxTotal += lineTax;

      orderItems.push({
        id: `item-${Date.now()}-${idx}`,
        order_id: orderId,
        product_id: p.id,
        quantity: qty,
        unit_price: p.selling_price,
        total_price: linePrice,
        tax_amount: lineTax,
        created_at: new Date().toISOString(),
      });

      // Decrement stock atomically
      const invIdx = currentInventory.findIndex((inv) => inv.product_id === p.id && (inv.store_id === storeId || inv.store_id === 'store-1'));
      if (invIdx !== -1) {
        currentInventory[invIdx].quantity = Math.max(0, currentInventory[invIdx].quantity - qty);
        currentInventory[invIdx].updated_at = new Date().toISOString();
      }
    });

    setStored(STORAGE_KEYS.INVENTORY, currentInventory);

    const discount = subtotal > 300 ? 50 : 0;
    const total = Number((subtotal + taxTotal - discount).toFixed(2));

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      customer_id: customer.id,
      store_id: storeId,
      subtotal,
      tax: taxTotal,
      discount,
      total,
      status: 'paid', // Customer completed in-app checkout!
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Store Order
    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    setStored(STORAGE_KEYS.ORDERS, [newOrder, ...orders]);

    // Store Order Items
    const allItems = getStored<OrderItem[]>(STORAGE_KEYS.ORDER_ITEMS, INITIAL_ORDER_ITEMS);
    setStored(STORAGE_KEYS.ORDER_ITEMS, [...allItems, ...orderItems]);

    // Store Payment (Razorpay UPI)
    const paymentId = `pay-${Date.now().toString().slice(-6)}`;
    const payments = getStored<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    const newPayment: Payment = {
      id: paymentId,
      order_id: orderId,
      amount: total,
      method: 'upi',
      gateway: 'razorpay',
      transaction_id: `pay_RAZOR_${Date.now().toString().slice(-8)}`,
      status: 'success',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.PAYMENTS, [newPayment, ...payments]);

    // Generate single-use Exit Pass
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const qrToken = `PENGO-EXIT-SECURE-${orderNumber.slice(-4)}-${randomSuffix}`;
    const exitPasses = getStored<ExitPass[]>(STORAGE_KEYS.EXIT_PASSES, INITIAL_EXIT_PASSES);
    const newPass: ExitPass = {
      id: `exit-${Date.now().toString().slice(-6)}`,
      order_id: orderId,
      qr_token: qrToken,
      is_used: false,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour expiry
      created_at: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.EXIT_PASSES, [newPass, ...exitPasses]);

    return {
      order: newOrder,
      items: orderItems,
      exitPass: newPass,
      customer,
      token: qrToken,
    };
  }
}
