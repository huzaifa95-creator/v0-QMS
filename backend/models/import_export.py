from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ShipmentStatus(str, Enum):
    PENDING = "pending"
    IN_TRANSIT = "in_transit"
    CUSTOMS_CLEARANCE = "customs_clearance"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class ShipmentType(str, Enum):
    IMPORT = "import"
    EXPORT = "export"

class ShipmentCreate(BaseModel):
    shipment_number: str
    shipment_type: ShipmentType
    origin_country: str
    destination_country: str
    carrier: str
    tracking_number: Optional[str] = None
    estimated_delivery: Optional[datetime] = None
    total_value: float = Field(gt=0)
    currency: str = Field(default="USD")
    notes: Optional[str] = None

class ShipmentUpdate(BaseModel):
    status: Optional[ShipmentStatus] = None
    tracking_number: Optional[str] = None
    estimated_delivery: Optional[datetime] = None
    actual_delivery: Optional[datetime] = None
    notes: Optional[str] = None

class ShipmentResponse(BaseModel):
    id: str
    shipment_number: str
    shipment_type: ShipmentType
    status: ShipmentStatus
    origin_country: str
    destination_country: str
    carrier: str
    tracking_number: Optional[str] = None
    estimated_delivery: Optional[datetime] = None
    actual_delivery: Optional[datetime] = None
    total_value: float
    currency: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    created_by: str

class DocumentCreate(BaseModel):
    shipment_id: str
    document_type: str  # "invoice", "packing_list", "bill_of_lading", etc.
    document_name: str
    file_url: str
    notes: Optional[str] = None

class DocumentResponse(BaseModel):
    id: str
    shipment_id: str
    document_type: str
    document_name: str
    file_url: str
    notes: Optional[str] = None
    uploaded_at: datetime
    uploaded_by: str
