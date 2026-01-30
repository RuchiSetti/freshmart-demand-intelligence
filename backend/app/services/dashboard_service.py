"""
Dashboard service - aggregates KPIs and chart data for dashboard view.
"""
import pandas as pd
from typing import Optional, Dict, List
from datetime import datetime, timedelta
from ..schemas import DashboardResponseSchema, DashboardKPISchema, DashboardChartsSchema, DemandTrendPoint
from ..data_loader import get_data_loader
from ..ml.model_manager import get_model_manager
from .alert_service import get_alert_service


class DashboardService:
    """Service for dashboard data aggregation."""
    
    def __init__(self):
        """Initialize dashboard service."""
        self.data_loader = get_data_loader()
        self.model_manager = get_model_manager()
        self.alert_service = get_alert_service()
    
    def get_dashboard_kpis(
        self,
        store_id: Optional[str] = None,
        date_range_days: int = 30
    ) -> DashboardResponseSchema:
        """
        Get dashboard KPIs and chart data.
        
        Args:
            store_id: Optional store ID for filtering
            date_range_days: Number of days for historical data
            
        Returns:
            DashboardResponseSchema with KPIs and charts
        """
        # Calculate date range
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=date_range_days)
        
        # Get sales data
        sales_df = self.data_loader.sales.copy()
        
        if store_id:
            sales_df = sales_df[sales_df['store_id'] == store_id]
        
        # Filter by date range
        sales_df = sales_df[
            (sales_df['date'] >= pd.Timestamp(start_date)) &
            (sales_df['date'] <= pd.Timestamp(end_date))
        ]
        
        # Calculate total sales
        total_sales = float(sales_df['revenue'].sum())
        
        # Calculate forecast for next 7 days (aggregate across products)
        forecast_next_7_days = self._calculate_aggregate_forecast(store_id, days=7)
        
        # Get alert counts
        all_alerts = self.alert_service.generate_alerts(store_id=store_id)
        stockout_risks = len([a for a in all_alerts if a.type == "STOCKOUT_RISK"])
        overstock_risks = len([a for a in all_alerts if a.type == "OVERSTOCK_RISK"])
        
        # Build KPIs
        kpis = DashboardKPISchema(
            total_sales=round(total_sales, 2),
            forecast_next_7_days=round(forecast_next_7_days, 2),
            stockout_risks=stockout_risks,
            overstock_risks=overstock_risks
        )
        
        # Build demand trend chart (last 30 days)
        demand_trend = self._build_demand_trend(sales_df, days=min(date_range_days, 30))
        
        charts = DashboardChartsSchema(demand_trend=demand_trend)
        
        return DashboardResponseSchema(kpis=kpis, charts=charts)
    
    def _calculate_aggregate_forecast(self, store_id: Optional[str], days: int) -> float:
        """Calculate aggregate forecast across all products."""
        inventory_df = self.data_loader.inventory
        
        if store_id:
            inventory_df = inventory_df[inventory_df['store_id'] == store_id]
        
        # Sample top 10 products to avoid performance issues
        sample_products = inventory_df.head(10)
        
        total_forecast = 0.0
        
        for _, inv_row in sample_products.iterrows():
            product_id = inv_row['product_id']
            current_store_id = inv_row['store_id']
            
            try:
                forecast_result = self.model_manager.get_forecast(
                    product_id=product_id,
                    store_id=current_store_id,
                    horizon=days
                )
                
                forecast_points = forecast_result['forecast']
                product_forecast = sum(point['demand'] for point in forecast_points)
                total_forecast += product_forecast
            except:
                continue
        
        return total_forecast
    
    def _build_demand_trend(self, sales_df, days: int) -> List[DemandTrendPoint]:
        """Build demand trend chart data."""
        # Aggregate sales by date
        daily_sales = sales_df.groupby('date').agg({'quantity': 'sum'}).reset_index()
        daily_sales = daily_sales.sort_values('date')
        
        # Take last N days
        daily_sales = daily_sales.tail(days)
        
        trend_points = []
        
        for _, row in daily_sales.iterrows():
            date_str = row['date'].strftime('%Y-%m-%d') if hasattr(row['date'], 'strftime') else str(row['date'])
            trend_points.append(DemandTrendPoint(
                date=date_str,
                value=float(row['quantity']),
            ))
        
        return trend_points


# Global singleton instance
_dashboard_service_instance = None

def get_dashboard_service() -> DashboardService:
    """Get the global DashboardService instance."""
    global _dashboard_service_instance
    if _dashboard_service_instance is None:
        _dashboard_service_instance = DashboardService()
    return _dashboard_service_instance


def get_dashboard_data(store_id: Optional[str] = None, date_range_days: int = 30) -> DashboardResponseSchema:
    """Functional facade used by routers (single import, no router->class coupling)."""
    return get_dashboard_service().get_dashboard_kpis(store_id=store_id, date_range_days=date_range_days)