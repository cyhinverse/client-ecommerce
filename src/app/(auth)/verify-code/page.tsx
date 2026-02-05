"use client";
import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAppDispatch } from "@/hooks/hooks";
import { Button } from "@/components/ui/button";
import { verifyCode } from "@/features/auth/authAction";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SpinnerLoading from "@/components/common/SpinnerLoading";

export default function VerifyCodePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailParam = searchParams.get("email");
  const codeParam = searchParams.get("code");

  const [otp, setOtp] = useState<string>(codeParam || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Auto-submit if code is present in URL
  React.useEffect(() => {
    if (codeParam && codeParam.length === 6 && emailParam) {
      handleAutoSubmit(codeParam, emailParam);
    }
  }, [codeParam, emailParam]);

  const handleAutoSubmit = async (code: string, email: string) => {
    setIsLoading(true);
    try {
      await dispatch(verifyCode({ email, code })).unwrap();
      toast.success("Xác thực email thành công!");
      router.push("/login");
    } catch {
      toast.error("Xác thực email thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    if (!emailParam) {
      toast.error("Thiếu email để xác thực");
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(verifyCode({ email: emailParam, code: otp })).unwrap();
      toast.success("Xác thực email thành công!");
      router.push("/login");
    } catch {
      toast.error("Xác thực email thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (value: string) => {
    setOtp(value);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Kiểm tra email
        </h1>
        <p className="text-sm text-muted-foreground">
          Chúng tôi đã gửi mã xác nhận đến{" "}
          {emailParam ? (
            <span className="font-medium text-gray-900">{emailParam}</span>
          ) : (
            "email của bạn"
          )}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* OTP Input */}
        <div className="flex flex-col items-center gap-3">
          <InputOTP
            value={otp}
            onChange={handleOTPChange}
            maxLength={6}
            disabled={isLoading}
          >
            <InputOTPGroup>
              <InputOTPSlot
                index={0}
                className="w-12 h-12 text-lg rounded-xl border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
              />
              <InputOTPSlot
                index={1}
                className="w-12 h-12 text-lg rounded-xl border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
              />
              <InputOTPSlot
                index={2}
                className="w-12 h-12 text-lg rounded-xl border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
              />
            </InputOTPGroup>
            <InputOTPSeparator className="text-gray-300" />
            <InputOTPGroup>
              <InputOTPSlot
                index={3}
                className="w-12 h-12 text-lg rounded-xl border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
              />
              <InputOTPSlot
                index={4}
                className="w-12 h-12 text-lg rounded-xl border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
              />
              <InputOTPSlot
                index={5}
                className="w-12 h-12 text-lg rounded-xl border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
              />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-xs text-muted-foreground">
            Vui lòng nhập mã 6 số đã được gửi
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full h-11 bg-[#E53935] hover:bg-[#D32F2F] rounded-full text-base font-medium"
        >
          {isLoading ? (
            <SpinnerLoading noWrapper size={18} className="mr-2 text-white" />
          ) : null}
          Xác nhận
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
