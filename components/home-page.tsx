'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, BarChart3, TrendingUp, Package, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const features = [
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Monitor demand patterns and inventory levels across all store locations in real-time.'
    },
    {
      icon: TrendingUp,
      title: 'Demand Forecasting',
      description: 'AI-powered predictions help optimize stock levels and reduce waste.'
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Smart alerts and automated reordering keep shelves stocked efficiently.'
    },
    {
      icon: Users,
      title: 'Multi-Store Management',
      description: 'Centralized control panel for managing 25+ store locations across India.'
    }
  ];

  const stats = [
    { value: '25', label: 'Store Locations' },
    { value: '94.2%', label: 'Forecast Accuracy' },
    { value: '₹2.4M', label: 'Monthly Revenue' },
    { value: '1,247', label: 'Products Tracked' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">FreshMart</h1>
                <p className="text-xs text-slate-500">Demand Intelligence</p>
              </div>
            </div>
            
            <Link href="/login">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4" />
              Trusted by 25+ Store Locations
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Smart Retail
              <span className="text-emerald-600"> Demand Intelligence</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Optimize inventory, predict demand, and maximize profits with AI-powered insights 
              for your retail chain. Real-time analytics across all store locations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/login">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Access Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Powerful Features for Modern Retail
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to manage inventory, predict demand, and optimize operations 
              across your entire retail network.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Optimize Your Retail Operations?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join the future of retail with intelligent demand forecasting and inventory management.
          </p>
          
          <Link href="/login">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-slate-50">
              Access Admin Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">FreshMart</h3>
                <p className="text-sm text-slate-400">Demand Intelligence Platform</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm">
                © 2024 FreshMart. Enterprise-grade retail intelligence.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}