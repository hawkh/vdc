"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Package } from "lucide-react";

export function LiveAnalyticsSummary({ analytics }: { analytics: any }) {
  const completionRate = analytics.totalTreatments > 0 ? 
    (analytics.completedTreatments / analytics.totalTreatments) * 100 : 0;
  
  const revenueRate = analytics.totalRevenue + analytics.pendingRevenue > 0 ?
    (analytics.totalRevenue / (analytics.totalRevenue + analytics.pendingRevenue)) * 100 : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Patient Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Active Patients</span>
            <Badge variant="default">{analytics.activePatients}/{analytics.totalPatients}</Badge>
          </div>
          <Progress value={(analytics.activePatients / analytics.totalPatients) * 100} />
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            {Math.round((analytics.activePatients / analytics.totalPatients) * 100)}% active rate
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Treatment Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Completion Rate</span>
            <Badge variant="default">{completionRate.toFixed(1)}%</Badge>
          </div>
          <Progress value={completionRate} />
          <div className="text-xs text-muted-foreground">
            {analytics.completedTreatments} completed, {analytics.inProgressTreatments} in progress
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Revenue Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Collection Rate</span>
            <Badge variant="default">{revenueRate.toFixed(1)}%</Badge>
          </div>
          <Progress value={revenueRate} />
          <div className="text-xs text-muted-foreground">
            ₹{analytics.totalRevenue.toLocaleString()} earned, ₹{analytics.pendingRevenue.toLocaleString()} pending
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Inventory Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Critical Stock</span>
              <Badge variant="destructive">{analytics.criticalStockItems}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Low Stock</span>
              <Badge variant="secondary">{analytics.lowStockItems}</Badge>
            </div>
          </div>
          {analytics.criticalStockItems > 0 && (
            <div className="flex items-center text-sm text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              Immediate reorder required
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Treatments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(analytics.treatmentTypes)
              .sort(([,a], [,b]) => (b as number) - (a as number))
              .slice(0, 3)
              .map(([treatment, count]) => (
                <div key={treatment} className="flex justify-between items-center">
                  <span className="text-sm">{treatment}</span>
                  <Badge variant="outline">{count as number}</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Staff Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Available Staff</span>
            <Badge variant="default">{analytics.availableStaff}/{analytics.availableStaff + (analytics.totalPatients - analytics.availableStaff)}</Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Ready to handle new appointments
          </div>
        </CardContent>
      </Card>
    </div>
  );
}