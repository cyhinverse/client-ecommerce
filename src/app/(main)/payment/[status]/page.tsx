"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle, ShoppingBag, Home, RefreshCcw } from "lucide-react";
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
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-black/5 max-w-lg w-full text-center space-y-8 border border-gray-100 dark:border-zinc-800"
                    >
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: 0.2 
                            }}
                            className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto"
                        >
                            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" strokeWidth={2} />
                        </motion.div>
                        
                        <div className="space-y-3">
                            <h2 className="text-4xl font-bold tracking-tight text-foreground">Payment Successful!</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Thank you for your purchase. We&apos;ve received your order and it will be shipped shortly.
                            </p>
                        </div>

                        {orderId && (
                            <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-dashed border-gray-200 dark:border-zinc-700">
                                <span className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Order Reference</span>
                                <span className="text-xl font-mono font-bold text-foreground tracking-wider">#{orderId.slice(-8).toUpperCase()}</span>
                            </div>
                        )}

                        <div className="flex flex-col gap-3 pt-2">
                            <Button 
                                onClick={() => router.push("/profile?tab=orders")} 
                                className="w-full rounded-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                            >
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                View My Order
                            </Button>
                            <Button 
                                onClick={() => router.push("/")} 
                                variant="ghost" 
                                className="w-full rounded-full h-12 text-base font-medium text-muted-foreground hover:text-foreground"
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    </motion.div>
                );

            case "failed":
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-black/5 max-w-lg w-full text-center space-y-8 border border-gray-100 dark:border-zinc-800"
                    >
                         <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                            className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto"
                        >
                            <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" strokeWidth={2} />
                        </motion.div>
                        
                        <div className="space-y-3">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground">Payment Failed</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                We couldn&apos;t process your payment. Please check your details and try again.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                            <Button 
                                onClick={() => router.push("/cart")} 
                                className="w-full rounded-full h-12 text-base font-semibold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"
                            >
                                <RefreshCcw className="w-5 h-5 mr-2" />
                                Try Again
                            </Button>
                            <Button 
                                onClick={() => router.push("/")} 
                                variant="ghost" 
                                className="w-full rounded-full h-12 text-base font-medium text-muted-foreground hover:text-foreground"
                            >
                                Return Home
                            </Button>
                        </div>
                    </motion.div>
                );

            case "error":
            default:
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-black/5 max-w-lg w-full text-center space-y-8 border border-gray-100 dark:border-zinc-800"
                    >
                         <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                             className="w-24 h-24 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto"
                        >
                             <AlertCircle className="w-12 h-12 text-amber-600 dark:text-amber-400" strokeWidth={2} />
                        </motion.div>
                        
                        <div className="space-y-3">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground">Something Went Wrong</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                An unexpected error occurred. Please contact our support team for assistance.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 mt-6">
                            <Button 
                                onClick={() => router.push("/")} 
                                className="w-full rounded-full h-12 text-base font-semibold"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                Return Home
                            </Button>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#fbfbfd] dark:bg-black flex items-center justify-center p-4">
             {/* Background Decoration */}
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-400/10 dark:bg-blue-900/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] bg-purple-400/10 dark:bg-purple-900/10 rounded-full blur-[100px]" />
            </div>
            
            <div className="relative z-10 w-full flex justify-center">
                {renderContent()}
            </div>
        </div>
    );
}
