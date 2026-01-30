'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import ProductCard from '@/components/product-card';
import ProductDetailModal from '@/components/product-detail-modal';
import { mockProducts, useStore } from '@/lib/data';
import { useStore as useStoreContext } from '@/lib/store-context';

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { currentStore } = useStoreContext();

  const categories = ['all', ...new Set(mockProducts.map(p => p.category))];
  const statuses = ['all', 'ok', 'attention', 'risk'];

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const stats = {
    total: mockProducts.length,
    inStock: mockProducts.filter(p => p.status === 'ok').length,
    attention: mockProducts.filter(p => p.status === 'attention').length,
    risk: mockProducts.filter(p => p.status === 'risk').length,
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground">
              Products Inventory
            </h1>
            <p className="text-foreground/60 mt-2">Manage inventory for <strong className="text-primary">{currentStore.city}</strong> store with real-time demand insights</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-border/50 bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-foreground/60 font-bold uppercase tracking-wide">Total Products</p>
                  <p className="text-3xl font-black text-primary mt-2">{stats.total}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-foreground/60 font-bold uppercase tracking-wide">In Stock</p>
                  <p className="text-3xl font-black text-green-600 mt-2">{stats.inStock}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-100 border border-green-200">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-foreground/60 font-bold uppercase tracking-wide">Attention</p>
                  <p className="text-3xl font-black text-yellow-600 mt-2">{stats.attention}</p>
                </div>
                <div className="p-3 rounded-xl bg-yellow-100 border border-yellow-200">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-foreground/60 font-bold uppercase tracking-wide">Risk</p>
                  <p className="text-3xl font-black text-red-600 mt-2">{stats.risk}</p>
                </div>
                <div className="p-3 rounded-xl bg-red-100 border border-red-200">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/60" />
          <input
            type="text"
            placeholder="Search products by name, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-border/50 text-foreground placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
        </div>

        {/* Filters */}
        <Card className="border border-border/50 bg-white shadow-lg">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="text-lg font-bold text-foreground">Filter Products</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">

              {/* Category Filter */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-3">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <Button
                      key={cat}
                      variant={categoryFilter === cat ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCategoryFilter(cat)}
                      className={`capitalize ${
                        categoryFilter === cat
                          ? 'bg-accent text-accent-foreground border-accent'
                          : 'border-border hover:border-accent'
                      }`}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-3">
                  Stock Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map(status => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className={`capitalize ${
                        statusFilter === status
                          ? 'bg-accent text-accent-foreground border-accent'
                          : 'border-border hover:border-accent'
                      }`}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-semibold">
              Showing {filteredProducts.length} of {mockProducts.length} products
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground font-semibold">No products found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </AppLayout>
  );
}
