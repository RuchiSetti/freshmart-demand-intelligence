"""
Product service - business logic for product listing.
Routers must not access DataLoader directly.
"""

from typing import List, Optional

from ..data_loader import get_data_loader
from ..schemas import ProductSchema
from ..security.auth import get_current_user
from ..security.models import User
from ..utils.masking import mask_price_for_role


def get_products(store_id: Optional[str] = None, category: Optional[str] = None) -> List[ProductSchema]:
    """
    Get list of products with optional filters.
    Note: unit_price is masked for non-admin roles.
    """
    dl = get_data_loader()
    user: User = get_current_user()

    products_list = dl.get_products_list(store_id=store_id, category=category)

    result: List[ProductSchema] = []
    for product in products_list:
        result.append(
            ProductSchema(
                product_id=str(product["product_id"]),
                name=str(product["name"]),
                category=str(product.get("category") or ""),
                current_stock=int(product.get("current_stock") or 0),
                store_id=str(product.get("store_id") or (store_id or "ALL")),
                unit_price=mask_price_for_role(product.get("unit_price"), user.role),
                avg_daily_sales=None,
            )
        )
    return result


