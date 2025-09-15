"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Match backend student response
interface StudentProfileResponse {
  email: string;
}

export default function ChangePasswordPage() {
  const [step, setStep] = useState<"fetching" | "verify" | "change">("fetching");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();
  const { toast } = useToast();

  // Fetch student's email using entryNumber from localStorage
  useEffect(() => {
    const fetchEmail = async () => {
      const entryNumber = localStorage.getItem("username"); 
      const token = localStorage.getItem("token");

      if (!entryNumber) {
        toast({
          title: "Not Logged In",
          description: "Please log in first.",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      if (!token) {
        toast({
          title: "Session Expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/students/entry-number/${entryNumber}`, {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true", 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to load student data");

        const data: StudentProfileResponse = await response.json();
        setEmail(data.email);
        setStep("verify"); 
      } catch (err) {
        console.error("Fetch email error:", err);
        toast({
          title: "Load Failed",
          description: "Could not fetch your account information.",
          variant: "destructive",
        });
        router.push("/dashboard");
      }
    };

    fetchEmail();
  }, [router, toast]);

  // Validate password strength
  const validatePassword = (pwd: string) => {
    return pwd.length >= 8 && /[A-Z]/.test(pwd) && /\d/.test(pwd);
  };

  // Step 1: Verify current password
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ current: "", new: "", confirm: "" });

    if (!currentPassword.trim()) {
      setErrors((prev) => ({ ...prev, current: "Current password is required." }));
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/confirm-password`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true", 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          currentPassword: currentPassword.trim(),
        }),
      });

      // SECURITY: Always check HTTP status first
      if (!response.ok) {
        console.warn(`[SECURITY] Backend returned ${response.status} for /confirm-password. Should be 401 on failure.`);
        setErrors((prev) => ({ ...prev, current: "Incorrect current password." }));
        return;
      }

      const result = await response.text();

      // Only accept EXACT "true" (trimmed)
      if (result.trim() !== "true") {
        console.warn(`[SECURITY] Backend returned 200 but body is not "true":`, result);
        setErrors((prev) => ({ ...prev, current: "Incorrect current password." }));
        return;
      }

      // Success → proceed to change step
      setStep("change");
    } catch (error) {
      console.error("Verification failed:", error);
      toast({
        title: "Error",
        description: "Could not verify password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Update password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ current: "", new: "", confirm: "" });

    // Frontend-only validation — confirmPassword never sent to backend
    if (!newPassword || !confirmPassword) {
      setErrors((prev) => ({ ...prev, confirm: "All fields are required." }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirm: "Passwords do not match." }));
      return;
    }

    if (!validatePassword(newPassword)) {
      setErrors((prev) => ({
        ...prev,
        new: "Password must be 8+ characters, with uppercase letter and number.",
      }));
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/update-password`, {
        method: "PUT",
        headers: {
          "ngrok-skip-browser-warning": "true", 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        // SEND ONLY email + newPassword — confirmPassword is validated ONLY on frontend
        body: JSON.stringify({
          email,
          newPassword: newPassword.trim(),
        }),
      });

      // SECURITY: Always check HTTP status first
      if (!response.ok) {
        console.warn(`[SECURITY] Backend returned ${response.status} for /update-password.`);
        const errorMsg = await response.text();
        setErrors((prev) => ({
          ...prev,
          confirm: errorMsg || "Failed to update password. Please try again.",
        }));
        return;
      }

      const result = await response.text();

      // Only accept success message
      if (!result.includes("Password updated successfully")) {
        console.warn(`[SECURITY] Backend returned 200 but unexpected body:`, result);
        setErrors((prev) => ({
          ...prev,
          confirm: result || "An unknown error occurred.",
        }));
        return;
      }

      // Success!
      setSuccess("Password changed successfully!");
      toast({
        title: "Success",
        description: "Your password has been updated.",
      });

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard/students/profiles");
      }, 2000);
    } catch (error) {
      console.error("Update password error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while fetching email
  if (step === "fetching") {
    return (
      <div className="container mx-auto py-10 px-4 max-w-md">
        <p className="text-center text-muted-foreground">Loading account details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-md">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Main Card */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Key className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {step === "verify" ? "Verify Current Password" : "New Password"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Step 1: Verify Current Password */}
          {step === "verify" && (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  autoFocus
                />
                {errors.current && (
                  <p className="text-sm text-red-500">{errors.current}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Continue"}
              </Button>
            </form>
          )}

          {/* Step 2: Set New Password */}
          {step === "change" && (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, new: "" }));
                  }}
                  placeholder="Enter new password"
                  required
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                </p>
                {errors.new && <p className="text-sm text-red-500">{errors.new}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirm: "" }));
                  }}
                  placeholder="Re-enter new password"
                  required
                />
                {errors.confirm && (
                  <p className="text-sm text-red-500">{errors.confirm}</p>
                )}
              </div>

              {success && (
                <p className="text-sm text-green-600 font-medium">{success}</p>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep("verify")}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}