"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, User, Shield, Users, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginPage() {
  const [userType, setUserType] = useState<string>("")
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const router = useRouter()
  const { toast } = useToast()

  // Demo credentials for easy testing
  const demoCredentials = [
    { username: "admin", password: "password123", userType: "administrator", label: "Administrator" },
    { username: "accountant", password: "password123", userType: "administrator", label: "Accountant" },
    { username: "teacher1", password: "password123", userType: "teacher", label: "Teacher" },
    { username: "student1", password: "password123", userType: "student", label: "Student" },
    { username: "parent1", password: "password123", userType: "guardian", label: "Parent" },
  ]

  const handleDemoLogin = (demo: any) => {
    setCredentials({ username: demo.username, password: demo.password })
    setUserType(demo.userType)
  }

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password || !userType) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      // For demo purposes, simulate successful login
      const mockResponse = {
        data: {
          token: "demo-jwt-token-" + Date.now(),
          username: credentials.username,
          email: credentials.username + "@tsms.edu",
          userType: userType.toUpperCase(),
        },
      }

      // Store authentication data
      if (typeof window !== "undefined") {
        localStorage.setItem("token", mockResponse.data.token)
        localStorage.setItem("userType", mockResponse.data.userType.toLowerCase())
        localStorage.setItem("username", mockResponse.data.username)
        localStorage.setItem("email", mockResponse.data.email)
      }

      toast({
        title: "Success!",
        description: `Welcome back, ${credentials.username}!`,
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      setError("Login failed. Please check your credentials.")
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getUserIcon = (type: string) => {
    switch (type) {
      case "student":
        return <User className="w-4 h-4" />
      case "teacher":
        return <GraduationCap className="w-4 h-4" />
      case "administrator":
        return <Shield className="w-4 h-4" />
      case "guardian":
        return <Users className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Logo and Branding */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-8">
        <div className="text-center text-white">
          <div className="mb-8">
            <GraduationCap className="w-24 h-24 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">TSMS</h1>
            <p className="text-xl opacity-90">Transcendence School Management System</p>
          </div>
          <div className="space-y-4 text-lg opacity-80">
            <p>Comprehensive School Management</p>
            <p>Student • Teacher • Guardian Portal</p>
            <p>Academic Excellence Made Simple</p>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to access your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="userType">Login As</Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Student
                      </div>
                    </SelectItem>
                    <SelectItem value="teacher">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Teacher
                      </div>
                    </SelectItem>
                    <SelectItem value="administrator">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Administrator
                      </div>
                    </SelectItem>
                    <SelectItem value="guardian">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Guardian
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username / Email</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username or email"
                  value={credentials.username}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                />
              </div>

              <Button
                onClick={handleLogin}
                className="w-full"
                disabled={!userType || !credentials.username || !credentials.password || loading}
              >
                {userType && getUserIcon(userType)}
                <span className="ml-2">{loading ? "Signing In..." : "Sign In"}</span>
              </Button>
            </CardContent>
          </Card>

          {/* Demo Credentials Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Demo Credentials</CardTitle>
              <CardDescription>Click to auto-fill login credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {demoCredentials.map((demo, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(demo)}
                    className="justify-start"
                  >
                    {getUserIcon(demo.userType)}
                    <span className="ml-2">
                      {demo.label}: {demo.username}
                    </span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">All demo passwords: password123</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
