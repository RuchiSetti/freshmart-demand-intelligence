"""
Dashboard router - provides dashboard KPIs and charts.
Endpoint: GET /dashboard
"""
from fastapi import APIRouter, Query
from typing import Optional
from ..schemas import DashboardResponseSchema
from ..services.dashboard_service import get_dashboard_data

router = APIRouter(tags=["Dashboard"])


@router.get("/dashboard", response_model=DashboardResponseSchema)
def dashboard(
    store_id: Optional[str] = Query(None, description="Filter by store ID"),
    date_range: Optional[int] = Query(30, description="Number of days for historical data")
):
    """
    Get dashboard KPIs and chart data.
    
    Returns:
        - total_sales: Total revenue in date range
        - forecast_next_7_days: Aggregated forecast for next 7 days
        - stockout_risks: Number of products at risk of stockout
        - overstock_risks: Number of products with excess inventory
        - demand_trend: Historical demand trend chart data
    """
    return get_dashboard_data(store_id=store_id, date_range_days=date_range)
