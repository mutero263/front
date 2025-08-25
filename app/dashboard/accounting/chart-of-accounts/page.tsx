"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react"
import { chartOfAccountsAPI } from "@/lib/accounting-api"
import type { ChartOfAccount } from "@/types/accounting"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ChartOfAccounts() {
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<ChartOfAccount | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    accountCode: "",
    accountName: "",
    accountType: "",
    parentAccountId: "",
  })

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await chartOfAccountsAPI.getAll()
      setAccounts(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load chart of accounts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingAccount) {
        await chartOfAccountsAPI.update(editingAccount.id, formData)
        toast({
          title: "Success",
          description: "Account updated successfully",
        })
      } else {
        await chartOfAccountsAPI.create(formData)
        toast({
          title: "Success",
          description: "Account created successfully",
        })
      }
      setDialogOpen(false)
      setEditingAccount(null)
      setFormData({ accountCode: "", accountName: "", accountType: "", parentAccountId: "" })
      fetchAccounts()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save account",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (account: ChartOfAccount) => {
    setEditingAccount(account)
    setFormData({
      accountCode: account.accountCode,
      accountName: account.accountName,
      accountType: account.accountType,
      parentAccountId: account.parentAccountId?.toString() || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this account?")) {
      try {
        await chartOfAccountsAPI.delete(id)
        toast({
          title: "Success",
          description: "Account deleted successfully",
        })
        fetchAccounts()
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to delete account",
          variant: "destructive",
        })
      }
    }
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "ASSET":
        return "bg-green-100 text-green-800"
      case "LIABILITY":
        return "bg-red-100 text-red-800"
      case "INCOME":
        return "bg-blue-100 text-blue-800"
      case "EXPENSE":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const groupedAccounts = accounts.reduce(
    (acc, account) => {
      if (!acc[account.accountType]) {
        acc[account.accountType] = []
      }
      acc[account.accountType].push(account)
      return acc
    },
    {} as Record<string, ChartOfAccount[]>,
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chart of Accounts</h2>
          <p className="text-muted-foreground">Loading accounts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chart of Accounts</h2>
          <p className="text-muted-foreground">Manage your accounting structure</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAccount ? "Edit Account" : "Add New Account"}</DialogTitle>
              <DialogDescription>
                {editingAccount ? "Update account details" : "Create a new account in your chart of accounts"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountCode">Account Code</Label>
                  <Input
                    id="accountCode"
                    value={formData.accountCode}
                    onChange={(e) => setFormData({ ...formData, accountCode: e.target.value })}
                    placeholder="e.g., 1001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select
                    value={formData.accountType}
                    onValueChange={(value) => setFormData({ ...formData, accountType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASSET">Asset</SelectItem>
                      <SelectItem value="LIABILITY">Liability</SelectItem>
                      <SelectItem value="INCOME">Income</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  placeholder="e.g., Cash at Bank"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingAccount ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Account Groups */}
      <div className="space-y-6">
        {Object.entries(groupedAccounts).map(([type, typeAccounts]) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                {type.charAt(0) + type.slice(1).toLowerCase()}s
                <Badge className={getAccountTypeColor(type)}>{typeAccounts.length} accounts</Badge>
              </CardTitle>
              <CardDescription>
                Total Balance: {formatCurrency(typeAccounts.reduce((sum, acc) => sum + acc.balance, 0))}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {typeAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{account.accountCode}</span>
                        <span className="font-medium">{account.accountName}</span>
                      </div>
                      {!account.isActive && <Badge variant="secondary">Inactive</Badge>}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(account.balance)}</div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(account)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(account.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
