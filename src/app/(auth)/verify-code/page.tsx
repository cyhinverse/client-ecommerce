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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F5F5F7] dark:bg-[#000000] p-4">
       <div className="w-full max-w-[400px] flex flex-col gap-6">
          
          <div className="text-center space-y-2">
             <Link href="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
                 <ArrowLeft className="h-4 w-4 mr-1" />
                 Back to login
             </Link>
             <div className="mx-auto w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg rotate-3 transition-transform hover:rotate-6">
                <Key className="h-6 w-6 text-white dark:text-black" />
             </div>
             <h1 className="text-2xl font-bold tracking-tight text-foreground">Check your email</h1>
             <p className="text-sm text-muted-foreground">We sent a verification code to your email</p>
          </div>

          <div className="p-8 rounded-[2rem] bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl shadow-xl border border-white/20">
             <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="space-y-4">
                   <Label className="text-xs font-medium text-muted-foreground text-center block">Verification Code</Label>
                   <div className="flex justify-center">
                     <InputOTP value={otp} onChange={handleOTPChange} maxLength={6}>
                       <InputOTPGroup className="gap-2">
                         <InputOTPSlot index={0} className="h-12 w-10 text-lg rounded-xl border border-muted-foreground/20 bg-gray-50/50 dark:bg-black/20" />
                         <InputOTPSlot index={1} className="h-12 w-10 text-lg rounded-xl border border-muted-foreground/20 bg-gray-50/50 dark:bg-black/20" />
                         <InputOTPSlot index={2} className="h-12 w-10 text-lg rounded-xl border border-muted-foreground/20 bg-gray-50/50 dark:bg-black/20" />
                       </InputOTPGroup>
                       <InputOTPSeparator />
                       <InputOTPGroup className="gap-2">
                         <InputOTPSlot index={3} className="h-12 w-10 text-lg rounded-xl border border-muted-foreground/20 bg-gray-50/50 dark:bg-black/20" />
                         <InputOTPSlot index={4} className="h-12 w-10 text-lg rounded-xl border border-muted-foreground/20 bg-gray-50/50 dark:bg-black/20" />
                         <InputOTPSlot index={5} className="h-12 w-10 text-lg rounded-xl border border-muted-foreground/20 bg-gray-50/50 dark:bg-black/20" />
                       </InputOTPGroup>
                     </InputOTP>
                   </div>
                   <p className="text-xs text-center text-muted-foreground">
                      Please enter the 6-digit code provided.
                   </p>
                </div>

                <Button 
                   type="submit" 
                   disabled={isLoading || otp.length !== 6}
                   className="w-full h-12 rounded-full bg-[#0071e3] hover:bg-[#0077ED] text-white font-medium text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
                >
                   {isLoading ? <SpinnerLoading noWrapper size={20} className="mr-2 text-white" /> : "Verify Code"}
                </Button>

             </form>
          </div>
       </div>
    </div>
  );
}
