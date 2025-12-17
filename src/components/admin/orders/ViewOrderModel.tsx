import { Order } from "@/types/order";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Package } from "lucide-react";
import Image from "next/image";

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
      pending: { label: "Pending", variant: "secondary" },
      confirmed: { label: "Confirmed", variant: "outline" },
      processing: { label: "Processing", variant: "default" },
      shipped: { label: "Shipped", variant: "default" },
      delivered: { label: "Delivered", variant: "outline" },
      cancelled: { label: "Cancelled", variant: "destructive" },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: "secondary",
    };

    return (
      <Badge variant={config.variant} className="rounded-lg">{config.label}</Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { label: string; variant: "default" | "secondary" | "destructive" | "outline" } } = {
      unpaid: { label: "Unpaid", variant: "secondary" },
      paid: { label: "Paid", variant: "outline" },
      refunded: { label: "Refunded", variant: "destructive" },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: "secondary",
    };

    return (
      <Badge variant={config.variant} className="rounded-lg">{config.label}</Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-[2rem] border-border/50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl shadow-2xl p-6">
        <DialogHeader className="border-b border-border/50 pb-4">
          <DialogTitle className="flex justify-between items-center">
            <span className="text-xl font-semibold tracking-tight">Order Details #{order._id.slice(-8).toUpperCase()}</span>
            <Button onClick={() => onEdit(order)} className="rounded-xl bg-black hover:bg-black/90 text-white dark:bg-[#0071e3] gap-2">
              <Edit className="w-4 h-4" />
              Update
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Thông tin đơn hàng */}
          <div className="p-5 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-border/50 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Order Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-medium">#{order._id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <span>{getStatusBadge(order.status)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment:</span>
                <span>{getPaymentStatusBadge(order.paymentStatus)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method:</span>
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Thông tin khách hàng & Địa chỉ */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-border/50 space-y-4">
               <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Customer & Shipping</h3>
               <div className="space-y-3 text-sm">
                 <div className="flex justify-between">
                   <span className="text-muted-foreground">Name:</span>
                   <span className="font-medium">{order.shippingAddress.fullName}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-muted-foreground">Phone:</span>
                   <span>{order.shippingAddress.phone}</span>
                 </div>
                 <div className="border-t border-border/50 pt-2 mt-2">
                   <div className="text-muted-foreground mb-1">Address:</div>
                   <div className="font-medium">{order.shippingAddress.address}</div>
                   {order.shippingAddress.ward && (
                     <div className="text-muted-foreground text-xs mt-0.5">{order.shippingAddress.ward}, {order.shippingAddress.district}</div>
                   )}
                   <div className="text-muted-foreground text-xs">{order.shippingAddress.city}</div>
                 </div>
                 {order.shippingAddress.note && (
                   <div className="mt-2 text-xs bg-yellow-50 text-yellow-800 p-2 rounded-lg border border-yellow-100">
                     <span className="font-medium">Note: </span>
                     {order.shippingAddress.note}
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>

        {/* Chi tiết sản phẩm */}
        <div className="space-y-4 mt-2">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground px-1">Product Details</h3>
          <div className="border border-border/50 rounded-2xl overflow-hidden bg-white/40">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Unit Price</th>
                  <th className="text-center p-4 font-medium">Qty</th>
                  <th className="text-right p-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {order.products?.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-border/50">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{item.name}</div>
                          {(item.color || item.size) && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {[item.color, item.size].filter(Boolean).join(' • ')}
                            </div>
                          )}
                          {item.sku && (
                            <div className="text-xs text-muted-foreground font-mono mt-0.5">SKU: {item.sku}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {formatCurrency(item.price.discountPrice || item.price.currentPrice)}
                    </td>
                    <td className="p-4 text-center">{item.quantity}</td>
                    <td className="p-4 text-right font-medium">
                      {formatCurrency((item.price.discountPrice || item.price.currentPrice) * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50/80 border-t border-border/50 font-semibold">
                 <tr>
                    <td colSpan={3} className="p-4 text-right">Total Amount</td>
                    <td className="p-4 text-right text-base text-black dark:text-white">
                       {formatCurrency(order.totalAmount)}
                    </td>
                 </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}