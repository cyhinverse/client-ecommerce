import { Order } from "@/types/order";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";

interface ViewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (order: Order) => void;
  order: Order | null;
}

export  function ViewOrderModal({
  isOpen,
  onClose,
  onEdit,
  order,
}: ViewOrderModalProps) {
  if (!order) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { label: string; variant: "default" | "secondary" | "destructive" | "outline" } } = {
      pending: { label: "Chờ xác nhận", variant: "secondary" },
      confirmed: { label: "Đã xác nhận", variant: "outline" },
      processing: { label: "Đang xử lý", variant: "default" },
      shipped: { label: "Đang giao", variant: "default" },
      delivered: { label: "Thành công", variant: "outline" },
      cancelled: { label: "Đã hủy", variant: "destructive" },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: "secondary",
    };

    return (
      <Badge variant={config.variant}>{config.label}</Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { label: string; variant: "default" | "secondary" | "destructive" | "outline" } } = {
      unpaid: { label: "Chưa thanh toán", variant: "secondary" },
      paid: { label: "Đã thanh toán", variant: "outline" },
      refunded: { label: "Đã hoàn tiền", variant: "destructive" },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: "secondary",
    };

    return (
      <Badge variant={config.variant}>{config.label}</Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Chi tiết đơn hàng #{order._id.slice(-8).toUpperCase()}</span>
            <Button onClick={() => onEdit(order)}>
              <Edit className="w-4 h-4 mr-2" />
              Cập nhật
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin đơn hàng */}
          <div className="space-y-4">
            <h3 className="font-semibold">Thông tin đơn hàng</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã đơn hàng:</span>
                <span className="font-medium">#{order._id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày đặt:</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái:</span>
                <span>{getStatusBadge(order.status)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thanh toán:</span>
                <span>{getPaymentStatusBadge(order.paymentStatus)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phương thức:</span>
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Thông tin khách hàng */}
          <div className="space-y-4">
            <h3 className="font-semibold">Thông tin khách hàng</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tên:</span>
                <span>{order.shippingAddress.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số điện thoại:</span>
                <span>{order.shippingAddress.phone}</span>
              </div>
            </div>
          </div>

          {/* Địa chỉ giao hàng */}
          <div className="space-y-4">
            <h3 className="font-semibold">Địa chỉ giao hàng</h3>
            <div className="space-y-2 text-sm">
              <div>
                <div>{order.shippingAddress.address}</div>
                {order.shippingAddress.ward && (
                  <div>{order.shippingAddress.ward}, {order.shippingAddress.district}</div>
                )}
                <div>{order.shippingAddress.city}</div>
              </div>
              {order.shippingAddress.note && (
                <div className="mt-2">
                  <span className="text-muted-foreground">Ghi chú: </span>
                  {order.shippingAddress.note}
                </div>
              )}
            </div>
          </div>

          {/* Tổng quan */}
          <div className="space-y-4">
            <h3 className="font-semibold">Tổng quan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng tiền hàng:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí vận chuyển:</span>
                <span>{formatCurrency(order.shippingFee)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giảm giá:</span>
                  <span className="text-green-600">-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base border-t pt-2">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chi tiết sản phẩm */}
        <div className="space-y-4">
          <h3 className="font-semibold">Chi tiết sản phẩm</h3>
          <div className="border rounded-lg">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3">Sản phẩm</th>
                  <th className="text-left p-3">Đơn giá</th>
                  <th className="text-left p-3">Số lượng</th>
                  <th className="text-left p-3">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.products?.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            <span>📦</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {(item.color || item.size) && (
                            <div className="text-sm text-muted-foreground">
                              {[item.color, item.size].filter(Boolean).join(' • ')}
                            </div>
                          )}
                          {item.sku && (
                            <div className="text-xs text-muted-foreground">SKU: {item.sku}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      {formatCurrency(item.price.discountPrice || item.price.currentPrice)}
                    </td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3 font-medium">
                      {formatCurrency((item.price.discountPrice || item.price.currentPrice) * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}