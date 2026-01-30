"""
Model Manager - orchestrates model selection, loading, and inference.
Provides unified interface for all forecasting models with auto-fallback.
"""
from pathlib import Path
from typing import List, Dict, Optional
import pandas as pd
import json
from datetime import datetime, timezone

from .baseline_model import BaselineModel
from .prophet_model import ProphetModel
from .xgboost_model import XGBoostModel
from ..config import settings
from ..data_loader import get_data_loader


class ModelManager:
    """
    Manages all forecasting models with auto-fallback logic:
    XGBoost → Prophet → Baseline
    """
    
    _instance = None
    _initialized = False
    
    def __new__(cls):
        """Singleton pattern."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize and load all models on first instantiation."""
        if not ModelManager._initialized:
            self._load_models()
            ModelManager._initialized = True
    
    def _load_models(self):
        """Load all available models from cache."""
        cache_path = settings.MODELS_CACHE_DIR
        
        print("=" * 60)
        print("[INFO] Loading ML models...")
        print("=" * 60)
        
        # Initialize models
        self.baseline = BaselineModel()
        self.prophet = ProphetModel()
        self.xgboost = XGBoostModel()
        
        # Try to load each model
        self.baseline_loaded = self.baseline.load(cache_path)
        self.prophet_loaded = self.prophet.load(cache_path)
        self.xgboost_loaded = self.xgboost.load(cache_path)

        # Model metadata / versioning (best-effort, backward compatible)
        self._manifest_path = cache_path / "model_manifest.json"
        self._manifest_mtime = self._manifest_path.stat().st_mtime if self._manifest_path.exists() else None
        self._model_metadata = self._load_manifest() if self._manifest_path.exists() else self._default_metadata()
        
        print("=" * 60)
        print(f"[INFO] Models Status:")
        print(f"  Baseline: {'READY' if self.baseline_loaded else 'NOT AVAILABLE'}")
        print(f"  Prophet: {'READY' if self.prophet_loaded else 'NOT AVAILABLE'}")
        print(f"  XGBoost: {'READY' if self.xgboost_loaded else 'NOT AVAILABLE'}")
        print("=" * 60)
        
        # Data loader reference
        self.data_loader = get_data_loader()

    def _default_metadata(self) -> Dict:
        now = datetime.now(timezone.utc).isoformat()
        return {
            "baseline": {"version": "1", "trained_on": None, "loaded_at": now},
            "prophet": {"version": "1", "trained_on": None, "loaded_at": now},
            "xgboost": {"version": "1", "trained_on": None, "loaded_at": now},
        }

    def _load_manifest(self) -> Dict:
        try:
            data = json.loads(self._manifest_path.read_text(encoding="utf-8"))
            # minimal validation
            if not isinstance(data, dict):
                return self._default_metadata()
            return data
        except Exception:
            return self._default_metadata()

    def reload_if_changed(self) -> None:
        """
        Reload models without restart if manifest or cache changes.
        This is intentionally lightweight (case-study friendly).
        """
        try:
            if not self._manifest_path.exists():
                return
            mtime = self._manifest_path.stat().st_mtime
            if self._manifest_mtime is None or mtime > self._manifest_mtime:
                self._load_models()
        except Exception:
            # never break inference due to reload
            return

    def is_ready(self) -> bool:
        return bool(self.baseline_loaded or self.prophet_loaded or self.xgboost_loaded)

    def get_status(self) -> Dict:
        return {
            "baseline": {"loaded": bool(self.baseline_loaded), "meta": self._model_metadata.get("baseline", {})},
            "prophet": {"loaded": bool(self.prophet_loaded), "meta": self._model_metadata.get("prophet", {})},
            "xgboost": {"loaded": bool(self.xgboost_loaded), "meta": self._model_metadata.get("xgboost", {})},
        }
    
    def get_forecast(
        self,
        product_id: str,
        store_id: str,
        horizon: int = 7,
        model_type: Optional[str] = None
    ) -> Dict:
        """
        Get forecast for a product-store combination.
        
        Args:
            product_id: Product ID
            store_id: Store ID
            horizon: Number of days to forecast
            model_type: Optional model override ('baseline', 'prophet', 'xgboost')
                       If None, uses config default with auto-fallback
        
        Returns:
            Dict with 'forecast' (list of points) and 'model_used' (string)
        """
        # Support reload without restart (manifest-based)
        self.reload_if_changed()

        # Get sales history
        sales_history = self.data_loader.get_sales_history(product_id, store_id)
        
        # Get upcoming festivals
        festivals = self.data_loader.get_upcoming_festivals(days_ahead=horizon + 30)
        
        # Determine which model to use
        if model_type is None:
            model_type = settings.MODEL_TYPE
        
        forecast_points = []
        model_used = "baseline"
        
        # Try requested model with fallback logic
        if model_type == "xgboost" and self.xgboost_loaded:
            forecast_points = self.xgboost.predict(
                product_id, store_id, sales_history, horizon, festivals
            )
            if forecast_points and len(forecast_points) > 0:
                model_used = "xgboost"
        
        # Fallback to Prophet
        if (not forecast_points or len(forecast_points) == 0) and self.prophet_loaded:
            forecast_points = self.prophet.predict(
                product_id, store_id, sales_history, horizon, festivals
            )
            if forecast_points and len(forecast_points) > 0:
                model_used = "prophet"
        
        # Final fallback to Baseline
        if not forecast_points or len(forecast_points) == 0:
            forecast_points = self.baseline.predict(
                product_id, store_id, sales_history, horizon
            )
            model_used = "baseline"
        
        return {
            'forecast': forecast_points,
            'model_used': model_used
        }


# Global singleton instance
_model_manager_instance = None

def get_model_manager() -> ModelManager:
    """Get the global ModelManager instance."""
    global _model_manager_instance
    if _model_manager_instance is None:
        _model_manager_instance = ModelManager()
    return _model_manager_instance
