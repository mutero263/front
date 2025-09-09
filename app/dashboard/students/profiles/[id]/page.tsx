"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, User, Mail, Phone, Calendar, Briefcase, BookOpen, FileText, Building, Stethoscope, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ✅ Match your backend DTO exactly
interface StudentProfileResponse {
  id: number;
  surname: string;
  firstName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  entryNumber: string;
  address: string;
  city: string;
  country: string;
  dateOfBirth: string; // "2020-01-01"
  gender: "MALE" | "FEMALE" | "OTHER";
  assignedClass: string;
  assignedSubjects: string[];

  // Guardian
  guardianSurname: string;
  guardianFirstName: string;
  guardianMiddleName: string;
  guardianEmail: string;
  guardianPhone: string;
  guardianNationalId: string;
  relationship: "FATHER" | "MOTHER" | "GUARDIAN" | "UNCLE" | "AUNT" | "GRANDPARENT" | "OTHER";
  employer: string;
  guardianAddress: string;
  guardianCity: string;
  guardianDateOfBirth: string;
  guardianGender: "MALE" | "FEMALE" | "OTHER";

  // History
  previousSchool: string;
  medicalConditions: string;

  // Documents (Base64 strings)
  transferDocuments: string;
  doctorLetter: string;
  birthCertificate: string;
  guardianIdDocument: string;
  proofOfResidence: string;
  previousResults: string;
  proofOfPayment: string;

  // Optional: profile picture (not in DTO but likely stored)
  profilePicture?: string;
}

export default function StudentProfilePage({ params }: { params: { entryNumber: string } }) {
  const { entryNumber } = params;
  const router = useRouter();
  const [student, setStudent] = useState<StudentProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Authentication required");
          router.push("/login");
          return;
        }

        // ✅ Fetch from backend using entryNumber
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/entry-number/${entryNumber}`, {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Student not found");
        }

        const data: StudentProfileResponse = await response.json();
        setStudent(data);
      } catch (err: any) {
        console.error("Failed to load student:", err);
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    if (entryNumber) fetchStudent();
  }, [entryNumber, router]);

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
        <h2 className="text-2xl font-bold text-red-600">Student Not Found</h2>
        <p className="text-gray-500">No student found with entry number: <strong>{entryNumber}</strong></p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/dashboard/students/list">← Back to List</Link>
        </Button>
      </div>
    );
  }

  const fullName = `${student.firstName} ${student.middleName || ""} ${student.surname}`.trim();

  const formatLocalDate = (date: string | null | undefined) => {
    if (!date) return "—";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
  };

  const renderDocument = (label: string, src: string) => {
    if (!src) return null;
    const isImage = src.toLowerCase().startsWith("image");
    return (
      <div className="space-y-2" key={label}>
        <h3 className="font-medium">{label}</h3>
        {isImage ? (
          <img src={src} alt={label} className="max-w-xs h-auto border rounded shadow-sm" />
        ) : (
          <p className="text-sm text-gray-500">📄 File uploaded</p>
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
            <strong>{student.assignedClass?.replace("GRADE", "Grade ") || "—"}</strong>
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
            <div><strong>Date of Birth:</strong> {formatLocalDate(student.dateOfBirth)}</div>
            <div><strong>Gender:</strong> {student.gender?.replace("MALE", "Male").replace("FEMALE", "Female").replace("OTHER", "Other") || "—"}</div>
            <div><strong>Email:</strong> {student.email || "—"}</div>
            <div><strong>Phone:</strong> {student.phoneNumber || "—"}</div>
            <div className="md:col-span-2">
              <strong>Address:</strong> {student.address || "—"}, {student.city || "—"}, {student.country || "—"}
            </div>
            <div><strong>Class:</strong> {student.assignedClass?.replace("GRADE", "Grade ") || "—"}</div>
            <div><strong>Subjects:</strong> {student.assignedSubjects?.length > 0 ? student.assignedSubjects.join(", ") : "—"}</div>
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
            <div><strong>DOB:</strong> {formatLocalDate(student.guardianDateOfBirth)}</div>
            <div><strong>Gender:</strong> {student.guardianGender || "—"}</div>
            <div><strong>Employer:</strong> {student.employer || "—"}</div>
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
            {renderDocument("Guardian ID Document", student.guardianIdDocument)}
            {renderDocument("Proof of Residence", student.proofOfResidence)}
            {renderDocument("Transfer Documents", student.transferDocuments)}
            {renderDocument("Doctor's Letter", student.doctorLetter)}
            {renderDocument("Previous Results", student.previousResults)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}