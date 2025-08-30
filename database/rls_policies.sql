-- Row Level Security Policies
-- Run this after creating the schema

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_challans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_items ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Customers policies
CREATE POLICY "Authenticated users can view customers" ON public.customers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Sales and above can manage customers" ON public.customers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager', 'sales')
        )
    );

-- Vendors policies
CREATE POLICY "Authenticated users can view vendors" ON public.vendors
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Procurement and above can manage vendors" ON public.vendors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager', 'procurement')
        )
    );

-- Products policies
CREATE POLICY "Authenticated users can view products" ON public.products
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Managers and above can manage products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager')
        )
    );

-- Inventory policies
CREATE POLICY "Authenticated users can view inventory" ON public.inventory
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Managers and above can manage inventory" ON public.inventory
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager')
        )
    );

-- Stock movements policies
CREATE POLICY "Authenticated users can view stock movements" ON public.stock_movements
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Managers and above can create stock movements" ON public.stock_movements
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager')
        )
    );

-- Quotations policies
CREATE POLICY "Authenticated users can view quotations" ON public.quotations
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Sales and above can manage quotations" ON public.quotations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager', 'sales')
        )
    );

-- Orders policies
CREATE POLICY "Authenticated users can view orders" ON public.orders
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Sales and above can manage orders" ON public.orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager', 'sales')
        )
    );

-- Apply similar policies to other tables...
-- (Quotation items, order items, etc. inherit permissions from parent tables)

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
    RETURN (SELECT role FROM public.users WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
