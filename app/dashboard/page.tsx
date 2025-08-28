"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Calendar,
  ClipboardCheck,
  Calculator,
  Bell,
  Activity,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalRevenue: number
  pendingFees: number
  todayAttendance: number
  upcomingExams: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 1250,
    totalTeachers: 85,
    totalRevenue: 125000,
    pendingFees: 45000,
    todayAttendance: 95,
    upcomingExams: 3,
  })
  const [userType, setUserType] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    // Get user info from localStorage
    if (typeof window !== "undefined") {
      const storedUserType = localStorage.getItem("userType") || ""
      const storedUsername = localStorage.getItem("username") || ""
      setUserType(storedUserType)
      setUsername(storedUsername)
    }
  }, [])

  const quickActions = [
    {
      title: "Student Registration",
      description: "Register new students",
      icon: Users,
      href: "/dashboard/students/register",
      color: "bg-blue-500",
    },
    {
      title: "Student List",
      description: "Show all registered students",
      icon: Users,
      href: "/dashboard/students/list"
    },
    {
      title: "Teacher Management",
      description: "Manage teaching staff",
      icon: GraduationCap,
      href: "/dashboard/teachers/register",
      color: "bg-green-500",
    },
    {
      title: "Fee Management",
      description: "Process fee payments",
      icon: DollarSign,
      href: "/dashboard/accounting/invoices",
      color: "bg-yellow-500",
    },
    {
      title: "Attendance",
      description: "Mark daily attendance",
      icon: ClipboardCheck,
      href: "/dashboard/attendance/mark",
      color: "bg-purple-500",
    },
    {
      title: "Exam Schedule",
      description: "Schedule examinations",
      icon: Calendar,
      href: "/dashboard/exams/schedule",
      color: "bg-red-500",
    },
    {
      title: "Accounting",
      description: "Financial management",
      icon: Calculator,
      href: "/dashboard/accounting",
      color: "bg-indigo-500",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      title: "New student registered",
      description: "John Doe enrolled in Grade 10A",
      time: "2 hours ago",
      type: "student",
    },
    {
      id: 2,
      title: "Fee payment received",
      description: "$500 payment from Mary Smith",
      time: "4 hours ago",
      type: "payment",
    },
    {
      id: 3,
      title: "Exam scheduled",
      description: "Mathematics exam for Grade 12",
      time: "1 day ago",
      type: "exam",
    },
    {
      id: 4,
      title: "Teacher assigned",
      description: "Ms. Johnson assigned to Physics",
      time: "2 days ago",
      type: "teacher",
    },
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const getUserTypeDisplay = (type: string) => {
    switch (type) {
      case "administrator":
        return "Administrator"
      case "teacher":
        return "Teacher"
      case "student":
        return "Student"
      case "guardian":
        return "Guardian"
      default:
        return "User"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {username || "User"}!
          </h2>
          <p className="text-muted-foreground">Welcome to your {getUserTypeDisplay(userType)} dashboard</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{getUserTypeDisplay(userType)}</Badge>
          <Button size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">+2 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (USD)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAttendance}%</div>
            <p className="text-xs text-muted-foreground">Above average</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 justify-start bg-transparent"
                  onClick={() => router.push(action.href)}
                >
                  <div className={`p-2 rounded-md ${action.color} mr-4`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="p-2 bg-muted rounded-full">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Key metrics and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Fee Payments</span>
                <Badge variant="destructive">${stats.pendingFees.toLocaleString()}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Upcoming Exams</span>
                <Badge variant="secondary">{stats.upcomingExams}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">System Status</span>
                <Badge variant="default">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Status</span>
                <Badge variant="default">Connected</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
