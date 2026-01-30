"""
Prompt templates for GenAI explanation generation.
All prompts explicitly instruct the LLM to NEVER predict numbers or trigger actions.
"""

# System prompt for all GenAI interactions
SYSTEM_PROMPT = """You are a retail analytics assistant that ONLY explains existing data and predictions.

CRITICAL RULES:
1. NEVER predict numbers or make forecasts yourself
2. NEVER suggest or trigger business actions
3. ONLY explain the ML predictions and data provided to you
4. Keep explanations concise (1-2 sentences maximum)
5. Use simple, business-friendly language
6. Focus on WHY something is happening, not WHAT to do about it
"""


def get_forecast_explanation_prompt(
    product_name: str,
    current_stock: int,
    avg_daily_sales: float,
    forecast_avg: float,
    upcoming_festival: str = None
) -> str:
    """
    Generate prompt for forecast explanation.
    
    Args:
        product_name: Name of the product
        current_stock: Current inventory level
        avg_daily_sales: Historical average daily sales
        forecast_avg: Average forecasted demand
        upcoming_festival: Optional upcoming festival name
        
    Returns:
        Formatted prompt for LLM
    """
    festival_info = f" An upcoming festival is {upcoming_festival}." if upcoming_festival else ""
    
    prompt = f"""Explain the demand forecast for {product_name}.

Current stock: {current_stock} units
Historical average daily sales: {avg_daily_sales:.1f} units
ML forecasted average demand: {forecast_avg:.1f} units per day{festival_info}

Provide a brief explanation of why the forecast shows this demand pattern. Focus on trends and external factors."""
    
    return prompt


def get_alert_explanation_prompt(
    product_name: str,
    alert_type: str,
    current_stock: int,
    forecasted_demand: float,
    days_until_issue: int
) -> str:
    """
    Generate prompt for alert explanation.
    
    Args:
        product_name: Name of the product
        alert_type: Type of alert (STOCKOUT_RISK, OVERSTOCK_RISK, EXPIRY_RISK)
        current_stock: Current inventory level
        forecasted_demand: Forecasted demand
        days_until_issue: Days until issue occurs
        
    Returns:
        Formatted prompt for LLM
    """
    alert_descriptions = {
        "STOCKOUT_RISK": "stock is running low",
        "OVERSTOCK_RISK": "there is excess inventory",
        "EXPIRY_RISK": "stock may expire before being sold"
    }
    
    description = alert_descriptions.get(alert_type, "there is an inventory issue")
    
    prompt = f"""Explain why {description} for {product_name}.

Current stock: {current_stock} units
Forecasted daily demand: {forecasted_demand:.1f} units
Estimated days until issue: {days_until_issue}

Provide a brief, business-friendly explanation of this inventory risk."""
    
    return prompt


def get_insight_prompt(
    product_name: str,
    category: str,
    recent_trend: str,
    upcoming_festival: str = None,
    alert_count: int = 0
) -> str:
    """
    Generate prompt for product insight.
    
    Args:
        product_name: Name of the product
        category: Product category
        recent_trend: Description of recent sales trend (e.g., "increasing", "stable", "decreasing")
        upcoming_festival: Optional upcoming festival name
        alert_count: Number of active alerts for this product
        
    Returns:
        Formatted prompt for LLM
    """
    festival_info = f" An upcoming festival is {upcoming_festival}." if upcoming_festival else ""
    alert_info = f" There are {alert_count} active alerts." if alert_count > 0 else ""
    
    prompt = f"""Generate a brief insight for {product_name} ({category}).

Recent sales trend: {recent_trend}{festival_info}{alert_info}

Provide a concise, actionable insight about this product's demand pattern and what factors are influencing it."""
    
    return prompt
