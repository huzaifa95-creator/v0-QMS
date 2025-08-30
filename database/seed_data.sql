-- Sample data for testing
-- Run this after creating schema and RLS policies

-- Insert sample product categories
INSERT INTO public.product_categories (name, description) VALUES
('Electronics', 'Electronic components and devices'),
('Hardware', 'Hardware tools and equipment'),
('Software', 'Software licenses and services'),
('Office Supplies', 'General office supplies and stationery');

-- Insert sample products
INSERT INTO public.products (name, description, sku, unit_price, unit) VALUES
('Laptop Computer', 'High-performance business laptop', 'LAP-001', 1200.00, 'pcs'),
('Office Chair', 'Ergonomic office chair with lumbar support', 'CHR-001', 350.00, 'pcs'),
('Printer Paper', 'A4 size white printer paper', 'PPR-001', 25.00, 'ream'),
('USB Cable', 'USB-C to USB-A cable 2m', 'USB-001', 15.00, 'pcs'),
('Monitor Stand', 'Adjustable monitor stand', 'MON-001', 85.00, 'pcs');

-- Insert sample customers
INSERT INTO public.customers (name, email, phone, address, city, country) VALUES
('ABC Corporation', 'contact@abc-corp.com', '+1-555-0101', '123 Business Ave', 'New York', 'USA'),
('XYZ Industries', 'info@xyz-industries.com', '+1-555-0102', '456 Industrial Blvd', 'Chicago', 'USA'),
('Global Trading Co', 'sales@globaltrading.com', '+1-555-0103', '789 Commerce St', 'Los Angeles', 'USA');

-- Insert sample vendors
INSERT INTO public.vendors (name, email, phone, address, city, country) VALUES
('Tech Supplies Inc', 'orders@techsupplies.com', '+1-555-0201', '321 Supplier Lane', 'San Francisco', 'USA'),
('Office Equipment Ltd', 'sales@officeequip.com', '+1-555-0202', '654 Vendor Road', 'Seattle', 'USA'),
('Hardware Solutions', 'info@hardwaresol.com', '+1-555-0203', '987 Parts Avenue', 'Denver', 'USA');

-- Initialize inventory for products
INSERT INTO public.inventory (product_id, quantity_on_hand, reorder_level) 
SELECT id, 100, 10 FROM public.products;
