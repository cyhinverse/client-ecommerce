"use client";
import React from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle, ShoppingBag, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentResultPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const status = params.status as string;
    const orderId = searchParams.get("orderId");

    const renderContent = () => {
        switch (status) {
            case "success":
                return (
                    <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, type: "spring" }}
                        >
                            <CheckCircle2 className="w-24 h-24 text-green-500" strokeWidth={1.5} />
                        </motion.div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-semibold tracking-tight">Payment Successful</h2>
                            <p className="text-muted-foreground text-lg">
                                Thank you for your purchase. Your order has been confirmed.
                            </p>
                        </div>
                        {orderId && (
                            <div className="bg-muted/30 px-4 py-2 rounded-full font-mono text-sm border border-border/50">
                                Order #{orderId.slice(-8).toUpperCase()}
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
                            <Button onClick={() => router.push("/")} variant="outline" className="rounded-full h-12 px-8 w-full sm:w-auto" size="lg">
                                <Home className="w-4 h-4 mr-2" />
                                Home
                            </Button>
                            <Button onClick={() => router.push("/profile?tab=orders")} className="rounded-full h-12 px-8 w-full sm:w-auto bg-[#0071E3] hover:bg-[#0077ED] text-white" size="lg">
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                View Order
                            </Button>
                        </div>
                    </div>
                );

            case "failed":
                return (
                    <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
                         <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, type: "spring" }}
                        >
                            <XCircle className="w-24 h-24 text-red-500" strokeWidth={1.5} />
                        </motion.div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-semibold tracking-tight">Payment Failed</h2>
                            <p className="text-muted-foreground text-lg">
                                Your payment could not be processed. Please try again or use a different method.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
                            <Button onClick={() => router.push("/")} variant="outline" className="rounded-full h-12 px-8 w-full sm:w-auto" size="lg">
                                <Home className="w-4 h-4 mr-2" />
                                Home
                            </Button>
                            <Button onClick={() => router.push("/cart")} className="rounded-full h-12 px-8 w-full sm:w-auto" size="lg">
                                Try Again
                            </Button>
                        </div>
                    </div>
                );

            case "error":
            default:
                return (
                    <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
                         <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, type: "spring" }}
                        >
                             <AlertCircle className="w-24 h-24 text-amber-500" strokeWidth={1.5} />
                        </motion.div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-semibold tracking-tight">Something Went Wrong</h2>
                            <p className="text-muted-foreground text-lg">
                                An unexpected error occurred. Please contact our support team.
                            </p>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <Button onClick={() => router.push("/")} className="rounded-full h-12 px-8" size="lg">
                                Return Home
                            </Button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-background">
            {renderContent()}
        </div>
    );
}
