"""
Explanation service - orchestrates GenAI for generating insights and explanations.
This service ONLY generates text explanations, never predictions or actions.
"""
from typing import Dict, List, Optional
from .llm_client import get_llm_client
from .prompt_templates import (
    SYSTEM_PROMPT,
    get_forecast_explanation_prompt,
    get_alert_explanation_prompt,
    get_insight_prompt
)


class ExplanationService:
    """
    Service for generating GenAI explanations.
    All outputs are text-only explanations of existing data/predictions.
    """
    
    def __init__(self):
        """Initialize explanation service."""
        self.llm_client = get_llm_client()
    
    def explain_forecast(
        self,
        product_name: str,
        current_stock: int,
        avg_daily_sales: float,
        forecast_avg: float,
        upcoming_festival: Optional[str] = None
    ) -> str:
        """
        Generate explanation for a forecast.
        
        Args:
            product_name: Name of the product
            current_stock: Current inventory level
            avg_daily_sales: Historical average daily sales
            forecast_avg: Average forecasted demand
            upcoming_festival: Optional upcoming festival name
            
        Returns:
            Natural language explanation
        """
        if not self.llm_client.is_available():
            # Fallback explanation without GenAI
            return self._generate_fallback_forecast_explanation(
                product_name, avg_daily_sales, forecast_avg, upcoming_festival
            )
        
        prompt = get_forecast_explanation_prompt(
            product_name, current_stock, avg_daily_sales, forecast_avg, upcoming_festival
        )
        
        explanation = self.llm_client.generate_text(prompt, system_message=SYSTEM_PROMPT)
        return explanation
    
    def explain_alert(
        self,
        product_name: str,
        alert_type: str,
        current_stock: int,
        forecasted_demand: float,
        days_until_issue: int
    ) -> str:
        """
        Generate explanation for an alert.
        
        Args:
            product_name: Name of the product
            alert_type: Type of alert
            current_stock: Current inventory level
            forecasted_demand: Forecasted demand
            days_until_issue: Days until issue occurs
            
        Returns:
            Natural language explanation
        """
        if not self.llm_client.is_available():
            # Fallback explanation without GenAI
            return self._generate_fallback_alert_explanation(
                product_name, alert_type, days_until_issue
            )
        
        prompt = get_alert_explanation_prompt(
            product_name, alert_type, current_stock, forecasted_demand, days_until_issue
        )
        
        explanation = self.llm_client.generate_text(prompt, system_message=SYSTEM_PROMPT)
        return explanation
    
    def generate_insight(
        self,
        product_name: str,
        category: str,
        recent_trend: str,
        upcoming_festival: Optional[str] = None,
        alert_count: int = 0
    ) -> str:
        """
        Generate business insight for a product.
        
        Args:
            product_name: Name of the product
            category: Product category
            recent_trend: Description of recent sales trend
            upcoming_festival: Optional upcoming festival name
            alert_count: Number of active alerts
            
        Returns:
            Natural language insight
        """
        if not self.llm_client.is_available():
            # Fallback insight without GenAI
            return self._generate_fallback_insight(
                product_name, category, recent_trend, upcoming_festival
            )
        
        prompt = get_insight_prompt(
            product_name, category, recent_trend, upcoming_festival, alert_count
        )
        
        insight = self.llm_client.generate_text(prompt, system_message=SYSTEM_PROMPT)
        return insight
    
    # ========================================================================
    # Fallback methods (when GenAI is unavailable)
    # ========================================================================
    
    def _generate_fallback_forecast_explanation(
        self,
        product_name: str,
        avg_daily_sales: float,
        forecast_avg: float,
        upcoming_festival: Optional[str]
    ) -> str:
        """Generate simple rule-based forecast explanation."""
        if forecast_avg > avg_daily_sales * 1.2:
            trend = "increasing"
            reason = f" due to upcoming {upcoming_festival}" if upcoming_festival else " based on historical patterns"
        elif forecast_avg < avg_daily_sales * 0.8:
            trend = "decreasing"
            reason = " based on recent trends"
        else:
            trend = "stable"
            reason = ""
        
        return f"Demand for {product_name} is forecasted to be {trend}{reason}."
    
    def _generate_fallback_alert_explanation(
        self,
        product_name: str,
        alert_type: str,
        days_until_issue: int
    ) -> str:
        """Generate simple rule-based alert explanation."""
        if alert_type == "STOCKOUT_RISK":
            return f"{product_name} may run out of stock in approximately {days_until_issue} days based on current demand."
        elif alert_type == "OVERSTOCK_RISK":
            return f"{product_name} has excess inventory that may take over {days_until_issue} days to sell."
        elif alert_type == "EXPIRY_RISK":
            return f"{product_name} may expire before it can be sold based on current stock levels and demand."
        else:
            return f"Inventory issue detected for {product_name}."
    
    def _generate_fallback_insight(
        self,
        product_name: str,
        category: str,
        recent_trend: str,
        upcoming_festival: Optional[str]
    ) -> str:
        """Generate simple rule-based insight."""
        festival_note = f" With {upcoming_festival} approaching, demand may increase." if upcoming_festival else ""
        return f"{product_name} ({category}) shows {recent_trend} sales trend.{festival_note}"


# Global singleton instance
_explanation_service_instance = None

def get_explanation_service() -> ExplanationService:
    """Get the global ExplanationService instance."""
    global _explanation_service_instance
    if _explanation_service_instance is None:
        _explanation_service_instance = ExplanationService()
    return _explanation_service_instance
