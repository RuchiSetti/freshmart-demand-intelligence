"""
API v1 router aggregator.

Non-negotiable contract:
  - Base path: /api/v1
  - Allowed endpoints only:
      POST /api/v1/auth/login (PUBLIC - no auth required)
      POST /api/v1/auth/register (PUBLIC - no auth required)
      GET /api/v1/auth/me (PROTECTED - requires JWT token)
      GET /api/v1/dashboard (PROTECTED - requires JWT token)
      GET /api/v1/products (PROTECTED - requires JWT token)
      GET /api/v1/stores (PROTECTED - requires JWT token)
      GET /api/v1/forecast (PROTECTED - requires JWT token)
      GET /api/v1/alerts (PROTECTED - requires JWT token)
      GET /api/v1/insights (PROTECTED - requires JWT token)
      GET /health (PUBLIC)
      GET /ready (PUBLIC)
"""

from fastapi import APIRouter, Depends

from .dashboard import router as dashboard_router
from .products import router as products_router
from .stores import router as stores_router
from .forecast import router as forecast_router
from .alerts import router as alerts_router
from .insights import router as insights_router
from .auth import router as auth_router
from ..security.auth import require_user


# Auth router is included WITHOUT dependencies (public endpoints)
# We need to create a separate router for auth that doesn't require auth
auth_router_public = APIRouter(prefix="/api/v1")
auth_router_public.include_router(auth_router)

# Main API v1 router - all endpoints require authentication
api_v1_router = APIRouter(prefix="/api/v1", dependencies=[Depends(require_user)])

# Protected endpoints (require JWT token)
api_v1_router.include_router(dashboard_router)
api_v1_router.include_router(products_router)
api_v1_router.include_router(stores_router)
api_v1_router.include_router(forecast_router)
api_v1_router.include_router(alerts_router)
api_v1_router.include_router(insights_router)


