from fastapi import APIRouter, HTTPException, status, Depends, Query
from fastapi.responses import Response
from typing import List, Optional
from models.quotations import (
    QuotationCreate, QuotationUpdate, QuotationResponse, 
    QuotationStatusUpdate, QuotationFilter, QuotationPDFRequest
)
from models.base import BaseResponse, PaginatedResponse
from auth.dependencies import get_current_active_user
from database.supabase_client import db
from services.pdf_generator import pdf_generator
from datetime import datetime, date
import uuid
from decimal import Decimal

router = APIRouter(prefix="/quotations", tags=["Quotations"])

def generate_quotation_number() -> str:
    """Generate a unique quotation number"""
    timestamp = datetime.now().strftime("%Y%m%d")
    random_suffix = str(uuid.uuid4())[:8].upper()
    return f"QUO-{timestamp}-{random_suffix}"

def calculate_quotation_totals(items: List[dict]) -> dict:
    """Calculate quotation totals from items"""
    subtotal = Decimal('0')
    total_discount = Decimal('0')
    total_tax = Decimal('0')
    
    for item in items:
        quantity = Decimal(str(item['quantity']))
        unit_price = Decimal(str(item['unit_price']))
        discount_percent = Decimal(str(item.get('discount_percent', 0)))
        tax_rate = Decimal(str(item.get('tax_rate', 0)))
        
        line_subtotal = quantity * unit_price
        line_discount = line_subtotal * (discount_percent / 100)
        line_after_discount = line_subtotal - line_discount
        line_tax = line_after_discount * (tax_rate / 100)
        line_total = line_after_discount + line_tax
        
        subtotal += line_subtotal
        total_discount += line_discount
        total_tax += line_tax
        
        # Update item with calculated line total
        item['line_total'] = float(line_total)
    
    total_amount = subtotal - total_discount + total_tax
    
    return {
        'subtotal': float(subtotal),
        'discount_amount': float(total_discount),
        'tax_amount': float(total_tax),
        'total_amount': float(total_amount)
    }

@router.post("/", response_model=BaseResponse)
async def create_quotation(
    quotation_data: QuotationCreate,
    current_user = Depends(get_current_active_user)
):
    """Create a new quotation"""
    try:
        # Calculate totals
        items_list = [item.dict() for item in quotation_data.items]
        totals = calculate_quotation_totals(items_list)
        
        # Create quotation
        quotation_dict = quotation_data.dict(exclude={'items'})
        quotation_dict.update({
            "id": str(uuid.uuid4()),
            "quotation_number": generate_quotation_number(),
            "status": "draft",
            "created_by": current_user.id,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            **totals
        })
        
        # Create quotation record
        quotation_result = await db.create_record("quotations", quotation_dict)
        if not quotation_result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create quotation"
            )
        
        quotation_id = quotation_dict["id"]
        
        # Create quotation items
        for item_data in items_list:
            item_dict = {
                "id": str(uuid.uuid4()),
                "quotation_id": quotation_id,
                "created_at": datetime.utcnow().isoformat(),
                **item_data
            }
            
            item_result = await db.create_record("quotation_items", item_dict)
            if not item_result["success"]:
                # Rollback quotation if item creation fails
                await db.delete_record("quotations", quotation_id)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create quotation items"
                )
        
        return BaseResponse(
            success=True,
            message="Quotation created successfully",
            data={"quotation_id": quotation_id, "quotation_number": quotation_dict["quotation_number"]}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Quotation creation failed: {str(e)}"
        )

@router.get("/", response_model=PaginatedResponse)
async def get_quotations(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    customer_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    current_user = Depends(get_current_active_user)
):
    """Get quotations with pagination and filtering"""
    try:
        offset = (page - 1) * limit
        filters = {}
        
        # Apply filters
        if customer_id:
            filters["customer_id"] = customer_id
        if status:
            filters["status"] = status
        
        # Get total count
        count_result = await db.get_records("quotations", filters)
        total = count_result["count"] if count_result["success"] else 0
        
        # Get paginated results
        if search:
            result = await db.search_records("quotations", "quotation_number", search)
        else:
            result = await db.get_records("quotations", filters, limit, offset)
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to fetch quotations"
            )
        
        # Enrich with customer data
        enriched_quotations = []
        for quotation in result["data"]:
            # Get customer details
            customer_result = await db.get_records("customers", {"id": quotation["customer_id"]})
            if customer_result["success"] and customer_result["data"]:
                customer = customer_result["data"][0]
                quotation["customer_name"] = customer["name"]
                quotation["customer_email"] = customer["email"]
            
            enriched_quotations.append(quotation)
        
        total_pages = (total + limit - 1) // limit
        
        return PaginatedResponse(
            items=enriched_quotations,
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
            detail=f"Failed to fetch quotations: {str(e)}"
        )

@router.get("/{quotation_id}", response_model=QuotationResponse)
async def get_quotation(
    quotation_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get a specific quotation by ID"""
    try:
        # Get quotation
        result = await db.get_records("quotations", {"id": quotation_id})
        if not result["success"] or not result["data"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Quotation not found"
            )
        
        quotation = result["data"][0]
        
        # Get customer details
        customer_result = await db.get_records("customers", {"id": quotation["customer_id"]})
        if customer_result["success"] and customer_result["data"]:
            customer = customer_result["data"][0]
            quotation["customer_name"] = customer["name"]
            quotation["customer_email"] = customer["email"]
        
        # Get quotation items
        items_result = await db.get_records("quotation_items", {"quotation_id": quotation_id})
        if items_result["success"]:
            items = []
            for item in items_result["data"]:
                # Get product details
                product_result = await db.get_records("products", {"id": item["product_id"]})
                if product_result["success"] and product_result["data"]:
                    product = product_result["data"][0]
                    item["product_name"] = product["name"]
                    item["product_sku"] = product["sku"]
                    item["product_unit"] = product["unit"]
                items.append(item)
            quotation["items"] = items
        else:
            quotation["items"] = []
        
        return QuotationResponse(**quotation)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch quotation: {str(e)}"
        )

@router.put("/{quotation_id}", response_model=BaseResponse)
async def update_quotation(
    quotation_id: str,
    quotation_data: QuotationUpdate,
    current_user = Depends(get_current_active_user)
):
    """Update a quotation"""
    try:
        # Check if quotation exists
        existing = await db.get_records("quotations", {"id": quotation_id})
        if not existing["success"] or not existing["data"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Quotation not found"
            )
        
        update_data = quotation_data.dict(exclude_unset=True, exclude={'items'})
        
        # If items are being updated, recalculate totals
        if quotation_data.items is not None:
            items_list = [item.dict() for item in quotation_data.items]
            totals = calculate_quotation_totals(items_list)
            update_data.update(totals)
            
            # Delete existing items
            await db.delete_record("quotation_items", quotation_id)  # This would need a custom method
            
            # Create new items
            for item_data in items_list:
                item_dict = {
                    "id": str(uuid.uuid4()),
                    "quotation_id": quotation_id,
                    "created_at": datetime.utcnow().isoformat(),
                    **item_data
                }
                await db.create_record("quotation_items", item_dict)
        
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        result = await db.update_record("quotations", quotation_id, update_data)
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update quotation"
            )
        
        return BaseResponse(
            success=True,
            message="Quotation updated successfully",
            data=result["data"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Quotation update failed: {str(e)}"
        )

@router.patch("/{quotation_id}/status", response_model=BaseResponse)
async def update_quotation_status(
    quotation_id: str,
    status_data: QuotationStatusUpdate,
    current_user = Depends(get_current_active_user)
):
    """Update quotation status"""
    try:
        # Check if quotation exists
        existing = await db.get_records("quotations", {"id": quotation_id})
        if not existing["success"] or not existing["data"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Quotation not found"
            )
        
        update_data = {
            "status": status_data.status,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        if status_data.notes:
            update_data["notes"] = status_data.notes
        
        result = await db.update_record("quotations", quotation_id, update_data)
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update quotation status"
            )
        
        return BaseResponse(
            success=True,
            message=f"Quotation status updated to {status_data.status}",
            data=result["data"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Status update failed: {str(e)}"
        )

@router.get("/{quotation_id}/pdf")
async def generate_quotation_pdf(
    quotation_id: str,
    current_user = Depends(get_current_active_user)
):
    """Generate PDF for quotation"""
    try:
        # Get quotation with full details
        quotation_result = await db.get_records("quotations", {"id": quotation_id})
        if not quotation_result["success"] or not quotation_result["data"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Quotation not found"
            )
        
        quotation = quotation_result["data"][0]
        
        # Get customer details
        customer_result = await db.get_records("customers", {"id": quotation["customer_id"]})
        if customer_result["success"] and customer_result["data"]:
            customer = customer_result["data"][0]
            quotation.update({
                "customer_name": customer["name"],
                "customer_email": customer["email"],
                "customer_address": customer.get("address", "")
            })
        
        # Get items with product details
        items_result = await db.get_records("quotation_items", {"quotation_id": quotation_id})
        items = []
        if items_result["success"]:
            for item in items_result["data"]:
                product_result = await db.get_records("products", {"id": item["product_id"]})
                if product_result["success"] and product_result["data"]:
                    product = product_result["data"][0]
                    item["product_name"] = product["name"]
                    item["product_sku"] = product["sku"]
                items.append(item)
        
        quotation["items"] = items
        
        # Generate PDF
        pdf_bytes = pdf_generator.generate_quotation_pdf(quotation)
        
        # Return PDF as response
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=quotation_{quotation['quotation_number']}.pdf"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF generation failed: {str(e)}"
        )

@router.delete("/{quotation_id}", response_model=BaseResponse)
async def delete_quotation(
    quotation_id: str,
    current_user = Depends(get_current_active_user)
):
    """Delete a quotation"""
    try:
        # Check if quotation exists
        existing = await db.get_records("quotations", {"id": quotation_id})
        if not existing["success"] or not existing["data"]:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Quotation not found"
            )
        
        # Delete quotation items first (due to foreign key constraint)
        # Note: This would need a custom method in the database client
        # For now, we'll assume cascade delete is set up in the database
        
        result = await db.delete_record("quotations", quotation_id)
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete quotation"
            )
        
        return BaseResponse(
            success=True,
            message="Quotation deleted successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Quotation deletion failed: {str(e)}"
        )
