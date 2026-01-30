"""
Baseline forecasting model using simple moving average.
This is the fallback model when more complex models fail or are unavailable.
"""
import pickle
import pandas as pd
import numpy as np
from pathlib import Path
from typing import List, Dict
from datetime import datetime, timedelta


class BaselineModel:
    """Simple moving average baseline forecasting model."""
    
    def __init__(self, window_sizes: List[int] = [7, 14, 30]):
        """
        Initialize baseline model.
        
        Args:
            window_sizes: List of window sizes for moving averages
        """
        self.window_sizes = window_sizes
        self.params = {}
    
    def load(self, cache_path: Path) -> bool:
        """
        Load baseline parameters from cache.
        
        Args:
            cache_path: Path to models_cache directory
            
        Returns:
            True if loaded successfully, False otherwise
        """
        try:
            param_file = cache_path / "baseline_params.pkl"
            if param_file.exists():
                with open(param_file, 'rb') as f:
                    self.params = pickle.load(f)
                print(f"✅ Loaded baseline parameters from {param_file}")
                return True
            else:
                print(f"⚠️ Baseline params file not found: {param_file}")
                return False
        except Exception as e:
            print(f"❌ Error loading baseline params: {e}")
            return False
    
    def predict(
        self, 
        product_id: str, 
        store_id: str, 
        sales_history: pd.DataFrame,
        horizon: int = 7
    ) -> List[Dict]:
        """
        Generate forecast using moving average.
        
        Args:
            product_id: Product ID
            store_id: Store ID
            sales_history: DataFrame with 'date' and 'quantity' columns
            horizon: Number of days to forecast
            
        Returns:
            List of forecast points with date and demand
        """
        if len(sales_history) == 0:
            # No history, return zeros
            return self._generate_zero_forecast(horizon)
        
        # Calculate moving average from recent history
        recent_sales = sales_history.tail(max(self.window_sizes)).copy()
        
        # Use weighted average of different window sizes
        forecasts = []
        for window in self.window_sizes:
            if len(recent_sales) >= window:
                avg = recent_sales.tail(window)['quantity'].mean()
                forecasts.append(avg)
        
        if not forecasts:
            # Not enough history, use overall average
            predicted_demand = sales_history['quantity'].mean()
        else:
            # Weighted average: shorter windows get more weight
            weights = [1.0 / (i + 1) for i in range(len(forecasts))]
            predicted_demand = np.average(forecasts, weights=weights)
        
        # Generate forecast points
        last_date = sales_history['date'].max()
        if isinstance(last_date, pd.Timestamp):
            last_date = last_date.date()
        
        forecast_points = []
        for day in range(1, horizon + 1):
            forecast_date = last_date + timedelta(days=day)
            forecast_points.append({
                'date': forecast_date.strftime('%Y-%m-%d'),
                'demand': float(predicted_demand)
            })
        
        return forecast_points
    
    def _generate_zero_forecast(self, horizon: int) -> List[Dict]:
        """Generate zero forecast when no history is available."""
        today = datetime.now().date()
        forecast_points = []
        for day in range(1, horizon + 1):
            forecast_date = today + timedelta(days=day)
            forecast_points.append({
                'date': forecast_date.strftime('%Y-%m-%d'),
                'demand': 0.0
            })
        return forecast_points
