"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, User, Mail, Phone, Calendar, Briefcase, BookOpen, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("students");
    const students = stored ? JSON.parse(stored) : [];
    const found = students.find((s: any) => s.id === id);

    if (found) {
      setStudent(found);
    } else {
      console.error("Student not found:", id);
    }
    setLoading(false);
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Loading student profile...</p>
      </div>
    );
  }

  // Not found state
  if (!student) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Student not found</h2>
        <p className="text-gray-500">No data found for ID: <strong>{id}</strong></p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/dashboard/students/list">← Back to List</Link>
        </Button>
      </div>
    );
  }

  // ✅ Fixed: Use backticks for template literal
  const fullName = `${student.firstName} ${student.middleName || ""} ${student.surname}`.trim();

  // ✅ Move renderDocument inside the component, before JSX
  const renderDocument = (label: string, src: string) => {
    if (!src) return null;
    const isImage = src.startsWith("data:image");
    return (
      <div className="space-y-2" key={label}>
        <h3 className="font-medium">{label}</h3>
        {isImage ? (
          <img src={src} alt={label} className="max-w-xs h-auto border rounded shadow-sm" />
        ) : (
          <p className="text-sm text-gray-500">📄 PDF or file uploaded</p>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 flex items-center justify-center bg-gray-100">
            {student.profilePicture ? (
              <img 
                src={student.profilePicture} 
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Avatar className="w-full h-full">
                <AvatarFallback>
                  {student.firstName?.[0]}{student.surname?.[0]}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">{fullName}</h1>
          <p className="text-muted-foreground">
            Entry No: <strong>{student.entryNumber}</strong> • Class:{" "}
            <strong>{student.assignedClass?.replace("grade", "Grade ") || "—"}</strong>
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div><strong>Full Name:</strong> {fullName}</div>
            <div><strong>Entry Number:</strong> {student.entryNumber}</div>
            <div><strong>Date of Birth:</strong> {student.dateOfBirth || "—"}</div>
            <div><strong>Gender:</strong> {student.gender || "—"}</div>
            <div><strong>Email:</strong> {student.email || "—"}</div>
            <div><strong>Phone:</strong> {student.phone || "—"}</div>
            <div className="md:col-span-2">
              <strong>Address:</strong> {student.address || "—"}, {student.city || "—"}, {student.country || "—"}
            </div>
          </CardContent>
        </Card>

        {/* Guardian Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Guardian Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <strong>Full Name:</strong>{" "}
              {`${student.guardianFirstName || ""} ${student.guardianMiddleName || ""} ${student.guardianSurname || ""}`.trim() ||
                "—"}
            </div>
            <div><strong>Relationship:</strong> {student.relationship || "—"}</div>
            <div><strong>Phone:</strong> {student.guardianPhone || "—"}</div>
            <div><strong>Email:</strong> {student.guardianEmail || "—"}</div>
            <div><strong>National ID:</strong> {student.guardianNationalId || "—"}</div>
            <div><strong>DOB:</strong> {student.guardianDOB || "—"}</div>
            <div className="md:col-span-2"><strong>Address:</strong> {student.guardianAddress || "—"}</div>
          </CardContent>
        </Card>

        {/* Academic & Medical */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Academic & Medical History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div><strong>Previous School:</strong> {student.previousSchool || "—"}</div>
            <div><strong>Medical Conditions:</strong> {student.medicalConditions || "None"}</div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Supporting Documents
            </CardTitle>
            <CardDescription>Uploaded during registration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderDocument("Proof of Payment", student.proofOfPayment)}
            {renderDocument("Birth Certificate", student.birthCertificate)}
            {renderDocument("Guardian ID", student.guardianId)}
            {renderDocument("Proof of Residence", student.proofOfResidence)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}