"use client"

import { useState, useEffect } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  GraduationCap,
  Users,
  BookOpen,
  Bus,
  DollarSign,
  Home,
  ClipboardList,
  Settings,
  LogOut,
  Award,
  BarChart3,
  Calculator,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

export function AppSidebar() {
  const [userType, setUserType] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserType(localStorage.getItem("userType") || "")
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("userType")
      localStorage.removeItem("username")
    }
    router.push("/")
  }

  const menuItems = [
    {
      title: "Student Management",
      icon: Users,
      items: [
        { title: "Student Registration", href: "/dashboard/students/register" },
        { title: "Student List", href: "/dashboard/students/list" },
        { title: "Student Profiles", href: "/dashboard/students/profiles" },
        { title: "Student Reports", href: "/dashboard/students/reports" },
      ],
    },
    {
      title: "Teacher Management",
      icon: GraduationCap,
      items: [
        { title: "Teacher Registration", href: "/dashboard/teachers/register" },
        { title: "Teacher List", href: "/dashboard/teachers/list" },
        { title: "Subject Assignment", href: "/dashboard/teachers/assignments" },
        { title: "Teacher Reports", href: "/dashboard/teachers/reports" },
      ],
    },
    {
      title: "Academic Structure",
      icon: BookOpen,
      items: [
        { title: "Classes & Grades", href: "/dashboard/academic/classes" },
        { title: "Subjects", href: "/dashboard/academic/subjects" },
        { title: "Curriculum", href: "/dashboard/academic/curriculum" },
        { title: "Academic Calendar", href: "/dashboard/academic/calendar" },
      ],
    },
    {
      title: "Exams & Results",
      icon: Award,
      items: [
        { title: "Exam Schedule", href: "/dashboard/exams/schedule" },
        { title: "Create Exam", href: "/dashboard/exams/create" },
        { title: "Result Entry", href: "/dashboard/exams/results" },
        { title: "Grade Reports", href: "/dashboard/exams/reports" },
        { title: "Result Analysis", href: "/dashboard/exams/analysis" },
      ],
    },
    {
      title: "Transport Management",
      icon: Bus,
      items: [
        { title: "Routes", href: "/dashboard/transport/routes" },
        { title: "Vehicles", href: "/dashboard/transport/vehicles" },
        { title: "Driver Management", href: "/dashboard/transport/drivers" },
        { title: "Transport Reports", href: "/dashboard/transport/reports" },
      ],
    },
    {
      title: "Fee Management",
      icon: DollarSign,
      items: [
        { title: "Fee Structure", href: "/dashboard/fees/structure" },
        { title: "Payment Entry", href: "/dashboard/fees/payments" },
        { title: "Fee Collection", href: "/dashboard/fees/collection" },
        { title: "Fee Reports", href: "/dashboard/fees/reports" },
        { title: "Outstanding Fees", href: "/dashboard/fees/outstanding" },
      ],
    },
    {
      title: "Hostel Management",
      icon: Home,
      items: [
        { title: "Room Allocation", href: "/dashboard/hostel/rooms" },
        { title: "Room Management", href: "/dashboard/hostel/management" },
        { title: "Hostel Fees", href: "/dashboard/hostel/fees" },
        { title: "Occupancy Reports", href: "/dashboard/hostel/occupancy" },
      ],
    },
    {
      title: "Attendance Management",
      icon: ClipboardList,
      items: [
        { title: "Mark Attendance", href: "/dashboard/attendance/mark" },
        { title: "Attendance Reports", href: "/dashboard/attendance/reports" },
        { title: "Class Register", href: "/dashboard/attendance/register" },
        { title: "Attendance Analysis", href: "/dashboard/attendance/analysis" },
      ],
    },
    {
      title: "Accounting & Finance",
      icon: Calculator,
      items: [
        { title: "Dashboard", href: "/dashboard/accounting" },
        { title: "Chart of Accounts", href: "/dashboard/accounting/chart-of-accounts" },
        { title: "Invoices", href: "/dashboard/accounting/invoices" },
        { title: "Payments", href: "/dashboard/accounting/payments" },
        { title: "Expenses", href: "/dashboard/accounting/expenses" },
        { title: "Payroll", href: "/dashboard/accounting/payroll" },
        { title: "Budget Management", href: "/dashboard/accounting/budgets" },
        { title: "Bank Reconciliation", href: "/dashboard/accounting/bank-reconciliation" },
        { title: "Financial Reports", href: "/dashboard/accounting/reports" },
        { title: "Audit Trail", href: "/dashboard/accounting/audit" },
      ],
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-lg font-bold">TSMS</h2>
            <p className="text-xs text-muted-foreground capitalize">{userType} Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">
                    <BarChart3 className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <Collapsible key={item.title} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.href}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/settings">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
