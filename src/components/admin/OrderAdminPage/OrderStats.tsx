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

interface OrdersStatsProps {
  totalOrders?: number;
  pendingOrders?: number;
  confirmedOrders?: number;
  processingOrders?: number;
  shippedOrders?: number;
  deliveredOrders?: number;
  cancelledOrders?: number;
  totalRevenue?: number;
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
}: OrdersStatsProps) {
  const stats = [
    {
      title: "Tổng đơn hàng",
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Chờ xác nhận",
      value: pendingOrders.toLocaleString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Đã xác nhận",
      value: confirmedOrders.toLocaleString(),
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Đang xử lý",
      value: processingOrders.toLocaleString(),
      icon: Package,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Đang giao",
      value: shippedOrders.toLocaleString(),
      icon: Truck,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Thành công",
      value: deliveredOrders.toLocaleString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Đã hủy",
      value: cancelledOrders.toLocaleString(),
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Tổng doanh thu",
      value: `₫${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">{stat.title}</CardTitle>
            <div className={`p-1 rounded-sm ${stat.bgColor}`}>
              <stat.icon className={`w-3 h-3 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}