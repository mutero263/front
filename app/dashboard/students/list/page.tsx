"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function StudentListPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("students");
    const data = stored ? JSON.parse(stored) : [];
    setStudents(data);
    setFilteredStudents(data);
  }, []);

  useEffect(() => {
    const results = students.filter(
      (s) =>
        s.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.middleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.entryNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(results);
  }, [searchTerm, students]);

  const handleDelete = (id: string, fullName: string) => {
    const updated = students.filter((s) => s.id !== id);
    localStorage.setItem("students", JSON.stringify(updated));
    setStudents(updated);
    setFilteredStudents(updated);

    toast({
      title: "Deleted",
      description: `${fullName} has been removed.`,
      variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Student List</h1>
          <p className="text-muted-foreground">{students.length} student(s) registered</p>
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
          {filteredStudents.length === 0 ? (
            <p className="text-center py-6 text-gray-500">
              {searchTerm ? "No matching students found." : "No students registered yet."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-left text-sm font-semibold text-gray-700">
                    <th className="pb-3">Photo</th>
                    <th className="pb-3">Surname</th>
                    <th className="pb-3">First Name</th>
                    <th className="pb-3">Middle Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Entry #</th>
                    <th className="pb-3">Address</th>
                    <th className="pb-3">City</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100">
                          {student.profilePicture ? (
                            <img 
                              src={student.profilePicture} 
                              alt={`${student.firstName} ${student.surname}`} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 text-lg">👤</span>
                          )}
                        </div>
                      </td>
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
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <Link href={`/dashboard/students/profiles/${student.id}`}>
                            View
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            confirm(`Delete ${student.firstName} ${student.surname}? This cannot be undone.`) &&
                            handleDelete(student.id, `${student.firstName} ${student.surname}`)
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
  );
}