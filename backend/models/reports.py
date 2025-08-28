from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class SalesReport(BaseModel):
    total_revenue: float
    total_orders: int
    average_order_value: float
    period_start: datetime
    period_end: datetime
    top_customers: List[Dict[str, Any]]
    monthly_breakdown: List[Dict[str, Any]]

class InventoryReport(BaseModel):
    total_products: int
    total_value: float
    low_stock_count: int
    out_of_stock_count: int
    top_products: List[Dict[str, Any]]
    category_breakdown: List[Dict[str, Any]]

class QuotationReport(BaseModel):
    total_quotations: int
    accepted_quotations: int
    pending_quotations: int
    conversion_rate: float
    average_quotation_value: float
    monthly_trends: List[Dict[str, Any]]

class DashboardMetrics(BaseModel):
    total_revenue: float
    total_orders: int
    pending_quotations: int
    low_stock_alerts: int
    recent_activities: List[Dict[str, Any]]
