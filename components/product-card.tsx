'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/data'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const sparklineMax = Math.max(...product.demandTrend)
  const sparklineMin = Math.min(...product.demandTrend)
  const range = sparklineMax - sparklineMin || 1

  // Normalize data for sparkline
  const points = product.demandTrend.map((val) => ((val - sparklineMin) / range) * 100)
  const pathData = points
    .map((y, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * 200} ${100 - y}`)
    .join(' ')

  const statusColor =
    product.status === 'ok'
      ? 'border-accent text-accent'
      : product.status === 'attention'
        ? 'border-yellow-500 text-yellow-400'
        : 'border-destructive text-destructive'

  const TrendIcon = product.trend === 'up' ? TrendingUp : product.trend === 'down' ? TrendingDown : Minus

  const stockPercentage = (product.currentStock / product.requiredStock) * 100;
  const priceDisplay = product.price ? `$${product.price.toFixed(2)}` : 'N/A';
  const turnoverDisplay = product.turnoverRate ? `${product.turnoverRate.toFixed(1)}x` : 'N/A';

  return (
    <div
      onClick={onClick}
      className="rounded-xl border border-border bg-gradient-to-br from-card to-card/50 p-5 hover:border-accent hover:shadow-xl hover:shadow-accent/20 transition-all cursor-pointer group hover:-translate-y-1 duration-300"
    >
      {/* Header with Category Badge */}
      <div className="flex items-start justify-between mb-3">
        <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wide">
          {product.category}
        </span>
        <div className={`flex items-center gap-1 ${
          product.trend === 'up' ? 'text-green-400' : product.trend === 'down' ? 'text-red-400' : 'text-muted-foreground'
        }`}>
          <TrendIcon size={16} className="font-bold" />
        </div>
      </div>

      {/* Product Image with Overlay */}
      <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-secondary relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.riskBadge && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-destructive/90 text-white text-xs font-bold backdrop-blur-sm">
            {product.riskBadge === 'stockout' ? '⚠️ Low Stock' : product.riskBadge === 'expiry' ? '⏰ Expiring' : '📦 Overstock'}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1 mb-4">
        <h3 className="font-bold text-foreground line-clamp-2 text-sm leading-tight">{product.name}</h3>
        <p className="text-xs text-muted-foreground">{product.category}</p>
      </div>

      {/* Price and Turnover */}
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-border">
        <div>
          <p className="text-xs text-muted-foreground">Price</p>
          <p className="text-sm font-bold text-accent">{priceDisplay}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Turnover</p>
          <p className="text-sm font-bold text-cyan-400">{turnoverDisplay}</p>
        </div>
      </div>

      {/* Stock Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-semibold text-foreground">Stock Level</span>
          <span className={`text-xs font-bold ${
            stockPercentage >= 80 ? 'text-green-400' : stockPercentage >= 50 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {product.currentStock}/{product.requiredStock}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              stockPercentage >= 80
                ? 'bg-gradient-to-r from-cyan-400 to-accent'
                : stockPercentage >= 50
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                  : 'bg-gradient-to-r from-red-500 to-destructive'
            }`}
            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Sparkline Chart */}
      <div className="mb-3 h-10 bg-secondary/50 rounded px-2 py-1 border border-border/50">
        <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00d9ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={pathData}
            stroke="#00d9ff"
            strokeWidth="2"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={pathData + ' L 200 100 L 0 100'}
            fill="url(#sparkGradient)"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Status Badge */}
      <Badge
        variant="outline"
        className={`w-full justify-center text-xs font-bold ${statusColor} border-2`}
      >
        {product.status === 'ok' ? '✓ OK' : product.status === 'attention' ? '! Attention' : '✕ Risk'}
      </Badge>
    </div>
  )
}
