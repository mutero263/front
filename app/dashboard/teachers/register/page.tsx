"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { teacherAPI } from "@/lib/api"

export default function TeacherRegistration() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    qualifications: "",
    certifications: "",
    areaOfExpertise: "",
    assignedClasses: [] as string[],
    assignedSubjects: [] as string[],
  })

  const [loading, setLoading] = useState(false)

  const classes = [
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ]

  const subjects = [
    "Mathematics",
    "English",
    "Science",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Art",
    "Music",
    "Physical Education",
    "French",
    "Spanish",
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleClassChange = (className: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      assignedClasses: checked
        ? [...prev.assignedClasses, className]
        : prev.assignedClasses.filter((c) => c !== className),
    }))
  }

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      assignedSubjects: checked
        ? [...prev.assignedSubjects, subject]
        : prev.assignedSubjects.filter((s) => s !== subject),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await teacherAPI.register(formData)
      toast({
        title: "Success!",
        description: "Teacher registered successfully.",
      })
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        qualifications: "",
        certifications: "",
        areaOfExpertise: "",
        assignedClasses: [],
        assignedSubjects: [],
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to register teacher.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Teacher Registration</h2>
        <p className="text-muted-foreground">Register a new teacher in the system</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Teacher Information</CardTitle>
            <CardDescription>Enter the teacher's personal and professional details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="areaOfExpertise">Area of Expertise</Label>
                <Input
                  id="areaOfExpertise"
                  value={formData.areaOfExpertise}
                  onChange={(e) => handleInputChange("areaOfExpertise", e.target.value)}
                  placeholder="e.g., Mathematics, Science"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-2">
              <Label htmlFor="qualifications">Qualifications</Label>
              <Textarea
                id="qualifications"
                value={formData.qualifications}
                onChange={(e) => handleInputChange("qualifications", e.target.value)}
                placeholder="Enter educational qualifications"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certifications">Certifications</Label>
              <Textarea
                id="certifications"
                value={formData.certifications}
                onChange={(e) => handleInputChange("certifications", e.target.value)}
                placeholder="Enter professional certifications"
                rows={3}
              />
            </div>

            {/* Class Assignments */}
            <div className="space-y-2">
              <Label>Assigned Classes</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {classes.map((className) => (
                  <div key={className} className="flex items-center space-x-2">
                    <Checkbox
                      id={`class-${className}`}
                      checked={formData.assignedClasses.includes(className)}
                      onCheckedChange={(checked) => handleClassChange(className, checked as boolean)}
                    />
                    <Label htmlFor={`class-${className}`} className="text-sm">
                      {className}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject Assignments */}
            <div className="space-y-2">
              <Label>Assigned Subjects</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {subjects.map((subject) => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subject-${subject}`}
                      checked={formData.assignedSubjects.includes(subject)}
                      onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                    />
                    <Label htmlFor={`subject-${subject}`} className="text-sm">
                      {subject}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register Teacher"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
