'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, Info, Zap, X } from 'lucide-react';
import { mockAlerts, mockProducts } from '@/lib/data';

const allAlerts = [
  ...mockAlerts,
  {
    id: 'a5',
    productId: '12',
    severity: 'info' as const,
    message: 'Organic Pasta stocks reaching seasonal demand peak',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'seasonal',
  },
  {
    id: 'a6',
    productId: '6',
    severity: 'info' as const,
    message: 'Hass Avocado promotion scheduled for this weekend',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    type: 'promotional',
  },
];

export default function AlertsPage() {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const visibleAlerts = allAlerts.filter(
    a => !dismissedAlerts.includes(a.id) && (severityFilter === 'all' || a.severity === severityFilter)
  );

  const criticalCount = visibleAlerts.filter(a => a.severity === 'critical').length;
  const warningCount = visibleAlerts.filter(a => a.severity === 'warning').length;
  const infoCount = visibleAlerts.filter(a => a.severity === 'info').length;

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts([...dismissedAlerts, alertId]);
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-6 h-6" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6" />;
      default:
        return <Info className="w-6 h-6" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/10 border-destructive/30 text-destructive border-l-destructive';
      case 'warning':
        return 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400 border-l-yellow-400';
      default:
        return 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400 border-l-cyan-400';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-cyan-400 bg-clip-text text-transparent">
            Alerts & Notifications
          </h1>
          <p className="text-muted-foreground mt-2">Monitor and manage critical inventory and operational alerts</p>
        </div>

        {/* Alert Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 cursor-pointer hover:shadow-xl transition-all" onClick={() => setSeverityFilter('all')}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Total Alerts</p>
                  <p className="text-3xl font-bold text-accent mt-2">{visibleAlerts.length}</p>
                </div>
                <Zap className="w-8 h-8 text-accent/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/30 cursor-pointer hover:shadow-xl hover:shadow-destructive/20 transition-all" onClick={() => setSeverityFilter('critical')}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Critical</p>
                  <p className="text-3xl font-bold text-destructive mt-2">{criticalCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-destructive/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-400/5 to-yellow-400/10 border-yellow-400/30 cursor-pointer hover:shadow-xl hover:shadow-yellow-400/20 transition-all" onClick={() => setSeverityFilter('warning')}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Warning</p>
                  <p className="text-3xl font-bold text-yellow-400 mt-2">{warningCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-400/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-400/5 to-cyan-400/10 border-cyan-400/30 cursor-pointer hover:shadow-xl hover:shadow-cyan-400/20 transition-all" onClick={() => setSeverityFilter('info')}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Info</p>
                  <p className="text-3xl font-bold text-cyan-400 mt-2">{infoCount}</p>
                </div>
                <Info className="w-8 h-8 text-cyan-400/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {visibleAlerts.length === 0 ? (
            <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
              <CardContent className="py-16 text-center">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="text-lg font-bold text-foreground mb-2">No Alerts</h3>
                <p className="text-muted-foreground">All systems are operating normally</p>
              </CardContent>
            </Card>
          ) : (
            visibleAlerts.map(alert => {
              const product = mockProducts.find(p => p.id === alert.productId);
              return (
                <Card
                  key={alert.id}
                  className={`bg-gradient-to-r border-l-4 transition-all hover:shadow-lg ${getSeverityColor(
                    alert.severity
                  )} ${
                    alert.severity === 'critical'
                      ? 'from-destructive/5 to-destructive/0'
                      : alert.severity === 'warning'
                      ? 'from-yellow-400/5 to-yellow-400/0'
                      : 'from-cyan-400/5 to-cyan-400/0'
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 flex-shrink-0 ${
                        alert.severity === 'critical'
                          ? 'text-destructive'
                          : alert.severity === 'warning'
                          ? 'text-yellow-400'
                          : 'text-cyan-400'
                      }`}>
                        {getIcon(alert.severity)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-bold text-foreground text-lg">{alert.message}</h3>
                            {product && (
                              <div className="flex items-center gap-2 mt-2">
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-8 h-8 rounded object-cover"
                                />
                                <span className="text-sm text-muted-foreground">{product.name}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <Badge
                              variant="outline"
                              className={`capitalize ${
                                alert.severity === 'critical'
                                  ? 'border-destructive text-destructive'
                                  : alert.severity === 'warning'
                                  ? 'border-yellow-400 text-yellow-400'
                                  : 'border-cyan-400 text-cyan-400'
                              }`}
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="uppercase font-semibold">{alert.type}</span>
                            <span>
                              {alert.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDismiss(alert.id)}
                            className="text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
