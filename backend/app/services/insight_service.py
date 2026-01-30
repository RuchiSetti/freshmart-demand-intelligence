"""
Insight service - generates GenAI-powered insights for products.
"""
from typing import Optional
import pandas as pd
from ..schemas import InsightSchema
from ..data_loader import get_data_loader
from ..genai.explanation_service import get_explanation_service
from .alert_service import get_alert_service


class InsightService:
    """Service for generating product insights using GenAI."""
    
    def __init__(self):
        """Initialize insight service."""
        self.data_loader = get_data_loader()
        self.explanation_service = get_explanation_service()
        self.alert_service = get_alert_service()
    
    def get_product_insight(
        self,
        product_id: str,
        store_id: Optional[str] = None
    ) -> InsightSchema:
        """
        Generate insight for a product.
        
        Args:
            product_id: Product ID
            store_id: Optional store ID for context
            
        Returns:
            InsightSchema with GenAI-generated insight
        """
        # Get product details
        product = self.data_loader.get_product(product_id)
        if not product:
            return InsightSchema(
                product_id=product_id,
                store_id=store_id,
                insight="Product not found."
            )
        
        product_name = product['name']
        category = product['category']
        
        # Get recent sales trend
        recent_trend = self._analyze_recent_trend(product_id, store_id)
        
        # Check for upcoming festivals
        upcoming_festivals = self.data_loader.get_upcoming_festivals(days_ahead=14)
        upcoming_festival = upcoming_festivals[0]['festival_name'] if upcoming_festivals and len(upcoming_festivals) > 0 else None
        
        # Count alerts for this product
        all_alerts = self.alert_service.generate_alerts(store_id=store_id)
        product_alerts = [a for a in all_alerts if a.product_id == product_id]
        alert_count = len(product_alerts)
        
        # Generate insight using GenAI
        insight_text = self.explanation_service.generate_insight(
            product_name=product_name,
            category=category,
            recent_trend=recent_trend,
            upcoming_festival=upcoming_festival,
            alert_count=alert_count
        )
        
        return InsightSchema(
            product_id=product_id,
            store_id=store_id,
            insight=insight_text
        )
    
    def _analyze_recent_trend(
        self, 
        product_id: str, 
        store_id: Optional[str],
        days: int = 14
    ) -> str:
        """Analyze recent sales trend for a product."""
        # Get sales history
        sales_df = self.data_loader.sales
        
        filtered = sales_df[sales_df['product_id'] == product_id]
        if store_id:
            filtered = filtered[filtered['store_id'] == store_id]
        
        if len(filtered) == 0:
            return "no recent sales data"
        
        # Group by date
        daily_sales = filtered.groupby('date').agg({'quantity': 'sum'}).reset_index()
        daily_sales = daily_sales.sort_values('date')
        
        if len(daily_sales) < 7:
            return "insufficient data"
        
        # Compare recent week vs previous week
        recent_week = daily_sales.tail(7)['quantity'].mean()
        previous_week = daily_sales.tail(14).head(7)['quantity'].mean()
        
        if previous_week == 0:
            return "stable"
        
        change_pct = ((recent_week - previous_week) / previous_week) * 100
        
        if change_pct > 20:
            return "increasing"
        elif change_pct < -20:
            return "decreasing"
        else:
            return "stable"


# Global singleton instance
_insight_service_instance = None

def get_insight_service() -> InsightService:
    """Get the global InsightService instance."""
    global _insight_service_instance
    if _insight_service_instance is None:
        _insight_service_instance = InsightService()
    return _insight_service_instance


def get_insight(product_id: str, store_id: Optional[str] = None) -> InsightSchema:
    """Functional facade used by routers (single import)."""
    return get_insight_service().get_product_insight(product_id=product_id, store_id=store_id)