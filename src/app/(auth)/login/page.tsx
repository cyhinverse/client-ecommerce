"use client";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { login } from "@/features/auth/authAction";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loading, isAuthenticated, token } = useAppSelector(
    (state) => state.auth
  );

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated && token) {
      router.push("/");
    }
  }, [isAuthenticated, token, router]);

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    try {
      const result = await dispatch(login(data));

      if (login.fulfilled.match(result)) {
        toast.success("Welcome back");
        router.push("/");
      } else {
        const errorMessage =
          (result.payload as { message: string })?.message ||
          "Login failed";
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
             <div className="mx-auto w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg rotate-3 transition-transform hover:rotate-6">
                <Lock className="h-6 w-6 text-white dark:text-black" />
             </div>
             <h1 className="text-2xl font-bold tracking-tight text-foreground">Sign in</h1>
             <p className="text-sm text-muted-foreground">Welcome back to the store</p>
          </div>

          <div className="p-8 rounded-[2rem] bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl shadow-xl border border-white/20">
             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                
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
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                      >
                         {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                   </div>
                   {form.formState.errors.password && (
                     <p className="text-xs text-red-500 ml-1">{form.formState.errors.password.message}</p>
                   )}
                </div>

                <div className="flex items-center justify-between pt-1">
                   <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe} 
                        onCheckedChange={(checked) => setRememberMe(!!checked)}
                        className="rounded-[4px] border-muted-foreground/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer select-none">Remember me</Label>
                   </div>
                   <Link href="/forgot-password" area-label="Forgot Password" className="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors">
                      Forgot password?
                   </Link>
                </div>

                <Button 
                   type="submit" 
                   disabled={loading}
                   className="w-full h-12 rounded-full bg-[#0071e3] hover:bg-[#0077ED] text-white font-medium text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
                >
                   {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
                   {!loading && <ArrowRight className="ml-2 h-5 w-5 opacity-50" />}
                </Button>

             </form>
          </div>

          <div className="text-center">
             <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-[#0071e3] hover:text-[#0077ED] transition-colors">
                   Create one now
                </Link>
             </p>
          </div>
       </div>
    </div>
  );
}
