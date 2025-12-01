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
                        <h2 className="text-2xl font-bold text-success">Thanh toán thành công!</h2>
                        <p className="text-muted-foreground">
                            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được thanh toán thành công.
                        </p>
                        {orderId && (
                            <p className="text-sm text-muted-foreground">Mã đơn hàng: {orderId}</p>
                        )}
                        <div className="flex gap-4 mt-6">
                            <Button onClick={() => router.push("/")} variant="outline">
                                Về trang chủ
                            </Button>
                            <Button onClick={() => router.push("/profile")}>
                                Xem đơn hàng
                            </Button>
                        </div>
                    </div>
                );

            case "failed":
                return (
                    <div className="flex flex-col items-center text-center space-y-4">
                        <XCircle className="w-16 h-16 text-destructive" />
                        <h2 className="text-2xl font-bold text-destructive">Thanh toán thất bại</h2>
                        <p className="text-muted-foreground">
                            Giao dịch thanh toán của bạn không thành công hoặc đã bị hủy.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <Button onClick={() => router.push("/")} variant="outline">
                                Về trang chủ
                            </Button>
                            <Button onClick={() => router.push("/cart")}>
                                Về giỏ hàng
                            </Button>
                        </div>
                    </div>
                );

            case "error":
            default:
                return (
                    <div className="flex flex-col items-center text-center space-y-4">
                        <AlertCircle className="w-16 h-16 text-warning" />
                        <h2 className="text-2xl font-bold text-warning">Có lỗi xảy ra</h2>
                        <p className="text-muted-foreground">
                            Có lỗi xảy ra trong quá trình xử lý thanh toán. Vui lòng liên hệ bộ phận hỗ trợ.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <Button onClick={() => router.push("/")}>
                                Về trang chủ
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
