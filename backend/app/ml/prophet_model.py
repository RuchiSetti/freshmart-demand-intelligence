"""
Prophet time-series forecasting model wrapper.
Uses Facebook Prophet for trend + seasonality + festival effects.
"""
import pickle
import pandas as pd
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime, timedelta

try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False
    print("[WARNING] Prophet not installed. Install with: pip install prophet")


class ProphetModel:
    """Prophet forecasting model wrapper."""
    
    def __init__(self):
        """Initialize Prophet model."""
        self.models = {}  # Cache for trained models by product_store key
    
    def load(self, cache_path: Path) -> bool:
        """
        Load pre-trained Prophet models from cache.
        
        Args:
            cache_path: Path to models_cache directory
            
        Returns:
            True if at least one model loaded successfully
        """
        if not PROPHET_AVAILABLE:
            print("[ERROR] Prophet not available")
            return False
        
        try:
            # Load all prophet model files
            model_files = list(cache_path.glob("prophet_*.pkl"))
            
            if not model_files:
                print(f"[WARNING] No Prophet models found in {cache_path}")
                return False
            
            for model_file in model_files:
                # Extract product_id and store_id from filename
                # Format: prophet_P102_S01.pkl
                parts = model_file.stem.split('_')
                if len(parts) >= 3:
                    product_id = parts[1]
                    store_id = parts[2]
                    key = f"{product_id}_{store_id}"
                    
                    with open(model_file, 'rb') as f:
                        self.models[key] = pickle.load(f)
            
            print(f"[OK] Loaded {len(self.models)} Prophet models")
            return True
            
        except Exception as e:
            print(f"[ERROR] Error loading Prophet models: {e}")
            return False
    
    def predict(
        self, 
        product_id: str, 
        store_id: str,
        sales_history: pd.DataFrame,
        horizon: int = 7,
        festivals: Optional[List[Dict]] = None
    ) -> List[Dict]:
        """
        Generate forecast using Prophet.
        
        Args:
            product_id: Product ID
            store_id: Store ID
            sales_history: DataFrame with 'date' and 'quantity' columns
            horizon: Number of days to forecast
            festivals: Optional list of upcoming festivals
            
        Returns:
            List of forecast points with date, demand, and confidence intervals
        """
        if not PROPHET_AVAILABLE:
            return self._generate_fallback_forecast(horizon)
        
        key = f"{product_id}_{store_id}"
        
        # Check if we have a trained model for this combination
        if key in self.models:
            model = self.models[key]
        else:
            # Train on-the-fly if no cached model (fallback)
            if len(sales_history) < 14:
                return self._generate_fallback_forecast(horizon)
            model = self._train_model(sales_history, festivals)
        
        # Generate forecast
        try:
            future = model.make_future_dataframe(periods=horizon, freq='D')
            forecast = model.predict(future)
            
            # Extract forecast points (only future dates)
            last_date = sales_history['date'].max()
            future_forecast = forecast[forecast['ds'] > last_date].head(horizon)
            
            forecast_points = []
            for _, row in future_forecast.iterrows():
                forecast_points.append({
                    'date': row['ds'].strftime('%Y-%m-%d'),
                    'demand': max(0, float(row['yhat'])),  # Ensure non-negative
                    'lower_bound': max(0, float(row['yhat_lower'])),
                    'upper_bound': max(0, float(row['yhat_upper']))
                })
            
            return forecast_points
            
        except Exception as e:
            print(f"[ERROR] Prophet prediction failed: {e}")
            return self._generate_fallback_forecast(horizon)
    
    def _train_model(self, sales_history: pd.DataFrame, festivals: Optional[List[Dict]] = None):
        """Train Prophet model on-the-fly."""
        # Prepare data in Prophet format
        df = sales_history[['date', 'quantity']].copy()
        df.columns = ['ds', 'y']
        df = df.groupby('ds').agg({'y': 'sum'}).reset_index()
        
        # Initialize Prophet with seasonality
        # Add festivals as external regressors if available
        if festivals:
            # Add holiday dataframe
            holidays = pd.DataFrame([
                {'ds': pd.to_datetime(f['date']), 'holiday': f['festival_name']}
                for f in festivals
            ])
            model = Prophet(
                holidays=holidays,
                daily_seasonality=False,
                weekly_seasonality=True,
                yearly_seasonality=True,
                seasonality_mode='multiplicative'
            )
        else:
            model = Prophet(
                daily_seasonality=False,
                weekly_seasonality=True,
                yearly_seasonality=True,
                seasonality_mode='multiplicative'
            )
        
        model.fit(df)
        return model
    
    def _generate_fallback_forecast(self, horizon: int) -> List[Dict]:
        """Generate simple fallback forecast when Prophet fails."""
        today = datetime.now().date()
        forecast_points = []
        for day in range(1, horizon + 1):
            forecast_date = today + timedelta(days=day)
            forecast_points.append({
                'date': forecast_date.strftime('%Y-%m-%d'),
                'demand': 0.0,
                'lower_bound': 0.0,
                'upper_bound': 0.0
            })
        return forecast_points
