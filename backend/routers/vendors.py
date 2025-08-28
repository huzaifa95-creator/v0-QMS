from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from models.master_data import (
    VendorCreate, VendorUpdate, VendorResponse, VendorFilter
)
from models.base import BaseResponse, PaginatedResponse, PaginationParams
from auth.dependencies import get_current_active_user
from database.supabase_client import db
from datetime import datetime
import uuid

router = APIRouter(prefix="/vendors", tags=["Vendors"])

@router.post("/", response_model=BaseResponse)
async def create_vendor(
    vendor_data: VendorCreate,
    current_user = Depends(get_current_active_user)
):
    """Create a new vendor"""
    try:
        vendor_dict = vendor_data.dict()
        vendor_dict.update({
            "id": str(uuid.uuid4()),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        })
        
        result = await db.create_record("vendors", vendor_dict)
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create vendor"
            )
        
        return BaseResponse(
            success=True,
            message="Vendor created successfully",
            data=result["data"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Vendor creation failed: {str(e)}"
        )

@router.get("/", response_model=PaginatedResponse)
async def get_vendors(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    current_user = Depends(get_current_active_user)
):
    """Get vendors with pagination and filtering"""
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
        count_result = await db.get_records("vendors", filters)
        total = count_result["count"] if count_result["success"] else 0
        
        # Get paginated results
        if search:
            result = await db.search_records("vendors", "name", search)
        else:
            result = await db.get_records("vendors", filters, limit, offset)
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to fetch vendors"
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
            detail=f"Failed to fetch vendors: {str(e)}"
        )

@router.get("/{vendor_id}", response_model=VendorResponse)
async def get_vendor(
    vendor_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get a specific vendor by ID"""
    try:
        result = await db.get_records("vendors", {"id": vendor_id})
        if not result["success"] or not result["data"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vendor not found"
            )
        
        return VendorResponse(**result["data"][0])
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch vendor: {str(e)}"
        )

@router.put("/{vendor_id}", response_model=BaseResponse)
async def update_vendor(
    vendor_id: str,
    vendor_data: VendorUpdate,
    current_user = Depends(get_current_active_user)
):
    """Update a vendor"""
    try:
        # Check if vendor exists
        existing = await db.get_records("vendors", {"id": vendor_id})
        if not existing["success"] or not existing["data"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vendor not found"
            )
        
        update_data = vendor_data.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        result = await db.update_record("vendors", vendor_id, update_data)
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update vendor"
            )
        
        return BaseResponse(
            success=True,
            message="Vendor updated successfully",
            data=result["data"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Vendor update failed: {str(e)}"
        )

@router.delete("/{vendor_id}", response_model=BaseResponse)
async def delete_vendor(
    vendor_id: str,
    current_user = Depends(get_current_active_user)
):
    """Delete a vendor"""
    try:
        # Check if vendor exists
        existing = await db.get_records("vendors", {"id": vendor_id})
        if not existing["success"] or not existing["data"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vendor not found"
            )
        
        result = await db.delete_record("vendors", vendor_id)
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete vendor"
            )
        
        return BaseResponse(
            success=True,
            message="Vendor deleted successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Vendor deletion failed: {str(e)}"
        )
