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
    email: z.string().email("Email không hợp lệ"),
    code: z.string().length(6, "Mã xác thực phải có 6 ký tự"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải bao gồm chữ hoa, chữ thường và số"
      ),
    confirmPassword: z
      .string()
      .min(8, "Mật khẩu xác nhận phải có ít nhất 8 ký tự"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
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
        toast.success("Đặt lại mật khẩu thành công!");
        router.push("/login");
      } else {
        const errorMessage =
         "Đặt lại mật khẩu thất bại";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      const errorMessage = error?.message || "Đặt lại mật khẩu thất bại";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const newPassword = watch("newPassword");

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-green-600" />
          </div>

          <CardTitle className="text-2xl font-bold">Đặt lại mật khẩu</CardTitle>
          <CardDescription className="text-base">
            Nhập mã xác thực và mật khẩu mới
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="w-full pl-10"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Code Field */}
            <div className="space-y-2">
              <Label htmlFor="code">Mã xác thực</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  {...register("code")}
                  id="code"
                  type="text"
                  placeholder="Nhập mã xác thực 6 số"
                  className="w-full pl-10"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  {...register("newPassword")}
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
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
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu mới"
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
              {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và
              số
            </p>
            {newPassword && (
              <div className="mt-2 space-y-1">
                <p
                  className={`text-xs ${
                    newPassword.length >= 8 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ✓ Ít nhất 8 ký tự: {newPassword.length}/8
                </p>
                <p
                  className={`text-xs ${
                    /[a-z]/.test(newPassword)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ✓ Chữ thường
                </p>
                <p
                  className={`text-xs ${
                    /[A-Z]/.test(newPassword)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ✓ Chữ hoa
                </p>
                <p
                  className={`text-xs ${
                    /\d/.test(newPassword) ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ✓ Số
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
