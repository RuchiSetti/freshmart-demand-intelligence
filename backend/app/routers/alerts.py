"""
Alerts router - provides inventory risk alerts.
Endpoint: GET /alerts
"""
from fastapi import APIRouter, Query
from typing import List, Optional
from ..schemas import AlertSchema
from ..services.alert_service import get_alerts

router = APIRouter(tags=["Alerts"])


@router.get("/alerts", response_model=List[AlertSchema])
def alerts(
    store_id: Optional[str] = Query(None, description="Filter by store ID"),
    severity: Optional[str] = Query(None, description="Filter by severity (HIGH, MEDIUM, LOW)")
):
    """
    Get inventory risk alerts.
    
    Query Parameters:
        - store_id: Optional filter by store
        - severity: Optional filter by severity level
        
    Returns:
        List of alerts sorted by severity (HIGH first)
        
    Alert Types:
        - STOCKOUT_RISK: Product may run out of stock soon
        - OVERSTOCK_RISK: Product has excess inventory
        - EXPIRY_RISK: Product may expire before being sold
    """
    return get_alerts(store_id=store_id, severity=severity)
