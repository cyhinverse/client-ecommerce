// components/admin/OrderAdminPage/OrderStats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  ShoppingCart,
  Truck,
  AlertCircle,
} from "lucide-react";

interface OrderStatusCount {
  _id: string;
  count: number;
}

interface OrdersStatsProps {
  totalOrders?: number;
  pendingOrders?: number;
  confirmedOrders?: number;
  processingOrders?: number;
  shippedOrders?: number;
  deliveredOrders?: number;
  cancelledOrders?: number;
  totalRevenue?: number;
  ordersByStatus?: OrderStatusCount[];
}

export function OrdersStats({
  totalOrders = 0,
  pendingOrders = 0,
  confirmedOrders = 0,
  processingOrders = 0,
  shippedOrders = 0,
  deliveredOrders = 0,
  cancelledOrders = 0,
  totalRevenue = 0,
  ordersByStatus = [],
}: OrdersStatsProps) {

  // Tính toán stats từ ordersByStatus nếu có
  let calculatedStats = {
    total: totalOrders,
    pending: pendingOrders,
    confirmed: confirmedOrders,
    processing: processingOrders,
    shipped: shippedOrders,
    delivered: deliveredOrders,
    cancelled: cancelledOrders,
    revenue: totalRevenue
  };

  if (ordersByStatus && ordersByStatus.length > 0) {
    calculatedStats = {
      total: ordersByStatus.reduce((sum, item) => sum + item.count, 0),
      pending: ordersByStatus.find(item => item._id === 'pending')?.count || 0,
      confirmed: ordersByStatus.find(item => item._id === 'confirmed')?.count || 0,
      processing: ordersByStatus.find(item => item._id === 'processing')?.count || 0,
      shipped: ordersByStatus.find(item => item._id === 'shipped')?.count || 0,
      delivered: ordersByStatus.find(item => item._id === 'delivered')?.count || 0,
      cancelled: ordersByStatus.find(item => item._id === 'cancelled')?.count || 0,
      revenue: totalRevenue
    };
  }

  const stats = [
    {
      title: "Tổng đơn hàng",
      value: calculatedStats.total.toLocaleString(),
      icon: ShoppingCart,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Chờ xác nhận",
      value: calculatedStats.pending.toLocaleString(),
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Đã xác nhận",
      value: calculatedStats.confirmed.toLocaleString(),
      icon: AlertCircle,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Đang xử lý",
      value: calculatedStats.processing.toLocaleString(),
      icon: Package,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Đang giao",
      value: calculatedStats.shipped.toLocaleString(),
      icon: Truck,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Thành công",
      value: calculatedStats.delivered.toLocaleString(),
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Đã hủy",
      value: calculatedStats.cancelled.toLocaleString(),
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Tổng doanh thu",
      value: `₫${calculatedStats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="overflow-hidden border-border bg-card hover:shadow-md transition-shadow min-h-[100px] flex flex-col justify-between rounded-none shadow-none"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground leading-tight min-h-[32px] flex items-center uppercase tracking-wider">
              {stat.title}
            </CardTitle>
            <div className={`p-1 rounded-none ${stat.bgColor} flex-shrink-0 ml-2`}>
              <stat.icon className={`w-3 h-3 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-lg font-bold text-foreground text-right">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}