"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, User, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function StudentListPage() {
  const [students, setStudents] = useState<any[]>([])
  const [filteredStudents, setFilteredStudents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Load students from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("students")
    const data = stored ? JSON.parse(stored) : []
    setStudents(data)
    setFilteredStudents(data)
  }, [])

  // Filter students based on search term
  useEffect(() => {
    const results = students.filter(
      (student) =>
        student.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.middleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.entryNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.address?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredStudents(results)
  }, [searchTerm, students])

  // Handle delete
  const handleDelete = (id: string, fullName: string) => {
    const updated = students.filter((s) => s.id !== id)
    localStorage.setItem("students", JSON.stringify(updated))
    setStudents(updated)
    setFilteredStudents(updated)

    toast({
      title: "Deleted",
      description: `${fullName} has been removed.`,
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Student List</h1>
            <p className="text-muted-foreground">
              {students.length} student(s) registered
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/students/register">+ Register New Student</Link>
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <Input
                placeholder="Search by name, entry number, email, phone, city, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>

          <CardContent>
            {filteredStudents.length === 0 ? (
              <p className="text-center py-6 text-gray-500">
                {searchTerm ? "No matching students found." : "No students registered yet."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b text-left text-sm font-semibold text-gray-700">
                      <th className="pb-3">Surname</th>
                      <th className="pb-3">First Name</th>
                      <th className="pb-3">Middle Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Phone Number</th>
                      <th className="pb-3">Entry Number</th>
                      <th className="pb-3">Address</th>
                      <th className="pb-3">City</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3">{student.surname || "-"}</td>
                        <td className="py-3">{student.firstName || "-"}</td>
                        <td className="py-3">{student.middleName || "-"}</td>
                        <td className="py-3">{student.email || "-"}</td>
                        <td className="py-3">{student.phone || "-"}</td>
                        <td className="py-3 font-medium">{student.entryNumber || "-"}</td>
                        <td className="py-3 max-w-xs truncate" title={student.address}>
                          {student.address || "-"}
                        </td>
                        <td className="py-3">{student.city || "-"}</td>
                        <td className="py-3 flex items-center gap-2">
                          {/* View Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="gap-1"
                          >
                            <Link href={`/dashboard/students/profiles/${student.id}`}>
                              <Eye className="w-3 h-3" />
                              View
                            </Link>
                          </Button>

                          {/* Delete Button */}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              confirm(
                                `Delete ${student.firstName} ${student.surname}? This cannot be undone.`
                              ) &&
                              handleDelete(
                                student.id,
                                `${student.firstName} ${student.surname}`
                              )
                            }
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}