"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, FileText, Plus } from "lucide-react"
import { examAPI } from "@/lib/api"
import type { Exam } from "@/types"
import Link from "next/link"

export default function ExamSchedule() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      const response = await examAPI.getSchedule()
      setExams(response.data)
    } catch (error) {
      console.error("Failed to fetch exams:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800"
      case "ONGOING":
        return "bg-green-100 text-green-800"
      case "COMPLETED":
        return "bg-gray-100 text-gray-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case "UNIT_TEST":
        return "bg-yellow-100 text-yellow-800"
      case "MIDTERM":
        return "bg-orange-100 text-orange-800"
      case "FINAL":
        return "bg-purple-100 text-purple-800"
      case "PRACTICAL":
        return "bg-cyan-100 text-cyan-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Exam Schedule</h2>
          <p className="text-muted-foreground">Loading exam schedule...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Exam Schedule</h2>
          <p className="text-muted-foreground">Manage and view all scheduled examinations</p>
        </div>
        <Link href="/dashboard/exams/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Schedule New Exam
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {exams.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Exams Scheduled</h3>
              <p className="text-muted-foreground text-center mb-4">
                There are no exams scheduled at the moment. Create a new exam to get started.
              </p>
              <Link href="/dashboard/exams/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule First Exam
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          exams.map((exam) => (
            <Card key={exam.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {exam.title}
                      <Badge className={getStatusColor(exam.status)}>{exam.status.replace("_", " ")}</Badge>
                    </CardTitle>
                    <CardDescription>
                      {exam.subject} • {exam.class}
                    </CardDescription>
                  </div>
                  <Badge className={getExamTypeColor(exam.examType)}>{exam.examType.replace("_", " ")}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{new Date(exam.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {exam.startTime} - {exam.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{exam.totalMarks} marks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Pass: {exam.passingMarks} marks</span>
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    View Results
                  </Button>
                  {exam.status === "SCHEDULED" && <Button size="sm">Start Exam</Button>}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
