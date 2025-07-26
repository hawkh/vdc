"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet } from "lucide-react";

const financialData = {
  dailyRevenue: 12500,
  monthlyRevenue: 285000,
  yearlyRevenue: 2850000,
  pendingPayments: 45000,
  expenses: 85000,
  profit: 200000,
  paymentMethods: [
    { method: "Cash", amount: 125000, percentage: 44 },
    { method: "UPI", amount: 95000, percentage: 33 },
    { method: "Card", amount: 65000, percentage: 23 }
  ]
};

export function FinancialDashboard({ financial }: { financial: any }) {
  const financialData = financial || { dailyRevenue: 0, monthlyRevenue: 0, pendingPayments: 0, paymentMethods: [] };
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{financialData.dailyRevenue.toLocaleString()}</div>
          <div className="flex items-center text-xs text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            +12% from yesterday
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{financialData.monthlyRevenue.toLocaleString()}</div>
          <div className="flex items-center text-xs text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            +8% from last month
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">₹{financialData.pendingPayments.toLocaleString()}</div>
          <div className="flex items-center text-xs text-red-600">
            <TrendingDown className="h-3 w-3 mr-1" />
            15 pending invoices
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Payment Methods Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financialData.paymentMethods.map((method) => (
              <div key={method.method} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <Wallet className="h-4 w-4 mr-2" />
                    {method.method}
                  </span>
                  <span className="font-medium">₹{method.amount.toLocaleString()}</span>
                </div>
                <Progress value={method.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">₹{financialData.profit.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Revenue: ₹{financialData.monthlyRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">
            Expenses: ₹{financialData.expenses.toLocaleString()}
          </div>
          <Badge variant="default" className="mt-2">
            70.2% Profit Margin
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}