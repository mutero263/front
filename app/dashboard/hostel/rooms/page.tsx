"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Users, Plus, Edit, UserPlus } from "lucide-react"
import { hostelAPI } from "@/lib/api"
import type { HostelRoom } from "@/types"

export default function HostelRooms() {
  const [rooms, setRooms] = useState<HostelRoom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await hostelAPI.getRooms()
      setRooms(response.data)
    } catch (error) {
      console.error("Failed to fetch rooms:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case "SINGLE":
        return "bg-blue-100 text-blue-800"
      case "DOUBLE":
        return "bg-green-100 text-green-800"
      case "TRIPLE":
        return "bg-yellow-100 text-yellow-800"
      case "DORMITORY":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getOccupancyColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    if (percentage >= 100) return "bg-red-100 text-red-800"
    if (percentage >= 80) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hostel Rooms</h2>
          <p className="text-muted-foreground">Loading hostel rooms...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hostel Rooms</h2>
          <p className="text-muted-foreground">Manage hostel room allocation and occupancy</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Room
        </Button>
      </div>

      <div className="grid gap-4">
        {rooms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Home className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Rooms Available</h3>
              <p className="text-muted-foreground text-center mb-4">
                No hostel rooms have been added yet. Create rooms to manage occupancy.
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add First Room
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <Card key={room.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      Room {room.roomNumber}
                      <Badge className={getRoomTypeColor(room.roomType)}>{room.roomType}</Badge>
                    </CardTitle>
                    <Badge className={room.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {room.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <CardDescription>
                    {room.building} • Floor {room.floor}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Occupancy</span>
                      </div>
                      <Badge className={getOccupancyColor(room.currentOccupancy, room.capacity)}>
                        {room.currentOccupancy}/{room.capacity}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Facilities:</h4>
                      <div className="flex flex-wrap gap-1">
                        {room.facilities.map((facility, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between space-x-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      {room.currentOccupancy < room.capacity && (
                        <Button size="sm" className="flex-1">
                          <UserPlus className="w-4 h-4 mr-1" />
                          Allocate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
