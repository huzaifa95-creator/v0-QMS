from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class TransactionType(str, Enum):
    PURCHASE = "purchase"
    SALE = "sale"
    ADJUSTMENT = "adjustment"
    RETURN = "return"
    TRANSFER = "transfer"

class StockMovementCreate(BaseModel):
    product_id: str
    transaction_type: TransactionType
    quantity: int
    unit_cost: Optional[float] = None
    reference_id: Optional[str] = None  # Order ID, PO ID, etc.
    notes: Optional[str] = None

class StockMovementResponse(BaseModel):
    id: str
    product_id: str
    product_name: Optional[str] = None
    transaction_type: TransactionType
    quantity: int
    unit_cost: Optional[float] = None
    reference_id: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    created_by: str

class InventoryItemUpdate(BaseModel):
    current_stock: Optional[int] = Field(None, ge=0)
    minimum_stock: Optional[int] = Field(None, ge=0)
    maximum_stock: Optional[int] = Field(None, ge=0)
    reorder_point: Optional[int] = Field(None, ge=0)
    unit_cost: Optional[float] = Field(None, gt=0)

class InventoryItemResponse(BaseModel):
    id: str
    product_id: str
    product_name: Optional[str] = None
    product_sku: Optional[str] = None
    current_stock: int
    minimum_stock: int
    maximum_stock: int
    reorder_point: int
    unit_cost: float
    total_value: float
    last_updated: datetime
    status: str  # "in_stock", "low_stock", "out_of_stock"

class InventoryAnalytics(BaseModel):
    total_products: int
    total_value: float
    low_stock_items: int
    out_of_stock_items: int
    recent_movements: int
    top_moving_products: List[dict]
