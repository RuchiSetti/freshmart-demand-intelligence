'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/lib/store-context';
import { Settings as SettingsIcon, Bell, Lock, Users, Zap, Mail, Phone, MapPin, Building2, Sliders, Save } from 'lucide-react';

export default function SettingsPage() {
  const { currentStore } = useStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoReorderEnabled, setAutoReorderEnabled] = useState(true);
  const [weekendAlerts, setWeekendAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [forecastAlerts, setForecastAlerts] = useState(true);

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Page Header */}
        <div className="border-b border-border pb-8">
          <h1 className="text-5xl font-black text-foreground mb-3">Settings</h1>
          <p className="text-foreground/60 text-lg">
            Manage <strong>{currentStore.city} Store</strong> configuration, notifications, and preferences
          </p>
        </div>

        {/* Store Profile Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            Store Profile
          </h2>

          <Card className="border border-border/50 bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm shadow-lg">
            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="flex items-center justify-between">
                <span>{currentStore.name}</span>
                <Badge className="bg-green-600 text-white">{currentStore.status === 'online' ? 'Online' : 'Offline'}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Manager Info */}
                <div>
                  <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest block mb-2">Store Manager</label>
                  <Input
                    defaultValue={currentStore.managerName}
                    disabled
                    className="bg-secondary border-border/50 text-foreground font-semibold"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest block mb-2">Location</label>
                  <Input
                    defaultValue={`${currentStore.city}, ${currentStore.region} Region`}
                    disabled
                    className="bg-secondary border-border/50 text-foreground font-semibold"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest block mb-2">Phone</label>
                  <div className="flex gap-2">
                    <Input
                      defaultValue={currentStore.managerPhone}
                      disabled
                      className="bg-secondary border-border/50 text-foreground font-semibold"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest block mb-2">Email</label>
                  <Input
                    defaultValue={`${currentStore.name.replace(/\s+/g, '.').toLowerCase()}@freshmart.com`}
                    disabled
                    className="bg-secondary border-border/50 text-foreground font-semibold"
                  />
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-xs text-foreground/60 font-bold uppercase mb-1">Staff</p>
                  <p className="text-2xl font-black text-primary">{currentStore.staffCount}</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
                  <p className="text-xs text-foreground/60 font-bold uppercase mb-1">Accuracy</p>
                  <p className="text-2xl font-black text-accent">{currentStore.forecastAccuracy}%</p>
                </div>
                <div className="p-4 rounded-lg bg-green-100/50 border border-green-200/50">
                  <p className="text-xs text-foreground/60 font-bold uppercase mb-1">Stock Level</p>
                  <p className="text-2xl font-black text-green-600">{currentStore.averageStock}%</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-100/50 border border-blue-200/50">
                  <p className="text-xs text-foreground/60 font-bold uppercase mb-1">Status</p>
                  <p className="text-2xl font-black text-blue-600">Online</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification Preferences */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-6 h-6 text-accent" />
            Notifications & Alerts
          </h2>

          <Card className="border border-border/50 bg-white shadow-lg">
            <CardContent className="p-6 space-y-5">
              {/* Master Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">All Notifications</p>
                  <p className="text-xs text-foreground/60 mt-1">Enable/disable all notification types</p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                  className="ml-4"
                />
              </div>

              {notificationsEnabled && (
                <div className="space-y-4 pt-4">
                  {[
                    {
                      icon: '⚠️',
                      title: 'Critical Alerts',
                      description: 'Stockouts, overstocks, and inventory issues',
                      state: [lowStockAlerts, setLowStockAlerts],
                    },
                    {
                      icon: '📈',
                      title: 'Forecast Alerts',
                      description: 'Demand forecasting and prediction changes',
                      state: [forecastAlerts, setForecastAlerts],
                    },
                    {
                      icon: '🎉',
                      title: 'Weekend Alerts',
                      description: 'Special notifications for weekend peaks',
                      state: [weekendAlerts, setWeekendAlerts],
                    },
                    {
                      icon: '📊',
                      title: 'Daily Digest',
                      description: 'Daily summary of store performance',
                      state: [true, () => {}],
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{item.title}</p>
                          <p className="text-xs text-foreground/60">{item.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={item.state[0]}
                        onCheckedChange={item.state[1]}
                        className="ml-4"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Inventory Management */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-green-600" />
            Inventory Management
          </h2>

          <Card className="border border-border/50 bg-white shadow-lg">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Auto-Reorder System</p>
                  <p className="text-xs text-foreground/60 mt-1">Automatically suggest and execute reorders based on demand forecast</p>
                </div>
                <Switch
                  checked={autoReorderEnabled}
                  onCheckedChange={setAutoReorderEnabled}
                  className="ml-4"
                />
              </div>

              {autoReorderEnabled && (
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">Reorder Point (%)</label>
                    <Input
                      type="number"
                      defaultValue="50"
                      className="bg-secondary border-border text-foreground"
                    />
                    <p className="text-xs text-foreground/60 mt-1">Trigger automatic reorder when stock falls below this level</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">Reorder Quantity</label>
                    <Input
                      type="number"
                      defaultValue="500"
                      className="bg-secondary border-border text-foreground"
                    />
                    <p className="text-xs text-foreground/60 mt-1">Default quantity to order when threshold is reached</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Data & Security */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-red-600" />
            Data & Security
          </h2>

          <Card className="border border-border/50 bg-white shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-semibold text-foreground text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-foreground/60 mt-1 mb-3">Enhance security with 2FA</p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Lock className="w-4 h-4 mr-2" />
                  Enable 2FA
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <p className="font-semibold text-foreground text-sm">Change Password</p>
                <p className="text-xs text-foreground/60 mt-1 mb-3">Update your account password regularly</p>
                <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  Change Password
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="font-semibold text-foreground text-sm">Data Export</p>
                <p className="text-xs text-foreground/60 mt-1 mb-3">Download your store data</p>
                <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent">
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex gap-4 pt-8 border-t border-border">
          <Button className="flex-1 bg-primary hover:bg-primary/90 text-white py-6 text-lg font-bold rounded-xl">
            <Save className="w-5 h-5 mr-2" />
            Save All Changes
          </Button>
          <Button variant="outline" className="flex-1 border-border hover:bg-secondary py-6 text-lg font-bold rounded-xl bg-transparent">
            Cancel
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
