"""
Data loader module - loads all CSV data into memory at startup.
Provides singleton access to data throughout the application.
"""
import pandas as pd
from pathlib import Path
from typing import Optional, List, Dict
from datetime import datetime, date
from .config import settings


class DataLoader:
    """
    Singleton data loader - loads all CSV files once and caches in memory.
    This ensures fast API response times without repeated disk I/O.
    """
    
    _instance = None
    _initialized = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Load all data on first initialization."""
        if not DataLoader._initialized:
            self._load_data()
            DataLoader._initialized = True
    
    def _load_data(self):
        """Load all CSV files into pandas DataFrames."""
        data_dir = settings.DATA_DIR
        
        # Load products
        self.products = pd.read_csv(data_dir / "products.csv")
        print(f"[OK] Loaded {len(self.products)} products")
        
        # Load stores
        self.stores = pd.read_csv(data_dir / "stores.csv")
        print(f"[OK] Loaded {len(self.stores)} stores")
        
        # Load sales transactions
        self.sales = pd.read_csv(data_dir / "sales_transactions.csv")
        self.sales['date'] = pd.to_datetime(self.sales['date'])
        print(f"[OK] Loaded {len(self.sales)} sales transactions")
        
        # Load inventory
        self.inventory = pd.read_csv(data_dir / "inventory.csv")
        self.inventory['last_updated'] = pd.to_datetime(self.inventory['last_updated'])
        print(f"[OK] Loaded {len(self.inventory)} inventory records")
        
        # Load festivals
        self.festivals = pd.read_csv(data_dir / "festivals.csv")
        self.festivals['date'] = pd.to_datetime(self.festivals['date'])
        print(f"[OK] Loaded {len(self.festivals)} festival dates")
        
        print("=" * 60)
        print("[SUCCESS] ALL DATA LOADED INTO MEMORY")
        print("=" * 60)
    
    # ========================================================================
    # Query Helpers
    # ========================================================================
    
    def get_product(self, product_id: str) -> Optional[Dict]:
        """Get product details by ID."""
        result = self.products[self.products['product_id'] == product_id]
        if len(result) == 0:
            return None
        return result.iloc[0].to_dict()
    
    def get_store(self, store_id: str) -> Optional[Dict]:
        """Get store details by ID."""
        result = self.stores[self.stores['store_id'] == store_id]
        if len(result) == 0:
            return None
        return result.iloc[0].to_dict()
    
    def get_products_list(self, store_id: Optional[str] = None, category: Optional[str] = None) -> List[Dict]:
        """Get list of products with optional filters."""
        filtered = self.products.copy()
        
        if category:
            filtered = filtered[filtered['category'] == category]
        
        # Join with inventory if store_id specified
        if store_id:
            inv = self.inventory[self.inventory['store_id'] == store_id]
            filtered = filtered.merge(inv[['product_id', 'current_stock']], on='product_id', how='left')
            filtered['current_stock'] = filtered['current_stock'].fillna(0).astype(int)
            filtered['store_id'] = store_id
        
        return filtered.to_dict('records')
    
    def get_current_stock(self, product_id: str, store_id: str) -> int:
        """Get current stock for a product at a store."""
        result = self.inventory[
            (self.inventory['product_id'] == product_id) &
            (self.inventory['store_id'] == store_id)
        ]
        if len(result) == 0:
            return 0
        return int(result.iloc[0]['current_stock'])
    
    def get_sales_history(
        self, 
        product_id: str, 
        store_id: str, 
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> pd.DataFrame:
        """Get sales history for a product-store combination."""
        filtered = self.sales[
            (self.sales['product_id'] == product_id) &
            (self.sales['store_id'] == store_id)
        ].copy()
        
        if start_date:
            filtered = filtered[filtered['date'] >= pd.Timestamp(start_date)]
        if end_date:
            filtered = filtered[filtered['date'] <= pd.Timestamp(end_date)]
        
        return filtered.sort_values('date')
    
    def get_avg_daily_sales(self, product_id: str, store_id: str, days: int = 30) -> float:
        """Calculate average daily sales for a product-store."""
        from datetime import timedelta
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        
        history = self.get_sales_history(product_id, store_id, start_date, end_date)
        
        if len(history) == 0:
            return 0.0
        
        return float(history['quantity'].mean())
    
    def get_total_sales_revenue(
        self, 
        store_id: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> float:
        """Calculate total sales revenue with optional filters."""
        filtered = self.sales.copy()
        
        if store_id:
            filtered = filtered[filtered['store_id'] == store_id]
        if start_date:
            filtered = filtered[filtered['date'] >= pd.Timestamp(start_date)]
        if end_date:
            filtered = filtered[filtered['date'] <= pd.Timestamp(end_date)]
        
        return float(filtered['revenue'].sum())
    
    def get_upcoming_festivals(self, days_ahead: int = 30) -> List[Dict]:
        """Get upcoming festivals within specified days."""
        today = pd.Timestamp(datetime.now().date())
        future_date = today + pd.Timedelta(days=days_ahead)
        
        upcoming = self.festivals[
            (self.festivals['date'] >= today) &
            (self.festivals['date'] <= future_date)
        ]
        
        return upcoming.to_dict('records')
    
    def is_festival_nearby(self, target_date: date, window_days: int = 3) -> Optional[Dict]:
        """Check if there's a festival within window_days of target_date."""
        target = pd.Timestamp(target_date)
        
        for _, festival in self.festivals.iterrows():
            days_diff = abs((festival['date'] - target).days)
            if days_diff <= window_days:
                return festival.to_dict()
        
        return None


# Global singleton instance
_data_loader_instance = None

def get_data_loader() -> DataLoader:
    """Get the global DataLoader instance."""
    global _data_loader_instance
    if _data_loader_instance is None:
        _data_loader_instance = DataLoader()
    return _data_loader_instance
