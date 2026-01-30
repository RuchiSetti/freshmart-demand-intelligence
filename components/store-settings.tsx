'use client';

import React, { useState } from 'react';
import { X, Save, Store, Clock, Users, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store-context';

interface StoreSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StoreSettings({ isOpen, onClose }: StoreSettingsProps) {
  const { currentStore } = useStore();
  const [settings, setSettings] = useState({
    storeName: currentStore.name,
    managerName: currentStore.managerName,
    managerPhone: currentStore.managerPhone,
    operatingHours: '9:00 AM - 10:00 PM',
    maxCapacity: currentStore.staffCount * 50,
    alertThreshold: 20,
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="fixed right-0 top-0 h-screen z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
        <div className="p-6 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/5 to-accent/5">
          <h2 className="text-lg font-bold text-foreground">Store Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={settings.storeName}
                  onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="managerName">Manager Name</Label>
                <Input
                  id="managerName"
                  value={settings.managerName}
                  onChange={(e) => setSettings({...settings, managerName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="managerPhone">Manager Phone</Label>
                <Input
                  id="managerPhone"
                  value={settings.managerPhone}
                  onChange={(e) => setSettings({...settings, managerPhone: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hours">Operating Hours</Label>
                <Input
                  id="hours"
                  value={settings.operatingHours}
                  onChange={(e) => setSettings({...settings, operatingHours: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="capacity">Max Daily Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={settings.maxCapacity}
                  onChange={(e) => setSettings({...settings, maxCapacity: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="threshold">Low Stock Alert (%)</Label>
                <Input
                  id="threshold"
                  type="number"
                  value={settings.alertThreshold}
                  onChange={(e) => setSettings({...settings, alertThreshold: parseInt(e.target.value)})}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="p-4 border-t border-border">
          <Button onClick={handleSave} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </>
  );
}