'use client';

import React from 'react';
import AppLayout from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertCircle, Users, ArrowUpRight, ArrowDownRight, CheckCircle } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { formatCurrency } from '@/lib/utils';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function Dashboard() {
  const { currentStore, allStores } = useStore();

  const topPerformers = allStores.sort((a, b) => b.actualSales - a.actualSales).slice(0, 5);
  const needsAttention = allStores.sort((a, b) => b.stockoutRate - a.stockoutRate).slice(0, 3);

  const storeMetrics = topPerformers.map(s => ({
    name: s.city,
    sales: s.actualSales,
    target: s.salesTarget,
    accuracy: s.forecastAccuracy,
  }));

  const regionPerformance = [
    { 
      region: 'North', 
      stores: allStores.filter(s => s.region === 'North').length,
      sales: allStores.filter(s => s.region === 'North').reduce((sum, s) => sum + s.actualSales, 0),
    },
    { 
      region: 'South', 
      stores: allStores.filter(s => s.region === 'South').length,
      sales: allStores.filter(s => s.region === 'South').reduce((sum, s) => sum + s.actualSales, 0),
    },
    { 
      region: 'East', 
      stores: allStores.filter(s => s.region === 'East').length,
      sales: allStores.filter(s => s.region === 'East').reduce((sum, s) => sum + s.actualSales, 0),
    },
    { 
      region: 'West', 
      stores: allStores.filter(s => s.region === 'West').length,
      sales: allStores.filter(s => s.region === 'West').reduce((sum, s) => sum + s.actualSales, 0),
    },
    { 
      region: 'Central', 
      stores: allStores.filter(s => s.region === 'Central').length,
      sales: allStores.filter(s => s.region === 'Central').reduce((sum, s) => sum + s.actualSales, 0),
    },
  ];

  const onlineStores = allStores.filter(s => s.status === 'online').length;

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/0 to-accent/5 border border-primary/10 shadow-lg backdrop-blur-xl p-8 md:p-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/10 to-orange-200/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/10 to-green-200/5 rounded-full blur-3xl -z-10" />

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary/60 uppercase tracking-widest mb-2">Welcome</p>
                <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tight">
                  {getGreeting()}, {currentStore.managerName}!
                </h1>
                <p className="text-lg text-foreground/70 mb-6 max-w-2xl leading-relaxed">
                  Managing <strong className="text-foreground">{currentStore.name}</strong> in {currentStore.city}. All {onlineStores} stores across FreshMart are operational with excellent performance.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-primary text-white px-4 py-1.5 text-sm font-semibold">📊 {formatCurrency(currentStore.actualSales)} Today</Badge>
                  <Badge className="bg-accent text-white px-4 py-1.5 text-sm font-semibold">📈 {currentStore.forecastAccuracy}% Accuracy</Badge>
                  <Badge className="bg-green-600 text-white px-4 py-1.5 text-sm font-semibold">💚 {currentStore.averageStock}% Stock Level</Badge>
                </div>
              </div>
              <div className="hidden lg:block text-8xl opacity-20">🛒</div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-border/50 bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-primary/30 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Today Sales</p>
                  <p className="text-2xl font-black text-foreground mt-2">{formatCurrency(currentStore.actualSales)}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-100/50 border border-green-200/50">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ArrowUpRight className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-semibold">vs target: {((currentStore.actualSales / currentStore.salesTarget) * 100).toFixed(0)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-accent/30 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Forecast Accuracy</p>
                  <p className="text-3xl font-black text-foreground mt-2">{currentStore.forecastAccuracy}%</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-100/50 border border-orange-200/50">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {currentStore.forecastAccuracy >= 93 ? (
                  <>
                    <ArrowUpRight className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-600 font-semibold">Excellent</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-600 font-semibold">Good</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-primary/30 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Staff</p>
                  <p className="text-3xl font-black text-foreground mt-2">{currentStore.staffCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100/50 border border-blue-200/50">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-blue-600 font-semibold">{currentStore.region} Region</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-red-300/30 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Stockout Rate</p>
                  <p className="text-3xl font-black text-foreground mt-2">{currentStore.stockoutRate}%</p>
                </div>
                <div className="p-3 rounded-xl bg-red-100/50 border border-red-200/50">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {currentStore.stockoutRate < 1.5 ? (
                  <>
                    <ArrowDownRight className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-semibold">Low risk</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-4 h-4 text-red-600" />
                    <span className="text-red-600 font-semibold">Monitor</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-border/50 bg-white/30 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Top Performing Stores</CardTitle>
              <p className="text-xs text-foreground/60 mt-1">Weekly sales by store</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={storeMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e1d9" />
                  <XAxis dataKey="name" stroke="#6b6158" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b6158" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e8e1d9',
                      borderRadius: '12px',
                    }}
                    formatter={(value: any) => formatCurrency(value)}
                  />
                  <Bar dataKey="sales" fill="#2d5016" name="Actual Sales" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="target" fill="#e67e22" name="Target" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-white/30 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Sales by Region</CardTitle>
              <p className="text-xs text-foreground/60 mt-1">Network-wide distribution</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={regionPerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ region, stores }) => `${region} (${stores} stores)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="sales"
                  >
                    <Cell fill="#2d5016" />
                    <Cell fill="#e67e22" />
                    <Cell fill="#c0392b" />
                    <Cell fill="#27ae60" />
                    <Cell fill="#f39c12" />
                  </Pie>
                  <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-border/50 bg-white/30 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <span>🏆</span> Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPerformers.map((store, idx) => (
                  <div key={store.id} className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-transparent border border-green-100/50 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-sm">{idx + 1}. {store.name}</p>
                      <p className="text-xs text-foreground/60">{store.region} Region</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-foreground text-lg">{formatCurrency(store.actualSales)}</p>
                      <Badge className="bg-green-600 text-white text-xs">{store.forecastAccuracy}% Accuracy</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-white/30 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <span>⚠️</span> Needs Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {needsAttention.map((store) => (
                  <div key={store.id} className="p-3 rounded-lg bg-gradient-to-r from-orange-50 to-transparent border border-orange-100/50 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-sm">{store.name}</p>
                      <p className="text-xs text-foreground/60">{store.region} Region • {store.staffCount} Staff</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-orange-600 text-lg">{store.stockoutRate}%</p>
                      <p className="text-xs text-foreground/60">Stockout Risk</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}