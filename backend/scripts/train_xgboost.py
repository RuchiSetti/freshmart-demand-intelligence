"""
Train XGBoost regression model for demand forecasting.
Uses feature engineering with lags, rolling stats, and seasonality.
"""
import pickle
import sys
from pathlib import Path
import pandas as pd
import numpy as np

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from app.config import settings
from app.data_loader import DataLoader

try:
    import xgboost as xgb
    from sklearn.model_selection import train_test_split
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False
    print("[ERROR] XGBoost or scikit-learn not installed")
    sys.exit(1)


def create_features(df: pd.DataFrame, festivals_df: pd.DataFrame) -> pd.DataFrame:
    """Create features for XGBoost training."""
    df = df.copy()
    df['date'] = pd.to_datetime(df['date'])
    
    # Sort by date
    df = df.sort_values('date')
    
    # Date features
    df['day_of_week'] = df['date'].dt.dayofweek
    df['day_of_month'] = df['date'].dt.day
    df['month'] = df['date'].dt.month
    df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
    
    # Lag features (previous week, 2 weeks, month)
    df['lag_7'] = df['quantity'].shift(7)
    df['lag_14'] = df['quantity'].shift(14)
    df['lag_30'] = df['quantity'].shift(30)
    
    # Rolling statistics
    df['rolling_mean_7'] = df['quantity'].rolling(window=7, min_periods=1).mean()
    df['rolling_mean_14'] = df['quantity'].rolling(window=14, min_periods=1).mean()
    df['rolling_std_7'] = df['quantity'].rolling(window=7, min_periods=1).std()
    
    # Festival features
    df['is_festival'] = 0
    df['festival_multiplier'] = 1.0
    
    festivals_df['date'] = pd.to_datetime(festivals_df['date'])
    
    for _, festival_row in festivals_df.iterrows():
        festival_date = festival_row['date']
        # Mark 2 days before and after festival
        mask = (df['date'] >= festival_date - pd.Timedelta(days=2)) & \
               (df['date'] <= festival_date + pd.Timedelta(days=2))
        df.loc[mask, 'is_festival'] = 1
        df.loc[mask, 'festival_multiplier'] = festival_row['demand_multiplier']
    
    # Fill NaN values
    df = df.fillna(method='bfill').fillna(method='ffill').fillna(0)
    
    return df


def train_xgboost_model():
    """Train XGBoost model on all product-store combinations."""
    if not XGBOOST_AVAILABLE:
        print("[ERROR] Cannot train XGBoost model - library not installed")
        return
    
    print("=" * 60)
    print("[INFO] Training XGBoost Model")
    print("=" * 60)
    
    # Load data
    data_loader = DataLoader()
    sales_df = data_loader.sales.copy()
    festivals_df = data_loader.festivals.copy()
    
    # Aggregate sales by date (global model across all products)
    daily_sales = sales_df.groupby('date').agg({'quantity': 'sum'}).reset_index()
    
    print(f"[INFO] Total sales records: {len(daily_sales)}")
    print(f"[INFO] Date range: {daily_sales['date'].min()} to {daily_sales['date'].max()}")
    
    # Create features
    print("[INFO] Creating features...")
    df_features = create_features(daily_sales, festivals_df)
    
    # Define feature columns
    feature_cols = [
        'day_of_week', 'day_of_month', 'month', 'is_weekend',
        'lag_7', 'lag_14', 'lag_30',
        'rolling_mean_7', 'rolling_mean_14', 'rolling_std_7',
        'is_festival', 'festival_multiplier'
    ]
    
    # Remove rows with NaN (from lag features)
    df_clean = df_features.dropna()
    print(f"[INFO] Training samples after cleaning: {len(df_clean)}")
    
    # Prepare X and y
    X = df_clean[feature_cols]
    y = df_clean['quantity']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, shuffle=False  # Time-series: no shuffle
    )
    
    print(f"[INFO] Training set: {len(X_train)} samples")
    print(f"[INFO] Test set: {len(X_test)} samples")
    
    # Train XGBoost model
    print("[INFO] Training XGBoost...")
    
    model = xgb.XGBRegressor(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        objective='reg:squarederror',
        random_state=42,
        verbosity=0
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    print(f"[OK] Training R² score: {train_score:.4f}")
    print(f"[OK] Test R² score: {test_score:.4f}")
    
    # Save model and feature columns
    output_data = {
        'model': model,
        'feature_cols': feature_cols,
        'train_score': train_score,
        'test_score': test_score
    }
    
    output_file = settings.MODELS_CACHE_DIR / "xgboost_demand.pkl"
    with open(output_file, 'wb') as f:
        pickle.dump(output_data, f)
    
    print(f"[OK] Model saved to: {output_file}")
    
    # Feature importance
    print("\n[INFO] Top 5 Important Features:")
    importances = model.feature_importances_
    feature_importance = list(zip(feature_cols, importances))
    feature_importance.sort(key=lambda x: x[1], reverse=True)
    
    for feat, importance in feature_importance[:5]:
        print(f"  {feat}: {importance:.4f}")
    
    print()
    print("=" * 60)
    print("[SUCCESS] XGBoost training complete!")
    print("=" * 60)


if __name__ == "__main__":
    train_xgboost_model()
