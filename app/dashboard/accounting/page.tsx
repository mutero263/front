"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  PieChart,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { accountingDashboardAPI } from "@/lib/accounting-api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AccountingDashboard() {
  const [overview, setOverview] = useState<any>({})
  const [cashPosition, setCashPosition] = useState<any>({})
  const [feeCollection, setFeeCollection] = useState<any>({})
  const [expenseSummary, setExpenseSummary] = useState<any>({})
  const [budgetStatus, setBudgetStatus] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, cashRes, feeRes, expenseRes, budgetRes] = await Promise.all([
        accountingDashboardAPI.getOverview(),
        accountingDashboardAPI.getCashPosition(),
        accountingDashboardAPI.getFeeCollection(),
        accountingDashboardAPI.getExpenseSummary(),
        accountingDashboardAPI.getBudgetStatus(),
      ])

      setOverview(overviewRes.data)
      setCashPosition(cashRes.data)
      setFeeCollection(feeRes.data)
      setExpenseSummary(expenseRes.data)
      setBudgetStatus(budgetRes.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load accounting dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Accounting Dashboard</h2>
          <p className="text-muted-foreground">Loading financial overview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Accounting Dashboard</h2>
          <p className="text-muted-foreground">Financial overview and key metrics</p>
        </div>
        <div className="flex space-x-2">
          <Link href="/dashboard/accounting/reports">
            <Button variant="outline">
              <PieChart className="w-4 h-4 mr-2" />
              Reports
            </Button>
          </Link>
          <Link href="/dashboard/accounting/transactions">
            <Button>
              <DollarSign className="w-4 h-4 mr-2" />
              New Transaction
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cash</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(cashPosition.totalCash || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {cashPosition.cashChange >= 0 ? "+" : ""}
              {cashPosition.cashChange}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Fees</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(feeCollection.outstanding || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {feeCollection.outstandingCount || 0} students with pending fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview.monthlyRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {overview.revenueGrowth >= 0 ? "+" : ""}
              {overview.revenueGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(expenseSummary.monthlyTotal || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {expenseSummary.expenseChange >= 0 ? "+" : ""}
              {expenseSummary.expenseChange}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Cash Position */}
        <Card>
          <CardHeader>
            <CardTitle>Cash Position</CardTitle>
            <CardDescription>Current cash and bank balances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Cash on Hand</span>
                <span className="font-medium">{formatCurrency(cashPosition.cashOnHand || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Bank Balance (USD)</span>
                <span className="font-medium">{formatCurrency(cashPosition.bankUSD || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Bank Balance (ZWL)</span>
                <span className="font-medium">{formatCurrency(cashPosition.bankZWL || 0, "ZWL")}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-sm font-medium">Total</span>
                <span className="font-bold">{formatCurrency(cashPosition.totalCash || 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fee Collection Status */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Collection</CardTitle>
            <CardDescription>Current term fee collection status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Invoiced</span>
                <span className="font-medium">{formatCurrency(feeCollection.totalInvoiced || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Collected</span>
                <span className="font-medium text-green-600">{formatCurrency(feeCollection.collected || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Outstanding</span>
                <span className="font-medium text-red-600">{formatCurrency(feeCollection.outstanding || 0)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-sm font-medium">Collection Rate</span>
                <span className="font-bold">{feeCollection.collectionRate || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Status */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Status</CardTitle>
            <CardDescription>Current year budget performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Budget</span>
                <span className="font-medium">{formatCurrency(budgetStatus.totalBudget || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Spent</span>
                <span className="font-medium">{formatCurrency(budgetStatus.totalSpent || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Remaining</span>
                <span className="font-medium">{formatCurrency(budgetStatus.remaining || 0)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-sm font-medium">Utilization</span>
                <span className="font-bold">{budgetStatus.utilizationRate || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used accounting functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/accounting/invoices/create">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <CreditCard className="w-6 h-6 mb-2" />
                <span className="text-sm">Create Invoice</span>
              </Button>
            </Link>
            <Link href="/dashboard/accounting/payments/record">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <CheckCircle className="w-6 h-6 mb-2" />
                <span className="text-sm">Record Payment</span>
              </Button>
            </Link>
            <Link href="/dashboard/accounting/expenses/create">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <TrendingDown className="w-6 h-6 mb-2" />
                <span className="text-sm">Add Expense</span>
              </Button>
            </Link>
            <Link href="/dashboard/accounting/payroll">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <Users className="w-6 h-6 mb-2" />
                <span className="text-sm">Process Payroll</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
