# FreshMart Demand Forecasting Backend

Production-grade FastAPI backend with real ML forecasting (Prophet, XGBoost) and GenAI explanations for retail demand forecasting.

## 🏗️ Architecture

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration management
│   ├── schemas.py           # Pydantic models
│   ├── data_loader.py       # In-memory data loading
│   ├── routers/             # API endpoints
│   │   ├── dashboard.py     # Dashboard KPIs
│   │   ├── products.py      # Product list/details
│   │   ├── forecast.py      # Demand forecasting
│   │   ├── alerts.py        # Inventory alerts
│   │   └── insights.py      # GenAI insights
│   ├── services/            # Business logic
│   │   ├── forecast_service.py
│   │   ├── inventory_service.py
│   │   ├── alert_service.py
│   │   ├── dashboard_service.py
│   │   └── insight_service.py
│   ├── ml/                  # ML models
│   │   ├── baseline_model.py
│   │   ├── prophet_model.py
│   │   ├── xgboost_model.py
│   │   └── model_manager.py
│   └── genai/               # GenAI layer
│       ├── llm_client.py
│       ├── prompt_templates.py
│       └── explanation_service.py
├── data/                    # CSV datasets
├── models_cache/            # Trained ML models
├── scripts/                 # Training scripts
│   ├── generate_synthetic_data.py
│   ├── train_baseline.py
│   ├── train_prophet.py
│   └── train_xgboost.py
├── requirements.txt
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Generate Synthetic Data

```bash
python scripts/generate_synthetic_data.py
```

This creates:
- **41 products** across 10 categories (Grains, Dairy, Snacks, etc.)
- **10 stores** in major Indian cities
- **22,000+ sales transactions** over 6 months
- **410 inventory records**
- **13 festival dates** (Diwali, Holi, Eid, etc.)

### 3. Train ML Models

```bash
# Train baseline model (fast)
python scripts/train_baseline.py

# Train Prophet models (2-3 minutes)
python scripts/train_prophet.py

# Train XGBoost model (1-2 minutes)
python scripts/train_xgboost.py
```

### 4. Configure Environment (Optional)

Create `.env` file (copy from `.env.example`):

```env
OPENAI_API_KEY=your_api_key_here  # For GenAI insights
MODEL_TYPE=xgboost                # baseline, prophet, or xgboost
ENVIRONMENT=development
LOG_LEVEL=INFO
```

### 5. Run the Backend

```bash
uvicorn app.main:app --reload --port 8000
```

Or if running from the project root:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

API will be available at:
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Root Endpoint**: http://localhost:8000/

## 📡 API Endpoints

### Dashboard
**GET /dashboard?store_id={optional}**

Returns KPIs and demand trend chart:
```json
{
  "kpis": {
    "total_sales": 1245000,
    "forecast_next_7_days": 18340,
    "stockout_risks": 6,
    "overstock_risks": 3
  },
  "charts": {
    "demand_trend": [
      {"date": "2026-01-20", "actual": 1200, "forecast": null}
    ]
  }
}
```

### Products
**GET /products?store_id={optional}&category={optional}**

Returns product list with current stock.

**GET /product/{product_id}?store_id={required}**

Returns detailed product information.

### Forecast
**GET /product/{product_id}/forecast?store_id={required}&days=7**

Returns demand forecast:
```json
{
  "product_id": "P102",
  "store_id": "S01",
  "forecast": [
    {"date": "2026-01-27", "demand": 42.5}
  ],
  "model_used": "xgboost"
}
```

### Alerts
**GET /alerts?store_id={optional}&severity={optional}**

Returns inventory risk alerts:
```json
[
  {
    "product_id": "P102",
    "store_id": "S01",
    "type": "STOCKOUT_RISK",
    "severity": "HIGH",
    "message": "Stock likely to deplete in 3 days",
    "days_until_issue": 3
  }
]
```

### Insights
**GET /insights/{product_id}?store_id={optional}**

Returns GenAI-powered insight:
```json
{
  "product_id": "P102",
  "insight": "Demand is increasing due to upcoming Holi festival; current stock may not be sufficient."
}
```

## 🤖 ML Models

### Baseline Model
- **Method**: Weighted moving average (7, 14, 30 day windows)
- **Use**: Fast fallback when other models unavailable
- **Training**: Instant (no training required)

### Prophet Model
- **Features**: Trend + weekly/yearly seasonality + festival effects
- **Training**: Top 20 product-store combinations
- **Accuracy**: Good for products with clear patterns
- **Training Time**: 2-3 minutes

### XGBoost Model
- **Features**: Lags, rolling stats, seasonality, festivals, day of week
- **Training**: Global model across all products
- **Accuracy**: Best for complex patterns
- **Training Time**: 1-2 minutes

**Model Selection**: Auto-fallback: XGBoost → Prophet → Baseline

## 🧠 GenAI Integration

**Purpose**: Generate natural language explanations ONLY

**Strict Rules**:
- ✅ Explain ML predictions and data patterns
- ✅ Provide business context for forecasts/alerts
- ❌ NEVER predict numbers
- ❌ NEVER trigger actions

**Fallback**: If OpenAI API unavailable, uses rule-based explanations

## 🔧 Configuration

### Model Selection
Change `MODEL_TYPE` in `.env`:
- `baseline` - Fast, simple moving averages
- `prophet` - Time-series with seasonality
- `xgboost` - Best accuracy (default)

### GenAI Provider
Easily switch from OpenAI to LLaMA/Ollama:
1. Update `llm_client.py` to use Ollama endpoint
2. Change `LLM_MODEL` in config
3. No other code changes needed

## 📊 Data Schema

### Products CSV
```
product_id,name,category,shelf_life_days,unit_price
P101,Basmati Rice 5kg,Grains,365,245.00
```

### Sales CSV
```
date,product_id,store_id,quantity,revenue
2025-08-01,P101,S01,45,11025.00
```

### Inventory CSV
```
product_id,store_id,current_stock,last_updated
P101,S01,520,2026-01-26 22:00:00
```

### Festivals CSV
```
date,festival_name,region,demand_multiplier
2026-03-14,Holi,North,1.7
```

## 🎯 Core Principles

1. **ML predicts numbers** - Prophet/XGBoost generate forecasts
2. **GenAI explains decisions** - Natural language context
3. **Humans approve actions** - No automated ordering
4. **Backend hides complexity** - Clean API contracts
5. **Frontend stays simple** - Ready-to-use JSON responses

## 🔍 Testing

### Manual API Testing
```bash
# Dashboard
curl http://localhost:8000/dashboard

# Products at store S01
curl "http://localhost:8000/products?store_id=S01"

# Forecast for product P102
curl "http://localhost:8000/product/P102/forecast?store_id=S01&days=7"

# Alerts
curl http://localhost:8000/alerts

# Insight for product
curl "http://localhost:8000/insights/P102?store_id=S01"
```

### Interactive API Docs
Visit http://localhost:8000/docs to test all endpoints interactively.

## 📦 Dependencies

- **FastAPI**: Web framework
- **Prophet**: Time-series forecasting
- **XGBoost**: Gradient boosting for ML
- **Pandas/NumPy**: Data processing
- **OpenAI**: GenAI explanations (optional)
- **Uvicorn**: ASGI server

## 🚧 Production Considerations

- ✅ In-memory data loading (fast responses)
- ✅ No training during requests (models pre-trained)
- ✅ Auto-fallback model selection
- ✅ CORS enabled for frontend integration
- ✅ API documentation auto-generated
- ✅ Environment-based configuration
- ⚠️ Add authentication for production
- ⚠️ Add rate limiting
- ⚠️ Consider Redis for caching at scale

## 📝 License

MIT License - feel free to use and modify.

---

**Built with ❤️ for production-ready retail forecasting**
