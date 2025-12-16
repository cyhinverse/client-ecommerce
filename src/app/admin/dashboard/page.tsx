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
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock data for dashboard
const chartData = [
  { month: "Jan", revenue: 18600000 },
  { month: "Feb", revenue: 30500000 },
  { month: "Mar", revenue: 23700000 },
  { month: "Apr", revenue: 73000000 },
  { month: "May", revenue: 20900000 },
  { month: "Jun", revenue: 21400000 },
];

const visitorData = [
  { month: "Jan", visitors: 450 },
  { month: "Feb", visitors: 520 },
  { month: "Mar", visitors: 480 },
  { month: "Apr", visitors: 650 },
  { month: "May", visitors: 780 },
  { month: "Jun", visitors: 900 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const visitorConfig = {
  visitors: {
    label: "Visitors",
    color: "#16a34a",
  },
} satisfies ChartConfig;

const stats = [
  {
    name: "Total Revenue",
    value: "45.2M",
    change: "+12.5%",
    changeType: "positive",
    icon: DollarSign,
    description: "vs last month",
  },
  {
    name: "Orders",
    value: "1,248",
    change: "+8.2%",
    changeType: "positive",
    icon: ShoppingCart,
    description: "124 new orders",
  },
  {
    name: "Customers",
    value: "8,567",
    change: "+3.4%",
    changeType: "positive",
    icon: Users,
    description: "286 new customers",
  },
  {
    name: "Products",
    value: "456",
    change: "-2.1%",
    changeType: "negative",
    icon: Package,
    description: "12 new products",
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
    name: "Add Product",
    description: "Add a new product",
    icon: Package,
    href: "/admin/products",
  },
  {
    name: "View Orders",
    description: "Manage orders",
    icon: ShoppingCart,
    href: "/admin/orders",
  },
  {
    name: "Manage Users",
    description: "View user list",
    icon: Users,
    href: "/admin/users",
  },
  {
    name: "View Reports",
    description: "Revenue analysis",
    icon: BarChart3,
    href: "/admin/analytics",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500">Completed</Badge>;
    case "processing":
      return <Badge className="bg-blue-500">Processing</Badge>;
    case "pending":
      return <Badge variant="outline">Pending</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
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
    <div className="space-y-6 no-scrollbar">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Overview
          </h1>
          <p className="text-gray-600 mt-2">
            Statistics and store performance analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Jan, 2024
          </Button>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
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
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                5 latest orders in the last 24h
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View all
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
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>
                Most favorite products
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View all
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
                        {product.sales} sales
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
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Quick access to management features
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
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Sales and user performance analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Conversion Rate</span>
                  <Badge className="bg-green-500">68.5%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Avg. Cart Value
                  </span>
                  <span className="text-sm font-medium">1,250,000₫</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Processing Time
                  </span>
                  <span className="text-sm font-medium">2.3 hours</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <Badge className="bg-blue-500">94.2%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Returning Customers
                  </span>
                  <span className="text-sm font-medium">42.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Avg. Rating
                  </span>
                  <span className="text-sm font-medium">4.7/5</span>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Revenue Chart</h4>
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[200px] w-full"
                >
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
                    <Bar
                      dataKey="revenue"
                      fill="var(--color-revenue)"
                      radius={4}
                    />
                  </BarChart>
                </ChartContainer>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">New Visitors</h4>
                <ChartContainer
                  config={visitorConfig}
                  className="min-h-[200px] w-full"
                >
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
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest activities in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "New Order",
                description: "ORD-005 from Hoàng Văn E",
                time: "2 mins ago",
                type: "order",
              },
              {
                action: "New Product",
                description: "iPhone 15 Pro Max added to stock",
                time: "1 hour ago",
                type: "product",
              },
              {
                action: "New User",
                description: "Nguyễn Thị F registered",
                time: "2 hours ago",
                type: "user",
              },
              {
                action: "New Review",
                description: "Customer rated 5 stars for MacBook Air M3",
                time: "3 hours ago",
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
