import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StatsCard from "@/components/admin/StatsCard";
import {
  BarChart3,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  CreditCard,
  Activity,
} from "lucide-react";

const stats = [
  {
    name: "Tổng doanh thu",
    value: "45.2M",
    change: "+12.5%",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    name: "Đơn hàng",
    value: "1,234",
    change: "+8.2%",
    changeType: "positive",
    icon: ShoppingCart,
  },
  {
    name: "Khách hàng",
    value: "8,567",
    change: "+3.4%",
    changeType: "positive",
    icon: Users,
  },
  {
    name: "Sản phẩm",
    value: "456",
    change: "-2.1%",
    changeType: "negative",
    icon: Package,
  },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Nguyễn Văn A",
    amount: 1250000,
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Trần Thị B",
    amount: 850000,
    status: "processing",
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: "Lê Văn C",
    amount: 2100000,
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "Phạm Thị D",
    amount: 450000,
    status: "pending",
    date: "2024-01-14",
  },
];

const topProducts = [
  {
    name: "iPhone 15 Pro Max",
    sales: 234,
    revenue: 35000000,
  },
  {
    name: "Samsung Galaxy S24",
    sales: 189,
    revenue: 28000000,
  },
  {
    name: "MacBook Air M3",
    sales: 156,
    revenue: 42000000,
  },
  {
    name: "AirPods Pro",
    sales: 298,
    revenue: 8900000,
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Tổng quan
        </h1>
        <p className="text-gray-600 mt-2">
          Thống kê và phân tích hiệu suất cửa hàng
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.name}
            title={stat.name}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType as "positive" | "negative" | undefined}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-2">Đơn hàng gần đây</h3>
            <p className="text-sm text-gray-600 mb-4">5 đơn hàng mới nhất trong 24h qua</p>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(order.amount)}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-green-50 text-green-700"
                          : order.status === "processing"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {order.status === "completed"
                        ? "Hoàn thành"
                        : order.status === "processing"
                        ? "Đang xử lý"
                        : "Chờ xác nhận"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Xem tất cả đơn hàng
            </Button>
          </div>
        </Card>

        {/* Top Products */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-2">Sản phẩm bán chạy</h3>
            <p className="text-sm text-gray-600 mb-4">Top sản phẩm được yêu thích nhất</p>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        {product.sales} lượt bán
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-green-600">
                    {formatPrice(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Xem tất cả sản phẩm
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium mb-2">Thao tác nhanh</h3>
          <p className="text-sm text-gray-600 mb-4">
            Truy cập nhanh vào các tính năng quản lý
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Button variant="outline" className="h-16 flex-col">
              <Package className="h-5 w-5 mb-1" />
              <span className="text-sm">Thêm sản phẩm</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <ShoppingCart className="h-5 w-5 mb-1" />
              <span className="text-sm">Tạo đơn hàng</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Users className="h-5 w-5 mb-1" />
              <span className="text-sm">Quản lý KH</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <BarChart3 className="h-5 w-5 mb-1" />
              <span className="text-sm">Báo cáo</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}