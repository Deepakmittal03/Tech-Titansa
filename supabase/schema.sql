-- ============================================================================
-- peNgo – Smart Retail Command Center
-- Complete Production Database Schema & Security Policies (Supabase PostgreSQL)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STORES TABLE
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    gstin VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100) UNIQUE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
    brand VARCHAR(255) NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL CHECK (mrp >= 0),
    selling_price NUMERIC(10, 2) NOT NULL CHECK (selling_price >= 0),
    gst_rate NUMERIC(5, 2) DEFAULT 18.00 CHECK (gst_rate >= 0),
    image_url TEXT,
    variants JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_barcode ON public.products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);

-- 4. INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    min_threshold INTEGER NOT NULL DEFAULT 10 CHECK (min_threshold >= 0),
    batch_number VARCHAR(100),
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_product_store_batch UNIQUE (product_id, store_id, batch_number)
);

CREATE INDEX IF NOT EXISTS idx_inventory_store_product ON public.inventory(store_id, product_id);

-- 5. STOCK MOVEMENTS (AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('in', 'out', 'adjustment', 'transfer', 'damaged')),
    reason TEXT NOT NULL,
    reference_id VARCHAR(100),
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    total_purchases INTEGER DEFAULT 0,
    total_spent NUMERIC(12, 2) DEFAULT 0.00,
    loyalty_points INTEGER DEFAULT 0,
    segment VARCHAR(50) DEFAULT 'New',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE RESTRICT,
    subtotal NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'created' CHECK (status IN (
        'created', 'payment_pending', 'paid', 'exit_verification', 'completed', 'cancelled', 'failed'
    )),
    payment_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_store ON public.orders(store_id);

-- 8. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    method VARCHAR(50) NOT NULL CHECK (method IN ('upi', 'card', 'wallet', 'cash')),
    gateway VARCHAR(50) NOT NULL DEFAULT 'razorpay',
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SMART EXIT PASSES (Single-Use Gate Verification)
CREATE TABLE IF NOT EXISTS public.exit_passes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    qr_token VARCHAR(255) UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(255),
    verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exit_passes_token ON public.exit_passes(qr_token);

-- 11. COUPONS & OFFERS
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
    min_cart_value NUMERIC(10, 2) DEFAULT 0.00,
    max_discount NUMERIC(10, 2),
    usage_limit INTEGER DEFAULT 1000,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SECURITY AUDIT LOGS & FRAUD ALERTS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STORED PROCEDURE: TRANSACTION-SAFE EXIT PASS VERIFICATION & INVENTORY DEDUCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.verify_and_burn_exit_pass(
    p_qr_token VARCHAR,
    p_staff_name VARCHAR
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_exit_pass public.exit_passes%ROWTYPE;
    v_order public.orders%ROWTYPE;
    v_item RECORD;
BEGIN
    -- 1. Lock and fetch exit pass
    SELECT * INTO v_exit_pass
    FROM public.exit_passes
    WHERE qr_token = p_qr_token
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'INVALID_TOKEN', 'message', 'Exit pass not found.');
    END IF;

    -- 2. Verify single-use check
    IF v_exit_pass.is_used THEN
        RETURN jsonb_build_object('success', false, 'error', 'ALREADY_USED', 'message', 'Pass has already been cleared.');
    END IF;

    -- 3. Check expiration
    IF v_exit_pass.expires_at < NOW() THEN
        RETURN jsonb_build_object('success', false, 'error', 'EXPIRED', 'message', 'Exit pass has expired.');
    END IF;

    -- 4. Mark pass as burned
    UPDATE public.exit_passes
    SET is_used = TRUE,
        verified_by = p_staff_name,
        verified_at = NOW()
    WHERE id = v_exit_pass.id;

    -- 5. Mark order as completed
    UPDATE public.orders
    SET status = 'completed',
        updated_at = NOW()
    WHERE id = v_exit_pass.order_id
    RETURNING * INTO v_order;

    -- 6. Atomically deduct inventory for each item
    FOR v_item IN
        SELECT product_id, quantity FROM public.order_items WHERE order_id = v_order.id
    LOOP
        UPDATE public.inventory
        SET quantity = GREATEST(0, quantity - v_item.quantity),
            updated_at = NOW()
        WHERE product_id = v_item.product_id AND store_id = v_order.store_id;

        -- Record stock movement audit
        INSERT INTO public.stock_movements (product_id, store_id, quantity, type, reason, reference_id)
        VALUES (v_item.product_id, v_order.store_id, -v_item.quantity, 'out', 'Self-Checkout Purchase', v_order.order_number);
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Exit pass verified. Order completed.',
        'order_number', v_order.order_number,
        'verified_at', NOW()
    );
END;
$$;

-- Enable Row Level Security (RLS)
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exit_passes ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated staff
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Staff manage products" ON public.products FOR ALL USING (true);
CREATE POLICY "Staff manage inventory" ON public.inventory FOR ALL USING (true);
CREATE POLICY "Staff manage orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Staff manage exit passes" ON public.exit_passes FOR ALL USING (true);
