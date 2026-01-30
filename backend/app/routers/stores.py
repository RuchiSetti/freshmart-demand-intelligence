"""
Stores router.
Endpoint: GET /stores
"""

from fastapi import APIRouter
from typing import List

from ..schemas import StoreSchema
from ..services.store_service import get_stores

router = APIRouter(tags=["Stores"])


@router.get("/stores", response_model=List[StoreSchema])
def stores():
    return get_stores()


