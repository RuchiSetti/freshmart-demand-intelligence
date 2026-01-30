'use client';

import React from 'react';
import AppLayout from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { TrendingUp, Zap, Target, AlertTriangle } from 'lucide-react';
import { categoryHeatmap } from '@/lib/data';

const categoryPerformance = [
  { category: 'Dairy', avgPrice: 5.2, turnover: 12.3, demand: 850, margin: 32 },
  { category: 'Produce', avgPrice: 2.8, turnover: 9.8, demand: 720, margin: 28 },
  { category: 'Bakery', avgPrice: 4.9, turnover: 14.2, demand: 680, margin: 35 },
  { category: 'Pantry', avgPrice: 6.1, turnover: 8.5, demand: 590, margin: 30 },
];

const dailyMetrics = [
  { day: 'Monday', stockouts: 2, overstock: 1, forecast_accuracy: 92, sales: 28500 },
  { day: 'Tuesday', stockouts: 1, overstock: 2, forecast_accuracy: 93, sales: 26800 },
  { day: 'Wednesday', stockouts: 3, overstock: 1, forecast_accuracy: 91, sales: 31200 },
  { day: 'Thursday', stockouts: 2, overstock: 2, forecast_accuracy: 94, sales: 33800 },
  { day: 'Friday', stockouts: 1, overstock: 0, forecast_accuracy: 95, sales: 38900 },
  { day: 'Saturday', stockouts: 0, overstock: 3, forecast_accuracy: 93, sales: 45200 },
  { day: 'Sunday', stockouts: 1, overstock: 2, forecast_accuracy: 92, sales: 40100 },
];

const opportunities = [
  {
    id: 1,
    title: 'Bundle High-Demand Items',
    description: 'Dairy & Bakery categories show complementary purchase patterns',
    potential: '12-15% increase',
    icon: '📦',
  },
  {
    id: 2,
    title: 'Weekend Stock Optimization',
    description: 'Stockouts on weekends despite high demand signals',
    potential: '8-10% revenue lift',
    icon: '📈',
  },
  {
    id: 3,
    title: 'Seasonal Forecasting',
    description: 'Implement advanced seasonal patterns in forecast model',
    potential: '3-5% accuracy gain',
    icon: '📊',
  },
  {
    id: 4,
    title: 'Cross-Category Promotion',
    description: 'Target low-turnover items with complimentary products',
    potential: '6-8% volume increase',
    icon: '🎯',
  },
];

export default function InsightsPage() {
  const heatmapColors = (value: number) => {
    if (value >= 70) return '#00d9ff';
    if (value >= 50) return '#00f5d4';
    if (value >= 30) return '#a29bfe';
    return '#fd79a8';
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-cyan-400 bg-clip-text text-transparent">
            Insights & Analytics
          </h1>
          <p className="text-muted-foreground mt-2">Deep dive into demand patterns, trends, and optimization opportunities</p>
        </div>

        {/* Key Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-cyan-400/10 to-cyan-400/0 border-cyan-400/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Avg Forecast Accuracy</p>
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <p className="text-3xl font-bold text-cyan-400">93.1%</p>
              <p className="text-xs text-green-400 font-semibold mt-2">↑ 1.2% this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-400/10 to-green-400/0 border-green-400/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Avg Stockout Rate</p>
                <AlertTriangle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-green-400">1.6%</p>
              <p className="text-xs text-green-400 font-semibold mt-2">↓ 0.3% improvement</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/0 border-accent/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Revenue Potential</p>
                <Target className="w-5 h-5 text-accent" />
              </div>
              <p className="text-3xl font-bold text-accent">$28.5K</p>
              <p className="text-xs text-orange-400 font-semibold mt-2">Untapped this month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-400/10 to-purple-400/0 border-purple-400/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Best Category</p>
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-purple-400">Bakery</p>
              <p className="text-xs text-purple-400 font-semibold mt-2">14.2x turnover rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Metrics */}
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Weekly Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2e42" />
                  <XAxis dataKey="day" stroke="#a0a4af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#a0a4af" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1b2e',
                      border: '1px solid #2d2e42',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="forecast_accuracy" fill="#00d9ff" name="Forecast Accuracy %" />
                  <Bar dataKey="stockouts" fill="#fd79a8" name="Stockouts" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sales Trend */}
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Weekly Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyMetrics}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f5d4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00f5d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2e42" />
                  <XAxis dataKey="day" stroke="#a0a4af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#a0a4af" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1b2e',
                      border: '1px solid #2d2e42',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#00f5d4"
                    strokeWidth={3}
                    dot={{ fill: '#00f5d4', r: 5 }}
                    name="Daily Sales"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Category Performance */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Category Performance Matrix</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Bubble size = demand volume, Y-axis = turnover rate, X-axis = price point</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2e42" />
                <XAxis dataKey="avgPrice" name="Avg Price" stroke="#a0a4af" />
                <YAxis dataKey="turnover" name="Turnover Rate" stroke="#a0a4af" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: '#1a1b2e',
                    border: '1px solid #2d2e42',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => value.toFixed(2)}
                />
                <Scatter name="Categories" data={categoryPerformance} fill="#00d9ff">
                  {categoryPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={heatmapColors(entry.demand)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Heatmap */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Weekly Demand Heatmap by Category</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Darker colors indicate higher demand volumes</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-bold text-foreground border-b border-border">Day</th>
                    {['Dairy', 'Produce', 'Bakery', 'Pantry'].map(cat => (
                      <th key={cat} className="text-center py-3 px-4 text-xs font-bold text-foreground border-b border-border">
                        {cat}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categoryHeatmap.map((row, idx) => (
                    <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4 text-sm font-semibold text-foreground border-b border-border/50">
                        {row.day}
                      </td>
                      {['dairy', 'produce', 'bakery', 'pantry'].map(key => {
                        const value = row[key as keyof typeof row] as number;
                        const percentage = (value / 100) * 100;
                        return (
                          <td
                            key={key}
                            className="py-3 px-4 text-center text-sm font-bold border-b border-border/50 rounded"
                            style={{
                              backgroundColor: heatmapColors(value),
                              opacity: 0.2 + (percentage / 100) * 0.8,
                              color: percentage > 50 ? '#f0f2f5' : '#a0a4af',
                            }}
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Opportunities */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Growth Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map(opp => (
              <Card key={opp.id} className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-accent/50 transition-all cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{opp.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">{opp.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{opp.description}</p>
                      <div className="mt-3 inline-block">
                        <Badge className="bg-accent/20 text-accent border-accent/50">
                          Potential: {opp.potential}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Findings */}
        <Card className="bg-gradient-to-br from-cyan-400/10 to-cyan-400/0 border-cyan-400/30">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Key Findings This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span className="text-foreground">
                  <strong>Bakery Performance:</strong> Highest turnover rate (14.2x) with consistent demand throughout the week
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span className="text-foreground">
                  <strong>Weekend Peak:</strong> Saturday shows 45% higher sales - requires 15-20% inventory buffer
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span className="text-foreground">
                  <strong>Stockout Patterns:</strong> Weekday stockouts average 1.6%, concentrated in high-demand categories
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">•</span>
                <span className="text-foreground">
                  <strong>Forecast Accuracy:</strong> Model improving 1.2% week-over-week, now at 93.1% overall accuracy
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
