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
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import SpinnerLoading from "@/components/common/SpinnerLoading";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loading, isAuthenticated, token } = useAppSelector(
    (state) => state.auth,
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
        toast.success("Chào mừng bạn trở lại!");
        router.push("/");
      } else {
        const errorMessage =
          (result.payload as { message: string })?.message ||
          "Đăng nhập thất bại";
        toast.error(errorMessage);
      }
    } catch {
      toast.error("Đã có lỗi xảy ra");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Đăng nhập
        </h1>
        <p className="text-sm text-muted-foreground">
          Nhập email và mật khẩu để đăng nhập
        </p>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={loading}
            {...form.register("email")}
            className="h-11 rounded-xl border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Mật khẩu
            </Label>
            <Link
              href="/forgot-password"
              className="text-sm text-[#E53935] hover:underline underline-offset-4"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              disabled={loading}
              {...form.register("password")}
              className="h-11 rounded-xl border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(!!checked)}
            className="rounded border-gray-300 data-[state=checked]:bg-[#E53935] data-[state=checked]:border-[#E53935]"
          />
          <Label
            htmlFor="remember"
            className="text-sm text-gray-600 cursor-pointer"
          >
            Ghi nhớ đăng nhập
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-[#E53935] hover:bg-[#D32F2F] rounded-full text-base font-medium mt-2"
        >
          {loading && (
            <SpinnerLoading noWrapper size={18} className="mr-2 text-white" />
          )}
          Đăng nhập
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="text-[#E53935] hover:underline underline-offset-4 font-medium"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
