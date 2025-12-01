"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart, Tooltip } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock data for dashboard
const chartData = [
  { month: "Tháng 1", revenue: 18600000 },
  { month: "Tháng 2", revenue: 30500000 },
  { month: "Tháng 3", revenue: 23700000 },
  { month: "Tháng 4", revenue: 73000000 },
  { month: "Tháng 5", revenue: 20900000 },
  { month: "Tháng 6", revenue: 21400000 },
];

const visitorData = [
  { month: "Tháng 1", visitors: 450 },
  { month: "Tháng 2", visitors: 520 },
  { month: "Tháng 3", visitors: 480 },
  { month: "Tháng 4", visitors: 650 },
  { month: "Tháng 5", visitors: 780 },
  { month: "Tháng 6", visitors: 900 },
];

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const visitorConfig = {
  visitors: {
    label: "Khách truy cập",
    color: "#16a34a",
  },
} satisfies ChartConfig;

const stats = [
  {
    name: "Tổng doanh thu",
    value: "45.2M",
    change: "+12.5%",
    changeType: "positive",
    icon: DollarSign,
    description: "So với tháng trước",
  },
  {
    name: "Đơn hàng",
    value: "1,248",
    change: "+8.2%",
    changeType: "positive",
    icon: ShoppingCart,
    description: "124 đơn hàng mới",
  },
  {
    name: "Khách hàng",
    value: "8,567",
    change: "+3.4%",
    changeType: "positive",
    icon: Users,
    description: "286 khách hàng mới",
  },
  {
    name: "Sản phẩm",
    value: "456",
    change: "-2.1%",
    changeType: "negative",
    icon: Package,
    description: "12 sản phẩm mới",
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
    growth: "+15%",
  },
  {
    name: "Samsung Galaxy S24",
    sales: 189,
    revenue: 28000000,
    growth: "+8%",
  },
  {
    name: "MacBook Air M3",
    sales: 156,
    revenue: 42000000,
    growth: "+12%",
  },
  {
    name: "AirPods Pro",
    sales: 298,
    revenue: 8900000,
    growth: "+25%",
  },
];

const quickActions = [
  {
    name: "Thêm sản phẩm",
    description: "Thêm sản phẩm mới",
    icon: Package,
    href: "/admin/products",
  },
  {
    name: "Xem đơn hàng",
    description: "Quản lý đơn hàng",
    icon: ShoppingCart,
    href: "/admin/orders",
  },
  {
    name: "Quản lý người dùng",
    description: "Xem danh sách người dùng",
    icon: Users,
    href: "/admin/users",
  },
  {
    name: "Xem báo cáo",
    description: "Phân tích doanh thu",
    icon: BarChart3,
    href: "/admin/analytics",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500">Hoàn thành</Badge>;
    case "processing":
      return <Badge className="bg-blue-500">Đang xử lý</Badge>;
    case "pending":
      return <Badge variant="outline">Chờ xác nhận</Badge>;
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};


export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Tổng quan
          </h1>
          <p className="text-gray-600 mt-2">
            Thống kê và phân tích hiệu suất cửa hàng
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Tháng 1, 2024
          </Button>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {stat.changeType === "positive" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                )}
                <span
                  className={
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                <span className="text-muted-foreground">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Đơn hàng gần đây</CardTitle>
              <CardDescription>
                5 đơn hàng mới nhất trong 24h qua
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Xem tất cả
            </Button>
          </CardHeader>
          <CardContent>
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
                    <p className="font-medium">{formatPrice(order.amount)}</p>
                    <div className="mt-1">{getStatusBadge(order.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sản phẩm bán chạy</CardTitle>
              <CardDescription>
                Top sản phẩm được yêu thích nhất
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Xem tất cả
            </Button>
          </CardHeader>
          <CardContent>
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
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      {formatPrice(product.revenue)}
                    </p>
                    <p className="text-xs text-green-600">{product.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Performance */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>
              Truy cập nhanh vào các tính năng quản lý
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={action.name}
                    variant="outline"
                    className="w-full h-16 flex-col"
                    asChild
                  >
                    <a href={action.href}>
                      <IconComponent className="h-5 w-5 mb-1" />
                      <span className="text-sm font-normal">{action.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {action.description}
                      </span>
                    </a>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Chỉ số hiệu suất</CardTitle>
            <CardDescription>
              Phân tích hiệu suất bán hàng và người dùng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tỷ lệ chuyển đổi</span>
                  <Badge className="bg-green-500">68.5%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Giỏ hàng trung bình
                  </span>
                  <span className="text-sm font-medium">1,250,000₫</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Thời gian xử lý đơn
                  </span>
                  <span className="text-sm font-medium">2.3 giờ</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tỷ lệ hoàn thành</span>
                  <Badge className="bg-blue-500">94.2%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Khách hàng quay lại
                  </span>
                  <span className="text-sm font-medium">42.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Đánh giá trung bình
                  </span>
                  <span className="text-sm font-medium">4.7/5</span>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Biểu đồ doanh thu</h4>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Khách truy cập mới</h4>
                <ChartContainer config={visitorConfig} className="min-h-[200px] w-full">
                  <LineChart accessibilityLayer data={visitorData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="visitors" 
                      stroke="var(--color-visitors)" 
                      strokeWidth={2} 
                      dot={false} 
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>
            Các hoạt động mới nhất trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "Đơn hàng mới",
                description: "ORD-005 từ Hoàng Văn E",
                time: "2 phút trước",
                type: "order",
              },
              {
                action: "Sản phẩm mới",
                description: "iPhone 15 Pro Max được thêm vào kho",
                time: "1 giờ trước",
                type: "product",
              },
              {
                action: "Người dùng mới",
                description: "Nguyễn Thị F đã đăng ký tài khoản",
                time: "2 giờ trước",
                type: "user",
              },
              {
                action: "Đánh giá mới",
                description: "Khách hàng đánh giá 5 sao cho MacBook Air M3",
                time: "3 giờ trước",
                type: "review",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      activity.type === "order"
                        ? "bg-blue-500"
                        : activity.type === "product"
                        ? "bg-green-500"
                        : activity.type === "user"
                        ? "bg-purple-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
