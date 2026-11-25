// ============================================================================
// peNgo Smart Retail Command Center — Database Types
// Supabase PostgreSQL Schema
// ============================================================================

// ─── Enums ──────────────────────────────────────────────────────────────────

export type UserRoleType =
  | 'super_admin'
  | 'store_owner'
  | 'store_manager'
  | 'inventory_manager'
  | 'cashier'
  | 'analyst';

export type OrderStatus =
  | 'created'
  | 'payment_pending'
  | 'paid'
  | 'exit_verification'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type PaymentMethod = 'upi' | 'card' | 'wallet' | 'cash';
export type PaymentGateway = 'razorpay';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export type StockMovementType =
  | 'in'
  | 'out'
  | 'adjustment'
  | 'transfer'
  | 'damaged';

export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type CouponType = 'percentage' | 'fixed';
export type CartStatus = 'active' | 'checked_out' | 'abandoned';
export type RefundStatus = 'requested' | 'approved' | 'processed' | 'rejected';
export type NotificationType = 'info' | 'warning' | 'error' | 'success';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type RiskLevel = 'low' | 'medium' | 'high';
export type CustomerSegment = 'New' | 'Regular' | 'VIP' | 'Loyal' | string;

// ─── Base Entity ────────────────────────────────────────────────────────────

export type BaseEntity = {
  id: string;
  created_at: string;
  updated_at?: string;
};

// ─── User & Auth ────────────────────────────────────────────────────────────

export type User = BaseEntity & {
  email: string;
  full_name: string;
  role?: string;
  store_id?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  last_login_at?: string | null;
};

export type Role = BaseEntity & {
  name: UserRoleType;
  description?: string | null;
};

export type Permission = BaseEntity & {
  name: string;
  description?: string | null;
  module: string;
  action: string;
};

export type UserRole = BaseEntity & {
  user_id: string;
  role_id: string;
  store_id?: string | null;
};

// ─── Store ──────────────────────────────────────────────────────────────────

export type Store = BaseEntity & {
  name: string;
  code: string;
  address?: string;
  address_line1?: string;
  address_line2?: string | null;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string;
  email?: string;
  gstin?: string | null;
  owner_id?: string;
  is_active: boolean;
  settings?: Record<string, unknown> | null;
};

// ─── Products ───────────────────────────────────────────────────────────────

export type ProductVariant = {
  name: string;
  value: string;
  price_adjustment?: number;
  sku_suffix?: string | null;
};

export type Product = BaseEntity & {
  name: string;
  description?: string | null;
  sku: string;
  barcode: string;
  mrp: number;
  selling_price: number;
  cost_price?: number | null;
  gst_rate: number;
  hsn_code?: string | null;
  category_id?: string | null;
  brand: string;
  image_url?: string | null;
  variants?: ProductVariant[] | null;
  unit?: string | null;
  weight?: number | null;
  is_active: boolean;
};

// ─── Categories ─────────────────────────────────────────────────────────────

export type Category = BaseEntity & {
  name: string;
  slug?: string;
  description?: string | null;
  parent_id?: string | null;
  image_url?: string | null;
  sort_order?: number;
  is_active: boolean;
};

// ─── Inventory ──────────────────────────────────────────────────────────────

export type InventoryItem = BaseEntity & {
  product_id: string;
  store_id: string;
  quantity: number;
  reserved_quantity?: number;
  min_threshold: number;
  max_threshold?: number | null;
  batch_number?: string | null;
  expiry_date?: string | null;
  cost_price?: number | null;
  location?: string | null;
  status?: InventoryStatus;
};

// ─── Stock Movements ────────────────────────────────────────────────────────

export type StockMovement = BaseEntity & {
  inventory_id?: string;
  product_id: string;
  store_id: string;
  type: StockMovementType;
  quantity: number;
  previous_quantity?: number;
  new_quantity?: number;
  reason: string;
  reference?: string | null;
  reference_type?: string | null;
  performed_by?: string;
  destination_store_id?: string | null;
};

// ─── Suppliers ──────────────────────────────────────────────────────────────

export type Supplier = BaseEntity & {
  name: string;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  gstin?: string | null;
  is_active: boolean;
};

// ─── Customers ──────────────────────────────────────────────────────────────

export type Customer = BaseEntity & {
  name: string;
  email?: string | null;
  phone: string;
  avatar_url?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  address?: string | null;
  total_purchases: number;
  total_spent: number;
  loyalty_points: number;
  segment?: CustomerSegment;
  is_active?: boolean;
};

// ─── Cart & Cart Items ──────────────────────────────────────────────────────

export type CartItem = BaseEntity & {
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: Product;
};

export type Cart = BaseEntity & {
  customer_id: string;
  store_id: string;
  status: CartStatus;
  items?: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
};

// ─── Orders & Order Items ───────────────────────────────────────────────────

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  tax_amount: number;
  created_at?: string;
  product?: Product;
};

export type Order = BaseEntity & {
  order_number: string;
  customer_id?: string | null;
  store_id: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  payment_id?: string;
  notes?: string | null;
  customer?: Customer;
  items?: OrderItem[];
  payment?: Payment;
};

// ─── Payments & Refunds ─────────────────────────────────────────────────────

export type Payment = BaseEntity & {
  order_id: string;
  amount: number;
  method: PaymentMethod;
  gateway?: PaymentGateway | null;
  transaction_id: string;
  gateway_order_id?: string | null;
  gateway_response?: Record<string, unknown> | null;
  status: PaymentStatus;
  paid_at?: string | null;
};

export type Refund = BaseEntity & {
  order_id: string;
  payment_id: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  gateway_refund_id?: string | null;
  approved_by?: string | null;
  processed_at?: string | null;
};

// ─── Smart Exit Passes ──────────────────────────────────────────────────────

export type ExitPass = {
  id: string;
  order_id: string;
  qr_token: string;
  is_used: boolean;
  verified_by?: string | null;
  verified_at?: string | null;
  expires_at: string;
  created_at: string;
  updated_at?: string;
};

// ─── Coupons & Loyalty ──────────────────────────────────────────────────────

export type Coupon = BaseEntity & {
  code: string;
  name?: string;
  description?: string | null;
  type: CouponType;
  discount_value: number;
  min_cart_value?: number | null;
  max_discount?: number | null;
  applicable_products?: string[] | null;
  applicable_categories?: string[] | null;
  usage_limit?: number | null;
  used_count?: number;
  valid_from?: string;
  valid_until?: string | null;
  is_active: boolean;
};

export type CouponUsage = BaseEntity & {
  coupon_id: string;
  customer_id: string;
  order_id: string;
  discount_applied: number;
};

export type LoyaltyTransaction = BaseEntity & {
  customer_id: string;
  order_id?: string | null;
  points: number;
  type: 'earned' | 'redeemed' | 'expired' | 'adjusted';
  description?: string;
};

// ─── Notifications & Audit ──────────────────────────────────────────────────

export type Notification = BaseEntity & {
  user_id?: string | null;
  store_id?: string | null;
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string | null;
};

export type AuditLog = BaseEntity & {
  user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  old_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  ip_address?: string | null;
};
