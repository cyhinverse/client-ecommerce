"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Order, OrderProduct } from "@/types/order";
import { Package, Clock, Truck, CheckCircle, XCircle, RefreshCw, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/hooks";
import { createPaymentUrl } from "@/features/payment/paymentAction";
import { toast } from "sonner";
import { useState } from "react";

interface OrderDialogProps {
    order: Order | null;
    open: boolean;
    onClose: () => void;
}

export default function OrderDialog({ order, open, onClose }: OrderDialogProps) {
    const dispatch = useAppDispatch();
    const [isPaying, setIsPaying] = useState(false);

    if (!order) return null;

    const handlePayment = async () => {
        if (!order) return;
        setIsPaying(true);
        try {
            toast.loading("Đang chuyển hướng đến VNPay...");
            const result = await dispatch(createPaymentUrl(order._id)).unwrap();
            if (result.paymentUrl) {
                window.location.href = result.paymentUrl;
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Không thể tạo thanh toán. Vui lòng thử lại.");
        } finally {
            setIsPaying(false);
        }
    };

    const getStatusIcon = (status: Order["status"]) => {
        switch (status) {
            case "pending": return <Clock className="h-3.5 w-3.5" />;
            case "confirmed":
            case "processing": return <RefreshCw className="h-3.5 w-3.5" />;
            case "shipped": return <Truck className="h-3.5 w-3.5" />;
            case "delivered": return <CheckCircle className="h-3.5 w-3.5" />;
            case "cancelled": return <XCircle className="h-3.5 w-3.5" />;
            default: return <Package className="h-3.5 w-3.5" />;
        }
    };

    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "confirmed":
            case "processing": return "bg-blue-100 text-blue-800";
            case "shipped": return "bg-purple-100 text-purple-800";
            case "delivered": return "bg-green-100 text-green-800";
            case "cancelled": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: Order["status"]) => {
        switch (status) {
            case "pending": return "Chờ xác nhận";
            case "confirmed": return "Đã xác nhận";
            case "processing": return "Đang xử lý";
            case "shipped": return "Đang giao hàng";
            case "delivered": return "Đã giao hàng";
            case "cancelled": return "Đã hủy";
            default: return status;
        }
    };

    const getPaymentStatusText = (status: Order["paymentStatus"]) => {
        switch (status) {
            case "unpaid": return "Chưa thanh toán";
            case "paid": return "Đã thanh toán";
            case "refunded": return "Đã hoàn tiền";
            default: return status;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getProductDisplayName = (product: OrderProduct) => {
        let name = product.name;
        if (product.color || product.size) {
            const attributes = [product.color, product.size].filter(Boolean);
            if (attributes.length > 0) {
                name += ` (${attributes.join(" - ")})`;
            }
        }
        return name;
    };

    const getActualPrice = (product: OrderProduct) => {
        return product.price.discountPrice || product.price.currentPrice;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] sm:max-w-[95vw] w-[70vw] h-[80vh] overflow-y-auto p-0">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        Chi tiết đơn hàng
                        <Badge className={`${getStatusColor(order.status)} text-xs`}>
                            <span className="flex items-center gap-1">
                                {getStatusIcon(order.status)}
                                {getStatusText(order.status)}
                            </span>
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Main Content - 2/3 width */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Order Information */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Thông tin đơn hàng
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-muted-foreground text-xs">Mã đơn hàng:</span>
                                        <p className="font-medium mt-1 text-sm">{order.orderCode || order._id}</p>
                                    </div>

                                    <div>
                                        <span className="text-muted-foreground text-xs">Ngày đặt:</span>
                                        <p className="mt-1 text-sm">{formatDate(order.createdAt)}</p>
                                    </div>

                                    <div>
                                        <span className="text-muted-foreground text-xs">Cập nhật lúc:</span>
                                        <p className="mt-1 text-sm">{formatDate(order.updatedAt)}</p>
                                    </div>

                                    {order.deliveredAt && (
                                        <div>
                                            <span className="text-muted-foreground text-xs">Ngày giao hàng:</span>
                                            <p className="mt-1 text-sm">{formatDate(order.deliveredAt)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Products */}
                            <div>
                                <h3 className="font-semibold text-base mb-3">Sản phẩm ({order.products.length})</h3>
                                <div className="space-y-3">
                                    {order.products.map((product, index) => (
                                        <div key={product.productId + index} className="flex items-start gap-3 p-3 border rounded-lg">
                                            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                                {product.image ? (
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        width={56}
                                                        height={56}
                                                        className="object-cover rounded"
                                                    />
                                                ) : (
                                                    <Package className="h-6 w-6 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm mb-1">{getProductDisplayName(product)}</p>
                                                {product.sku && (
                                                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                                                )}
                                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                    <span>Số lượng: {product.quantity}</span>
                                                    <span>•</span>
                                                    <span>{formatCurrency(getActualPrice(product))} / sp</span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="font-semibold text-sm">{formatCurrency(getActualPrice(product) * product.quantity)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - 1/3 width */}
                        <div className="space-y-4">
                            {/* Order Summary */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-base mb-3">Tổng quan đơn hàng</h3>
                                    <div className="flex justify-between items-center font-semibold text-base border-t pt-2">
                                        <span>Tổng cộng:</span>
                                        <span>{formatCurrency(order.totalAmount)}</span>
                                    </div>
                                </div>

                            {/* Payment Information */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    Thanh toán
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground text-xs">Phương thức:</span>
                                        <span className="font-medium text-sm">{order.paymentMethod === "cod" ? "COD" : "VNPay"}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground text-xs">Trạng thái:</span>
                                        <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"} className="text-xs">
                                            {getPaymentStatusText(order.paymentStatus)}
                                        </Badge>
                                    </div>
                                    {order.discountCode && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground text-xs">Mã giảm giá:</span>
                                            <span className="font-medium text-sm text-blue-600">{order.discountCode}</span>
                                        </div>
                                    )}
                                </div>
                                {order.paymentMethod === "vnpay" && order.paymentStatus === "unpaid" && (
                                    <div className="mt-4 pt-4 border-t">
                                        <Button
                                            className="w-full"
                                            onClick={handlePayment}
                                            disabled={isPaying}
                                        >
                                            {isPaying ? "Đang xử lý..." : "Thanh toán ngay"}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Giao hàng
                                </h3>
                                <div className="text-sm space-y-1">
                                    <p className="font-semibold text-sm">{order.shippingAddress.fullName}</p>
                                    <p className="text-muted-foreground text-xs">{order.shippingAddress.phone}</p>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        {[
                                            order.shippingAddress.address,
                                            order.shippingAddress.ward,
                                            order.shippingAddress.district,
                                            order.shippingAddress.city
                                        ].filter(Boolean).join(", ")}
                                    </p>
                                    {order.shippingAddress.note && (
                                        <div className="mt-2 pt-2 border-t">
                                            <p className="font-medium text-xs mb-1">Ghi chú:</p>
                                            <p className="text-muted-foreground text-xs">{order.shippingAddress.note}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    );
}