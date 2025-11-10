"use client";
import React, { useState } from "react";
import { useAppDispatch } from "@/hooks/hooks";
import { Input } from "@/components/ui/input";
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
import { sendCode } from "@/features/auth/authAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
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
        toast.success("Mã xác thực đã được gửi đến email của bạn");
        router.push("/verify-code");
      }
    } catch (error: any) {
      toast.error(error?.message || "Gửi mã xác thực thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md gap-1">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-xl font-semibold">
            Xác thực email
          </CardTitle>
          <CardDescription>Nhập email để nhận mã xác thực</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email}
            >
              {isLoading ? "Đang gửi mã..." : "Gửi mã xác thực"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
