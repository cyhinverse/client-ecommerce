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
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/hooks";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/features/auth/authAction";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

// Schema validation với Zod
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

type FormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await dispatch(forgotPassword(data.email)).unwrap();
      toast.success("Password reset link sent to your email");
      router.push("/reset-password");
    } catch {
      toast.error("Failed to send password reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Link>

          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>

          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription className="text-base">
            Enter email to receive verification code
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Sử dụng handleSubmit từ react-hook-form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Code"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              We will send a 6-digit code to your email
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
