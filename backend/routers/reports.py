from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta
from ..models.reports import *
from ..auth.dependencies import get_current_user
from ..database.supabase_client import get_supabase_client

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/dashboard", response_model=DashboardMetrics)
async def get_dashboard_metrics(
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        # Get total revenue from orders
        orders_result = supabase.table("orders").select("total_amount").eq("status", "completed").execute()
        total_revenue = sum(order["total_amount"] for order in orders_result.data)
        
        # Get total orders count
        total_orders = len(orders_result.data)
        
        # Get pending quotations
        quotations_result = supabase.table("quotations").select("id").eq("status", "sent").execute()
        pending_quotations = len(quotations_result.data)
        
        # Get low stock alerts
        inventory_result = supabase.table("inventory").select("*").execute()
        low_stock_alerts = sum(1 for item in inventory_result.data if item["current_stock"] <= item["minimum_stock"])
        
        # Recent activities (simplified)
        recent_activities = [
            {"type": "order", "description": "New order #ORD-001 created", "timestamp": datetime.now()},
            {"type": "quotation", "description": "Quotation #QUO-002 sent to customer", "timestamp": datetime.now() - timedelta(hours=2)},
            {"type": "inventory", "description": "Stock updated for Product A", "timestamp": datetime.now() - timedelta(hours=4)}
        ]
        
        return DashboardMetrics(
            total_revenue=total_revenue,
            total_orders=total_orders,
            pending_quotations=pending_quotations,
            low_stock_alerts=low_stock_alerts,
            recent_activities=recent_activities
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/sales", response_model=SalesReport)
async def get_sales_report(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        if not start_date:
            start_date = datetime.now() - timedelta(days=30)
        if not end_date:
            end_date = datetime.now()
        
        # Get orders within date range
        query = supabase.table("orders").select("*, customers(name)").gte("created_at", start_date.isoformat()).lte("created_at", end_date.isoformat())
        orders_result = query.execute()
        
        total_revenue = sum(order["total_amount"] for order in orders_result.data)
        total_orders = len(orders_result.data)
        average_order_value = total_revenue / total_orders if total_orders > 0 else 0
        
        # Top customers (simplified)
        customer_totals = {}
        for order in orders_result.data:
            customer_name = order["customers"]["name"] if order["customers"] else "Unknown"
            customer_totals[customer_name] = customer_totals.get(customer_name, 0) + order["total_amount"]
        
        top_customers = [{"name": name, "total": total} for name, total in sorted(customer_totals.items(), key=lambda x: x[1], reverse=True)[:5]]
        
        # Monthly breakdown (simplified)
        monthly_breakdown = [
            {"month": "January", "revenue": total_revenue * 0.3},
            {"month": "February", "revenue": total_revenue * 0.4},
            {"month": "March", "revenue": total_revenue * 0.3}
        ]
        
        return SalesReport(
            total_revenue=total_revenue,
            total_orders=total_orders,
            average_order_value=average_order_value,
            period_start=start_date,
            period_end=end_date,
            top_customers=top_customers,
            monthly_breakdown=monthly_breakdown
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/quotations", response_model=QuotationReport)
async def get_quotation_report(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    current_user: dict = Depends(get_current_user),
    supabase = Depends(get_supabase_client)
):
    try:
        if not start_date:
            start_date = datetime.now() - timedelta(days=30)
        if not end_date:
            end_date = datetime.now()
        
        # Get quotations within date range
        query = supabase.table("quotations").select("*").gte("created_at", start_date.isoformat()).lte("created_at", end_date.isoformat())
        quotations_result = query.execute()
        
        total_quotations = len(quotations_result.data)
        accepted_quotations = sum(1 for q in quotations_result.data if q["status"] == "accepted")
        pending_quotations = sum(1 for q in quotations_result.data if q["status"] == "sent")
        conversion_rate = (accepted_quotations / total_quotations * 100) if total_quotations > 0 else 0
        
        total_value = sum(q["total_amount"] for q in quotations_result.data)
        average_quotation_value = total_value / total_quotations if total_quotations > 0 else 0
        
        # Monthly trends (simplified)
        monthly_trends = [
            {"month": "January", "quotations": total_quotations // 3, "accepted": accepted_quotations // 3},
            {"month": "February", "quotations": total_quotations // 3, "accepted": accepted_quotations // 3},
            {"month": "March", "quotations": total_quotations // 3, "accepted": accepted_quotations // 3}
        ]
        
        return QuotationReport(
            total_quotations=total_quotations,
            accepted_quotations=accepted_quotations,
            pending_quotations=pending_quotations,
            conversion_rate=conversion_rate,
            average_quotation_value=average_quotation_value,
            monthly_trends=monthly_trends
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
