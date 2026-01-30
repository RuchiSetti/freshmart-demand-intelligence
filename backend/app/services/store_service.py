"""
Store service - business logic for stores listing.
"""

from typing import List

from ..data_loader import get_data_loader
from ..schemas import StoreSchema


def get_stores() -> List[StoreSchema]:
    dl = get_data_loader()
    stores_df = dl.stores.copy()
    stores = stores_df.to_dict("records")
    return [
        StoreSchema(
            store_id=str(s["store_id"]),
            name=str(s["name"]),
            city=str(s.get("city") or ""),
            state=str(s.get("state") or ""),
            region=str(s.get("region") or ""),
        )
        for s in stores
    ]


