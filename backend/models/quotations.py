from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal
from models.base import QuotationStatus

# Quotation Item models
class QuotationItemBase(BaseModel):
    product_id: str
    quantity: int
    unit_price: Decimal
    discount_percent: Optional[Decimal] = 0
    tax_rate: Optional[Decimal] = 0

class QuotationItemCreate(QuotationItemBase):
    pass

class QuotationItemUpdate(BaseModel):
    product_id: Optional[str] = None
    quantity: Optional[int] = None
    unit_price: Optional[Decimal] = None
    discount_percent: Optional[Decimal] = None
    tax_rate: Optional[Decimal] = None

class QuotationItemResponse(QuotationItemBase):
    id: str
    quotation_id: str
    line_total: Decimal
    created_at: datetime
    # Include product details
    product_name: Optional[str] = None
    product_sku: Optional[str] = None
    product_unit: Optional[str] = None

# Quotation models
class QuotationBase(BaseModel):
    customer_id: str
    valid_until: date
    notes: Optional[str] = None

class QuotationCreate(QuotationBase):
    items: List[QuotationItemCreate]

class QuotationUpdate(BaseModel):
    customer_id: Optional[str] = None
    status: Optional[QuotationStatus] = None
    valid_until: Optional[date] = None
    notes: Optional[str] = None
    items: Optional[List[QuotationItemCreate]] = None

class QuotationResponse(QuotationBase):
    id: str
    quotation_number: str
    status: QuotationStatus
    subtotal: Decimal
    tax_amount: Decimal
    discount_amount: Decimal
    total_amount: Decimal
    created_by: str
    created_at: datetime
    updated_at: datetime
    # Include customer details
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    # Include items
    items: List[QuotationItemResponse] = []

class QuotationStatusUpdate(BaseModel):
    status: QuotationStatus
    notes: Optional[str] = None

class QuotationFilter(BaseModel):
    customer_id: Optional[str] = None
    status: Optional[QuotationStatus] = None
    date_from: Optional[date] = None
    date_to: Optional[date] = None

# PDF Generation models
class QuotationPDFRequest(BaseModel):
    quotation_id: str
    include_terms: bool = True
    include_notes: bool = True

class QuotationPDFResponse(BaseModel):
    success: bool
    pdf_url: Optional[str] = None
    message: str
