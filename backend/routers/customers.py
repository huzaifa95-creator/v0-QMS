from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from models.master_data import (
    CustomerCreate, CustomerUpdate, CustomerResponse, CustomerFilter
)
from models.base import BaseResponse, PaginatedResponse, PaginationParams
from auth.dependencies import get_current_active_user
from database.supabase_client import db
from datetime import datetime
import uuid

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.post("/", response_model=BaseResponse)
async def create_customer(
    customer_data: CustomerCreate,
    current_user = Depends(get_current_active_user)
):
    """Create a new customer"""
    try:
        customer_dict = customer_data.dict()
        customer_dict.update({
            "id": str(uuid.uuid4()),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        })
        
        result = await db.create_record("customers", customer_dict)
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create customer"
            )
        
        return BaseResponse(
            success=True,
            message="Customer created successfully",
            data=result["data"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Customer creation failed: {str(e)}"
        )

@router.get("/", response_model=PaginatedResponse)
async def get_customers(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    current_user = Depends(get_current_active_user)
):
    """Get customers with pagination and filtering"""
    try:
        offset = (page - 1) * limit
        filters = {}
        
        # Apply filters
        if city:
            filters["city"] = city
        if country:
            filters["country"] = country
        if is_active is not None:
            filters["is_active"] = is_active
        
        # Get total count
        count_result = await db.get_records("customers", filters)
        total = count_result["count"] if count_result["success"] else 0
        
        # Get paginated results
        if search:
            result = await db.search_records("customers", "name", search)
        else:
            result = await db.get_records("customers", filters, limit, offset)
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to fetch customers"
            )
        
        total_pages = (total + limit - 1) // limit
        
        return PaginatedResponse(
            items=result["data"],
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch customers: {str(e)}"
        )

@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get a specific customer by ID"""
    try:
        result = await db.get_records("customers", {"id": customer_id})
        if not result["success"] or not result["data"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found"
            )
        
        return CustomerResponse(**result["data"][0])
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch customer: {str(e)}"
        )

@router.put("/{customer_id}", response_model=BaseResponse)
async def update_customer(
    customer_id: str,
    customer_data: CustomerUpdate,
    current_user = Depends(get_current_active_user)
):
    """Update a customer"""
    try:
        # Check if customer exists
        existing = await db.get_records("customers", {"id": customer_id})
        if not existing["success"] or not existing["data"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found"
            )
        
        update_data = customer_data.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        result = await db.update_record("customers", customer_id, update_data)
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update customer"
            )
        
        return BaseResponse(
            success=True,
            message="Customer updated successfully",
            data=result["data"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Customer update failed: {str(e)}"
        )

@router.delete("/{customer_id}", response_model=BaseResponse)
async def delete_customer(
    customer_id: str,
    current_user = Depends(get_current_active_user)
):
    """Delete a customer"""
    try:
        # Check if customer exists
        existing = await db.get_records("customers", {"id": customer_id})
        if not existing["success"] or not existing["data"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found"
            )
        
        result = await db.delete_record("customers", customer_id)
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete customer"
            )
        
        return BaseResponse(
            success=True,
            message="Customer deleted successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Customer deletion failed: {str(e)}"
        )
