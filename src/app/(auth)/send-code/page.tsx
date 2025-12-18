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
        (error as { message?: string })?.message || "Failed to send verification code"
      );
    } finally {
      setIsLoading(false);
    }
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
                <Mail className="h-6 w-6 text-white dark:text-black" />
             </div>
             <h1 className="text-2xl font-bold tracking-tight text-foreground">Verify Email</h1>
             <p className="text-sm text-muted-foreground">Enter your email to receive verification code</p>
          </div>

          <div className="p-8 rounded-[2rem] bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl shadow-xl border border-white/20">
             <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-2">
                   <Label className="text-xs font-medium text-muted-foreground ml-1">Email</Label>
                   <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors group-focus-within:text-blue-500" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-12 h-12 rounded-xl bg-gray-50/50 dark:bg-black/20 border-transparent focus:bg-white dark:focus:bg-black/40 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        disabled={isLoading}
                      />
                   </div>
                </div>

                <Button 
                   type="submit" 
                   disabled={isLoading || !email}
                   className="w-full h-12 rounded-full bg-[#0071e3] hover:bg-[#0077ED] text-white font-medium text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
                >
                   {isLoading ? <SpinnerLoading noWrapper size={20} className="mr-2 text-white" /> : "Send Code"}
                </Button>

             </form>
          </div>
       </div>
    </div>
  );
}
