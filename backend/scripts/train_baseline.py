"""
Train baseline forecasting model.
This script calculates simple moving average parameters.
"""
import pickle
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from app.config import settings

def train_baseline():
    """
    Train baseline model (just save configuration/parameters).
    Baseline uses moving averages, so no actual training needed.
    """
    print("=" * 60)
    print("[INFO] Training Baseline Model")
    print("=" * 60)
    
    # Baseline parameters
    params = {
        'window_sizes': [7, 14, 30],
        'method': 'weighted_moving_average',
        'description': 'Simple moving average baseline with multiple windows'
    }
    
    # Save parameters
    output_file = settings.MODELS_CACHE_DIR / "baseline_params.pkl"
    with open(output_file, 'wb') as f:
        pickle.dump(params, f)
    
    print(f"[OK] Baseline parameters saved to: {output_file}")
    print(f"  Window sizes: {params['window_sizes']}")
    print(f"  Method: {params['method']}")
    print("=" * 60)
    print("[SUCCESS] Baseline model training complete!")
    print("=" * 60)

if __name__ == "__main__":
    train_baseline()
