"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, ArrowLeft, ArrowRight, Check, FileDown } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// PDF Libraries
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer'

type FormStep = "personal" | "guardian" | "history" | "documents"

export default function StudentRegistration() {
  const [currentStep, setCurrentStep] = useState<FormStep>("personal")
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
  const [guardianDOB, setGuardianDOB] = useState<Date>()
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    // Personal Details
    surname: "",
    firstName: "",
    middleName: "",
    email: "",
    phone: "",
    entryNumber: "",
    address: "",
    city: "",
    country: "",
    gender: "",
    assignedClass: "",
    profilePicture: "",

    // Guardian Details
    guardianSurname: "",
    guardianFirstName: "",
    guardianMiddleName: "",
    guardianEmail: "",
    guardianPhone: "",
    guardianNationalId: "",
    relationship: "",
    employer: "",
    guardianAddress: "",
    guardianCity: "",
    guardianGender: "",

    // History
    previousSchool: "",
    medicalConditions: "",

    // Documents (now store Base64 strings)
    transferDocuments: "",
    doctorLetter: "",
    birthCertificate: "",
    guardianId: "",
    proofOfResidence: "",
    previousResults: "",
    proofOfPayment: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // ✅ Convert uploaded file to Base64
  const handleFileUpload = (field: string, files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        const base64String = reader.result as string
        handleInputChange(field, base64String)
      }

      reader.readAsDataURL(file)
    }
  }

  const handleProfilePictureUpload = (files: FileList | null) => {
    handleFileUpload("profilePicture", files)
  }

  const handleNext = () => {
    const steps: FormStep[] = ["personal", "guardian", "history", "documents"]
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const steps: FormStep[] = ["personal", "guardian", "history", "documents"]
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const handleSaveAndFinish = () => {
    if (!formData.surname || !formData.firstName || !formData.entryNumber || !formData.gender || !formData.assignedClass) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      })
      return
    }

    const studentData = {
      id: Date.now().toString(),
      ...formData,
      dateOfBirth: dateOfBirth ? format(dateOfBirth, "PPP") : null,
      guardianDOB: guardianDOB ? format(guardianDOB, "PPP") : null,
      createdAt: new Date().toISOString(),
    }

    const stored = localStorage.getItem("students")
    const students = stored ? JSON.parse(stored) : []

    const exists = students.some((s: any) => s.entryNumber === formData.entryNumber)
    if (exists) {
      toast({
        title: "Duplicate Entry Number",
        description: `A student with Entry Number '${formData.entryNumber}' is already registered.`,
        variant: "destructive",
      })
      return
    }

    students.push(studentData)
    localStorage.setItem("students", JSON.stringify(students))

    toast({
      title: "Registration Completed Successfully!",
      description: `${formData.firstName} ${formData.surname} has been registered.`,
    })

    setIsSubmitted(true)
  }

  // --- PDF Document Component ---
  const StudentRegistrationPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.schoolName}>Transcendence School Management System</Text>
          <Text style={styles.title}>Student Registration Form</Text>
        </View>

        {/* Student Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          
          {/* Profile Picture in PDF */}
          {formData.profilePicture && (
            <View style={styles.profilePicContainer}>
              <Image src={formData.profilePicture} style={styles.profilePicPDF} />
            </View>
          )}
          
          <View style={styles.row}>
            <Text style={styles.label}>Full Name:</Text>
            <Text>{formData.firstName} {formData.middleName} {formData.surname}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Entry Number:</Text>
            <Text>{formData.entryNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text>{dateOfBirth ? format(dateOfBirth, "PPP") : "Not set"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Gender:</Text>
            <Text>{formData.gender}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Class:</Text>
            <Text>{formData.assignedClass.replace("grade", "Grade ")}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text>{formData.email || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text>{formData.phone || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text>{formData.address}, {formData.city}, {formData.country}</Text>
          </View>
        </View>

        {/* Guardian Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guardian Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Full Name:</Text>
            <Text>{formData.guardianFirstName} {formData.guardianMiddleName} {formData.guardianSurname}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Relationship:</Text>
            <Text>{formData.relationship}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text>{formData.guardianPhone}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text>{formData.guardianEmail}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>National ID:</Text>
            <Text>{formData.guardianNationalId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>DOB:</Text>
            <Text>{guardianDOB ? format(guardianDOB, "PPP") : "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text>{formData.guardianAddress || "—"}</Text>
          </View>
        </View>

        {/* Academic & Medical */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic & Medical History</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Previous School:</Text>
            <Text>{formData.previousSchool || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Medical Conditions:</Text>
            <Text>{formData.medicalConditions || "None"}</Text>
          </View>
        </View>

        {/* Uploaded Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Supporting Documents</Text>

          {/* Proof of Payment */}
          {formData.proofOfPayment && (
            <View style={styles.docItem}>
              <Text style={styles.docLabel}>Proof of Payment:</Text>
              <Image src={formData.proofOfPayment} style={styles.image} />
            </View>
          )}

          {/* Birth Certificate */}
          {formData.birthCertificate && (
            <View style={styles.docItem}>
              <Text style={styles.docLabel}>Birth Certificate:</Text>
              <Image src={formData.birthCertificate} style={styles.image} />
            </View>
          )}

          {/* Guardian ID */}
          {formData.guardianId && (
            <View style={styles.docItem}>
              <Text style={styles.docLabel}>Guardian ID:</Text>
              <Image src={formData.guardianId} style={styles.image} />
            </View>
          )}

          {/* Proof of Residence */}
          {formData.proofOfResidence && (
            <View style={styles.docItem}>
              <Text style={styles.docLabel}>Proof of Residence:</Text>
              <Image src={formData.proofOfResidence} style={styles.image} />
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Registered on: {format(new Date(), "PPP")}</Text>
          <Text style={styles.footerText}>TSMS | Transcendence School Management System</Text>
        </View>
      </Page>
    </Document>
  )

  // --- PDF Styles ---
  const styles = StyleSheet.create({
    page: {
      padding: 50,
      fontFamily: 'Helvetica',
    },
    header: {
      marginBottom: 20,
      textAlign: 'center',
    },
    schoolName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2563eb',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 5,
      color: '#000',
    },
    section: {
      marginBottom: 20,
      padding: 10,
      backgroundColor: '#f8fafc',
      borderRadius: 4,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#1e40af',
      borderBottom: '1 solid #d1d5db',
      paddingBottom: 4,
    },
    row: {
      flexDirection: 'row',
      marginBottom: 5,
    },
    label: {
      width: 120,
      fontWeight: 'bold',
    },
    docItem: {
      marginBottom: 10,
    },
    docLabel: {
      fontWeight: 'bold',
      marginBottom: 4,
    },
    image: {
      width: 200,
      height: 150,
      objectFit: 'cover',
      borderRadius: 4,
    },
    profilePicContainer: {
      marginBottom: 15,
      alignItems: 'center',
    },
    profilePicPDF: {
      width: 120,
      height: 120,
      borderRadius: 60,
      objectFit: 'cover',
    },
    footer: {
      marginTop: 40,
      paddingTop: 10,
      borderTop: '1 solid #e5e7eb',
      textAlign: 'center',
      fontSize: 10,
      color: '#6b7280',
    },
    footerText: {
      marginBottom: 4,
    },
  })

  // --- Render Functions ---
  const renderPersonalDetails = () => (
    <Card>
      <CardHeader>
        <CardTitle>Student Personal Details</CardTitle>
        <CardDescription>Enter the student's personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture Upload Section */}
        <div className="flex flex-col items-center space-y-4 pb-6 border-b">
          <div className="relative">
            <div 
              className={cn(
                "w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 flex items-center justify-center bg-gray-100",
                formData.profilePicture && "border-blue-500"
              )}
            >
              {formData.profilePicture ? (
                <img 
                  src={formData.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-6xl">👤</span>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2">
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={(e) => handleProfilePictureUpload(e.target.files)}
                className="hidden"
              />
              <Button
                type="button"
                size="icon"
                className="rounded-full w-10 h-10"
                onClick={() => document.getElementById('profilePicture')?.click()}
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Upload a clear photo of the student. JPG, PNG or GIF. Max size 5MB.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="surname">Surname *</Label>
            <Input id="surname" value={formData.surname} onChange={(e) => handleInputChange("surname", e.target.value)} placeholder="Enter surname" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} placeholder="Enter first name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="middleName">Middle Name</Label>
            <Input id="middleName" value={formData.middleName} onChange={(e) => handleInputChange("middleName", e.target.value)} placeholder="Enter middle name" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="Enter email address" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="Enter phone number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="entryNumber">Entry Number *</Label>
            <Input id="entryNumber" value={formData.entryNumber} onChange={(e) => handleInputChange("entryNumber", e.target.value)} placeholder="Enter entry number" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} placeholder="Enter full address" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} placeholder="Enter city" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={formData.country} onChange={(e) => handleInputChange("country", e.target.value)} placeholder="Enter country" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date of Birth *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateOfBirth && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateOfBirth} onSelect={setDateOfBirth} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assignedClass">Assign Class *</Label>
            <Select value={formData.assignedClass} onValueChange={(value) => handleInputChange("assignedClass", value)}>
              <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="grade1">Grade 1</SelectItem>
                <SelectItem value="grade2">Grade 2</SelectItem>
                <SelectItem value="grade3">Grade 3</SelectItem>
                <SelectItem value="grade4">Grade 4</SelectItem>
                <SelectItem value="grade5">Grade 5</SelectItem>
                <SelectItem value="grade6">Grade 6</SelectItem>
                <SelectItem value="grade7">Grade 7</SelectItem>
                <SelectItem value="grade8">Grade 8</SelectItem>
                <SelectItem value="grade9">Grade 9</SelectItem>
                <SelectItem value="grade10">Grade 10</SelectItem>
                <SelectItem value="grade11">Grade 11</SelectItem>
                <SelectItem value="grade12">Grade 12</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderGuardianDetails = () => (
    <Card>
      <CardHeader>
        <CardTitle>Guardian Details</CardTitle>
        <CardDescription>Enter guardian/parent information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guardianSurname">Surname *</Label>
            <Input id="guardianSurname" value={formData.guardianSurname} onChange={(e) => handleInputChange("guardianSurname", e.target.value)} placeholder="Enter surname" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianFirstName">First Name *</Label>
            <Input id="guardianFirstName" value={formData.guardianFirstName} onChange={(e) => handleInputChange("guardianFirstName", e.target.value)} placeholder="Enter first name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianMiddleName">Middle Name(s)</Label>
            <Input id="guardianMiddleName" value={formData.guardianMiddleName} onChange={(e) => handleInputChange("guardianMiddleName", e.target.value)} placeholder="Enter middle name" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guardianEmail">Email *</Label>
            <Input id="guardianEmail" type="email" value={formData.guardianEmail} onChange={(e) => handleInputChange("guardianEmail", e.target.value)} placeholder="Enter email address" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianPhone">Phone Number *</Label>
            <Input id="guardianPhone" value={formData.guardianPhone} onChange={(e) => handleInputChange("guardianPhone", e.target.value)} placeholder="Enter phone number" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guardianNationalId">National ID Number *</Label>
            <Input id="guardianNationalId" value={formData.guardianNationalId} onChange={(e) => handleInputChange("guardianNationalId", e.target.value)} placeholder="Enter national ID" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship to Student *</Label>
            <Select value={formData.relationship} onValueChange={(value) => handleInputChange("relationship", value)}>
              <SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="father">Father</SelectItem>
                <SelectItem value="mother">Mother</SelectItem>
                <SelectItem value="guardian">Guardian</SelectItem>
                <SelectItem value="uncle">Uncle</SelectItem>
                <SelectItem value="aunt">Aunt</SelectItem>
                <SelectItem value="grandparent">Grandparent</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employer">Employer</Label>
            <Input id="employer" value={formData.employer} onChange={(e) => handleInputChange("employer", e.target.value)} placeholder="Enter employer name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianCity">City</Label>
            <Input id="guardianCity" value={formData.guardianCity} onChange={(e) => handleInputChange("guardianCity", e.target.value)} placeholder="Enter city" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !guardianDOB && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {guardianDOB ? format(guardianDOB, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={guardianDOB} onSelect={setGuardianDOB} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianGender">Gender</Label>
            <Select value={formData.guardianGender} onValueChange={(value) => handleInputChange("guardianGender", value)}>
              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guardianAddress">Address</Label>
          <Textarea id="guardianAddress" value={formData.guardianAddress} onChange={(e) => handleInputChange("guardianAddress", e.target.value)} placeholder="Enter full address" />
        </div>
      </CardContent>
    </Card>
  )

  const renderStudentHistory = () => (
    <Card>
      <CardHeader>
        <CardTitle>Student History</CardTitle>
        <CardDescription>Previous school and medical information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="previousSchool">Name of Previous School</Label>
          <Input id="previousSchool" value={formData.previousSchool} onChange={(e) => handleInputChange("previousSchool", e.target.value)} placeholder="Enter previous school name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicalConditions">Medical Conditions and Allergies</Label>
          <Textarea id="medicalConditions" value={formData.medicalConditions} onChange={(e) => handleInputChange("medicalConditions", e.target.value)} placeholder="Enter any medical conditions or allergies" rows={4} />
        </div>
      </CardContent>
    </Card>
  )

  const renderDocumentUpload = () => (
    <Card>
      <CardHeader>
        <CardTitle>Document Upload</CardTitle>
        <CardDescription>Upload required documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {[
          { id: "birthCertificate", label: "Birth Certificate *", field: "birthCertificate" },
          { id: "guardianId", label: "Guardian ID Card or Passport *", field: "guardianId" },
          { id: "proofOfResidence", label: "Proof of Residence *", field: "proofOfResidence" },
          { id: "previousResults", label: "Previous Results (If applicable)", field: "previousResults" },
          { id: "proofOfPayment", label: "Proof of Payment *", field: "proofOfPayment" },
        ].map((doc) => (
          <div key={doc.id} className="space-y-2">
            <Label htmlFor={doc.id}>{doc.label}</Label>
            <div className="flex items-center space-x-2">
              <Input
                id={doc.id}
                type="file"
                accept=".pdf,.png,.jpeg,.jpg"
                onChange={(e) => handleFileUpload(doc.field, e.target.files)}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById(doc.id)?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              {formData[doc.field as keyof typeof formData] && (
                <span className="text-sm text-muted-foreground">
                  {formData[doc.field as keyof typeof formData].startsWith("data:") 
                    ? `Uploaded: ${doc.label.split(" *")[0]}` 
                    : formData[doc.field as keyof typeof formData]}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Accepted formats: PDF, PNG, JPEG</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "personal": return renderPersonalDetails()
      case "guardian": return renderGuardianDetails()
      case "history": return renderStudentHistory()
      case "documents": return renderDocumentUpload()
      default: return renderPersonalDetails()
    }
  }

  const steps = [
    { key: "personal", title: "Personal Details" },
    { key: "guardian", title: "Guardian Details" },
    { key: "history", title: "Student History" },
    { key: "documents", title: "Documents" },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Student Registration</h2>
        <p className="text-muted-foreground">Register a new student in the system</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className={cn("flex items-center justify-center w-8 h-8 rounded-full border-2",
              currentStep === step.key ? "bg-blue-600 border-blue-600 text-white" :
              steps.findIndex(s => s.key === currentStep) > index ? "bg-green-600 border-green-600 text-white" : "border-gray-300 text-gray-500")}>
              {steps.findIndex(s => s.key === currentStep) > index ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <span className={cn("ml-2 text-sm font-medium", currentStep === step.key ? "text-blue-600" : "text-gray-500")}>
              {step.title}
            </span>
            {index < steps.length - 1 && <div className="w-12 h-0.5 bg-gray-300 mx-4" />}
          </div>
        ))}
      </div>

      {/* After Submission */}
      {isSubmitted ? (
        <Card className="text-center py-10">
          <CardHeader>
            <CardTitle>✅ Registration Complete!</CardTitle>
            <CardDescription>
              {formData.firstName} {formData.surname} has been successfully registered.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PDFDownloadLink
              document={<StudentRegistrationPDF />}
              fileName={`student-${formData.entryNumber}-registration.pdf`}
            >
              {({ loading }) => (
                <Button size="lg" className="gap-2">
                  <FileDown className="w-5 h-5" />
                  {loading ? "Generating PDF..." : "Download Registration PDF"}
                </Button>
              )}
            </PDFDownloadLink>
            <Button
              variant="link"
              className="mt-4"
              onClick={() => router.push("/dashboard/students/list")}
            >
              ← Back to Student List
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {renderCurrentStep()}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === "personal"}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div className="space-x-2">
              {currentStep === "documents" ? (
                <Button onClick={handleSaveAndFinish}>
                  <Check className="w-4 h-4 mr-2" /> Save and Finish
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}