"""
Insights router - provides GenAI-powered product insights.
Endpoint: GET /insights
"""
from fastapi import APIRouter, Query
from typing import Optional
from ..schemas import InsightSchema
from ..services.insight_service import get_insight

router = APIRouter(tags=["Insights"])


@router.get("/insights", response_model=InsightSchema)
def insights(
    product_id: str = Query(..., description="Product ID (required)"),
    store_id: Optional[str] = Query(None, description="Optional store ID for context")
):
    """
    Get GenAI-powered insight for a product.
    
    Path Parameters:
        - product_id: Product ID
        
    Query Parameters:
        - store_id: Optional store ID for store-specific insights
        
    Returns:
        Natural language insight about product demand, trends, and risks
        
    Note:
        This endpoint uses GenAI to generate explanations.
        GenAI ONLY explains existing data and ML predictions - it never
        predicts numbers or triggers actions.
    """
    return get_insight(product_id=product_id, store_id=store_id)
