"""
Alert service - detects inventory risks and generates alerts.
"""
from typing import List, Optional
from ..schemas import AlertSchema
from ..data_loader import get_data_loader
from .inventory_service import get_inventory_service


class AlertService:
    """Service for generating inventory alerts based on rules."""
    
    def __init__(self):
        """Initialize alert service."""
        self.data_loader = get_data_loader()
        self.inventory_service = get_inventory_service()
        
        # Alert thresholds
        self.STOCKOUT_DAYS_THRESHOLD = 5  # Alert if stock < 5 days
        self.OVERSTOCK_DAYS_THRESHOLD = 30  # Alert if stock > 30 days
    
    def generate_alerts(
        self,
        store_id: Optional[str] = None,
        severity_filter: Optional[str] = None
    ) -> List[AlertSchema]:
        """
        Generate alerts for all products or filtered by store.
        
        Args:
            store_id: Optional store ID to filter alerts
            severity_filter: Optional severity filter (HIGH, MEDIUM, LOW)
            
        Returns:
            List of AlertSchema objects
        """
        alerts = []
        
        # Get all product-store combinations from inventory
        inventory_df = self.data_loader.inventory
        
        if store_id:
            inventory_df = inventory_df[inventory_df['store_id'] == store_id]
        
        for _, inv_row in inventory_df.iterrows():
            product_id = inv_row['product_id']
            current_store_id = inv_row['store_id']
            current_stock = inv_row['current_stock']
            
            # Get stock coverage
            coverage = self.inventory_service.get_stock_coverage(
                product_id, current_store_id
            )
            
            days_of_stock = coverage['days_of_stock']
            avg_daily_demand = coverage['avg_daily_demand']
            
            # Get product details
            product = self.data_loader.get_product(product_id)
            product_name = product['name'] if product else product_id
            
            # Check for stockout risk
            if days_of_stock < self.STOCKOUT_DAYS_THRESHOLD:
                severity = "HIGH" if days_of_stock < 3 else "MEDIUM"
                alerts.append(AlertSchema(
                    product_id=product_id,
                    store_id=current_store_id,
                    type="STOCKOUT_RISK",
                    severity=severity,
                    message=f"{product_name} may run out of stock in {int(days_of_stock)} days",
                    days_until_issue=int(days_of_stock),
                    current_stock=current_stock,
                    forecasted_demand=avg_daily_demand
                ))
            
            # Check for overstock risk
            elif days_of_stock > self.OVERSTOCK_DAYS_THRESHOLD:
                severity = "MEDIUM" if days_of_stock < 60 else "LOW"
                alerts.append(AlertSchema(
                    product_id=product_id,
                    store_id=current_store_id,
                    type="OVERSTOCK_RISK",
                    severity=severity,
                    message=f"{product_name} has excess inventory ({int(days_of_stock)} days of stock)",
                    days_until_issue=int(days_of_stock),
                    current_stock=current_stock,
                    forecasted_demand=avg_daily_demand
                ))
            
            # Check for expiry risk
            expiry_risk = self.inventory_service.get_expiry_risk(product_id, current_store_id)
            if expiry_risk and expiry_risk['has_risk']:
                alerts.append(AlertSchema(
                    product_id=product_id,
                    store_id=current_store_id,
                    type="EXPIRY_RISK",
                    severity="HIGH",
                    message=f"{product_name} may expire before being sold (shelf life: {expiry_risk['shelf_life_days']} days)",
                    days_until_issue=expiry_risk['shelf_life_days'],
                    current_stock=current_stock,
                    forecasted_demand=avg_daily_demand
                ))
        
        # Filter by severity if specified
        if severity_filter:
            alerts = [alert for alert in alerts if alert.severity == severity_filter]
        
        # Sort by severity (HIGH first)
        severity_order = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
        alerts.sort(key=lambda x: severity_order.get(x.severity, 3))
        
        return alerts


# Global singleton instance
_alert_service_instance = None

def get_alert_service() -> AlertService:
    """Get the global AlertService instance."""
    global _alert_service_instance
    if _alert_service_instance is None:
        _alert_service_instance = AlertService()
    return _alert_service_instance


def get_alerts(store_id: Optional[str] = None, severity: Optional[str] = None) -> List[AlertSchema]:
    """Functional facade used by routers (single import)."""
    return get_alert_service().generate_alerts(store_id=store_id, severity_filter=severity)