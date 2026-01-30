"""
Inventory service - compares inventory levels with forecasts and detects risks.
"""
from typing import Optional, Dict
from datetime import datetime, timedelta
from ..data_loader import get_data_loader
from ..ml.model_manager import get_model_manager


class InventoryService:
    """Service for inventory analysis and risk detection."""
    
    def __init__(self):
        """Initialize inventory service."""
        self.data_loader = get_data_loader()
        self.model_manager = get_model_manager()
    
    def get_stock_coverage(self, product_id: str, store_id: str) -> Dict:
        """
        Calculate how many days of stock remain based on forecast.
        
        Args:
            product_id: Product ID
            store_id: Store ID
            
        Returns:
            Dict with stock coverage analysis
        """
        # Get current stock
        current_stock = self.data_loader.get_current_stock(product_id, store_id)
        
        # Get forecast for next 7 days
        forecast_result = self.model_manager.get_forecast(
            product_id=product_id,
            store_id=store_id,
            horizon=7
        )
        
        forecast_points = forecast_result['forecast']
        
        if not forecast_points:
            return {
                'current_stock': current_stock,
                'days_of_stock': 999,  # Unknown
                'avg_daily_demand': 0
            }
        
        # Calculate average daily forecasted demand
        avg_daily_demand = sum(point['demand'] for point in forecast_points) / len(forecast_points)
        
        # Calculate days of stock remaining
        if avg_daily_demand > 0:
            days_of_stock = current_stock / avg_daily_demand
        else:
            days_of_stock = 999  # Effectively unlimited if no demand
        
        return {
            'current_stock': current_stock,
            'days_of_stock': round(days_of_stock, 1),
            'avg_daily_demand': round(avg_daily_demand, 2)
        }
    
    def compare_forecast_vs_inventory(
        self, 
        product_id: str, 
        store_id: str,
        days_ahead: int = 7
    ) -> Dict:
        """
        Compare forecasted demand with current inventory.
        
        Args:
            product_id: Product ID
            store_id: Store ID
            days_ahead: Number of days to analyze
            
        Returns:
            Dict with comparison analysis
        """
        # Get current stock
        current_stock = self.data_loader.get_current_stock(product_id, store_id)
        
        # Get forecast
        forecast_result = self.model_manager.get_forecast(
            product_id=product_id,
            store_id=store_id,
            horizon=days_ahead
        )
        
        forecast_points = forecast_result['forecast']
        
        # Calculate total forecasted demand
        total_forecasted_demand = sum(point['demand'] for point in forecast_points)
        
        # Calculate gap
        gap = current_stock - total_forecasted_demand
        
        return {
            'current_stock': current_stock,
            'total_forecasted_demand': round(total_forecasted_demand, 2),
            'gap': round(gap, 2),
            'gap_percentage': round((gap / current_stock * 100) if current_stock > 0 else 0, 2)
        }
    
    def get_expiry_risk(self, product_id: str, store_id: str) -> Optional[Dict]:
        """
        Check if product may expire before being sold.
        
        Args:
            product_id: Product ID
            store_id: Store ID
            
        Returns:
            Dict with expiry risk info, or None if no risk
        """
        # Get product details
        product = self.data_loader.get_product(product_id)
        if not product:
            return None
        
        shelf_life_days = product.get('shelf_life_days', 365)
        
        # Get stock coverage
        coverage = self.get_stock_coverage(product_id, store_id)
        days_of_stock = coverage['days_of_stock']
        
        # Check if stock will last longer than shelf life
        if days_of_stock > shelf_life_days:
            return {
                'has_risk': True,
                'days_of_stock': days_of_stock,
                'shelf_life_days': shelf_life_days,
                'excess_days': round(days_of_stock - shelf_life_days, 1)
            }
        
        return {
            'has_risk': False,
            'days_of_stock': days_of_stock,
            'shelf_life_days': shelf_life_days
        }


# Global singleton instance
_inventory_service_instance = None

def get_inventory_service() -> InventoryService:
    """Get the global InventoryService instance."""
    global _inventory_service_instance
    if _inventory_service_instance is None:
        _inventory_service_instance = InventoryService()
    return _inventory_service_instance
