'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, AlertCircle, BarChart3, Settings, Menu, X, TrendingUp, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useStore } from '@/lib/store-context';
import NotificationPanel from '@/components/notification-panel';
import ProfilePanel from '@/components/profile-panel';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { currentStore, setCurrentStore, allStores } = useStore();

  const navItems = [
    { href: '/', icon: Home, label: 'Dashboard', badge: null },
    { href: '/products', icon: ShoppingCart, label: 'Products', badge: '12' },
    { href: '/alerts', icon: AlertCircle, label: 'Alerts', badge: '4' },
    { href: '/insights', icon: BarChart3, label: 'Insights', badge: null },
    { href: '/analytics', icon: TrendingUp, label: 'Analytics', badge: null },
    { href: '/settings', icon: Settings, label: 'Settings', badge: null },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-sidebar via-sidebar to-sidebar/98 border-r border-sidebar-border/30 transition-transform duration-300 shadow-lg ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border/20 bg-gradient-to-b from-sidebar to-sidebar/50">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
              <img src="/freshmart-logo.png" alt="FreshMart" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-sidebar-foreground tracking-tight">FreshMart</h1>
              <p className="text-xs text-sidebar-foreground/70 font-semibold">Demand Intelligence</p>
            </div>
          </div>
        </div>

        {/* Store Selector */}
        <div className="p-4 border-b border-sidebar-border/20 bg-gradient-to-b from-sidebar/50 to-transparent">
          <label className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">Store Location</label>
          <div className="mt-3 relative">
            <select
              value={currentStore.id}
              onChange={(e) => {
                const store = allStores.find(s => s.id === e.target.value);
                if (store) setCurrentStore(store);
              }}
              className="w-full px-3 py-2.5 rounded-lg bg-sidebar-accent/40 border border-sidebar-border/50 text-sidebar-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-primary cursor-pointer appearance-none font-semibold"
            >
              {allStores.map(store => (
                <option key={store.id} value={store.id}>
                  {store.city} - {store.name.split('FreshMart ')[1]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-sidebar-foreground/70">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>{currentStore.region} Region</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start gap-3 mb-2 transition-all ${
                    isActive
                      ? 'bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-primary/50 hover:bg-sidebar-primary/30'
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-semibold">
                      {item.badge}
                    </span>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Store Status */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="px-3 py-3 rounded-lg bg-sidebar-accent/20 border border-sidebar-accent/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-sidebar-foreground">Status</span>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
            <p className="text-xs text-sidebar-foreground/70">All systems operational</p>
            <p className="text-xs text-sidebar-foreground/50 mt-1">25 stores online</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-foreground hover:bg-secondary/50 p-2 rounded-lg"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{currentStore.name}</h2>
              <p className="text-xs text-muted-foreground">{currentStore.region} Region</p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotificationsOpen(true)}
              className="relative text-muted-foreground hover:text-accent hover:bg-secondary group"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse group-hover:scale-150 transition-transform" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setProfileOpen(true)}
              className="text-muted-foreground hover:text-primary hover:bg-secondary"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                {currentStore.managerName.charAt(0)}
              </div>
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-6">{children}</div>
        </main>
      </div>
      

      {/* Panels */}
      <NotificationPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <ProfilePanel isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
