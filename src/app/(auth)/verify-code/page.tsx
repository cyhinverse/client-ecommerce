"use client";
import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAppDispatch } from "@/hooks/hooks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { verifyCode } from "@/features/auth/authAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
      router.push("/login");
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
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-xl font-semibold">
            Enter Verification Code
          </CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Verification Code</Label>
              <div className="flex justify-center">
                <InputOTP value={otp} onChange={handleOTPChange} maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Please enter all 6 digits
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
