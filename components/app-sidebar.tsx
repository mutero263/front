"use client";

import { useState, useEffect } from "react";
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
} from "@/components/ui/sidebar";
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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export function AppSidebar() {
  const [userType, setUserType] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userType")?.toUpperCase();
      if (!stored) {
        router.push("/login");
        return;
      }
      setUserType(stored);
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("username");
    }
    router.push("/login");
  };

  //  Define menu modules with per-item access control
  const menuItems = [
    {
      title: "Student Management",
      icon: Users,
      items: [
        {
          title: "Student Profile",
          href: "/dashboard/students/profiles",
          allowed: ["STUDENT", "GUARDIAN",],
        },
        {
          title: "Student Registration",
          href: "/dashboard/students/register",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Student List",
          href: "/dashboard/students/list",
          allowed: ["ADMINISTRATOR", "TEACHER"],
        },
        {
          title: "Student Reports",
          href: "/dashboard/students/reports",
          allowed: ["ADMINISTRATOR", "TEACHER", "STUDENT", "GUARDIAN"],
        },
      ],
    },
    {
      title: "Parent",
      icon: Users,
      items: [
        {
          title: "Meeting",
          href: "/dashboard/parents/meeting",
          allowed: ["GUARDIAN", "TEACHER", "ADMINISTRATOR"],
        },
      ],
    },
    {
      title: "Teacher Management",
      icon: GraduationCap,
      items: [
        {
          title: "Teacher Registration",
          href: "/dashboard/teachers/register",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Teacher List",
          href: "/dashboard/teachers/list",
          allowed: ["ADMINISTRATOR", "TEACHER"],
        },
        {
          title: "Subject Assignment",
          href: "/dashboard/teachers/assignments",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Teacher Reports",
          href: "/dashboard/teachers/reports",
          allowed: ["ADMINISTRATOR", "TEACHER"],
        },
        {
          title: "Consultation",
          href: "/dashboard/teachers/consultation",
          allowed: ["TEACHER", "ADMINISTRATOR"],
        },
      ],
    },
    {
      title: "Academic Structure",
      icon: BookOpen,
      items: [
        {
          title: "Classes & Grades",
          href: "/dashboard/academic/classes",
          allowed: ["TEACHER", "ADMINISTRATOR"],
        },
        {
          title: "Subjects",
          href: "/dashboard/academic/subjects",
          allowed: ["TEACHER", "ADMINISTRATOR", "STUDENT", "GUARDIAN"],
        },
        {
          title: "Curriculum",
          href: "/dashboard/academic/curriculum",
          allowed: ["TEACHER", "ADMINISTRATOR"],
        },
        {
          title: "Academic Calendar",
          href: "/dashboard/academic/calendar",
          allowed: ["TEACHER", "ADMINISTRATOR", "STUDENT", "GUARDIAN"],
        },
      ],
    },
    {
      title: "Exams & Results",
      icon: Award,
      items: [
        {
          title: "Exam Schedule",
          href: "/dashboard/exams/schedule",
          allowed: ["TEACHER", "ADMINISTRATOR", "STUDENT", "GUARDIAN"],
        },
        {
          title: "Create Exam",
          href: "/dashboard/exams/create",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Result Entry",
          href: "/dashboard/exams/results",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Grade Reports",
          href: "/dashboard/exams/reports",
          allowed: ["TEACHER", "ADMINISTRATOR", "STUDENT", "GUARDIAN"],
        },
        {
          title: "Result Analysis",
          href: "/dashboard/exams/analysis",
          allowed: ["TEACHER", "ADMINISTRATOR", "STUDENT", "GUARDIAN"],
        },
      ],
    },
    {
      title: "Transport Management",
      icon: Bus,
      items: [
        {
          title: "Routes",
          href: "/dashboard/transport/routes",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Vehicles",
          href: "/dashboard/transport/vehicles",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Driver Management",
          href: "/dashboard/transport/drivers",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Transport Reports",
          href: "/dashboard/transport/reports",
          allowed: ["ADMINISTRATOR"],
        },
      ],
    },
    {
      title: "Fee Management",
      icon: DollarSign,
      items: [
        {
          title: "Fee Structure",
          href: "/dashboard/fees/structure",
          allowed: ["STUDENT", "GUARDIAN", "ADMINISTRATOR"],
        },
        {
          title: "Outstanding Fees",
          href: "/dashboard/fees/outstanding",
          allowed: ["STUDENT", "GUARDIAN", "ADMINISTRATOR"],
        },
        {
          title: "Payment Entry",
          href: "/dashboard/fees/payments",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Fee Collection",
          href: "/dashboard/fees/collection",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Fee Reports",
          href: "/dashboard/fees/reports",
          allowed: ["ADMINISTRATOR", ],
        },
      ],
    },
    {
      title: "Hostel Management",
      icon: Home,
      items: [
        {
          title: "Room Allocation",
          href: "/dashboard/hostel/rooms",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Room Management",
          href: "/dashboard/hostel/management",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Hostel Fees",
          href: "/dashboard/hostel/fees",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Occupancy Reports",
          href: "/dashboard/hostel/occupancy",
          allowed: ["ADMINISTRATOR"],
        },
      ],
    },
    {
      title: "Attendance Management",
      icon: ClipboardList,
      items: [
        {
          title: "Mark Attendance",
          href: "/dashboard/attendance/mark",
          allowed: ["TEACHER", "ADMINISTRATOR"],
        },
        {
          title: "Attendance Reports",
          href: "/dashboard/attendance/reports",
          allowed: ["TEACHER", "ADMINISTRATOR"],
        },
        {
          title: "Class Register",
          href: "/dashboard/attendance/register",
          allowed: ["TEACHER", "ADMINISTRATOR"],
        },
        {
          title: "Attendance Analysis",
          href: "/dashboard/attendance/analysis",
          allowed: ["TEACHER", "ADMINISTRATOR"],
        },
      ],
    },
    {
      title: "Accounting & Finance",
      icon: Calculator,
      items: [
        {
          title: "Dashboard",
          href: "/dashboard/accounting",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Chart of Accounts",
          href: "/dashboard/accounting/chart-of-accounts",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Invoices",
          href: "/dashboard/accounting/invoices",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Payments",
          href: "/dashboard/accounting/payments",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Expenses",
          href: "/dashboard/accounting/expenses",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Payroll",
          href: "/dashboard/accounting/payroll",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Financial Reports",
          href: "/dashboard/accounting/reports",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Audit Trail",
          href: "/dashboard/accounting/audit",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Bank Reconciliation",
          href: "/dashboard/accounting/bank-reconciliation",
          allowed: ["ADMINISTRATOR"],
        },
        {
          title: "Budget Management",
          href: "/dashboard/accounting/budgets",
          allowed: ["ADMINISTRATOR"],
        },
      ],
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-lg font-bold">TSMS</h2>
            <p className="text-xs text-muted-foreground capitalize">
              {userType?.toLowerCase() || "user"} portal
            </p>
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
              {menuItems.map((module) => {
                // Filter items in module by user access
                const accessibleItems = module.items.filter((item) =>
                  item.allowed.includes(userType)
                );

                // Only show module if user has access to any item
                if (accessibleItems.length === 0) return null;

                return (
                  <Collapsible key={module.title} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <module.icon className="w-4 h-4" />
                          <span>{module.title}</span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {accessibleItems.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={item.href}>
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
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
  );
}