import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  CheckCircle,
  DollarSign,
  ShoppingCart,
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const stats = [
    {
      title: "Total Orders",
      value: formatNumber(calculatedStats.total),
      icon: ShoppingCart,

    },
    {
      title: "Pending",
      value: formatNumber(calculatedStats.pending),
      icon: Clock,

    },
    {
      title: "Delivered",
      value: formatNumber(calculatedStats.delivered),
      icon: CheckCircle,

    },
    {
      title: "TOTAL REVENUE",
      value: formatCurrency(calculatedStats.revenue),
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
       <Card key={index} className="rounded-none border border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}