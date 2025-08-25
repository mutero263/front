"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Check, X, Clock, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { attendanceAPI, studentAPI } from "@/lib/api"
import type { Student } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { Users } from "lucide-react" // Import Users component

export default function MarkAttendance() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const classes = [
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ]

  useEffect(() => {
    if (selectedClass) {
      fetchStudents()
    }
  }, [selectedClass])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const response = await studentAPI.getByClass(selectedClass)
      setStudents(response.data)
      // Initialize attendance with all students as present
      const initialAttendance: Record<number, string> = {}
      response.data.forEach((student: Student) => {
        initialAttendance[student.id] = "PRESENT"
      })
      setAttendance(initialAttendance)
    } catch (error) {
      console.error("Failed to fetch students:", error)
      toast({
        title: "Error",
        description: "Failed to fetch students for the selected class.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAttendanceChange = (studentId: number, status: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }))
  }

  const handleSaveAttendance = async () => {
    if (!selectedClass || students.length === 0) {
      toast({
        title: "Error",
        description: "Please select a class and ensure students are loaded.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const attendanceData = {
        class: selectedClass,
        date: format(selectedDate, "yyyy-MM-dd"),
        attendance: Object.entries(attendance).map(([studentId, status]) => ({
          studentId: Number.parseInt(studentId),
          status,
        })),
      }

      await attendanceAPI.markAttendance(attendanceData)
      toast({
        title: "Success!",
        description: "Attendance has been saved successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save attendance.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-100 text-green-800"
      case "ABSENT":
        return "bg-red-100 text-red-800"
      case "LATE":
        return "bg-yellow-100 text-yellow-800"
      case "EXCUSED":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PRESENT":
        return <Check className="w-4 h-4" />
      case "ABSENT":
        return <X className="w-4 h-4" />
      case "LATE":
        return <Clock className="w-4 h-4" />
      case "EXCUSED":
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getAttendanceSummary = () => {
    const total = students.length
    const present = Object.values(attendance).filter((status) => status === "PRESENT").length
    const absent = Object.values(attendance).filter((status) => status === "ABSENT").length
    const late = Object.values(attendance).filter((status) => status === "LATE").length
    const excused = Object.values(attendance).filter((status) => status === "EXCUSED").length

    return { total, present, absent, late, excused }
  }

  const summary = getAttendanceSummary()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mark Attendance</h2>
        <p className="text-muted-foreground">Record daily attendance for students</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Settings</CardTitle>
          <CardDescription>Select date and class to mark attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && students.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>
                {selectedClass} • {format(selectedDate, "PPP")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">{summary.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{summary.present}</p>
                  <p className="text-sm text-muted-foreground">Present</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
                  <p className="text-sm text-muted-foreground">Absent</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{summary.late}</p>
                  <p className="text-sm text-muted-foreground">Late</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{summary.excused}</p>
                  <p className="text-sm text-muted-foreground">Excused</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Attendance</CardTitle>
                  <CardDescription>Mark attendance for each student</CardDescription>
                </div>
                <Button onClick={handleSaveAttendance} disabled={saving}>
                  {saving ? "Saving..." : "Save Attendance"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading students...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">
                            {student.firstName} {student.surname}
                          </p>
                          <p className="text-sm text-muted-foreground">Entry No: {student.entryNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {["PRESENT", "ABSENT", "LATE", "EXCUSED"].map((status) => (
                          <Button
                            key={status}
                            variant={attendance[student.id] === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleAttendanceChange(student.id, status)}
                            className={cn(
                              "flex items-center gap-1",
                              attendance[student.id] === status && getStatusColor(status),
                            )}
                          >
                            {getStatusIcon(status)}
                            {status}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {selectedClass && students.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
            <p className="text-muted-foreground text-center">No students are enrolled in the selected class.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
