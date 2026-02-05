"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  Calendar,
  RefreshCcw,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useSocket } from "@/context/SocketContext";
import { formatCurrency } from "@/utils/format";
import { toast } from "sonner";
import { format } from "date-fns";
import { useDashboardStats } from "@/hooks/queries/useStatistics";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SpinnerLoading from "@/components/common/SpinnerLoading";

export default function AdminDashboard() {
  const { socket } = useSocket();
  const { data: stats, isLoading: loading, refetch } = useDashboardStats();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    refetch();
  }, [refetch, refreshKey]);

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      toast.info("Updating dashboard...");
      setRefreshKey((prev) => prev + 1);
    };

    socket.on("new_order", handleUpdate);
    socket.on("new_user", handleUpdate);
    socket.on("new_product", handleUpdate);

    return () => {
      socket.off("new_order", handleUpdate);
      socket.off("new_user", handleUpdate);
      socket.off("new_product", handleUpdate);
    };
  }, [socket]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0">
            Delivered
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-0">
            Shipped
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-0">
            Processing
          </Badge>
        );
      case "confirmed":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-0">
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 border-0">
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-0">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <SpinnerLoading size={32} />
          <p className="text-sm text-gray-500 font-medium">
            Loading Overview...
          </p>
        </div>
      </div>
    );
  }

  const displayStats = {
    // Handle both flat and nested counts structure
    totalRevenue: stats?.totalRevenue ?? stats?.counts?.revenue ?? 0,
    totalOrders: stats?.totalOrders ?? stats?.counts?.orders ?? 0,
    totalUsers: stats?.totalUsers ?? stats?.counts?.users ?? 0,
    totalProducts: stats?.totalProducts ?? stats?.counts?.products ?? 0,
    recentOrders: stats?.recentOrders || [],
    topProducts: stats?.topProducts || [],
    chartData: stats?.chartData || [],
  };

  const statCards = [
    {
      name: "Total Revenue",
      value: formatCurrency(displayStats.totalRevenue || 0),
      icon: DollarSign,
      description: "Total earnings",
      trend: "+12.5%",
      trendUp: true,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      name: "Orders",
      value: (displayStats.totalOrders || 0).toLocaleString(),
      icon: ShoppingCart,
      description: "Total orders",
      trend: "+8.2%",
      trendUp: true,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      name: "Customers",
      value: (displayStats.totalUsers || 0).toLocaleString(),
      icon: Users,
      description: "Total users",
      trend: "+4.6%",
      trendUp: true,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      name: "Products",
      value: (displayStats.totalProducts || 0).toLocaleString(),
      icon: Package,
      description: "Active items",
      trend: "0%",
      trendUp: true,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor your store statistics and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="rounded-xl bg-[#f7f7f7] h-10 gap-2 text-sm font-medium"
          >
            <Calendar className="h-3.5 w-3.5" />
            {format(new Date(), "MMM dd, yyyy")}
          </Button>
          <Button
            onClick={handleRefresh}
            className="rounded-xl h-10 gap-2 text-sm font-medium bg-[#E53935] hover:bg-[#D32F2F] text-white"
            disabled={loading}
          >
            {loading ? (
              <SpinnerLoading size={14} className="text-current" />
            ) : (
              <RefreshCcw className="h-3.5 w-3.5" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="rounded-2xl bg-[#f7f7f7] dark:bg-[#1C1C1E] p-6"
          >
            <div className="flex items-center justify-between">
              <div className={cn("p-2 rounded-xl", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  stat.trendUp
                    ? "bg-green-500/10 text-green-600"
                    : "bg-red-500/10 text-red-600"
                )}
              >
                {stat.trendUp ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stat.trend}
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </h3>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-2xl bg-[#f7f7f7] dark:bg-[#1C1C1E] p-6">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-lg text-foreground">Revenue</h3>
              <p className="text-sm text-muted-foreground">
                Monthly revenue overview
              </p>
            </div>
            <div className="p-2 rounded-full bg-white dark:bg-black/20">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="h-[300px] w-full">
            {displayStats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayStats.chartData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#E53935" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#E53935" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E5EA"
                    opacity={0.4}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#86868B"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                    }}
                    itemStyle={{ color: "#333", fontSize: "13px" }}
                    labelStyle={{
                      color: "#86868B",
                      marginBottom: "4px",
                      fontSize: "11px",
                    }}
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Revenue",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#E53935"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#E53935" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Orders Chart */}
        <div className="rounded-2xl bg-[#f7f7f7] dark:bg-[#1C1C1E] p-6">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-lg text-foreground">Orders</h3>
              <p className="text-sm text-muted-foreground">
                Monthly order volume
              </p>
            </div>
            <div className="p-2 rounded-full bg-white dark:bg-black/20">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="h-[300px] w-full">
            {displayStats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayStats.chartData} barSize={32}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E5EA"
                    opacity={0.4}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#86868B"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.02)" }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                    }}
                    itemStyle={{ color: "#333", fontSize: "13px" }}
                    labelStyle={{
                      color: "#86868B",
                      marginBottom: "4px",
                      fontSize: "11px",
                    }}
                  />
                  <Bar dataKey="orders" fill="#E53935" radius={[6, 6, 6, 6]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders Table */}
        <div className="rounded-2xl bg-[#f7f7f7] dark:bg-[#1C1C1E] p-6 flex flex-col">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                Recent Orders
              </h3>
              <p className="text-sm text-muted-foreground">
                Latest transactions
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-[#E53935] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex-1 space-y-2">
            {displayStats.recentOrders.length > 0 ? (
              displayStats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-black/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-black/20">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-sm text-foreground">
                        #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.user?.name || "Guest"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-sm text-foreground">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <div className="mt-1 scale-90 origin-right">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Package className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No recent orders found</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products List */}
        <div className="rounded-2xl bg-[#f7f7f7] dark:bg-[#1C1C1E] p-6 flex flex-col">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                Top Products
              </h3>
              <p className="text-sm text-muted-foreground">
                Best selling items
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-sm font-medium text-[#E53935] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex-1 space-y-2">
            {displayStats.topProducts.length > 0 ? (
              displayStats.topProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-black/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 shrink-0 rounded-xl bg-white dark:bg-black/20 overflow-hidden">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-muted-foreground text-xs font-bold">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <p
                        className="font-medium text-sm text-foreground line-clamp-1 max-w-[180px]"
                        title={product.name}
                      >
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.sold} sales
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm text-foreground">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Package className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
