from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from models.master_data import (
    ProductCreate, ProductUpdate, ProductResponse, ProductFilter
)
from models.base import BaseResponse, PaginatedResponse, PaginationParams
from auth.dependencies import get_current_active_user
from database.supabase_client import db
from datetime import datetime
import uuid

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=BaseResponse)
async def create_product(
    product_data: ProductCreate,
    current_user = Depends(get_current_active_user)
):
    """Create a new product"""
    try:
        product_dict = product_data.dict()
        product_dict.update({
            "id": str(uuid.uuid4()),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        })
        
        result = await db.create_record("products", product_dict)
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create product"
            )
        
        return BaseResponse(
            success=True,
            message="Product created successfully",
            data=result["data"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Product creation failed: {str(e)}"
        )

@router.get("/", response_model=PaginatedResponse)
async def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    sku: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    current_user = Depends(get_current_active_user)
):
    """Get products with pagination and filtering"""
    try:
        offset = (page - 1) * limit
        filters = {}
        
        # Apply filters
        if category:
            filters["category"] = category
        if sku:
            filters["sku"] = sku
        if is_active is not None:
            filters["is_active"] = is_active
        
        # Get total count
        count_result = await db.get_records("products", filters)
        total = count_result["count"] if count_result["success"] else 0
        
        # Get paginated results
        if search:
            result = await db.search_records("products", "name", search)
        else:
            result = await db.get_records("products", filters, limit, offset)
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to fetch products"
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
            detail=f"Failed to fetch products: {str(e)}"
        )

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get a specific product by ID"""
    try:
        result = await db.get_records("products", {"id": product_id})
        if not result["success"] or not result["data"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        return ProductResponse(**result["data"][0])
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch product: {str(e)}"
        )

@router.put("/{product_id}", response_model=BaseResponse)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    current_user = Depends(get_current_active_user)
):
    """Update a product"""
    try:
        # Check if product exists
        existing = await db.get_records("products", {"id": product_id})
        if not existing["success"] or not existing["data"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        update_data = product_data.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        result = await db.update_record("products", product_id, update_data)
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update product"
            )
        
        return BaseResponse(
            success=True,
            message="Product updated successfully",
            data=result["data"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Product update failed: {str(e)}"
        )

@router.delete("/{product_id}", response_model=BaseResponse)
async def delete_product(
    product_id: str,
    current_user = Depends(get_current_active_user)
):
    """Delete a product"""
    try:
        # Check if product exists
        existing = await db.get_records("products", {"id": product_id})
        if not existing["success"] or not existing["data"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        result = await db.delete_record("products", product_id)
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete product"
            )
        
        return BaseResponse(
            success=True,
            message="Product deleted successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Product deletion failed: {str(e)}"
        )
