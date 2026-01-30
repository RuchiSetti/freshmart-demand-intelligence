"""
XGBoost regression model for demand forecasting with feature engineering.
Uses historical patterns, seasonality, and external features.
"""
import pickle
import pandas as pd
import numpy as np
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime, timedelta

try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False
    print("[WARNING] XGBoost not installed. Install with: pip install xgboost")


class XGBoostModel:
    """XGBoost demand forecasting model."""
    
    def __init__(self):
        """Initialize XGBoost model."""
        self.model = None
        self.feature_cols = None
    
    def load(self, cache_path: Path) -> bool:
        """
        Load pre-trained XGBoost model from cache.
        
        Args:
            cache_path: Path to models_cache directory
            
        Returns:
            True if loaded successfully
        """
        if not XGBOOST_AVAILABLE:
            print("[ERROR] XGBoost not available")
            return False
        
        try:
            model_file = cache_path / "xgboost_demand.pkl"
            
            if not model_file.exists():
                print(f"[WARNING] XGBoost model not found: {model_file}")
                return False
            
            with open(model_file, 'rb') as f:
                saved_data = pickle.load(f)
                self.model = saved_data['model']
                self.feature_cols = saved_data['feature_cols']
            
            print(f"[OK] Loaded XGBoost model")
            return True
            
        except Exception as e:
            print(f"[ERROR] Error loading XGBoost model: {e}")
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
        Generate forecast using XGBoost with feature engineering.
        
        Args:
            product_id: Product ID
            store_id: Store ID
            sales_history: DataFrame with 'date' and 'quantity' columns
            horizon: Number of days to forecast
            festivals: Optional list of upcoming festivals
            
        Returns:
            List of forecast points with date and demand
        """
        if not XGBOOST_AVAILABLE or self.model is None or self.feature_cols is None:
            return self._generate_fallback_forecast(horizon)
        
        if len(sales_history) < 14:
            return self._generate_fallback_forecast(horizon)
        
        try:
            # Prepare historical data with features
            history_df = sales_history.copy()
            history_df = history_df.groupby('date').agg({'quantity': 'sum'}).reset_index()
            history_df = history_df.sort_values('date')
            
            # Generate features for historical data
            history_df = self._create_features(history_df, festivals)
            
            # Generate future dates
            last_date = history_df['date'].max()
            if isinstance(last_date, pd.Timestamp):
                last_date = last_date.date()
            
            forecast_points = []
            
            # Rolling forecast: predict one day at a time
            for day in range(1, horizon + 1):
                forecast_date = last_date + timedelta(days=day)
                
                # Create feature row for forecast date
                feature_row = self._create_future_features(
                    forecast_date, 
                    history_df,
                    festivals
                )
                
                # Make prediction
                X = feature_row[self.feature_cols]
                prediction = self.model.predict(X)[0]
                prediction = max(0, prediction)  # Ensure non-negative
                
                forecast_points.append({
                    'date': forecast_date.strftime('%Y-%m-%d'),
                    'demand': float(prediction)
                })
                
                # Add prediction to history for next iteration (rolling forecast)
                new_row = feature_row.copy()
                new_row['quantity'] = prediction
                history_df = pd.concat([history_df, new_row], ignore_index=True)
            
            return forecast_points
            
        except Exception as e:
            print(f"[ERROR] XGBoost prediction failed: {e}")
            return self._generate_fallback_forecast(horizon)
    
    def _create_features(self, df: pd.DataFrame, festivals: Optional[List[Dict]] = None) -> pd.DataFrame:
        """Create features for XGBoost model."""
        df = df.copy()
        
        # Date features
        df['day_of_week'] = pd.to_datetime(df['date']).dt.dayofweek
        df['day_of_month'] = pd.to_datetime(df['date']).dt.day
        df['month'] = pd.to_datetime(df['date']).dt.month
        df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
        
        # Lag features
        df['lag_7'] = df['quantity'].shift(7)
        df['lag_14'] = df['quantity'].shift(14)
        df['lag_30'] = df['quantity'].shift(30)
        
        # Rolling statistics
        df['rolling_mean_7'] = df['quantity'].rolling(window=7, min_periods=1).mean()
        df['rolling_mean_14'] = df['quantity'].rolling(window=14, min_periods=1).mean()
        df['rolling_std_7'] = df['quantity'].rolling(window=7, min_periods=1).std().fillna(0)
        
        # Festival features
        df['is_festival'] = 0
        df['festival_multiplier'] = 1.0
        
        if festivals:
            for _, row in df.iterrows():
                for festival in festivals:
                    festival_date = pd.to_datetime(festival['date']).date()
                    row_date = pd.to_datetime(row['date']).date()
                    if abs((festival_date - row_date).days) <= 2:
                        df.loc[df['date'] == row['date'], 'is_festival'] = 1
                        df.loc[df['date'] == row['date'], 'festival_multiplier'] = festival.get('demand_multiplier', 1.2)
        
        # Fill NaN values
        df = df.bfill().fillna(0)
        
        return df
    
    def _create_future_features(
        self, 
        forecast_date: datetime.date, 
        history_df: pd.DataFrame,
        festivals: Optional[List[Dict]] = None
    ) -> pd.DataFrame:
        """Create features for a future forecast date."""
        # Date features
        forecast_dt = pd.Timestamp(forecast_date)
        
        features = {
            'date': forecast_date,
            'day_of_week': forecast_dt.dayofweek,
            'day_of_month': forecast_dt.day,
            'month': forecast_dt.month,
            'is_weekend': 1 if forecast_dt.dayofweek >= 5 else 0,
        }
        
        # Lag features from history
        if len(history_df) >= 7:
            features['lag_7'] = history_df.iloc[-7]['quantity']
        else:
            features['lag_7'] = history_df['quantity'].mean()
        
        if len(history_df) >= 14:
            features['lag_14'] = history_df.iloc[-14]['quantity']
        else:
            features['lag_14'] = history_df['quantity'].mean()
        
        if len(history_df) >= 30:
            features['lag_30'] = history_df.iloc[-30]['quantity']
        else:
            features['lag_30'] = history_df['quantity'].mean()
        
        # Rolling statistics
        features['rolling_mean_7'] = history_df.tail(7)['quantity'].mean()
        features['rolling_mean_14'] = history_df.tail(14)['quantity'].mean()
        features['rolling_std_7'] = history_df.tail(7)['quantity'].std()
        if pd.isna(features['rolling_std_7']):
            features['rolling_std_7'] = 0
        
        # Festival features
        features['is_festival'] = 0
        features['festival_multiplier'] = 1.0
        
        if festivals:
            for festival in festivals:
                festival_date = pd.to_datetime(festival['date']).date()
                if abs((festival_date - forecast_date).days) <= 2:
                    features['is_festival'] = 1
                    features['festival_multiplier'] = festival.get('demand_multiplier', 1.2)
        
        return pd.DataFrame([features])
    
    def _generate_fallback_forecast(self, horizon: int) -> List[Dict]:
        """Generate simple fallback forecast when XGBoost fails."""
        today = datetime.now().date()
        forecast_points = []
        for day in range(1, horizon + 1):
            forecast_date = today + timedelta(days=day)
            forecast_points.append({
                'date': forecast_date.strftime('%Y-%m-%d'),
                'demand': 0.0
            })
        return forecast_points
