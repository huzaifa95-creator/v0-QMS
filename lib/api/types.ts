export interface User {
  id: string
  email: string
  full_name: string
  role: "admin" | "manager" | "user"
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  tax_number?: string
  created_at: string
  updated_at: string
}

export interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  tax_number?: string
  payment_terms?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  sku: string
  description?: string
  category: string
  unit_price: number
  unit: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface QuotationItem {
  id: string
  quotation_id: string
  product_id: string
  product_name?: string
  quantity: number
  unit_price: number
  discount_percentage: number
  total_amount: number
  created_at: string
}

export interface Quotation {
  id: string
  quotation_number: string
  customer_id: string
  customer_name?: string
  status: "draft" | "sent" | "accepted" | "rejected" | "expired"
  total_amount: number
  valid_until: string
  notes?: string
  created_at: string
  updated_at: string
  items: QuotationItem[]
}

export interface Order {
  id: string
  order_number: string
  customer_id: string
  customer_name?: string
  quotation_id?: string
  status: "draft" | "confirmed" | "in_progress" | "completed" | "cancelled"
  total_amount: number
  notes?: string
  delivery_date?: string
  created_at: string
  updated_at: string
  items: QuotationItem[]
}

export interface PurchaseOrder {
  id: string
  po_number: string
  vendor_id: string
  vendor_name?: string
  status: "draft" | "sent" | "confirmed" | "received" | "cancelled"
  total_amount: number
  notes?: string
  expected_delivery_date?: string
  created_at: string
  updated_at: string
  items: QuotationItem[]
}

export interface InventoryItem {
  id: string
  product_id: string
  product_name?: string
  product_sku?: string
  current_stock: number
  minimum_stock: number
  maximum_stock: number
  reorder_point: number
  unit_cost: number
  total_value: number
  last_updated: string
  status: "in_stock" | "low_stock" | "out_of_stock"
}

export interface StockMovement {
  id: string
  product_id: string
  product_name?: string
  transaction_type: "purchase" | "sale" | "adjustment" | "return" | "transfer"
  quantity: number
  unit_cost?: number
  reference_id?: string
  notes?: string
  created_at: string
  created_by: string
}

export interface Shipment {
  id: string
  shipment_number: string
  shipment_type: "import" | "export"
  status: "pending" | "in_transit" | "customs_clearance" | "delivered" | "cancelled"
  origin_country: string
  destination_country: string
  carrier: string
  tracking_number?: string
  estimated_delivery?: string
  actual_delivery?: string
  total_value: number
  currency: string
  notes?: string
  created_at: string
  updated_at: string
  created_by: string
}

export interface DashboardMetrics {
  total_revenue: number
  total_orders: number
  pending_quotations: number
  low_stock_alerts: number
  recent_activities: Array<{
    type: string
    description: string
    timestamp: string
  }>
}

// Request types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name: string
  role?: "admin" | "manager" | "user"
}

export interface CustomerCreateRequest {
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  tax_number?: string
}

export interface ProductCreateRequest {
  name: string
  sku: string
  description?: string
  category: string
  unit_price: number
  unit: string
}

export interface QuotationCreateRequest {
  customer_id: string
  items: Array<{
    product_id: string
    quantity: number
    unit_price: number
    discount_percentage?: number
  }>
  valid_until: string
  notes?: string
}
