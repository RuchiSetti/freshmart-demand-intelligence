'use client'

import React from 'react'
import AppLayout from '@/components/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { BarChart3 } from 'lucide-react'

const categoryData = [
  { name: 'Dairy', value: 35 },
  { name: 'Produce', value: 25 },
  { name: 'Bakery', value: 20 },
  { name: 'Pantry', value: 20 },
]

const colors = ['rgb(148, 163, 255)', 'rgb(100, 200, 200)', 'rgb(200, 200, 150)', 'rgb(200, 150, 150)']

const performanceData = [
  { month: 'Jan', forecast: 85, actual: 82 },
  { month: 'Feb', forecast: 88, actual: 90 },
  { month: 'Mar', forecast: 92, actual: 89 },
  { month: 'Apr', forecast: 90, actual: 94 },
  { month: 'May', forecast: 91, actual: 91 },
  { month: 'Jun', forecast: 93, actual: 95 },
]

export default function AnalyticsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Advanced metrics and performance analytics
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Avg Forecast Error</p>
                <p className="text-2xl font-bold text-accent">5.8%</p>
                <p className="text-xs text-muted-foreground mt-2">↓ 0.3% from last period</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Inventory Turnover</p>
                <p className="text-2xl font-bold text-accent">7.2x</p>
                <p className="text-xs text-muted-foreground mt-2">↑ 0.5x from last period</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Stockout Prevention</p>
                <p className="text-2xl font-bold text-accent">98.2%</p>
                <p className="text-xs text-muted-foreground mt-2">↑ 1.2% from last period</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Waste Reduction</p>
                <p className="text-2xl font-bold text-accent">12.3%</p>
                <p className="text-xs text-muted-foreground mt-2">↑ 2.1% from last period</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales by Category */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Sales Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(15, 23, 42)',
                      border: '1px solid rgb(30, 41, 59)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Trend */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Forecast Accuracy Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(30, 41, 59)" />
                  <XAxis dataKey="month" stroke="rgb(100, 116, 139)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="rgb(100, 116, 139)" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(15, 23, 42)',
                      border: '1px solid rgb(30, 41, 59)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="rgb(148, 163, 255)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="rgb(100, 200, 200)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
