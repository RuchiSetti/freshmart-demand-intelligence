'use client';

import React, { createContext, useContext, useState } from 'react';
import { mockStores, InventoryPreferences } from './data';

interface StoreContextType {
  currentStore: typeof mockStores[0];
  setCurrentStore: (store: typeof mockStores[0]) => void;
  allStores: typeof mockStores;
  updateInventoryPreferences: (preferences: InventoryPreferences) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentStore, setCurrentStore] = useState(mockStores[0]);

  const updateInventoryPreferences = (preferences: InventoryPreferences) => {
    const updatedStore = {
      ...currentStore,
      inventoryPreferences: preferences,
    };
    setCurrentStore(updatedStore);
  };

  return (
    <StoreContext.Provider value={{ 
      currentStore, 
      setCurrentStore, 
      allStores: mockStores,
      updateInventoryPreferences 
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
