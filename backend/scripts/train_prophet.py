"""
Train Prophet time-series models for top product-store combinations.
Prophet captures trend + seasonality + festival effects.
"""
import pickle
import sys
from pathlib import Path
import pandas as pd

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from app.config import settings
from app.data_loader import DataLoader

try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False
    print("[ERROR] Prophet not installed. Install with: pip install prophet")
    sys.exit(1)


def train_prophet_models(top_n: int = 20):
    """
    Train Prophet models for top N product-store combinations.
    
    Args:
        top_n: Number of top-selling product-store combinations to train
    """
    if not PROPHET_AVAILABLE:
        print("[ERROR] Cannot train Prophet models - library not installed")
        return
    
    print("=" * 60)
    print("[INFO] Training Prophet Models")
    print("=" * 60)
    
    # Load data
    data_loader = DataLoader()
    sales_df = data_loader.sales.copy()
    festivals_df = data_loader.festivals.copy()
    
    # Find top N product-store combinations by total sales
    top_combos = (
        sales_df.groupby(['product_id', 'store_id'])
        .agg({'quantity': 'sum', 'revenue': 'sum'})
        .sort_values('revenue', ascending=False)
        .head(top_n)
        .reset_index()
    )
    
    print(f"[INFO] Training models for top {len(top_combos)} product-store combinations")
    print()
    
    # Prepare festivals as holidays
    holidays_df = festivals_df[['date', 'festival_name']].copy()
    holidays_df.columns = ['ds', 'holiday']
    
    trained_count = 0
    
    for idx, row in top_combos.iterrows():
        product_id = row['product_id']
        store_id = row['store_id']
        
        print(f"[{idx+1}/{len(top_combos)}] Training: {product_id} at {store_id}")
        
        # Get sales history for this combination
        history = sales_df[
            (sales_df['product_id'] == product_id) &
            (sales_df['store_id'] == store_id)
        ].copy()
        
        # Aggregate by date (Prophet requires one row per date)
        history = history.groupby('date').agg({'quantity': 'sum'}).reset_index()
        history.columns = ['ds', 'y']
        
        # Skip if not enough data
        if len(history) < 30:
            print(f"  [SKIP] Not enough data (need at least 30 days)")
            continue
        
        try:
            # Initialize Prophet model
            model = Prophet(
                holidays=holidays_df,
                daily_seasonality=False,
                weekly_seasonality=True,
                yearly_seasonality=True,
                seasonality_mode='multiplicative',
                changepoint_prior_scale=0.05
            )
            
            # Fit model
            model.fit(history, verbose=False)
            
            # Save model
            output_file = settings.MODELS_CACHE_DIR / f"prophet_{product_id}_{store_id}.pkl"
            with open(output_file, 'wb') as f:
                pickle.dump(model, f)
            
            print(f"  [OK] Model saved to: prophet_{product_id}_{store_id}.pkl")
            trained_count += 1
            
        except Exception as e:
            print(f"  [ERROR] Training failed: {e}")
            continue
    
    print()
    print("=" * 60)
    print(f"[SUCCESS] Prophet training complete!")
    print(f"  Models trained: {trained_count}")
    print(f"  Location: {settings.MODELS_CACHE_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    train_prophet_models(top_n=20)
