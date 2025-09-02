"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Video, User, Mail, Phone, Link as LinkIcon, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function TeacherPage() {
  const [students, setStudents] = useState<any[]>([])
  const [activeMeets, setActiveMeets] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  // Load students from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("students")
    const data = stored ? JSON.parse(stored) : []
    setStudents(data)

    // Load active Meet links
    const meets: Record<string, string> = {}
    data.forEach((s: any) => {
      const link = localStorage.getItem(`meet_${s.id}`)
      if (link) meets[s.id] = link
    })
    setActiveMeets(meets)
  }, [])

  const handleStartMeet = (student: any) => {
    // Open new Google Meet in new tab
    window.open("https://meet.google.com/new", "_blank")

    toast({
      title: "Starting Google Meet...",
      description: (
        <div className="space-y-1">
          <p>1. You'll be redirected to Google Sign-In (if not signed in).</p>
          <p>2. After signing in, click 'New meeting' → 'Start instant meeting'.</p>
          <p>3. Copy the link and paste it below to share with {student.guardianFirstName}.</p>
        </div>
      ),
      duration: 5000,
    })
  }

  const handlePasteLink = (studentId: string, link: string) => {
    if (!link.trim()) return

    if (!link.includes("meet.google.com")) {
      toast({
        title: "Invalid Link",
        description: "Please enter a valid Google Meet URL like: meet.google.com/abc-defg-hij",
        variant: "destructive",
      })
      return
    }

    localStorage.setItem(`meet_${studentId}`, link)
    setActiveMeets((prev) => ({ ...prev, [studentId]: link }))

    toast({
      title: "Link Shared!",
      description: "Parent can now join the consultation.",
    })
  }

  const filteredStudents = students.filter(
    (s) =>
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.entryNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Start consultations with parents via Google Meet</p>
          </div>
          <Button variant="outline" onClick={() => localStorage.clear()}>
            Clear Data
          </Button>
        </div>

        {/* Info Banner */}
        <Card className="bg-blue-50 border-blue-200 mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 text-sm text-blue-800">
              <HelpCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <strong>How to Start a Google Meet:</strong>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Click <strong>Start Meet</strong> below.</li>
                  <li>Sign in with your Google account (school or personal).</li>
                  <li>Click <strong>"New meeting" → "Start instant meeting"</strong>.</li>
                  <li>Copy the URL and paste it in the input box to share with the parent.</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="mb-6">
          <Label htmlFor="search">Search Student</Label>
          <Input
            id="search"
            placeholder="Search by name, entry number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Student List */}
        <div className="space-y-6">
          {filteredStudents.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No students found.</p>
          ) : (
            filteredStudents.map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {student.firstName} {student.middleName} {student.surname}
                      </CardTitle>
                      <CardDescription>
                        {student.assignedClass.replace("grade", "Grade ")} • {student.entryNumber}
                      </CardDescription>
                    </div>
                    <Badge>{student.gender}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Guardian Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Parent:</strong> {student.guardianFirstName} {student.guardianSurname}
                    </div>
                    <div>
                      <strong>Email:</strong> {student.guardianEmail || "—"}
                    </div>
                    <div>
                      <strong>Phone:</strong> {student.guardianPhone || "—"}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      onClick={() => handleStartMeet(student)}
                      className="bg-red-500 hover:bg-red-600 gap-2"
                    >
                      <Video className="w-4 h-4" />
                      Start Google Meet
                    </Button>

                    {activeMeets[student.id] ? (
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <LinkIcon className="w-4 h-4" />
                        <a
                          href={activeMeets[student.id]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-green-800"
                        >
                          Meet Active – Click to Join
                        </a>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <Input
                          placeholder="Paste Meet link here"
                          className="w-64"
                          onBlur={(e) => handlePasteLink(student.id, e.target.value)}
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="w-4 h-4 text-gray-500" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>After starting the meeting, copy the URL from the browser and paste it here to notify the parent.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}