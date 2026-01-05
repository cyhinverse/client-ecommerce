"use client";
import React, { useState } from "react";
import { useAppDispatch } from "@/hooks/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { sendCode } from "@/features/auth/authAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import SpinnerLoading from "@/components/common/SpinnerLoading";

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
        toast.success("Verification code sent to your email");
        router.push("/verify-code");
      }
    } catch (error) {
      toast.error(
        (error as { message?: string })?.message ||
          "Failed to send verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Verify Email</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to receive verification code
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 rounded-md"
                disabled={isLoading}
              />
            </div>
            <Button disabled={isLoading || !email} className="rounded-md h-10">
              {isLoading && (
                <SpinnerLoading
                  noWrapper
                  size={16}
                  className="mr-2 text-white"
                />
              )}
              Send Code
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
