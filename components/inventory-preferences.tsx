'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle, Package, Truck, Shield, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store-context';
import { InventoryPreferences } from '@/lib/data';

interface InventoryPreferencesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InventoryPreferencesPanel({ isOpen, onClose }: InventoryPreferencesProps) {
  const { currentStore, updateInventoryPreferences } = useStore();
  const [preferences, setPreferences] = useState<InventoryPreferences>(
    currentStore.inventoryPreferences || {
      lowStockThreshold: 10,
      autoReorderEnabled: true,
      autoReorderThreshold: 20,
      autoReorderQuantity: 50,
      productPriority: 'fast-moving',
      preferredSupplier: 'FreshMart Central Supply',
      deliveryFrequency: 'weekly',
      overstockProtection: true,
      maxStockLimit: 500,
      categoryRules: {
        fruits: { enabled: true, threshold: 15, maxStock: 200 },
        frozen: { enabled: true, threshold: 25, maxStock: 300 },
        snacks: { enabled: true, threshold: 30, maxStock: 400 },
        dairy: { enabled: true, threshold: 12, maxStock: 250 },
        produce: { enabled: true, threshold: 18, maxStock: 350 },
        bakery: { enabled: true, threshold: 20, maxStock: 180 },
      },
    }
  );

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (currentStore.inventoryPreferences) {
      setPreferences(currentStore.inventoryPreferences);
    }
  }, [currentStore.inventoryPreferences]);

  const handleSave = () => {
    updateInventoryPreferences(preferences);
    setHasChanges(false);
    // Show success message or toast here
  };

  const updatePreference = (key: keyof InventoryPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateCategoryRule = (category: keyof InventoryPreferences['categoryRules'], field: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      categoryRules: {
        ...prev.categoryRules,
        [category]: {
          ...prev.categoryRules[category],
          [field]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  if (!isOpen) return null;

  const categoryIcons = {
    fruits: '🥭',
    frozen: '❄️',
    snacks: '🧃',
    dairy: '🥛',
    produce: '🥬',
    bakery: '🍞',
  };

  const categoryNames = {
    fruits: 'Fruits',
    frozen: 'Frozen Items',
    snacks: 'Snacks',
    dairy: 'Dairy',
    produce: 'Produce',
    bakery: 'Bakery',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Inventory Preferences Panel */}
      <div className="fixed right-0 top-0 h-screen z-50 w-full max-w-2xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center gap-3">
            <Settings2 className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">Inventory Preferences</h2>
              <p className="text-sm text-muted-foreground">{currentStore.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                Unsaved Changes
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Low Stock Alert Threshold */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Low Stock Alert Threshold
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Set when alerts should trigger to prevent stockouts
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="lowStockThreshold" className="min-w-0 flex-1">
                  Alert when stock drops below:
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={preferences.lowStockThreshold}
                    onChange={(e) => updatePreference('lowStockThreshold', parseInt(e.target.value))}
                    className="w-20"
                    min="1"
                  />
                  <span className="text-sm text-muted-foreground">units</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auto-Reorder Rules */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="w-5 h-5 text-blue-500" />
                Auto-Reorder Rules
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Automate ordering to save time and reduce manual work
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoReorderEnabled">Enable Auto-Reorder</Label>
                <Switch
                  id="autoReorderEnabled"
                  checked={preferences.autoReorderEnabled}
                  onCheckedChange={(checked) => updatePreference('autoReorderEnabled', checked)}
                />
              </div>
              
              {preferences.autoReorderEnabled && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="autoReorderThreshold">Reorder when stock drops below:</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="autoReorderThreshold"
                          type="number"
                          value={preferences.autoReorderThreshold}
                          onChange={(e) => updatePreference('autoReorderThreshold', parseInt(e.target.value))}
                          className="w-20"
                          min="1"
                        />
                        <span className="text-sm text-muted-foreground">units</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="autoReorderQuantity">Order quantity:</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="autoReorderQuantity"
                          type="number"
                          value={preferences.autoReorderQuantity}
                          onChange={(e) => updatePreference('autoReorderQuantity', parseInt(e.target.value))}
                          className="w-20"
                          min="1"
                        />
                        <span className="text-sm text-muted-foreground">units</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Product Priority */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings2 className="w-5 h-5 text-purple-500" />
                Product Priority Focus
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose which products to prioritize for better demand accuracy
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="productPriority">Priority Focus:</Label>
                <Select
                  value={preferences.productPriority}
                  onValueChange={(value) => updatePreference('productPriority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fast-moving">Fast-moving items (milk, bread)</SelectItem>
                    <SelectItem value="seasonal">Seasonal items</SelectItem>
                    <SelectItem value="premium">Premium items</SelectItem>
                    <SelectItem value="all">All products equally</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Supplier & Delivery Preferences */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Truck className="w-5 h-5 text-green-500" />
                Supplier & Delivery Preferences
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure supplier and delivery settings for better logistics
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preferredSupplier">Preferred Supplier:</Label>
                <Select
                  value={preferences.preferredSupplier}
                  onValueChange={(value) => updatePreference('preferredSupplier', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FreshMart Central Supply">FreshMart Central Supply</SelectItem>
                    <SelectItem value="Regional Fresh Foods">Regional Fresh Foods</SelectItem>
                    <SelectItem value="Local Organic Suppliers">Local Organic Suppliers</SelectItem>
                    <SelectItem value="Premium Food Distributors">Premium Food Distributors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deliveryFrequency">Delivery Frequency:</Label>
                <Select
                  value={preferences.deliveryFrequency}
                  onValueChange={(value) => updatePreference('deliveryFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Overstock Protection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="w-5 h-5 text-red-500" />
                Overstock Protection
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Prevent ordering too much to reduce waste and warehouse crowding
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="overstockProtection">Enable Overstock Protection</Label>
                <Switch
                  id="overstockProtection"
                  checked={preferences.overstockProtection}
                  onCheckedChange={(checked) => updatePreference('overstockProtection', checked)}
                />
              </div>
              
              {preferences.overstockProtection && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="maxStockLimit">Maximum stock limit per item:</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="maxStockLimit"
                        type="number"
                        value={preferences.maxStockLimit}
                        onChange={(e) => updatePreference('maxStockLimit', parseInt(e.target.value))}
                        className="w-24"
                        min="1"
                      />
                      <span className="text-sm text-muted-foreground">units</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Category-Level Rules */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="w-5 h-5 text-indigo-500" />
                Category-Level Rules
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Set different rules for different product categories for smarter management
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(preferences.categoryRules).map(([category, rules]) => (
                <div key={category} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                      <Label className="font-medium">
                        {categoryNames[category as keyof typeof categoryNames]}
                      </Label>
                    </div>
                    <Switch
                      checked={rules.enabled}
                      onCheckedChange={(checked) => updateCategoryRule(category as keyof InventoryPreferences['categoryRules'], 'enabled', checked)}
                    />
                  </div>
                  
                  {rules.enabled && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Alert Threshold</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={rules.threshold}
                            onChange={(e) => updateCategoryRule(category as keyof InventoryPreferences['categoryRules'], 'threshold', parseInt(e.target.value))}
                            className="w-16 h-8 text-xs"
                            min="1"
                          />
                          <span className="text-xs text-muted-foreground">units</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Max Stock</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={rules.maxStock}
                            onChange={(e) => updateCategoryRule(category as keyof InventoryPreferences['categoryRules'], 'maxStock', parseInt(e.target.value))}
                            className="w-16 h-8 text-xs"
                            min="1"
                          />
                          <span className="text-xs text-muted-foreground">units</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-gray-50/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Changes will apply to all future inventory operations
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}