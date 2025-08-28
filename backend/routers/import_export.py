from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from typing import List, Optional
from ..models.import_export import *
from ..auth.dependencies import get_current_user
from ..database.supabase_client import get_supabase_client
import uuid
from datetime import datetime

router = APIRouter(prefix="/import-export", tags=["import-export"])

@router.post("/shipments", response_model=ShipmentResponse)
async def create_shipment(
    shipment: ShipmentCreate,
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        shipment_data = {
            "id": str(uuid.uuid4()),
            "shipment_number": shipment.shipment_number,
            "shipment_type": shipment.shipment_type,
            "status": ShipmentStatus.PENDING,
            "origin_country": shipment.origin_country,
            "destination_country": shipment.destination_country,
            "carrier": shipment.carrier,
            "tracking_number": shipment.tracking_number,
            "estimated_delivery": shipment.estimated_delivery.isoformat() if shipment.estimated_delivery else None,
            "total_value": shipment.total_value,
            "currency": shipment.currency,
            "notes": shipment.notes,
            "created_by": current_user["id"],
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        result = supabase.table("shipments").insert(shipment_data).execute()
        
        return ShipmentResponse(
            id=result.data[0]["id"],
            shipment_number=result.data[0]["shipment_number"],
            shipment_type=result.data[0]["shipment_type"],
            status=result.data[0]["status"],
            origin_country=result.data[0]["origin_country"],
            destination_country=result.data[0]["destination_country"],
            carrier=result.data[0]["carrier"],
            tracking_number=result.data[0]["tracking_number"],
            estimated_delivery=datetime.fromisoformat(result.data[0]["estimated_delivery"]) if result.data[0]["estimated_delivery"] else None,
            actual_delivery=datetime.fromisoformat(result.data[0]["actual_delivery"]) if result.data[0]["actual_delivery"] else None,
            total_value=result.data[0]["total_value"],
            currency=result.data[0]["currency"],
            notes=result.data[0]["notes"],
            created_at=datetime.fromisoformat(result.data[0]["created_at"]),
            updated_at=datetime.fromisoformat(result.data[0]["updated_at"]),
            created_by=result.data[0]["created_by"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/shipments", response_model=List[ShipmentResponse])
async def get_shipments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    shipment_type: Optional[ShipmentType] = None,
    status: Optional[ShipmentStatus] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        query = supabase.table("shipments").select("*")
        
        if shipment_type:
            query = query.eq("shipment_type", shipment_type)
        if status:
            query = query.eq("status", status)
        if search:
            query = query.or_(f"shipment_number.ilike.%{search}%,carrier.ilike.%{search}%")
            
        result = query.range(skip, skip + limit - 1).order("created_at", desc=True).execute()
        
        shipments = []
        for shipment_data in result.data:
            shipment = ShipmentResponse(
                id=shipment_data["id"],
                shipment_number=shipment_data["shipment_number"],
                shipment_type=shipment_data["shipment_type"],
                status=shipment_data["status"],
                origin_country=shipment_data["origin_country"],
                destination_country=shipment_data["destination_country"],
                carrier=shipment_data["carrier"],
                tracking_number=shipment_data["tracking_number"],
                estimated_delivery=datetime.fromisoformat(shipment_data["estimated_delivery"]) if shipment_data["estimated_delivery"] else None,
                actual_delivery=datetime.fromisoformat(shipment_data["actual_delivery"]) if shipment_data["actual_delivery"] else None,
                total_value=shipment_data["total_value"],
                currency=shipment_data["currency"],
                notes=shipment_data["notes"],
                created_at=datetime.fromisoformat(shipment_data["created_at"]),
                updated_at=datetime.fromisoformat(shipment_data["updated_at"]),
                created_by=shipment_data["created_by"]
            )
            shipments.append(shipment)
        
        return shipments
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/shipments/{shipment_id}", response_model=ShipmentResponse)
async def update_shipment(
    shipment_id: str,
    update_data: ShipmentUpdate,
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        update_dict = update_data.dict(exclude_unset=True)
        update_dict["updated_at"] = datetime.now().isoformat()
        
        if "estimated_delivery" in update_dict and update_dict["estimated_delivery"]:
            update_dict["estimated_delivery"] = update_dict["estimated_delivery"].isoformat()
        if "actual_delivery" in update_dict and update_dict["actual_delivery"]:
            update_dict["actual_delivery"] = update_dict["actual_delivery"].isoformat()
        
        result = supabase.table("shipments").update(update_dict).eq("id", shipment_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Shipment not found")
        
        return await get_shipment(shipment_id, current_user, supabase)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/export-data")
async def export_shipments_data(
    format: str = Query("csv", regex="^(csv|excel)$"),
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        # Get all shipments
        result = supabase.table("shipments").select("*").execute()
        
        if format == "csv":
            import csv
            import io
            
            output = io.StringIO()
            writer = csv.DictWriter(output, fieldnames=["shipment_number", "shipment_type", "status", "origin_country", "destination_country", "carrier", "total_value", "created_at"])
            writer.writeheader()
            
            for shipment in result.data:
                writer.writerow({
                    "shipment_number": shipment["shipment_number"],
                    "shipment_type": shipment["shipment_type"],
                    "status": shipment["status"],
                    "origin_country": shipment["origin_country"],
                    "destination_country": shipment["destination_country"],
                    "carrier": shipment["carrier"],
                    "total_value": shipment["total_value"],
                    "created_at": shipment["created_at"]
                })
            
            from fastapi.responses import StreamingResponse
            output.seek(0)
            return StreamingResponse(
                io.BytesIO(output.getvalue().encode()),
                media_type="text/csv",
                headers={"Content-Disposition": "attachment; filename=shipments.csv"}
            )
        
        return {"message": "Export format not supported"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def get_shipment(shipment_id: str, current_user: dict, supabase):
    result = supabase.table("shipments").select("*").eq("id", shipment_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    shipment_data = result.data[0]
    return ShipmentResponse(
        id=shipment_data["id"],
        shipment_number=shipment_data["shipment_number"],
        shipment_type=shipment_data["shipment_type"],
        status=shipment_data["status"],
        origin_country=shipment_data["origin_country"],
        destination_country=shipment_data["destination_country"],
        carrier=shipment_data["carrier"],
        tracking_number=shipment_data["tracking_number"],
        estimated_delivery=datetime.fromisoformat(shipment_data["estimated_delivery"]) if shipment_data["estimated_delivery"] else None,
        actual_delivery=datetime.fromisoformat(shipment_data["actual_delivery"]) if shipment_data["actual_delivery"] else None,
        total_value=shipment_data["total_value"],
        currency=shipment_data["currency"],
        notes=shipment_data["notes"],
        created_at=datetime.fromisoformat(shipment_data["created_at"]),
        updated_at=datetime.fromisoformat(shipment_data["updated_at"]),
        created_by=shipment_data["created_by"]
    )
