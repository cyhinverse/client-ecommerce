"use client";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { login } from "@/features/auth/authAction";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

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
    (state) => state.auth
  );

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      router.push("/");
    }
  }, [isAuthenticated, token, router]);

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    try {
      const result = await dispatch(login(data));

      if (login.fulfilled.match(result)) {
        toast.success("Đăng nhập thành công!");

        if (rememberMe && result.payload?.token) {
          localStorage.setItem("auth-token", result.payload.token);
        }
        router.push("/");
      } else {
        const errorMessage =
          (result.payload as { message: string })?.message ||
          "Đăng nhập thất bại!";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>

          <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
          <CardDescription className="text-base">
            Chào mừng bạn quay lại
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Đặt form.handleSubmit trực tiếp trong thẻ form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  {...form.register("email")}
                  placeholder="Nhập email của bạn"
                  className="pl-10"
                  autoComplete="username"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  placeholder="Nhập mật khẩu của bạn"
                  className="pl-10 pr-10"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label htmlFor="remember" className="text-sm">
                  Ghi nhớ đăng nhập
                </Label>
              </div>

              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-sm text-primary"
                onClick={() => router.push("/forgot-password")}
              >
                Quên mật khẩu?
              </Button>
            </div>

            {/* Di chuyển nút Submit vào trong form */}
            <Button
              type="submit" // Sử dụng type="submit" thay vì onClick
              className="w-full"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {/* Di chuyển phần đăng ký ra ngoài form */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Button
                type="button" // Thêm type="button" để không submit form
                variant="link"
                className="p-0 h-auto font-normal text-primary"
                onClick={() => router.push("/register")}
              >
                Đăng ký ngay
              </Button>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
