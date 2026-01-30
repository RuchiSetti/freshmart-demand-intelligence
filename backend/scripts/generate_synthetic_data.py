"""
Generate realistic synthetic data for Indian retail (FreshMart context).
Creates: products, stores, sales transactions, inventory, and festival calendar.
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path

# Set random seed for reproducibility
np.random.seed(42)

# Paths
DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

# ============================================================================
# Products Catalog
# ============================================================================

CATEGORIES = {
    "Grains": ["Basmati Rice 5kg", "Sona Masoori Rice 10kg", "Wheat Flour 5kg", "Whole Wheat Atta 10kg"],
    "Pulses": ["Toor Dal 1kg", "Moong Dal 1kg", "Chana Dal 1kg", "Masoor Dal 500g"],
    "Dairy": ["Full Cream Milk 1L", "Toned Milk 1L", "Curd 400g", "Paneer 200g", "Butter 100g"],
    "Cooking Oils": ["Sunflower Oil 1L", "Mustard Oil 1L", "Groundnut Oil 1L", "Coconut Oil 500ml"],
    "Spices": ["Turmeric Powder 100g", "Red Chilli Powder 100g", "Coriander Powder 100g", "Garam Masala 50g"],
    "Snacks": ["Potato Chips 50g", "Namkeen Mix 200g", "Biscuits Pack", "Cookies Pack"],
    "Beverages": ["Tea Powder 250g", "Coffee Powder 200g", "Cold Drink 1.5L", "Juice 1L"],
    "Personal Care": ["Soap 100g", "Shampoo 200ml", "Toothpaste 100g", "Face Wash 50ml"],
    "Household": ["Detergent 1kg", "Dishwash Liquid 500ml", "Floor Cleaner 1L", "Toilet Cleaner 500ml"],
    "Frozen": ["Frozen Peas 500g", "Frozen Mixed Veg 400g", "Ice Cream 1L", "Frozen Paneer 200g"],
}

products_data = []
product_id = 100

for category, items in CATEGORIES.items():
    for item_name in items:
        product_id += 1
        # Assign realistic prices and shelf life
        if category in ["Dairy", "Frozen"]:
            shelf_life = np.random.randint(7, 21)  # Perishable
            unit_price = np.random.uniform(20, 150)
        elif category in ["Grains", "Pulses", "Cooking Oils"]:
            shelf_life = np.random.randint(180, 365)  # Long shelf life
            unit_price = np.random.uniform(50, 500)
        else:
            shelf_life = np.random.randint(90, 180)
            unit_price = np.random.uniform(10, 200)
        
        products_data.append({
            "product_id": f"P{product_id}",
            "name": item_name,
            "category": category,
            "shelf_life_days": shelf_life,
            "unit_price": round(unit_price, 2)
        })

products_df = pd.DataFrame(products_data)
print(f"[OK] Generated {len(products_df)} products")

# ============================================================================
# Stores Master
# ============================================================================

stores_data = [
    {"store_id": "S01", "name": "FreshMart Delhi Central", "city": "Delhi", "state": "Delhi", "region": "North"},
    {"store_id": "S02", "name": "FreshMart Mumbai West", "city": "Mumbai", "state": "Maharashtra", "region": "West"},
    {"store_id": "S03", "name": "FreshMart Bangalore South", "city": "Bangalore", "state": "Karnataka", "region": "South"},
    {"store_id": "S04", "name": "FreshMart Kolkata East", "city": "Kolkata", "state": "West Bengal", "region": "East"},
    {"store_id": "S05", "name": "FreshMart Chennai Marina", "city": "Chennai", "state": "Tamil Nadu", "region": "South"},
    {"store_id": "S06", "name": "FreshMart Pune Camp", "city": "Pune", "state": "Maharashtra", "region": "West"},
    {"store_id": "S07", "name": "FreshMart Hyderabad Hitech", "city": "Hyderabad", "state": "Telangana", "region": "South"},
    {"store_id": "S08", "name": "FreshMart Ahmedabad CG", "city": "Ahmedabad", "state": "Gujarat", "region": "West"},
    {"store_id": "S09", "name": "FreshMart Jaipur Pink", "city": "Jaipur", "state": "Rajasthan", "region": "North"},
    {"store_id": "S10", "name": "FreshMart Lucknow Hazrat", "city": "Lucknow", "state": "Uttar Pradesh", "region": "North"},
]

stores_df = pd.DataFrame(stores_data)
print(f"[OK] Generated {len(stores_df)} stores")

# ============================================================================
# Festival Calendar (India)
# ============================================================================

festivals_data = [
    # 2025
    {"date": "2025-08-15", "festival_name": "Independence Day", "region": "All", "demand_multiplier": 1.3},
    {"date": "2025-08-27", "festival_name": "Ganesh Chaturthi", "region": "West", "demand_multiplier": 1.5},
    {"date": "2025-10-02", "festival_name": "Gandhi Jayanti", "region": "All", "demand_multiplier": 1.2},
    {"date": "2025-10-12", "festival_name": "Dussehra", "region": "All", "demand_multiplier": 1.6},
    {"date": "2025-10-31", "festival_name": "Diwali", "region": "All", "demand_multiplier": 2.0},
    {"date": "2025-11-15", "festival_name": "Guru Nanak Jayanti", "region": "North", "demand_multiplier": 1.4},
    {"date": "2025-12-25", "festival_name": "Christmas", "region": "All", "demand_multiplier": 1.5},
    
    # 2026
    {"date": "2026-01-14", "festival_name": "Makar Sankranti", "region": "All", "demand_multiplier": 1.4},
    {"date": "2026-01-26", "festival_name": "Republic Day", "region": "All", "demand_multiplier": 1.3},
    {"date": "2026-03-14", "festival_name": "Holi", "region": "North", "demand_multiplier": 1.7},
    {"date": "2026-04-02", "festival_name": "Eid al-Fitr", "region": "All", "demand_multiplier": 1.6},
    {"date": "2026-04-21", "festival_name": "Ram Navami", "region": "North", "demand_multiplier": 1.3},
    {"date": "2026-08-15", "festival_name": "Independence Day", "region": "All", "demand_multiplier": 1.3},
]

festivals_df = pd.DataFrame(festivals_data)
festivals_df['date'] = pd.to_datetime(festivals_df['date'])
print(f"[OK] Generated {len(festivals_df)} festival dates")

# ============================================================================
# Sales Transactions (6 months history)
# ============================================================================

# Date range: 6 months back from today
end_date = datetime.now().date()
start_date = end_date - timedelta(days=180)
date_range = pd.date_range(start=start_date, end=end_date, freq='D')

sales_data = []

for single_date in date_range:
    day_of_week = single_date.dayofweek  # 0=Monday, 6=Sunday
    
    # Check if festival
    festival_multiplier = 1.0
    for _, festival in festivals_df.iterrows():
        if abs((festival['date'].date() - single_date.date()).days) <= 2:  # 2 days before/after
            festival_multiplier = max(festival_multiplier, festival['demand_multiplier'])
    
    # Weekend boost
    weekend_multiplier = 1.3 if day_of_week >= 5 else 1.0
    
    # Generate sales for each product-store combination (sample ~30% of combinations)
    for _, product in products_df.iterrows():
        for _, store in stores_df.iterrows():
            # Not all products sold at all stores every day
            if np.random.random() > 0.3:
                continue
            
            # Base demand depends on category
            if product['category'] in ["Grains", "Dairy", "Cooking Oils"]:
                base_demand = np.random.uniform(20, 60)
            elif product['category'] in ["Pulses", "Spices"]:
                base_demand = np.random.uniform(10, 40)
            else:
                base_demand = np.random.uniform(5, 30)
            
            # Apply multipliers + some randomness
            quantity = base_demand * festival_multiplier * weekend_multiplier * np.random.uniform(0.7, 1.3)
            quantity = max(1, int(quantity))  # At least 1 unit
            
            revenue = quantity * product['unit_price']
            
            sales_data.append({
                "date": single_date.strftime("%Y-%m-%d"),
                "product_id": product['product_id'],
                "store_id": store['store_id'],
                "quantity": quantity,
                "revenue": round(revenue, 2)
            })

sales_df = pd.DataFrame(sales_data)
print(f"[OK] Generated {len(sales_df)} sales transactions")

# ============================================================================
# Inventory (Current Stock Levels)
# ============================================================================

inventory_data = []

for _, product in products_df.iterrows():
    for _, store in stores_df.iterrows():
        # Calculate avg daily sales for this product-store
        product_store_sales = sales_df[
            (sales_df['product_id'] == product['product_id']) &
            (sales_df['store_id'] == store['store_id'])
        ]
        
        if len(product_store_sales) > 0:
            avg_daily_sales = product_store_sales['quantity'].mean()
            
            # Current stock: randomly between 3-30 days of inventory
            days_of_stock = np.random.uniform(3, 30)
            current_stock = int(avg_daily_sales * days_of_stock)
            current_stock = max(5, current_stock)  # At least 5 units
            
            inventory_data.append({
                "product_id": product['product_id'],
                "store_id": store['store_id'],
                "current_stock": current_stock,
                "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })

inventory_df = pd.DataFrame(inventory_data)
print(f"[OK] Generated {len(inventory_df)} inventory records")

# ============================================================================
# Save all to CSV
# ============================================================================

products_df.to_csv(DATA_DIR / "products.csv", index=False)
stores_df.to_csv(DATA_DIR / "stores.csv", index=False)
festivals_df.to_csv(DATA_DIR / "festivals.csv", index=False)
sales_df.to_csv(DATA_DIR / "sales_transactions.csv", index=False)
inventory_df.to_csv(DATA_DIR / "inventory.csv", index=False)

print("\n" + "="*60)
print("[SUCCESS] ALL DATA GENERATED SUCCESSFULLY!")
print("="*60)
print(f"Location: {DATA_DIR}")
print(f"Products: {len(products_df)}")
print(f"Stores: {len(stores_df)}")
print(f"Festivals: {len(festivals_df)}")
print(f"Sales Transactions: {len(sales_df)}")
print(f"Inventory Records: {len(inventory_df)}")
print("="*60)
