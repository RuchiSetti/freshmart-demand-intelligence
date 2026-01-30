from fastapi import FastAPI
from app.routers import dashboard, products, forecast, alerts, insights

app = FastAPI(title="FreshMart Backend")

app.include_router(dashboard.router)
app.include_router(products.router)
app.include_router(forecast.router)
app.include_router(alerts.router)
app.include_router(insights.router)
