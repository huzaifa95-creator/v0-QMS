-- QMS Platform Database Schema
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT CHECK (role IN ('admin', 'manager', 'sales', 'procurement', 'viewer')) DEFAULT 'viewer',
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE public.customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    postal_code TEXT,
    tax_number TEXT,
    credit_limit DECIMAL(15,2) DEFAULT 0,
    payment_terms INTEGER DEFAULT 30,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors table
CREATE TABLE public.vendors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    postal_code TEXT,
    tax_number TEXT,
    payment_terms INTEGER DEFAULT 30,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product categories table
CREATE TABLE public.product_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT UNIQUE,
    category_id UUID REFERENCES public.product_categories(id),
    unit_price DECIMAL(15,2) NOT NULL DEFAULT 0,
    cost_price DECIMAL(15,2) DEFAULT 0,
    unit TEXT DEFAULT 'pcs',
    weight DECIMAL(10,3),
    dimensions TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory table
CREATE TABLE public.inventory (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity_on_hand INTEGER DEFAULT 0,
    quantity_reserved INTEGER DEFAULT 0,
    quantity_available INTEGER GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
    reorder_level INTEGER DEFAULT 0,
    max_stock_level INTEGER,
    location TEXT,
    last_counted_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id)
);

-- Stock movements table
CREATE TABLE public.stock_movements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id),
    movement_type TEXT CHECK (movement_type IN ('in', 'out', 'adjustment', 'transfer')) NOT NULL,
    quantity INTEGER NOT NULL,
    reference_type TEXT, -- 'purchase', 'sale', 'adjustment', 'transfer'
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quotations table
CREATE TABLE public.quotations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quote_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) NOT NULL,
    status TEXT CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')) DEFAULT 'draft',
    valid_until DATE,
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    terms_conditions TEXT,
    notes TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quotation items table
CREATE TABLE public.quotation_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quotation_id UUID REFERENCES public.quotations(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    line_total DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price * (1 - discount_percent/100)) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    quotation_id UUID REFERENCES public.quotations(id),
    customer_id UUID REFERENCES public.customers(id) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    order_date DATE DEFAULT CURRENT_DATE,
    expected_delivery_date DATE,
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    shipping_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    shipping_address TEXT,
    notes TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    line_total DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase orders table
CREATE TABLE public.purchase_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    po_number TEXT UNIQUE NOT NULL,
    vendor_id UUID REFERENCES public.vendors(id) NOT NULL,
    status TEXT CHECK (status IN ('draft', 'sent', 'confirmed', 'received', 'cancelled')) DEFAULT 'draft',
    order_date DATE DEFAULT CURRENT_DATE,
    expected_delivery_date DATE,
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    notes TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase order items table
CREATE TABLE public.purchase_order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    received_quantity INTEGER DEFAULT 0,
    line_total DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery challans table
CREATE TABLE public.delivery_challans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    challan_number TEXT UNIQUE NOT NULL,
    order_id UUID REFERENCES public.orders(id),
    delivery_date DATE DEFAULT CURRENT_DATE,
    driver_name TEXT,
    vehicle_number TEXT,
    status TEXT CHECK (status IN ('pending', 'in_transit', 'delivered', 'returned')) DEFAULT 'pending',
    notes TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE public.invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invoice_number TEXT UNIQUE NOT NULL,
    order_id UUID REFERENCES public.orders(id),
    customer_id UUID REFERENCES public.customers(id) NOT NULL,
    invoice_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    paid_amount DECIMAL(15,2) DEFAULT 0,
    balance_due DECIMAL(15,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    payment_terms TEXT,
    notes TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Import/Export shipments table
CREATE TABLE public.shipments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    shipment_number TEXT UNIQUE NOT NULL,
    type TEXT CHECK (type IN ('import', 'export')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'in_transit', 'customs_clearance', 'delivered', 'cancelled')) DEFAULT 'pending',
    origin_country TEXT,
    destination_country TEXT,
    shipping_method TEXT,
    tracking_number TEXT,
    estimated_delivery DATE,
    actual_delivery DATE,
    customs_value DECIMAL(15,2),
    freight_cost DECIMAL(15,2),
    insurance_cost DECIMAL(15,2),
    customs_duty DECIMAL(15,2),
    total_cost DECIMAL(15,2),
    notes TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipment items table
CREATE TABLE public.shipment_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_value DECIMAL(15,2),
    total_value DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_value) STORED,
    hs_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_customers_name ON public.customers(name);
CREATE INDEX idx_vendors_name ON public.vendors(name);
CREATE INDEX idx_products_name ON public.products(name);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_quotations_customer ON public.quotations(customer_id);
CREATE INDEX idx_quotations_status ON public.quotations(status);
CREATE INDEX idx_orders_customer ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_inventory_product ON public.inventory(product_id);
CREATE INDEX idx_stock_movements_product ON public.stock_movements(product_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON public.quotations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON public.purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delivery_challans_updated_at BEFORE UPDATE ON public.delivery_challans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
