'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Product, productImages } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const stockPercentage = (product.currentStock / product.requiredStock) * 100;

  const demandForecast = [
    { day: 'Mon', actual: 45, forecast: 42 },
    { day: 'Tue', actual: 52, forecast: 48 },
    { day: 'Wed', actual: 58, forecast: 55 },
    { day: 'Thu', actual: 62, forecast: 60 },
    { day: 'Fri', actual: 72, forecast: 70 },
    { day: 'Sat', actual: 85, forecast: 82 },
    { day: 'Sun', actual: 78, forecast: 75 },
  ];

  const demandDrivers = [
    { label: 'Base', value: 60, color: '#3b82f6' },
    { label: 'Weekend', value: 25, color: '#10b981' },
    { label: 'Seasonal', value: 10, color: '#f59e0b' },
    { label: 'Promo', value: 5, color: '#8b5cf6' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] p-0">

        {/* Header */}
        <DialogHeader className="px-6 py-3 border-b">
          <div className="flex items-center gap-3">
            <img
              src={productImages[product.id as keyof typeof productImages] || 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=400&h=400&fit=crop'}
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover"
            />

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {product.category}
                </Badge>

                <Badge variant={product.status === 'ok' ? 'default' : 'destructive'} className="text-xs px-2 py-0.5">
                  {product.status === 'attention' && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {product.status === 'ok' ? 'In Stock' : 'Low Stock'}
                </Badge>

                <Badge variant="outline" className={`text-xs px-2 py-0.5 ${
                  product.trend === 'up' ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'
                }`}>
                  {product.trend === 'up' 
                    ? <TrendingUp className="w-3 h-3 mr-1" /> 
                    : <TrendingDown className="w-3 h-3 mr-1" />}
                  {product.trend === 'up' ? 'Up' : 'Down'}
                </Badge>
              </div>

              <DialogTitle className="text-lg font-semibold text-gray-900">
                {product.name}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-3">
            <Metric label="Price" value={`₹${product.price?.toFixed(2)}`} />
            <Metric label="Turnover" value={`${product.turnoverRate?.toFixed(1)}x`} />
            <Metric label="Stock" value={product.currentStock} />
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Level</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{stockPercentage.toFixed(0)}%</span>
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      stockPercentage >= 80 ? 'bg-green-500' :
                      stockPercentage >= 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Forecast */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">7-Day Demand Forecast</h3>

              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={demandForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />

                  <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Drivers */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Demand Drivers</h3>

              <div className="space-y-3">
                {demandDrivers.map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-sm flex-1">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}%</span>

                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Detail Chips */}
          <div className="flex flex-wrap gap-2 text-xs">
            <Chip label="Category" value={product.category} />
            <Chip label="Status" value={product.status} />
            <Chip label="Trend" value={product.trend} />
            <Chip label="Updated" value="Today" />
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

/* Small Helpers */

function Metric({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: any }) {
  return (
    <div className="px-3 py-1 bg-gray-100 rounded-full flex gap-1">
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
