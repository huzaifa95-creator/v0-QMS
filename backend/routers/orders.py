from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from ..models.orders import *
from ..auth.dependencies import get_current_user
from ..database.supabase_client import get_supabase_client
import uuid
from datetime import datetime

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=OrderResponse)
async def create_order(
    order: OrderCreate,
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        # Generate order number
        order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        # Calculate total amount
        total_amount = sum(
            item.quantity * item.unit_price * (1 - item.discount_percentage / 100)
            for item in order.items
        )
        
        # Create order
        order_data = {
            "id": str(uuid.uuid4()),
            "order_number": order_number,
            "customer_id": order.customer_id,
            "quotation_id": order.quotation_id,
            "status": OrderStatus.DRAFT,
            "total_amount": total_amount,
            "notes": order.notes,
            "delivery_date": order.delivery_date.isoformat() if order.delivery_date else None,
            "created_by": current_user["id"],
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        result = supabase.table("orders").insert(order_data).execute()
        order_id = result.data[0]["id"]
        
        # Create order items
        for item in order.items:
            item_data = {
                "id": str(uuid.uuid4()),
                "order_id": order_id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "discount_percentage": item.discount_percentage,
                "total_amount": item.quantity * item.unit_price * (1 - item.discount_percentage / 100),
                "created_at": datetime.now().isoformat()
            }
            supabase.table("order_items").insert(item_data).execute()
        
        # Fetch complete order with items
        return await get_order(order_id, current_user, supabase)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[OrderResponse])
async def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[OrderStatus] = None,
    customer_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        query = supabase.table("orders").select("*, customers(name), order_items(*, products(name))")
        
        if status:
            query = query.eq("status", status)
        if customer_id:
            query = query.eq("customer_id", customer_id)
            
        result = query.range(skip, skip + limit - 1).order("created_at", desc=True).execute()
        
        orders = []
        for order_data in result.data:
            order = OrderResponse(
                id=order_data["id"],
                order_number=order_data["order_number"],
                customer_id=order_data["customer_id"],
                customer_name=order_data["customers"]["name"] if order_data["customers"] else None,
                quotation_id=order_data["quotation_id"],
                status=order_data["status"],
                total_amount=order_data["total_amount"],
                notes=order_data["notes"],
                delivery_date=datetime.fromisoformat(order_data["delivery_date"]) if order_data["delivery_date"] else None,
                created_at=datetime.fromisoformat(order_data["created_at"]),
                updated_at=datetime.fromisoformat(order_data["updated_at"]),
                items=[
                    OrderItemResponse(
                        id=item["id"],
                        order_id=item["order_id"],
                        product_id=item["product_id"],
                        product_name=item["products"]["name"] if item["products"] else None,
                        quantity=item["quantity"],
                        unit_price=item["unit_price"],
                        discount_percentage=item["discount_percentage"],
                        total_amount=item["total_amount"],
                        created_at=datetime.fromisoformat(item["created_at"])
                    ) for item in order_data["order_items"]
                ]
            )
            orders.append(order)
        
        return orders
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        result = supabase.table("orders").select("*, customers(name), order_items(*, products(name))").eq("id", order_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order_data = result.data[0]
        return OrderResponse(
            id=order_data["id"],
            order_number=order_data["order_number"],
            customer_id=order_data["customer_id"],
            customer_name=order_data["customers"]["name"] if order_data["customers"] else None,
            quotation_id=order_data["quotation_id"],
            status=order_data["status"],
            total_amount=order_data["total_amount"],
            notes=order_data["notes"],
            delivery_date=datetime.fromisoformat(order_data["delivery_date"]) if order_data["delivery_date"] else None,
            created_at=datetime.fromisoformat(order_data["created_at"]),
            updated_at=datetime.fromisoformat(order_data["updated_at"]),
            items=[
                OrderItemResponse(
                    id=item["id"],
                    order_id=item["order_id"],
                    product_id=item["product_id"],
                    product_name=item["products"]["name"] if item["products"] else None,
                    quantity=item["quantity"],
                    unit_price=item["unit_price"],
                    discount_percentage=item["discount_percentage"],
                    total_amount=item["total_amount"],
                    created_at=datetime.fromisoformat(item["created_at"])
                ) for item in order_data["order_items"]
            ]
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Purchase Orders endpoints
@router.post("/purchase-orders", response_model=PurchaseOrderResponse)
async def create_purchase_order(
    po: PurchaseOrderCreate,
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        po_number = f"PO-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        total_amount = sum(
            item.quantity * item.unit_price * (1 - item.discount_percentage / 100)
            for item in po.items
        )
        
        po_data = {
            "id": str(uuid.uuid4()),
            "po_number": po_number,
            "vendor_id": po.vendor_id,
            "status": PurchaseOrderStatus.DRAFT,
            "total_amount": total_amount,
            "notes": po.notes,
            "expected_delivery_date": po.expected_delivery_date.isoformat() if po.expected_delivery_date else None,
            "created_by": current_user["id"],
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        result = supabase.table("purchase_orders").insert(po_data).execute()
        po_id = result.data[0]["id"]
        
        # Create PO items
        for item in po.items:
            item_data = {
                "id": str(uuid.uuid4()),
                "purchase_order_id": po_id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "discount_percentage": item.discount_percentage,
                "total_amount": item.quantity * item.unit_price * (1 - item.discount_percentage / 100),
                "created_at": datetime.now().isoformat()
            }
            supabase.table("purchase_order_items").insert(item_data).execute()
        
        return await get_purchase_order(po_id, current_user, supabase)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/purchase-orders", response_model=List[PurchaseOrderResponse])
async def get_purchase_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[PurchaseOrderStatus] = None,
    vendor_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        query = supabase.table("purchase_orders").select("*, vendors(name), purchase_order_items(*, products(name))")
        
        if status:
            query = query.eq("status", status)
        if vendor_id:
            query = query.eq("vendor_id", vendor_id)
            
        result = query.range(skip, skip + limit - 1).order("created_at", desc=True).execute()
        
        pos = []
        for po_data in result.data:
            po = PurchaseOrderResponse(
                id=po_data["id"],
                po_number=po_data["po_number"],
                vendor_id=po_data["vendor_id"],
                vendor_name=po_data["vendors"]["name"] if po_data["vendors"] else None,
                status=po_data["status"],
                total_amount=po_data["total_amount"],
                notes=po_data["notes"],
                expected_delivery_date=datetime.fromisoformat(po_data["expected_delivery_date"]) if po_data["expected_delivery_date"] else None,
                created_at=datetime.fromisoformat(po_data["created_at"]),
                updated_at=datetime.fromisoformat(po_data["updated_at"]),
                items=[
                    OrderItemResponse(
                        id=item["id"],
                        order_id=item["purchase_order_id"],
                        product_id=item["product_id"],
                        product_name=item["products"]["name"] if item["products"] else None,
                        quantity=item["quantity"],
                        unit_price=item["unit_price"],
                        discount_percentage=item["discount_percentage"],
                        total_amount=item["total_amount"],
                        created_at=datetime.fromisoformat(item["created_at"])
                    ) for item in po_data["purchase_order_items"]
                ]
            )
            pos.append(po)
        
        return pos
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/purchase-orders/{po_id}", response_model=PurchaseOrderResponse)
async def get_purchase_order(
    po_id: str,
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    # Similar implementation to get_order but for purchase orders
    pass

# Delivery Challan endpoints
@router.post("/delivery-challans", response_model=DeliveryChallanResponse)
async def create_delivery_challan(
    challan: DeliveryChallanCreate,
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    # Implementation for creating delivery challans
    pass

@router.get("/delivery-challans", response_model=List[DeliveryChallanResponse])
async def get_delivery_challans(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    # Implementation for getting delivery challans
    pass
