'use client';

import React, { useState } from 'react';
import { X, User, Mail, Phone, LogOut, Settings, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store-context';
import InventoryPreferencesPanel from './inventory-preferences';
import StoreSettings from './store-settings';
import { useRouter } from 'next/navigation';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePanel({ isOpen, onClose }: ProfilePanelProps) {
  const { currentStore } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showInventoryPreferences, setShowInventoryPreferences] = useState(false);
  const [showStoreSettings, setShowStoreSettings] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Profile Panel */}
      <div className="fixed right-0 top-0 h-screen z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/5 to-accent/5">
          <h2 className="text-lg font-bold text-foreground">Store Profile</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Store Info Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {currentStore.name}
                </h3>
                <p className="text-sm text-foreground/60 mt-1">{currentStore.city}</p>
                <Badge className="mt-3 bg-green-600 text-white">
                  {currentStore.status === 'online' ? 'Online' : 'Offline'}
                </Badge>
              </div>

              <div className="space-y-3 mt-6 pt-6 border-t border-border">
                {/* Manager Info */}
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Manager</p>
                    <p className="text-sm font-semibold text-foreground">
                      {currentStore.managerName}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Phone</p>
                    <p className="text-sm font-semibold text-foreground">
                      {currentStore.managerPhone}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Email</p>
                    <p className="text-sm font-semibold text-foreground">
                      {currentStore.name.replace(/\s+/g, '.').toLowerCase()}@freshmart.com
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <div>
            <h4 className="font-bold text-foreground mb-3">Performance Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 border border-border/50">
                <span className="text-sm text-foreground/70">Forecast Accuracy</span>
                <span className="text-sm font-bold text-primary">{currentStore.forecastAccuracy}%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 border border-border/50">
                <span className="text-sm text-foreground/70">Avg Stock Level</span>
                <span className="text-sm font-bold text-green-600">{currentStore.averageStock}%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 border border-border/50">
                <span className="text-sm text-foreground/70">Staff Count</span>
                <span className="text-sm font-bold text-accent">{currentStore.staffCount}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-3">Settings</h4>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-foreground hover:bg-secondary/50"
                onClick={() => setShowStoreSettings(true)}
              >
                <Settings className="w-4 h-4 mr-3" />
                Store Settings
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-foreground hover:bg-secondary/50"
                onClick={() => setShowInventoryPreferences(true)}
              >
                <Globe className="w-4 h-4 mr-3" />
                Inventory Preferences
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 bg-transparent"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Store Settings Panel */}
      <StoreSettings 
        isOpen={showStoreSettings} 
        onClose={() => setShowStoreSettings(false)} 
      />

      {/* Inventory Preferences Panel */}
      <InventoryPreferencesPanel 
        isOpen={showInventoryPreferences} 
        onClose={() => setShowInventoryPreferences(false)} 
      />
    </>
  );
}
