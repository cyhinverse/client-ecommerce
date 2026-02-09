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
      title: "Tổng đơn hàng",
      value: formatNumber(calculatedStats.total),
      icon: ShoppingCart,

    },
    {
      title: "Chờ xử lý",
      value: formatNumber(calculatedStats.pending),
      icon: Clock,

    },
    {
      title: "Đã giao",
      value: formatNumber(calculatedStats.delivered),
      icon: CheckCircle,

    },
    {
      title: "TỔNG DOANH THU",
      value: formatCurrency(calculatedStats.revenue),
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="rounded-2xl bg-[#f7f7f7] p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</h3>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}