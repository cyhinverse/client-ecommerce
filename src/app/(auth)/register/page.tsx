"use client";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { register } from "@/features/auth/authAction";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import SpinnerLoading from "@/components/common/SpinnerLoading";

const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password confirmation must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading } = useAppSelector((state) => state.auth);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    try {
      const result = await dispatch(register(data));
      if (register.fulfilled.match(result)) {
        toast.success("Account created! Please verify your email.");
        router.push("/send-code");
      } else {
        const errorMessage =
          (result.payload as { message: string })?.message ||
          "Registration failed";
        toast.error(errorMessage);
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F5F5F7] dark:bg-[#000000] p-4">
       <div className="w-full max-w-[400px] flex flex-col gap-6">
          
          <div className="text-center space-y-2">
             <Link href="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
                 <ArrowLeft className="h-4 w-4 mr-1" />
                 Back to login
             </Link>
             <div className="mx-auto w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg -rotate-3 transition-transform hover:-rotate-6">
                <User className="h-6 w-6 text-white dark:text-black" />
             </div>
             <h1 className="text-2xl font-bold tracking-tight text-foreground">Create account</h1>
             <p className="text-sm text-muted-foreground">Join us to start shopping today</p>
          </div>

          <div className="p-8 rounded-[2rem] bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl shadow-xl border border-white/20">
             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                <div className="space-y-2">
                   <Label className="text-xs font-medium text-muted-foreground ml-1">Username</Label>
                   <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors group-focus-within:text-blue-500" />
                      <Input
                        {...form.register("username")}
                        placeholder="username"
                        className="pl-12 h-12 rounded-xl bg-gray-50/50 dark:bg-black/20 border-transparent focus:bg-white dark:focus:bg-black/40 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        autoComplete="username"
                      />
                   </div>
                   {form.formState.errors.username && (
                     <p className="text-xs text-red-500 ml-1">{form.formState.errors.username.message}</p>
                   )}
                </div>

                <div className="space-y-2">
                   <Label className="text-xs font-medium text-muted-foreground ml-1">Email</Label>
                   <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors group-focus-within:text-blue-500" />
                      <Input
                        {...form.register("email")}
                        placeholder="name@example.com"
                        className="pl-12 h-12 rounded-xl bg-gray-50/50 dark:bg-black/20 border-transparent focus:bg-white dark:focus:bg-black/40 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        autoComplete="email"
                      />
                   </div>
                   {form.formState.errors.email && (
                     <p className="text-xs text-red-500 ml-1">{form.formState.errors.email.message}</p>
                   )}
                </div>

                <div className="space-y-2">
                   <Label className="text-xs font-medium text-muted-foreground ml-1">Password</Label>
                   <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors group-focus-within:text-blue-500" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...form.register("password")}
                        placeholder="••••••••"
                        className="pl-12 pr-12 h-12 rounded-xl bg-gray-50/50 dark:bg-black/20 border-transparent focus:bg-white dark:focus:bg-black/40 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        autoComplete="new-password"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground">
                         {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                   </div>
                   {form.formState.errors.password && (
                     <p className="text-xs text-red-500 ml-1">{form.formState.errors.password.message}</p>
                   )}
                </div>

                <div className="space-y-2">
                   <Label className="text-xs font-medium text-muted-foreground ml-1">Confirm Password</Label>
                   <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors group-focus-within:text-blue-500" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        {...form.register("confirmPassword")}
                        placeholder="••••••••"
                        className="pl-12 pr-12 h-12 rounded-xl bg-gray-50/50 dark:bg-black/20 border-transparent focus:bg-white dark:focus:bg-black/40 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        autoComplete="new-password"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground">
                         {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                   </div>
                   {form.formState.errors.confirmPassword && (
                     <p className="text-xs text-red-500 ml-1">{form.formState.errors.confirmPassword.message}</p>
                   )}
                </div>

                <Button 
                   type="submit" 
                   disabled={loading}
                   className="w-full h-12 rounded-full bg-[#0071e3] hover:bg-[#0077ED] text-white font-medium text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 mt-2"
                >
                   {loading ? <SpinnerLoading noWrapper size={20} className="mr-2 text-white" /> : "Create Account"}
                </Button>

             </form>
          </div>

          <div className="text-center">
             <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-[#0071e3] hover:text-[#0077ED] transition-colors">
                   Log in here
                </Link>
             </p>
          </div>
       </div>
    </div>
  );
}
