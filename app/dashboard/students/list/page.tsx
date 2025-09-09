"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

// ✅ Match your backend DTO exactly
interface StudentRegistrationResponse {
  surname: string;
  firstName: string;
  middleName: string;
  entryNumber: string;
  email: string;
  phoneNumber: string;
  city: string;
  country: string;
  address: string;
}

export default function StudentListPage() {
  const [students, setStudents] = useState<StudentRegistrationResponse[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentRegistrationResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // ✅ Fetch students from /students/all
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast({
            title: "Authentication Required",
            description: "Please log in to view students.",
            variant: "destructive",
          });
          window.location.href = "/login";
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/all`, {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Expected JSON, got:", text);
          throw new Error("Server returned HTML. Check if backend is running.");
        }

        const data: StudentRegistrationResponse[] = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (err: any) {
        console.error("Error fetching students:", err);
        toast({
          title: "Load Failed",
          description:
            err.message.includes("HTML") || err.message.includes("token")
              ? "Check if backend is running and URL is correct."
              : err.message || "Could not load student list.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [toast]);

  // ✅ Filter students based on search term
  useEffect(() => {
    const results = students.filter(
      (s) =>
        s.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.middleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.entryNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(results);
  }, [searchTerm, students]);

  // deactivate student by entry number
  const deactivateStudent = async (entryNumber: string) => {
    if (!confirm(`Deactivate student with Entry #${entryNumber}? This cannot be undone.`)) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) { 
        toast({
          title: "Authentication Required",
          description: "Please log in to perform this action.",
          variant: "destructive",
        });
        window.location.href = "/login";
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/entry-number/${encodeURIComponent(entryNumber)}`,
        { 
          method: "Deactivate",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to deactivate student");
      setStudents((prev) => prev.filter((s) => s.entryNumber !== entryNumber));
      toast({
        title: "Student Deactivated",
        description: `Student with Entry #${entryNumber} has been deactivated.`,
        variant: "default",
      });
    } catch (err: any) {
      console.error("Error deactivating student:", err);
      toast({
        title: "Deactivation Failed",
        description: err.message || "Could not deactivate student.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Student List</h1>
          <p className="text-muted-foreground">
            {loading ? "Loading..." : `${students.length} student(s) registered`}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/students/register">+ Register New Student</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search by name, entry number, email, phone, city, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-center py-6 text-gray-500">Loading students...</p>
          ) : filteredStudents.length === 0 ? (
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
                    <th className="pb-3">Entry #</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">City</th>
                    <th className="pb-3">Address</th>
                    <th className="pb-3">Country</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredStudents.map((student, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3">{student.surname || "-"}</td>
                      <td className="py-3">{student.firstName || "-"}</td>
                      <td className="py-3">{student.middleName || "-"}</td>
                      <td className="py-3 font-medium">{student.entryNumber || "-"}</td>
                      <td className="py-3">{student.email || "-"}</td>
                      <td className="py-3">{student.phoneNumber || "-"}</td>
                      <td className="py-3">{student.city || "-"}</td>
                      <td className="py-3 max-w-xs truncate" title={student.address}>
                        {student.address || "-"}
                      </td>
                      <td className="py-3">{student.country || "-"}</td>
                      <td className="py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <Link href={`/dashboard/students/profiles/${encodeURIComponent(student.entryNumber)}`}>
                            View
                          </Link>
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
  );
}