"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Plus, Edit, Eye } from "lucide-react"
import { feeAPI } from "@/lib/api"
import type { FeeStructure } from "@/types"

export default function FeeStructurePage() {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeeStructures()
  }, [])

  const fetchFeeStructures = async () => {
    try {
      const response = await feeAPI.getStructure()
      setFeeStructures(response.data)
    } catch (error) {
      console.error("Failed to fetch fee structures:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fee Structure</h2>
          <p className="text-muted-foreground">Loading fee structures...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fee Structure</h2>
          <p className="text-muted-foreground">Manage school fee structures by grade and academic year</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Fee Structure
        </Button>
      </div>

      <div className="grid gap-4">
        {feeStructures.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <DollarSign className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Fee Structures</h3>
              <p className="text-muted-foreground text-center mb-4">
                No fee structures have been created yet. Create one to get started.
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create First Structure
              </Button>
            </CardContent>
          </Card>
        ) : (
          feeStructures.map((structure) => (
            <Card key={structure.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {structure.grade}
                      <Badge variant="secondary">{structure.academicYear}</Badge>
                    </CardTitle>
                    <CardDescription>Total Annual Fee: {formatCurrency(structure.totalFee)}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Tuition Fee</p>
                    <p className="text-lg font-semibold">{formatCurrency(structure.tuitionFee)}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Admission Fee</p>
                    <p className="text-lg font-semibold">{formatCurrency(structure.admissionFee)}</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Exam Fee</p>
                    <p className="text-lg font-semibold">{formatCurrency(structure.examFee)}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Library Fee</p>
                    <p className="text-lg font-semibold">{formatCurrency(structure.libraryFee)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Sports Fee</p>
                    <p className="text-lg font-semibold">{formatCurrency(structure.sportsFee)}</p>
                  </div>
                  <div className="text-center p-3 bg-cyan-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Transport Fee</p>
                    <p className="text-lg font-semibold">{formatCurrency(structure.transportFee)}</p>
                  </div>
                  <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Hostel Fee</p>
                    <p className="text-lg font-semibold">{formatCurrency(structure.hostelFee)}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Structure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
