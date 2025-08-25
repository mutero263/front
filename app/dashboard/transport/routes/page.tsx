"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Route, Plus, Edit, Trash2 } from "lucide-react"
import { transportAPI } from "@/lib/api"
import type { TransportRoute } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function TransportRoutes() {
  const [routes, setRoutes] = useState<TransportRoute[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = async () => {
    try {
      const response = await transportAPI.getRoutes()
      setRoutes(response.data)
    } catch (error) {
      console.error("Failed to fetch routes:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transport Routes</h2>
          <p className="text-muted-foreground">Loading transport routes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transport Routes</h2>
          <p className="text-muted-foreground">Manage school transport routes and schedules</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Route
        </Button>
      </div>

      <div className="grid gap-4">
        {routes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Route className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Routes Available</h3>
              <p className="text-muted-foreground text-center mb-4">
                No transport routes have been created yet. Add a new route to get started.
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create First Route
              </Button>
            </CardContent>
          </Card>
        ) : (
          routes.map((route) => (
            <Card key={route.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {route.routeName}
                      <Badge variant="secondary">#{route.routeNumber}</Badge>
                    </CardTitle>
                    <CardDescription>
                      {route.startPoint} → {route.endPoint}
                    </CardDescription>
                  </div>
                  <Badge className={route.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {route.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{route.distance} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{route.estimatedTime} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Route className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{route.stops.length} stops</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Stops:</h4>
                  <div className="flex flex-wrap gap-1">
                    {route.stops.map((stop, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {stop}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
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
