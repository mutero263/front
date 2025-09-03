"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, User, Shield, Users, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect } from "react";

export function LoginPage() {
  const [userType, setUserType] = useState<string>("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();

  // 🔐 Demo credentials (for auto-fill only in dev mode)
  const demoCredentials = [
    { username: "admin", password: "password123", userType: "administrator", label: "Administrator" },
    { username: "accountant", password: "password123", userType: "administrator", label: "Accountant" },
    { username: "teacher1", password: "password123", userType: "teacher", label: "Teacher" },
    { username: "student1", password: "password123", userType: "STUDENT", label: "Student" },
    { username: "parent1", password: "password123", userType: "guardian", label: "Parent" },
  ];

  // 🌐 Check environment: show demo panel only in dev
  const isDemoMode = process.env.NEXT_PUBLIC_APP_ENV !== "production";

  // 🛠 Get API URL with fallback (critical fix)
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://589f537ce690.ngrok-free.app";

  // Auto-fill demo credentials (does NOT auto-login)
  const handleDemoLogin = (demo: (typeof demoCredentials)[0]) => {
    setCredentials({ username: demo.username, password: demo.password });
    setUserType(demo.userType);
    setError("");
  };

  // 🔑 Real login: sends data to your backend
  const handleLogin = async () => {
    if (!credentials.username || !credentials.password || !userType) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid username or password.");
      }

      // ✅ Save real session data
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.userType);
        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email || `${data.username}@tsms.edu`);
      }

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.username}!`,
      });

      // 🚀 Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage =
        err.message.includes("failed") ? "Unable to connect to server" : err.message;
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear error when user types
  useEffect(() => {
    if (error) setError("");
  }, [credentials, userType]);

  // Icons based on user type
  const getUserIcon = (type: string) => {
    switch (type) {
      case "student":
        return <User className="w-4 h-4" />;
      case "teacher":
        return <GraduationCap className="w-4 h-4" />;
      case "administrator":
        return <Shield className="w-4 h-4" />;
      case "guardian":
        return <Users className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Branding */}
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
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

          {/* 🔐 Demo Panel - Only in Development */}
          {isDemoMode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Demo Credentials</CardTitle>
                <CardDescription>Click to auto-fill (still requires login)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {demoCredentials.map((demo, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleDemoLogin(demo)}
                      className="justify-start hover:bg-blue-50 transition-colors"
                    >
                      {getUserIcon(demo.userType)}
                      <span className="ml-2 font-medium">
                        {demo.label}: <span className="text-gray-600">{demo.username}</span>
                      </span>
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  All demo passwords: <strong>password123</strong>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Default export
export default function Login() {
  return <LoginPage />;
}