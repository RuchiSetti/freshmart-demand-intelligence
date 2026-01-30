"""
Forecast router - provides demand forecasts for products.
Endpoint: GET /forecast
"""
from fastapi import APIRouter, Query
from typing import Optional
from ..schemas import ForecastResponseSchema
from ..services.forecast_service import get_forecast

router = APIRouter(tags=["Forecasting"])


@router.get("/forecast", response_model=ForecastResponseSchema)
def forecast(
    product_id: str = Query(..., description="Product ID (required)"),
    store_id: str = Query(..., description="Store ID (required)"),
    days: int = Query(7, description="Number of days to forecast", ge=1, le=30),
    model: Optional[str] = Query(None, description="Model type: baseline, prophet, or xgboost")
):
    """
    Get demand forecast for a product at a specific store.
    
    Path Parameters:
        - product_id: Product ID
        
    Query Parameters:
        - store_id: Store ID (required)
        - days: Number of days to forecast (1-30, default: 7)
        - model: Optional model override (baseline, prophet, xgboost)
        
    Returns:
        Forecast with dates, demand predictions, and model used
    """
    return get_forecast(product_id=product_id, store_id=store_id, days_ahead=days, model_type=model)
