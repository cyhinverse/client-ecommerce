"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useAppDispatch } from "@/hooks/hooks";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/features/auth/authAction";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

const resetPasswordSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    code: z.string().length(6, "Mã xác nhận phải có 6 ký tự"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải chứa chữ hoa, chữ thường và số"
      ),
    confirmPassword: z.string().min(8, "Xác nhận mật khẩu phải có ít nhất 8 ký tự"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu không khớp",
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
        toast.error("Không thể đặt lại mật khẩu");
      }
    } catch (error) {
      const errorMessage = (error as Error)?.message || "Không thể đặt lại mật khẩu";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const newPassword = watch("newPassword");

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs transition-colors",
        met ? "text-green-600" : "text-gray-400"
      )}
    >
      {met ? (
        <Check className="h-3 w-3" />
      ) : (
        <div className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Đặt lại mật khẩu
        </h1>
        <p className="text-sm text-muted-foreground">
          Tạo mật khẩu mới cho tài khoản của bạn
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            {...register("email")}
            type="email"
            placeholder="name@example.com"
            className="h-11 rounded-xl border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Verification Code */}
        <div className="grid gap-2">
          <Label htmlFor="code" className="text-sm font-medium">
            Mã xác nhận
          </Label>
          <Input
            {...register("code")}
            placeholder="Nhập mã 6 số"
            maxLength={6}
            className="h-11 rounded-xl border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
            disabled={isLoading}
          />
          {errors.code && (
            <p className="text-sm text-red-500">{errors.code.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="grid gap-2">
          <Label htmlFor="newPassword" className="text-sm font-medium">
            Mật khẩu mới
          </Label>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              {...register("newPassword")}
              placeholder="••••••••"
              className="h-11 rounded-xl border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20 pr-11"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {/* Password Requirements */}
          {newPassword && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
              <PasswordRequirement met={newPassword.length >= 8} text="8+ ký tự" />
              <PasswordRequirement met={/[A-Z]/.test(newPassword)} text="Chữ hoa" />
              <PasswordRequirement met={/[a-z]/.test(newPassword)} text="Chữ thường" />
              <PasswordRequirement met={/\d/.test(newPassword)} text="Số" />
            </div>
          )}
          {errors.newPassword && (
            <p className="text-sm text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Xác nhận mật khẩu
          </Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="••••••••"
              className="h-11 rounded-xl border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20 pr-11"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-[#E53935] hover:bg-[#D32F2F] rounded-full text-base font-medium mt-2"
        >
          {isLoading && (
            <SpinnerLoading noWrapper size={18} className="mr-2 text-white" />
          )}
          Đặt lại mật khẩu
        </Button>
      </form>

      {/* Footer */}
      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-[#E53935] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại đăng nhập
      </Link>
    </div>
  );
}
