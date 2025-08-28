from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class BaseResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

class PaginationParams(BaseModel):
    page: int = 1
    limit: int = 10
    search: Optional[str] = None

class PaginatedResponse(BaseModel):
    items: List[dict]
    total: int
    page: int
    limit: int
    total_pages: int

# Common enums
class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    EMPLOYEE = "employee"
    VIEWER = "viewer"

class QuotationStatus(str, Enum):
    DRAFT = "draft"
    SENT = "sent"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"

class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class TransactionType(str, Enum):
    PURCHASE = "purchase"
    SALE = "sale"
    ADJUSTMENT = "adjustment"
    RETURN = "return"
