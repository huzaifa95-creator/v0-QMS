from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from ..models.inventory import *
from ..auth.dependencies import get_current_user
from ..database.supabase_client import get_supabase_client
import uuid
from datetime import datetime

router = APIRouter(prefix="/inventory", tags=["inventory"])

@router.get("/", response_model=List[InventoryItemResponse])
async def get_inventory(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    low_stock_only: bool = False,
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        query = supabase.table("inventory").select("*, products(name, sku)")
        
        if search:
            query = query.or_(f"products.name.ilike.%{search}%,products.sku.ilike.%{search}%")
        
        result = query.range(skip, skip + limit - 1).order("last_updated", desc=True).execute()
        
        inventory_items = []
        for item_data in result.data:
            # Determine status
            status = "in_stock"
            if item_data["current_stock"] <= 0:
                status = "out_of_stock"
            elif item_data["current_stock"] <= item_data["minimum_stock"]:
                status = "low_stock"
            
            if low_stock_only and status not in ["low_stock", "out_of_stock"]:
                continue
                
            item = InventoryItemResponse(
                id=item_data["id"],
                product_id=item_data["product_id"],
                product_name=item_data["products"]["name"] if item_data["products"] else None,
                product_sku=item_data["products"]["sku"] if item_data["products"] else None,
                current_stock=item_data["current_stock"],
                minimum_stock=item_data["minimum_stock"],
                maximum_stock=item_data["maximum_stock"],
                reorder_point=item_data["reorder_point"],
                unit_cost=item_data["unit_cost"],
                total_value=item_data["current_stock"] * item_data["unit_cost"],
                last_updated=datetime.fromisoformat(item_data["last_updated"]),
                status=status
            )
            inventory_items.append(item)
        
        return inventory_items
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{inventory_id}", response_model=InventoryItemResponse)
async def update_inventory_item(
    inventory_id: str,
    update_data: InventoryItemUpdate,
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        update_dict = update_data.dict(exclude_unset=True)
        update_dict["last_updated"] = datetime.now().isoformat()
        
        result = supabase.table("inventory").update(update_dict).eq("id", inventory_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Inventory item not found")
        
        # Return updated item
        return await get_inventory_item(inventory_id, current_user, supabase)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/movements", response_model=StockMovementResponse)
async def create_stock_movement(
    movement: StockMovementCreate,
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        # Create stock movement record
        movement_data = {
            "id": str(uuid.uuid4()),
            "product_id": movement.product_id,
            "transaction_type": movement.transaction_type,
            "quantity": movement.quantity,
            "unit_cost": movement.unit_cost,
            "reference_id": movement.reference_id,
            "notes": movement.notes,
            "created_by": current_user["id"],
            "created_at": datetime.now().isoformat()
        }
        
        result = supabase.table("stock_movements").insert(movement_data).execute()
        
        # Update inventory levels
        inventory_result = supabase.table("inventory").select("*").eq("product_id", movement.product_id).execute()
        
        if inventory_result.data:
            current_stock = inventory_result.data[0]["current_stock"]
            
            if movement.transaction_type in [TransactionType.PURCHASE, TransactionType.RETURN]:
                new_stock = current_stock + movement.quantity
            else:  # SALE, ADJUSTMENT, TRANSFER
                new_stock = current_stock - movement.quantity
            
            supabase.table("inventory").update({
                "current_stock": max(0, new_stock),
                "last_updated": datetime.now().isoformat()
            }).eq("product_id", movement.product_id).execute()
        
        return StockMovementResponse(
            id=result.data[0]["id"],
            product_id=movement.product_id,
            transaction_type=movement.transaction_type,
            quantity=movement.quantity,
            unit_cost=movement.unit_cost,
            reference_id=movement.reference_id,
            notes=movement.notes,
            created_at=datetime.fromisoformat(result.data[0]["created_at"]),
            created_by=current_user["id"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/movements", response_model=List[StockMovementResponse])
async def get_stock_movements(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    product_id: Optional[str] = None,
    transaction_type: Optional[TransactionType] = None,
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        query = supabase.table("stock_movements").select("*, products(name)")
        
        if product_id:
            query = query.eq("product_id", product_id)
        if transaction_type:
            query = query.eq("transaction_type", transaction_type)
            
        result = query.range(skip, skip + limit - 1).order("created_at", desc=True).execute()
        
        movements = []
        for movement_data in result.data:
            movement = StockMovementResponse(
                id=movement_data["id"],
                product_id=movement_data["product_id"],
                product_name=movement_data["products"]["name"] if movement_data["products"] else None,
                transaction_type=movement_data["transaction_type"],
                quantity=movement_data["quantity"],
                unit_cost=movement_data["unit_cost"],
                reference_id=movement_data["reference_id"],
                notes=movement_data["notes"],
                created_at=datetime.fromisoformat(movement_data["created_at"]),
                created_by=movement_data["created_by"]
            )
            movements.append(movement)
        
        return movements
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/analytics", response_model=InventoryAnalytics)
async def get_inventory_analytics(
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        # Get inventory summary
        inventory_result = supabase.table("inventory").select("*, products(name)").execute()
        
        total_products = len(inventory_result.data)
        total_value = sum(item["current_stock"] * item["unit_cost"] for item in inventory_result.data)
        low_stock_items = sum(1 for item in inventory_result.data if item["current_stock"] <= item["minimum_stock"] and item["current_stock"] > 0)
        out_of_stock_items = sum(1 for item in inventory_result.data if item["current_stock"] <= 0)
        
        # Get recent movements count
        movements_result = supabase.table("stock_movements").select("id").gte("created_at", (datetime.now() - timedelta(days=30)).isoformat()).execute()
        recent_movements = len(movements_result.data)
        
        # Get top moving products (simplified)
        top_moving_products = [
            {"product_name": "Sample Product 1", "movements": 25},
            {"product_name": "Sample Product 2", "movements": 18},
            {"product_name": "Sample Product 3", "movements": 12}
        ]
        
        return InventoryAnalytics(
            total_products=total_products,
            total_value=total_value,
            low_stock_items=low_stock_items,
            out_of_stock_items=out_of_stock_items,
            recent_movements=recent_movements,
            top_moving_products=top_moving_products
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def get_inventory_item(inventory_id: str, current_user: dict, supabase):
    result = supabase.table("inventory").select("*, products(name, sku)").eq("id", inventory_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    item_data = result.data[0]
    status = "in_stock"
    if item_data["current_stock"] <= 0:
        status = "out_of_stock"
    elif item_data["current_stock"] <= item_data["minimum_stock"]:
        status = "low_stock"
    
    return InventoryItemResponse(
        id=item_data["id"],
        product_id=item_data["product_id"],
        product_name=item_data["products"]["name"] if item_data["products"] else None,
        product_sku=item_data["products"]["sku"] if item_data["products"] else None,
        current_stock=item_data["current_stock"],
        minimum_stock=item_data["minimum_stock"],
        maximum_stock=item_data["maximum_stock"],
        reorder_point=item_data["reorder_point"],
        unit_cost=item_data["unit_cost"],
        total_value=item_data["current_stock"] * item_data["unit_cost"],
        last_updated=datetime.fromisoformat(item_data["last_updated"]),
        status=status
    )
