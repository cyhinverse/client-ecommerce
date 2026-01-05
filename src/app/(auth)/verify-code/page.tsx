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
import { Label } from "@/components/ui/label";
import { verifyCode } from "@/features/auth/authAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Key, ArrowLeft } from "lucide-react";
import Link from "next/link";
import SpinnerLoading from "@/components/common/SpinnerLoading";

export default function VerifyCodePage() {
  const dispatch = useAppDispatch();
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await dispatch(verifyCode(otp)).unwrap();
      toast.success("Email verified successfully");
      router.push("/login"); // Or next step
    } catch {
      toast.error("Email verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (value: string) => {
    setOtp(value);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Check your email
        </h1>
        <p className="text-sm text-muted-foreground">
          We sent a verification code to your email
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label className="sr-only" htmlFor="otp">
                Verification Code
              </Label>
              <div className="flex justify-center">
                <InputOTP value={otp} onChange={handleOTPChange} maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-10 h-10" />
                    <InputOTPSlot index={1} className="w-10 h-10" />
                    <InputOTPSlot index={2} className="w-10 h-10" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="w-10 h-10" />
                    <InputOTPSlot index={4} className="w-10 h-10" />
                    <InputOTPSlot index={5} className="w-10 h-10" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Please enter the 6-digit code provided.
              </p>
            </div>
            <Button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="rounded-md h-10"
            >
              {isLoading ? (
                <SpinnerLoading
                  noWrapper
                  size={16}
                  className="mr-2 text-white"
                />
              ) : (
                "Verify Code"
              )}
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
