from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

# Customer models
class CustomerBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    tax_number: Optional[str] = None
    contact_person: Optional[str] = None
    credit_limit: Optional[Decimal] = 0
    is_active: bool = True

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    tax_number: Optional[str] = None
    contact_person: Optional[str] = None
    credit_limit: Optional[Decimal] = None
    is_active: Optional[bool] = None

class CustomerResponse(CustomerBase):
    id: str
    created_at: datetime
    updated_at: datetime

# Vendor models
class VendorBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    tax_number: Optional[str] = None
    contact_person: Optional[str] = None
    payment_terms: Optional[str] = None
    is_active: bool = True

class VendorCreate(VendorBase):
    pass

class VendorUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    tax_number: Optional[str] = None
    contact_person: Optional[str] = None
    payment_terms: Optional[str] = None
    is_active: Optional[bool] = None

class VendorResponse(VendorBase):
    id: str
    created_at: datetime
    updated_at: datetime

# Product models
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    sku: Optional[str] = None
    category: Optional[str] = None
    unit_price: Decimal
    cost_price: Optional[Decimal] = None
    unit: str = "pcs"
    tax_rate: Optional[Decimal] = 0
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    sku: Optional[str] = None
    category: Optional[str] = None
    unit_price: Optional[Decimal] = None
    cost_price: Optional[Decimal] = None
    unit: Optional[str] = None
    tax_rate: Optional[Decimal] = None
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    id: str
    created_at: datetime
    updated_at: datetime

# Search and filter models
class CustomerFilter(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    is_active: Optional[bool] = None

class VendorFilter(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    is_active: Optional[bool] = None

class ProductFilter(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    sku: Optional[str] = None
    is_active: Optional[bool] = None
