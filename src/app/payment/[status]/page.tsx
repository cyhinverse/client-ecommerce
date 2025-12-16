"use client";
import React from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

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
                    <div className="flex flex-col items-center text-center space-y-4">
                        <CheckCircle className="w-16 h-16 text-success" />
                        <h2 className="text-2xl font-bold text-success">Payment Successful!</h2>
                        <p className="text-muted-foreground">
                            Thank you for your purchase. Your order has been paid successfully.
                        </p>
                        {orderId && (
                            <p className="text-sm text-muted-foreground">Order ID: {orderId}</p>
                        )}
                        <div className="flex gap-4 mt-6">
                            <Button onClick={() => router.push("/")} variant="outline">
                                Back to Home
                            </Button>
                            <Button onClick={() => router.push("/profile")}>
                                View Order
                            </Button>
                        </div>
                    </div>
                );

            case "failed":
                return (
                    <div className="flex flex-col items-center text-center space-y-4">
                        <XCircle className="w-16 h-16 text-destructive" />
                        <h2 className="text-2xl font-bold text-destructive">Payment Failed</h2>
                        <p className="text-muted-foreground">
                            Your payment transaction was unsuccessful or cancelled.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <Button onClick={() => router.push("/")} variant="outline">
                                Back to Home
                            </Button>
                            <Button onClick={() => router.push("/cart")}>
                                Back to Cart
                            </Button>
                        </div>
                    </div>
                );

            case "error":
            default:
                return (
                    <div className="flex flex-col items-center text-center space-y-4">
                        <AlertCircle className="w-16 h-16 text-warning" />
                        <h2 className="text-2xl font-bold text-warning">An Error Occurred</h2>
                        <p className="text-muted-foreground">
                            An error occurred during payment processing. Please contact support.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <Button onClick={() => router.push("/")}>
                                Back to Home
                            </Button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6">
                    {renderContent()}
                </CardContent>
            </Card>
        </div>
    );
}
