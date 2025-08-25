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
import { CalendarIcon, Upload, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

type FormStep = "personal" | "guardian" | "history" | "documents"

export default function StudentRegistration() {
  const [currentStep, setCurrentStep] = useState<FormStep>("personal")
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
  const [guardianDOB, setGuardianDOB] = useState<Date>()
  const { toast } = useToast()

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
    assignedSubjects: [],

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

    // Documents (file names for demo)
    transferDocuments: "",
    doctorLetter: "",
    birthCertificate: "",
    guardianId: "",
    proofOfResidence: "",
    previousResults: "",
    proofOfPayment: "",
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (files && files[0]) {
      handleInputChange(field, files[0].name)
    }
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
    toast({
      title: "Registration Completed Successfully!",
      description: "Student has been registered in the system.",
    })
    // Reset form or redirect
  }

  const renderPersonalDetails = () => (
    <Card>
      <CardHeader>
        <CardTitle>Student Personal Details</CardTitle>
        <CardDescription>Enter the student's personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="surname">Surname *</Label>
            <Input
              id="surname"
              value={formData.surname}
              onChange={(e) => handleInputChange("surname", e.target.value)}
              placeholder="Enter surname"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="middleName">Middle Name</Label>
            <Input
              id="middleName"
              value={formData.middleName}
              onChange={(e) => handleInputChange("middleName", e.target.value)}
              placeholder="Enter middle name"
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="entryNumber">Entry Number *</Label>
            <Input
              id="entryNumber"
              value={formData.entryNumber}
              onChange={(e) => handleInputChange("entryNumber", e.target.value)}
              placeholder="Enter entry number"
            />
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter full address"
            />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Enter city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="Enter country"
              />
            </div>
          </div>
        </div>

        {/* Fourth Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date of Birth *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !dateOfBirth && "text-muted-foreground")}
                >
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
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Fifth Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assignedClass">Assign Class *</Label>
            <Select value={formData.assignedClass} onValueChange={(value) => handleInputChange("assignedClass", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
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
          <div className="space-y-2">
            <Label htmlFor="assignedSubjects">Assign Subjects</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select subjects (multiple)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="geography">Geography</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
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
            <Input
              id="guardianSurname"
              value={formData.guardianSurname}
              onChange={(e) => handleInputChange("guardianSurname", e.target.value)}
              placeholder="Enter surname"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianFirstName">First Name *</Label>
            <Input
              id="guardianFirstName"
              value={formData.guardianFirstName}
              onChange={(e) => handleInputChange("guardianFirstName", e.target.value)}
              placeholder="Enter first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianMiddleName">Middle Name(s)</Label>
            <Input
              id="guardianMiddleName"
              value={formData.guardianMiddleName}
              onChange={(e) => handleInputChange("guardianMiddleName", e.target.value)}
              placeholder="Enter middle name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guardianEmail">Email *</Label>
            <Input
              id="guardianEmail"
              type="email"
              value={formData.guardianEmail}
              onChange={(e) => handleInputChange("guardianEmail", e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianPhone">Phone Number *</Label>
            <Input
              id="guardianPhone"
              value={formData.guardianPhone}
              onChange={(e) => handleInputChange("guardianPhone", e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guardianNationalId">National ID Number *</Label>
            <Input
              id="guardianNationalId"
              value={formData.guardianNationalId}
              onChange={(e) => handleInputChange("guardianNationalId", e.target.value)}
              placeholder="Enter national ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship to Student *</Label>
            <Select value={formData.relationship} onValueChange={(value) => handleInputChange("relationship", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
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
            <Input
              id="employer"
              value={formData.employer}
              onChange={(e) => handleInputChange("employer", e.target.value)}
              placeholder="Enter employer name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianCity">City</Label>
            <Input
              id="guardianCity"
              value={formData.guardianCity}
              onChange={(e) => handleInputChange("guardianCity", e.target.value)}
              placeholder="Enter city"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !guardianDOB && "text-muted-foreground")}
                >
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
            <Select
              value={formData.guardianGender}
              onValueChange={(value) => handleInputChange("guardianGender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
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
          <Textarea
            id="guardianAddress"
            value={formData.guardianAddress}
            onChange={(e) => handleInputChange("guardianAddress", e.target.value)}
            placeholder="Enter full address"
          />
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
          <Input
            id="previousSchool"
            value={formData.previousSchool}
            onChange={(e) => handleInputChange("previousSchool", e.target.value)}
            placeholder="Enter previous school name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transferDocuments">Upload Transfer Documents</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="transferDocuments"
              type="file"
              accept=".pdf,.png,.jpeg,.jpg"
              onChange={(e) => handleFileUpload("transferDocuments", e.target.files)}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("transferDocuments")?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            {formData.transferDocuments && (
              <span className="text-sm text-muted-foreground">{formData.transferDocuments}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Accepted formats: PDF, PNG, JPEG</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicalConditions">Medical Conditions and Allergies</Label>
          <Textarea
            id="medicalConditions"
            value={formData.medicalConditions}
            onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
            placeholder="Enter any medical conditions or allergies"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="doctorLetter">Upload Doctor's Letter</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="doctorLetter"
              type="file"
              accept=".pdf,.png,.jpeg,.jpg"
              onChange={(e) => handleFileUpload("doctorLetter", e.target.files)}
              className="hidden"
            />
            <Button type="button" variant="outline" onClick={() => document.getElementById("doctorLetter")?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            {formData.doctorLetter && <span className="text-sm text-muted-foreground">{formData.doctorLetter}</span>}
          </div>
          <p className="text-xs text-muted-foreground">Accepted formats: PDF, PNG, JPEG</p>
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
              <Button type="button" variant="outline" onClick={() => document.getElementById(doc.id)?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              {formData[doc.field as keyof typeof formData] && (
                <span className="text-sm text-muted-foreground">
                  {formData[doc.field as keyof typeof formData] as string}
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
      case "personal":
        return renderPersonalDetails()
      case "guardian":
        return renderGuardianDetails()
      case "history":
        return renderStudentHistory()
      case "documents":
        return renderDocumentUpload()
      default:
        return renderPersonalDetails()
    }
  }

  const steps = [
    { key: "personal", title: "Personal Details" },
    { key: "guardian", title: "Guardian Details" },
    { key: "history", title: "Student History" },
    { key: "documents", title: "Documents" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Student Registration</h2>
        <p className="text-muted-foreground">Register a new student in the system</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2",
                currentStep === step.key
                  ? "bg-blue-600 border-blue-600 text-white"
                  : steps.findIndex((s) => s.key === currentStep) > index
                    ? "bg-green-600 border-green-600 text-white"
                    : "border-gray-300 text-gray-500",
              )}
            >
              {steps.findIndex((s) => s.key === currentStep) > index ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <span
              className={cn("ml-2 text-sm font-medium", currentStep === step.key ? "text-blue-600" : "text-gray-500")}
            >
              {step.title}
            </span>
            {index < steps.length - 1 && <div className="w-12 h-0.5 bg-gray-300 mx-4" />}
          </div>
        ))}
      </div>

      {renderCurrentStep()}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === "personal"}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="space-x-2">
          {currentStep === "documents" ? (
            <Button onClick={handleSaveAndFinish}>
              <Check className="w-4 h-4 mr-2" />
              Save and Finish
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
