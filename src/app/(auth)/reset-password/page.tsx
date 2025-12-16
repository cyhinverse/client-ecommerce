"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Mail, Key } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useAppDispatch } from "@/hooks/hooks";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/features/auth/authAction";
import { toast } from "sonner";

// Schema validation với Zod
const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email"),
    code: z.string().length(6, "Verification code must be 6 characters"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase letters and numbers"
      ),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      console.log("Submitting data:", data);

      const result = await dispatch(
        resetPassword({
          email: data.email,
          code: data.code,
          newPassword: data.newPassword,
        })
      );

      if (resetPassword.fulfilled.match(result)) {
        toast.success("Password reset successfully!");
        router.push("/login");
      } else {
        const errorMessage = "Failed to reset password";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      const errorMessage =
        (error as Error)?.message || "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const newPassword = watch("newPassword");

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-success" />
          </div>

          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription className="text-base">
            Enter verification code and new password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Code Field */}
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("code")}
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="w-full pl-10"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>
              {errors.code && (
                <p className="text-sm text-destructive">
                  {errors.code.message}
                </p>
              )}
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("newPassword")}
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isLoading}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Reset Password"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Password must be at least 8 characters, including uppercase, lowercase letters and numbers
            </p>
            {newPassword && (
              <div className="mt-2 space-y-1">
                <p
                  className={`text-xs ${
                    newPassword.length >= 8 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ✓ At least 8 chars: {newPassword.length}/8
                </p>
                <p
                  className={`text-xs ${
                    /[a-z]/.test(newPassword)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ✓ Lowercase
                </p>
                <p
                  className={`text-xs ${
                    /[A-Z]/.test(newPassword)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ✓ Uppercase
                </p>
                <p
                  className={`text-xs ${
                    /\d/.test(newPassword) ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ✓ Number
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
