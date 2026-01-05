"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Key, ArrowLeft, Check } from "lucide-react";
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
      const errorMessage =
        (error as Error)?.message || "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const newPassword = watch("newPassword");

  const PasswordRequirement = ({
    met,
    text,
  }: {
    met: boolean;
    text: string;
  }) => (
    <div
      className={cn(
        "flex items-center gap-2 text-xs transition-colors duration-200",
        met ? "text-green-600 dark:text-green-400" : "text-muted-foreground/50"
      )}
    >
      {met ? (
        <Check className="h-3 w-3" />
      ) : (
        <div className="h-1 w-1 rounded-full bg-current ml-1 mr-1" />
      )}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Create a strong new password
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="name@example.com"
                className="h-10 rounded-md"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                {...register("code")}
                placeholder="6-digit code"
                maxLength={6}
                className="h-10 rounded-md"
                disabled={isLoading}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword")}
                  placeholder="New password"
                  className="h-10 rounded-md pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {newPassword && (
                <div className="grid grid-cols-2 gap-2 px-1 pt-1">
                  <PasswordRequirement
                    met={newPassword.length >= 8}
                    text="8+ chars"
                  />
                  <PasswordRequirement
                    met={/[A-Z]/.test(newPassword)}
                    text="Uppercase"
                  />
                  <PasswordRequirement
                    met={/[a-z]/.test(newPassword)}
                    text="Lowercase"
                  />
                  <PasswordRequirement
                    met={/\d/.test(newPassword)}
                    text="Number"
                  />
                </div>
              )}
              {errors.newPassword && (
                <p className="text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Confirm password"
                  className="h-10 rounded-md pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button disabled={isLoading} className="rounded-md h-10 mt-2">
              {isLoading && (
                <SpinnerLoading
                  noWrapper
                  size={16}
                  className="mr-2 text-white"
                />
              )}
              Reset Password
            </Button>
          </div>
        </form>
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="hover:text-brand underline underline-offset-4 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </p>
    </div>
  );
}
