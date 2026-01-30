"""
Pydantic schemas for API requests and responses.
These models match the frontend API contracts exactly.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime


# ============================================================================
# Shared Schemas
# ============================================================================

class TimeSeriesPointSchema(BaseModel):
    """Frontend-ready chart point for Recharts."""
    date: str  # YYYY-MM-DD
    value: float


# ============================================================================
# Authentication Schemas
# ============================================================================

class LoginRequestSchema(BaseModel):
    """
    Login request schema.
    
    Frontend should POST this to /api/v1/auth/login:
    {
        "email": "admin@freshmart.com",
        "password": "admin123"
    }
    """
    email: str = Field(..., description="User email address")
    password: str = Field(..., description="User password")


class RegisterRequestSchema(BaseModel):
    """
    Registration request schema.
    
    Frontend should POST this to /api/v1/auth/register:
    {
        "email": "newuser@freshmart.com",
        "password": "password123",
        "role": "viewer"  # Optional, defaults to "viewer"
    }
    """
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6, description="User password (min 6 characters)")
    role: str = Field(default="viewer", description="User role: admin, manager, or viewer")


class TokenResponseSchema(BaseModel):
    """
    Token response schema after successful login/register.
    
    Frontend should:
    1. Store the access_token (e.g., in localStorage)
    2. Send it in subsequent requests as: Authorization: Bearer <access_token>
    3. Include user info for UI display
    """
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    user: dict = Field(..., description="User information (email, role)")


# ============================================================================
# Product Schemas
# ============================================================================

class ProductSchema(BaseModel):
    """Product information with current stock."""
    product_id: str
    name: str
    category: str
    current_stock: int
    store_id: str
    unit_price: Optional[float] = None
    avg_daily_sales: Optional[float] = None


class StoreSchema(BaseModel):
    """Store information."""
    store_id: str
    name: str
    city: str
    state: str
    region: str


# ============================================================================
# Forecast Schemas
# ============================================================================

class ForecastPointSchema(BaseModel):
    """Single forecast data point."""
    date: str  # ISO format: "2026-01-27"
    value: float  # Predicted quantity
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None


class ForecastResponseSchema(BaseModel):
    """Forecast response for a product."""
    product_id: str
    store_id: str
    forecast: List[ForecastPointSchema]
    model_used: Optional[str] = None


# ============================================================================
# Alert Schemas
# ============================================================================

class AlertSchema(BaseModel):
    """Alert/notification schema."""
    product_id: str
    store_id: str
    type: str  # STOCKOUT_RISK, OVERSTOCK_RISK, EXPIRY_RISK
    severity: str  # HIGH, MEDIUM, LOW
    message: str
    days_until_issue: Optional[int] = None
    current_stock: Optional[int] = None
    forecasted_demand: Optional[float] = None


# ============================================================================
# Dashboard Schemas
# ============================================================================

class DashboardKPISchema(BaseModel):
    """Dashboard KPI metrics."""
    total_sales: float
    forecast_next_7_days: float
    stockout_risks: int
    overstock_risks: int


class DemandTrendPoint(BaseModel):
    """Single point in demand trend chart."""
    date: str
    value: float


class DashboardChartsSchema(BaseModel):
    """Dashboard chart data."""
    demand_trend: List[DemandTrendPoint]


class DashboardResponseSchema(BaseModel):
    """Complete dashboard response."""
    kpis: DashboardKPISchema
    charts: DashboardChartsSchema


# ============================================================================
# Insight Schemas
# ============================================================================

class InsightSchema(BaseModel):
    """GenAI-generated insight."""
    product_id: str
    store_id: Optional[str] = None
    insight: str  # Natural language explanation


# ============================================================================
# Internal Schemas (not exposed to API)
# ============================================================================

class SalesRecord(BaseModel):
    """Internal sales transaction record."""
    date: date
    product_id: str
    store_id: str
    quantity: float
    revenue: float


class InventoryRecord(BaseModel):
    """Internal inventory record."""
    product_id: str
    store_id: str
    current_stock: int
    last_updated: datetime


class FestivalRecord(BaseModel):
    """Internal festival calendar record."""
    date: date
    festival_name: str
    region: str
    demand_multiplier: float
