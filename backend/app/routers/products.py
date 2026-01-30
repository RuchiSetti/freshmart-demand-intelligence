"""
Products router - provides product list and details.
Endpoint: GET /products
"""
from fastapi import APIRouter, Query
from typing import List, Optional
from ..schemas import ProductSchema
from ..services.product_service import get_products

router = APIRouter(tags=["Products"])


@router.get("/products", response_model=List[ProductSchema])
def products(
    store_id: Optional[str] = Query(None, description="Filter by store ID"),
    category: Optional[str] = Query(None, description="Filter by category")
):
    """
    Get list of products with current stock levels.
    
    Query Parameters:
        - store_id: Optional filter by store
        - category: Optional filter by product category
        
    Returns:
        List of products with details and current stock
    """
    return get_products(store_id=store_id, category=category)
