"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Key, Loader2, ArrowLeft, Check, X } from "lucide-react";
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

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className={cn("flex items-center gap-2 text-xs transition-colors duration-200", met ? "text-green-600 dark:text-green-400" : "text-muted-foreground/50")}>
      {met ? <Check className="h-3 w-3" /> : <div className="h-1 w-1 rounded-full bg-current ml-1 mr-1" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F5F5F7] dark:bg-[#000000] p-4">
       <div className="w-full max-w-[400px] flex flex-col gap-6">
          
          <div className="text-center space-y-2">
             <Link href="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
                 <ArrowLeft className="h-4 w-4 mr-1" />
                 Back to login
             </Link>
             <div className="mx-auto w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg rotate-3 transition-transform hover:rotate-6">
                <Lock className="h-6 w-6 text-white dark:text-black" />
             </div>
             <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h1>
             <p className="text-sm text-muted-foreground">Create a strong new password</p>
          </div>

          <div className="p-8 rounded-[2rem] bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl shadow-xl border border-white/20">
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Email (Hidden logic or visible if needed, keeping visible for now as per logic) */}
                <div className="space-y-2">
                   <Label className="text-xs font-medium text-muted-foreground ml-1">Email</Label>
                   <Input
                      {...register("email")}
                      type="email"
                      placeholder="name@example.com"
                      className="pl-4 h-12 rounded-xl bg-gray-50/50 dark:bg-black/20 border-transparent focus:bg-white dark:focus:bg-black/40 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      disabled={isLoading}
                   />
                   {errors.email && (
                     <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>
                   )}
                </div>

                <div className="space-y-2">
                   <Label className="text-xs font-medium text-muted-foreground ml-1">Verification Code</Label>
                   <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors group-focus-within:text-blue-500" />
                      <Input
                        {...register("code")}
                        placeholder="6-digit code"
                        maxLength={6}
                        className="pl-12 h-12 rounded-xl bg-gray-50/50 dark:bg-black/20 border-transparent focus:bg-white dark:focus:bg-black/40 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        disabled={isLoading}
                      />
                   </div>
                   {errors.code && (
                     <p className="text-xs text-red-500 ml-1">{errors.code.message}</p>
                   )}
                </div>

                <div className="space-y-2">
                   <Label className="text-xs font-medium text-muted-foreground ml-1">New Password</Label>
                   <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors group-focus-within:text-blue-500" />
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        {...register("newPassword")}
                        placeholder="New password"
                        className="pl-12 pr-12 h-12 rounded-xl bg-gray-50/50 dark:bg-black/20 border-transparent focus:bg-white dark:focus:bg-black/40 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        disabled={isLoading}
                      />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground">
                         {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                   </div>
                   {/* Password Strength Indicators */}
                   {newPassword && (
                      <div className="grid grid-cols-2 gap-2 px-1 pt-1">
                         <PasswordRequirement met={newPassword.length >= 8} text="8+ characters" />
                         <PasswordRequirement met={/[A-Z]/.test(newPassword)} text="Uppercase letter" />
                         <PasswordRequirement met={/[a-z]/.test(newPassword)} text="Lowercase letter" />
                         <PasswordRequirement met={/\d/.test(newPassword)} text="Number" />
                      </div>
                   )}
                   {errors.newPassword && (
                     <p className="text-xs text-red-500 ml-1">{errors.newPassword.message}</p>
                   )}
                </div>

                <div className="space-y-2">
                   <Label className="text-xs font-medium text-muted-foreground ml-1">Confirm Password</Label>
                   <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors group-focus-within:text-blue-500" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        placeholder="Confirm password"
                        className="pl-12 pr-12 h-12 rounded-xl bg-gray-50/50 dark:bg-black/20 border-transparent focus:bg-white dark:focus:bg-black/40 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        disabled={isLoading}
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground">
                         {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                   </div>
                   {errors.confirmPassword && (
                     <p className="text-xs text-red-500 ml-1">{errors.confirmPassword.message}</p>
                   )}
                </div>

                <Button 
                   type="submit" 
                   disabled={isLoading}
                   className="w-full h-12 rounded-full bg-[#0071e3] hover:bg-[#0077ED] text-white font-medium text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 mt-2"
                >
                   {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Reset Password"}
                </Button>

             </form>
          </div>
       </div>
    </div>
  );
}
