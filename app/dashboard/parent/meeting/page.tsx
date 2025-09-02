 "use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, User, School, Phone, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ParentPage() {
  const [children, setChildren] = useState<any[]>([])
  const [activeMeets, setActiveMeets] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredChildren, setFilteredChildren] = useState<any[]>([])

  // Load children linked to parent
  useEffect(() => {
    const stored = localStorage.getItem("students")
    const allStudents = stored ? JSON.parse(stored) : []

    // Filter: only children where parent email matches
    const myChildren = allStudents.filter(
      (s: any) =>
        s.guardianEmail === "parent1@tsms.edu" || // Demo email
        s.guardianEmail?.includes("parent") // Fallback match
    )

    setChildren(myChildren)
    setFilteredChildren(myChildren) // Initialize filtered list

    // Load active Google Meet links
    const meets: Record<string, string> = {}
    myChildren.forEach((s: any) => {
      const link = localStorage.getItem(`meet_${s.id}`)
      if (link) meets[s.id] = link
    })
    setActiveMeets(meets)
  }, [])

  // Filter children based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredChildren(children)
    } else {
      const results = children.filter((child) =>
        [
          child.firstName,
          child.middleName,
          child.surname,
          child.entryNumber,
          child.assignedClass,
        ]
          .filter(Boolean)
          .some((field) =>
            field.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
      setFilteredChildren(results)
    }
  }, [searchTerm, children])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Parent Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          View your child's information and join consultations
        </p>

        {/* Search Bar */}
        <div className="mb-6">
          <Label htmlFor="parent-search">Search Your Child</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <Input
              id="parent-search"
              placeholder="Search by name, entry number, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results */}
        {children.length === 0 ? (
          // No children linked to this parent
          <Card>
            <CardContent className="py-6 text-center text-gray-500">
              <p>
                No children found in the system.
              </p>
              <p className="mt-1">
                Please check your login or contact the school administrator.
              </p>
            </CardContent>
          </Card>
        ) : filteredChildren.length === 0 ? (
          // Children exist, but none match search
          <Card>
            <CardContent className="py-6 text-center text-gray-500">
              <p>
                No child found matching <strong>"{searchTerm}"</strong>.
              </p>
              <p className="mt-1">
                Please check the spelling or try another keyword.
              </p>
            </CardContent>
          </Card>
        ) : (
          // Show matched children
          <div className="space-y-6">
            {filteredChildren.map((child) => (
              <Card key={child.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {child.firstName} {child.middleName} {child.surname}
                      </CardTitle>
                      <CardDescription>
                        <School className="w-4 h-4 inline mr-1" />
                        {child.assignedClass.replace("grade", "Grade ")} • Entry #{child.entryNumber}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">Your Child</Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4" />
                      <strong>Teacher:</strong> Mr. Smith ({child.assignedClass.replace("grade", "Grade ")})
                    </div>

                    {activeMeets[child.id] ? (
                      <Button
                        className="bg-green-600 hover:bg-green-700 gap-2"
                        onClick={() => window.open(activeMeets[child.id], "_blank")}
                      >
                        <Video className="w-4 h-4" />
                        Join Google Meet Consultation
                      </Button>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No active consultation. Please wait for teacher to start.
                      </p>
                    )}
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