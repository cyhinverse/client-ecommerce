"use client";
import React, { useState } from "react";
import { useAppDispatch } from "@/hooks/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { sendCode } from "@/features/auth/authAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SpinnerLoading from "@/components/common/SpinnerLoading";

export default function SendCodePage() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await dispatch(sendCode({ email })).unwrap();
      if (result) {
        toast.success("Mã xác nhận đã được gửi đến email của bạn");
        router.push("/verify-code");
      }
    } catch (error) {
      toast.error(
        (error as { message?: string })?.message || "Không thể gửi mã xác nhận"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Xác thực email
        </h1>
        <p className="text-sm text-muted-foreground">
          Nhập email để nhận mã xác thực
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 rounded-xl border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !email}
          className="w-full h-11 bg-[#E53935] hover:bg-[#D32F2F] rounded-full text-base font-medium mt-2"
        >
          {isLoading && (
            <SpinnerLoading noWrapper size={18} className="mr-2 text-white" />
          )}
          Gửi mã xác nhận
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
