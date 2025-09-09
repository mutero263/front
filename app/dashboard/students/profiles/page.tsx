"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, User, Mail, Phone, Calendar, Briefcase, BookOpen, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// ✅ Match your backend DTO
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
  dateOfBirth: string; // ISO format
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
  relationship: string;
  employer: string;
  guardianAddress: string;
  guardianCity: string;
  guardianDateOfBirth: string;
  guardianGender: string;

  // History
  previousSchool: string;
  medicalConditions: string;

  // Documents
  transferDocuments: string;
  doctorLetter: string;
  birthCertificate: string;
  guardianIdDocument: string;
  proofOfResidence: string;
  previousResults: string;
  proofOfPayment: string;

  // Optional
  profilePicture?: string;
}

export default function StudentProfilePage() {
  const [student, setStudent] = useState<StudentProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ Get entryNumber from localStorage (saved at login)
        const username = localStorage.getItem("username");
        if (!username) {
          toast({
            title: "Not Logged In",
            description: "Please log in to view your profile.",
            variant: "destructive",
          });
          router.push("/login");
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // ✅ Fetch student by entryNumber
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/students/entry-number/${username}`, {
          method: "GET",
          headers: {
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
        console.error("Failed to load profile:", err);
        toast({
          title: "Load Failed",
          description: "Could not load your profile. Check connection or try again.",
          variant: "destructive",
        });
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, toast]);

  const fullName = `${student?.firstName} ${student?.middleName || ""} ${student?.surname}`.trim();

  const formatLocalDate = (date: string | null | undefined) => {
    if (!date) return "—";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
  };

  const renderDocument = (label: string, src: string) => {
    if (!src) return null;
    const isImage = src.startsWith("data:image");
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

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Profile Not Found</h2>
        <p className="text-gray-500">No data found for your account.</p>
        <Button asChild className="mt-4" variant="outline">
          <a href="/login">← Log In Again</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Back to Dashboard */}
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        ← Back
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
            <div><strong>Gender:</strong> {student.gender?.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) || "—"}</div>
            <div><strong>Email:</strong> {student.email || "—"}</div>
            <div><strong>Phone:</strong> {student.phoneNumber || "—"}</div>
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