"""
FastAPI main application.
Orchestrates all routers, middleware, and startup events.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import settings
from .data_loader import get_data_loader
from .ml.model_manager import get_model_manager
from .routers.api_v1 import api_v1_router, auth_router_public
from .utils.errors import register_exception_handlers
from .utils.logging import configure_json_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Loads data and models into memory at startup.
    """
    configure_json_logging(settings.LOG_LEVEL)
    
    # Load data into memory
    get_data_loader()
    
    # Load ML models
    get_model_manager()
    
    yield
    
    # Cleanup on shutdown
    print("\n[INFO] Application shutting down...")


# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production-grade demand forecasting API with ML and GenAI",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def root():
    return {"status": "FreshMart backend running"}


# Register exception handlers
register_exception_handlers(app)

# Register routers
# Auth router is public (no authentication required for login/register)
app.include_router(auth_router_public)
# All other API v1 endpoints require JWT authentication
app.include_router(api_v1_router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.get("/ready")
async def readiness_check():
    """Readiness check endpoint (data + models)."""
    mm = get_model_manager()
    return {
        "status": "ok" if mm.is_ready() else "not_ready",
        "models": mm.get_status(),
    }
