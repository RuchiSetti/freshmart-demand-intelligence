"""
Forecast service - orchestrates ML model forecasting.
"""
from typing import List, Optional
from ..schemas import ForecastPointSchema, ForecastResponseSchema
from ..ml.model_manager import get_model_manager
from ..data_loader import get_data_loader


class ForecastService:
    """Service for generating demand forecasts."""
    
    def __init__(self):
        """Initialize forecast service."""
        self.model_manager = get_model_manager()
        self.data_loader = get_data_loader()
    
    def get_product_forecast(
        self,
        product_id: str,
        store_id: str,
        days_ahead: int = 7,
        model_type: Optional[str] = None
    ) -> ForecastResponseSchema:
        """
        Get forecast for a product-store combination.
        
        Args:
            product_id: Product ID
            store_id: Store ID
            days_ahead: Number of days to forecast
            model_type: Optional model override
            
        Returns:
            ForecastResponseSchema with forecast points and model used
        """
        # Get forecast from model manager
        result = self.model_manager.get_forecast(
            product_id=product_id,
            store_id=store_id,
            horizon=days_ahead,
            model_type=model_type
        )
        
        # Convert to schema objects
        forecast_points = []
        for point in result["forecast"]:
            # Normalize analytics shape to {date, value}
            forecast_points.append(
                ForecastPointSchema(
                    date=point["date"],
                    value=float(point.get("demand", 0.0)),
                    lower_bound=point.get("lower_bound"),
                    upper_bound=point.get("upper_bound"),
                )
            )
        
        return ForecastResponseSchema(
            product_id=product_id,
            store_id=store_id,
            forecast=forecast_points,
            model_used=result['model_used']
        )


# Global singleton instance
_forecast_service_instance = None

def get_forecast_service() -> ForecastService:
    """Get the global ForecastService instance."""
    global _forecast_service_instance
    if _forecast_service_instance is None:
        _forecast_service_instance = ForecastService()
    return _forecast_service_instance


def get_forecast(
    product_id: str,
    store_id: str,
    days_ahead: int = 7,
    model_type: Optional[str] = None,
) -> ForecastResponseSchema:
    """Functional facade used by routers (single import)."""
    return get_forecast_service().get_product_forecast(
        product_id=product_id, store_id=store_id, days_ahead=days_ahead, model_type=model_type
    )