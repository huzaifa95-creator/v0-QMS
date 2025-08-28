from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class OrderStatus(str, Enum):
    DRAFT = "draft"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class PurchaseOrderStatus(str, Enum):
    DRAFT = "draft"
    SENT = "sent"
    CONFIRMED = "confirmed"
    RECEIVED = "received"
    CANCELLED = "cancelled"

class DeliveryStatus(str, Enum):
    PENDING = "pending"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int = Field(gt=0)
    unit_price: float = Field(gt=0)
    discount_percentage: float = Field(default=0, ge=0, le=100)

class OrderItemResponse(BaseModel):
    id: str
    order_id: str
    product_id: str
    product_name: Optional[str] = None
    quantity: int
    unit_price: float
    discount_percentage: float
    total_amount: float
    created_at: datetime

class OrderCreate(BaseModel):
    customer_id: str
    quotation_id: Optional[str] = None
    items: List[OrderItemCreate]
    notes: Optional[str] = None
    delivery_date: Optional[datetime] = None

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    notes: Optional[str] = None
    delivery_date: Optional[datetime] = None

class OrderResponse(BaseModel):
    id: str
    order_number: str
    customer_id: str
    customer_name: Optional[str] = None
    quotation_id: Optional[str] = None
    status: OrderStatus
    total_amount: float
    notes: Optional[str] = None
    delivery_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []

class PurchaseOrderCreate(BaseModel):
    vendor_id: str
    items: List[OrderItemCreate]
    notes: Optional[str] = None
    expected_delivery_date: Optional[datetime] = None

class PurchaseOrderResponse(BaseModel):
    id: str
    po_number: str
    vendor_id: str
    vendor_name: Optional[str] = None
    status: PurchaseOrderStatus
    total_amount: float
    notes: Optional[str] = None
    expected_delivery_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []

class DeliveryChallanCreate(BaseModel):
    order_id: Optional[str] = None
    purchase_order_id: Optional[str] = None
    driver_name: str
    vehicle_number: str
    delivery_address: str
    items: List[OrderItemCreate]
    notes: Optional[str] = None

class DeliveryChallanResponse(BaseModel):
    id: str
    challan_number: str
    order_id: Optional[str] = None
    purchase_order_id: Optional[str] = None
    driver_name: str
    vehicle_number: str
    delivery_address: str
    status: DeliveryStatus
    total_amount: float
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []
