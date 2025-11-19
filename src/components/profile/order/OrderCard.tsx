"use client";
import { Eye, Clock, Truck, CheckCircle, XCircle, RefreshCw, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order, OrderProduct } from "@/types/order";

interface OrderCardProps {
    order: Order;
    onViewOrder: (orderId: string) => void;
    onCancelOrder: (orderId: string) => void;
    isCancelling: boolean;
}

export default function OrderCard({ order, onViewOrder, onCancelOrder, isCancelling }: OrderCardProps) {
    const getStatusIcon = (status: Order["status"]) => {
        switch (status) {
            case "pending": return <Clock className="h-4 w-4" />;
            case "confirmed":
            case "processing": return <RefreshCw className="h-4 w-4" />;
            case "shipped": return <Truck className="h-4 w-4" />;
            case "delivered": return <CheckCircle className="h-4 w-4" />;
            case "cancelled": return <XCircle className="h-4 w-4" />;
            default: return <Package className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "confirmed":
            case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
            case "shipped": return "bg-purple-100 text-purple-800 border-purple-200";
            case "delivered": return "bg-green-100 text-green-800 border-green-200";
            case "cancelled": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
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

    const getProductImage = (product: OrderProduct) => {
        return product.image || "/images/placeholder-product.jpg";
    };

    const getActualPrice = (product: OrderProduct) => {
        return product.price.discountPrice || product.price.currentPrice;
    };

    return (
        <Card key={order._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            {order.orderCode ? `Đơn hàng #${order.orderCode}` : `Đơn hàng ${order._id.slice(-8)}`}
                            <Badge variant="outline" className={getStatusColor(order.status)}>
                                <span className="flex items-center gap-1">
                                    {getStatusIcon(order.status)}
                                    {getStatusText(order.status)}
                                </span>
                            </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Đặt ngày: {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold">{formatCurrency(order.totalAmount)}</p>
                        <Badge variant="secondary" className="mt-1">
                            {getPaymentStatusText(order.paymentStatus)}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {/* Order Products */}
                <div className="border-t pt-3 mb-4">
                    <h4 className="font-medium mb-2">Sản phẩm:</h4>
                    <div className="space-y-3">
                        {order.products.slice(0, 3).map((product, index) => (
                            <div key={product.productId + index} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                        {product.image ? (
                                            <img
                                                src={getProductImage(product)}
                                                alt={product.name}
                                                className="w-6 h-6 object-cover rounded"
                                            />
                                        ) : (
                                            <Package className="h-4 w-4 text-gray-400" />
                                        )}
                                    </div>
                                    <span className="flex-1">
                                        {getProductDisplayName(product)}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div>{formatCurrency(getActualPrice(product) * product.quantity)}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {formatCurrency(getActualPrice(product))} × {product.quantity}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {order.products.length > 3 && (
                            <div className="text-sm text-muted-foreground text-center">
                                +{order.products.length - 3} sản phẩm khác...
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-3 mb-4">
                    <h4 className="font-medium mb-2">Tổng quan đơn hàng:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Tạm tính:</div>
                        <div className="text-right">{formatCurrency(order.subtotal)}</div>

                        <div className="text-muted-foreground">Phí vận chuyển:</div>
                        <div className="text-right">{formatCurrency(order.shippingFee)}</div>

                        {order.discountAmount > 0 && (
                            <>
                                <div className="text-muted-foreground">Giảm giá:</div>
                                <div className="text-right text-green-600">-{formatCurrency(order.discountAmount)}</div>
                            </>
                        )}

                        <div className="font-medium border-t pt-1">Tổng cộng:</div>
                        <div className="font-medium text-right border-t pt-1">{formatCurrency(order.totalAmount)}</div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="border-t pt-3 mb-4">
                    <h4 className="font-medium mb-1">Địa chỉ giao hàng:</h4>
                    <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.fullName} - {order.shippingAddress.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {[
                            order.shippingAddress.address,
                            order.shippingAddress.ward,
                            order.shippingAddress.district,
                            order.shippingAddress.city
                        ].filter(Boolean).join(", ")}
                    </p>
                    {order.shippingAddress.note && (
                        <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Ghi chú:</span> {order.shippingAddress.note}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="border-t pt-3 flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        Phương thức: {order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "VNPay"}
                        {order.discountCode && ` • Mã giảm giá: ${order.discountCode}`}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewOrder(order._id)}
                        >
                            <Eye className="h-4 w-4 mr-1" />
                            Xem chi tiết
                        </Button>

                        {(order.status === "pending" || order.status === "confirmed") && order.paymentStatus !== "paid" && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onCancelOrder(order._id)}
                                disabled={isCancelling}
                                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                            >
                                {isCancelling ? (
                                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                    <XCircle className="h-4 w-4 mr-1" />
                                )}
                                {isCancelling ? "Đang hủy..." : "Hủy đơn"}
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}