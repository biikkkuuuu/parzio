-- ==============================================================================
-- PARZIO DEMI-FINE JEWELLERY — PRODUCTION SUPABASE POSTGRESQL SCHEMA MIGRATION
-- ==============================================================================
-- Run this entire file in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLE: CATEGORIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    image TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- TABLE: PRODUCTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2) NOT NULL,
    save_percent NUMERIC(5, 2) DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 500,
    colorways INTEGER DEFAULT 40,
    sku TEXT NOT NULL UNIQUE,
    material TEXT DEFAULT '316L Surgical Stainless Steel',
    is_waterproof BOOLEAN DEFAULT TRUE,
    is_anti_tarnish BOOLEAN DEFAULT TRUE,
    badge TEXT,
    quote TEXT,
    image TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    stock INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indices for rapid filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_badge ON public.products(badge);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);

-- ==============================================================================
-- TABLE: ORDERS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'COD',
    payment_status TEXT DEFAULT 'PENDING',
    status TEXT DEFAULT 'PENDING',
    tracking_number TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ==============================================================================
-- TABLE: STORE_CONFIG (Banners, Marquees, Coupons, Emergency Lockdown)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.store_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_config ENABLE ROW LEVEL SECURITY;

-- Categories: Anyone can read, anyone can insert/update (or restrict via service_role in auth)
CREATE POLICY "Public categories are readable by everyone" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Enable all category operations" 
ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- Products: Anyone can read active products, full management for admin operations
CREATE POLICY "Public products are readable by everyone" 
ON public.products FOR SELECT USING (true);

CREATE POLICY "Enable all product operations" 
ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Orders: Anyone can insert orders (checkout), read and update for fulfillment
CREATE POLICY "Anyone can create orders" 
ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders are readable for tracking and admin" 
ON public.orders FOR SELECT USING (true);

CREATE POLICY "Orders can be updated" 
ON public.orders FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Orders can be deleted" 
ON public.orders FOR DELETE USING (true);

-- Store Config: Readable by all, full access for admin
CREATE POLICY "Store config readable by everyone" 
ON public.store_config FOR SELECT USING (true);

CREATE POLICY "Store config can be updated" 
ON public.store_config FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- SEED INITIAL DATA
-- ==============================================================================

-- Seed Categories
INSERT INTO public.categories (id, name, image, count, display_order)
VALUES
    ('cat-necklaces', 'Necklaces', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80', 10, 1),
    ('cat-earrings', 'Earrings', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80', 8, 2),
    ('cat-rings', 'Rings', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80', 8, 3),
    ('cat-bracelets', 'Bracelets', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ6KsGvMmDre3vW1DrMsKt5qGEuc3sAKPferGJypreLxK_7Y67atNQ4xomNX3mXsafI8KxVgwwIxAuSGRAMdU1nptUgdRG2egH30oAiQJPAMja-A9D7cmeTOcTjB4K4xMDXO1Jh0lOUQbTjY6ag3AcMy_FFMlynYLgIWldQSQ-kXA73U-4qhTyvLZlIuztQX18XRXyVMQVw4OkFAABmM7kQLZaJmDFCQgfCVkrUX-3u1FG5lCyJEWr', 8, 4),
    ('cat-anklets', 'Anklets', 'https://images.unsplash.com/photo-1611591475883-9b884179379e?auto=format&fit=crop&w=400&q=80', 6, 5)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, image = EXCLUDED.image, count = EXCLUDED.count;

-- Seed Hero Product
INSERT INTO public.products (id, name, category, price, original_price, save_percent, rating, reviews_count, colorways, sku, material, is_waterproof, is_anti_tarnish, badge, quote, image, description)
VALUES
    ('hero-coin-bracelet', 'Coin Charm Link Bracelet', 'Bracelets', 99, 1200, 91, 4.9, 1420, 40, 'BR-99-COIN', '316L Surgical Stainless Steel', true, true, 'HERO DROP', 'Wore it all summer in the pool and beach — zero blackening! Truly unbelievable quality for ₹99.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ6KsGvMmDre3vW1DrMsKt5qGEuc3sAKPferGJypreLxK_7Y67atNQ4xomNX3mXsafI8KxVgwwIxAuSGRAMdU1nptUgdRG2egH30oAiQJPAMja-A9D7cmeTOcTjB4K4xMDXO1Jh0lOUQbTjY6ag3AcMy_FFMlynYLgIWldQSQ-kXA73U-4qhTyvLZlIuztQX18XRXyVMQVw4OkFAABmM7kQLZaJmDFCQgfCVkrUX-3u1FG5lCyJEWr', 'Handmade 316L surgical stainless steel with smooth links, coin charms, and shiny beads. 100% waterproof and anti-tarnish.')
ON CONFLICT (id) DO NOTHING;

-- Seed Vault Products (Necklaces & Rings & Bracelets)
INSERT INTO public.products (id, name, category, price, original_price, save_percent, rating, reviews_count, colorways, sku, material, is_waterproof, is_anti_tarnish, badge, quote, image, description)
VALUES
    ('prod-pearl-double-necklace', 'PARZIO Necklace With Pearls', 'Necklaces', 99, 1300, 92, 4.9, 684, 40, 'NK-99-PEARL', 'Lustrous Shell Pearls + 316L Steel Clasp', true, true, 'BEST SELLER', 'Worn daily in water for 6 months, shine remains pristine.', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80', 'Double strand lustrous shell pearls with 316L stainless steel anti-tarnish lobster clasp.'),
    ('prod-emerald-collar-necklace', 'PARZIO Necklace Anti-Tarnish Emerald', 'Necklaces', 99, 1400, 92, 4.9, 712, 40, 'NK-99-EMR', '316L Stainless Steel + Emerald Cut Crystals', true, true, 'NEW LAUNCH', 'The green crystal sparkle looks identical to real emerald.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', 'Vibrant emerald-cut lab gemstones prong-set along a 316L stainless steel anti-tarnish collar chain.'),
    ('prod-dome-croissant-ring', 'PARZIO Chunky Croissant Dome Ring', 'Rings', 99, 1100, 91, 4.9, 934, 40, 'RG-99-CRST', '316L Stainless Steel Heavy Cast', true, true, 'BEST SELLER', 'Looks like a ₹50,000 Italian gold statement dome ring.', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80', 'Signature ribbed croissant silhouette with ergonomic interior comfort curve. Completely tarnish-proof.'),
    ('prod-cuban-tennis-bracelet', 'PARZIO Half Cuban Half Tennis Bracelet', 'Bracelets', 99, 1500, 93, 5.0, 1120, 40, 'BR-99-DUO', '316L Steel + AAAAA Zirconia Inlay', true, true, 'NEW COLLECTION', 'The contrast between curb link and tennis crystal is pure luxury.', 'https://images.unsplash.com/photo-1611591475883-9b884179379e?auto=format&fit=crop&w=600&q=80', 'Architectural split-link silhouette with 4mm micro-pave crystals and box clasp lock.')
ON CONFLICT (id) DO NOTHING;
