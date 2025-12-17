"use client";

import { useEffect, useState } from "react";
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
  RefreshCcw,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import  { useSocket } from "@/context/SocketContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/configStore";
import { getDashboardStats } from "@/features/statistics/statisticsAction";

export default function AdminDashboard() {
  const { socket } = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const { stats, isLoading: loading } = useSelector((state: RootState) => state.statistics);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch, refreshKey]);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge variant="default" className="bg-green-600 text-white hover:bg-green-700">Delivered</Badge>;
      case "shipped":
        return <Badge variant="default" className="bg-blue-600 text-white hover:bg-blue-700">Shipped</Badge>;
      case "processing":
        return <Badge variant="outline" className="border-blue-600 text-blue-600">Processing</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="border-green-600 text-green-600">Confirmed</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-gray-200 text-black hover:bg-gray-300">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive" className="bg-white border border-red-500 text-red-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  // Placeholder
  const displayStats = stats || {
    counts: { revenue: 0, orders: 0, users: 0, products: 0 },
    recentOrders: [],
    topProducts: [],
    chartData: [],
  };

  const statCards = [
    {
      name: "Total Revenue",
      value: formatPrice(displayStats.counts.revenue),
      icon: DollarSign,
      description: "Lifetime revenue",
    },
    {
      name: "Orders",
      value: displayStats.counts.orders.toLocaleString(),
      icon: ShoppingCart,
      description: "Total orders placed",
    },
    {
      name: "Customers",
      value: displayStats.counts.users.toLocaleString(),
      icon: Users,
      description: "Active user accounts",
    },
    {
      name: "Products",
      value: displayStats.counts.products.toLocaleString(),
      icon: Package,
      description: "Active products",
    },
  ];

  return (
    <div className="space-y-6 no-scrollbar">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">
            Overview
          </h1>
          <p className="text-gray-500 mt-2">
            Statistics and store performance analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-gray-200 text-black">
            <Calendar className="h-4 w-4 mr-2" />
            {format(new Date(), "MMMM, yyyy")}
          </Button>
          <Button onClick={handleRefresh} className="bg-black text-white hover:bg-gray-800">
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.name} className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">
                {stat.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Revenue Chart - Smooth Area Chart */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-black">Revenue Overview</CardTitle>
              <CardDescription className="text-gray-500">
                 Monthly revenue for the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                 {displayStats.chartData.length > 0 ? (
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={displayStats.chartData}>
                       <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#000000" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                       <XAxis 
                         dataKey="month" 
                         stroke="#888888" 
                         fontSize={12} 
                         tickLine={false} 
                         axisLine={false} 
                         dy={10}
                       />
                       <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f1f1f', 
                            borderColor: '#1f1f1f', 
                            borderRadius: '6px', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            color: '#fff'
                          }}
                          itemStyle={{ color: '#e5e5e5' }}
                          cursor={{ stroke: '#000', strokeWidth: 1, strokeDasharray: '4 4' }}
                          formatter={(value: number) => [formatPrice(value), "Revenue"]}
                       />
                       <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#000000" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                          activeDot={{ r: 6, strokeWidth: 0, fill: '#000' }}
                       />
                     </AreaChart>
                   </ResponsiveContainer>
                 ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No data available for chart
                    </div>
                 )}
              </div>
            </CardContent>
          </Card>

          {/* Orders Chart - Modern Bar Chart */}
          <Card className="border-gray-200 shadow-sm">
             <CardHeader>
              <CardTitle className="text-black">Order Trends</CardTitle>
              <CardDescription className="text-gray-500">
                 Monthly orders for the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                 {displayStats.chartData.length > 0 ? (
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={displayStats.chartData} barSize={40}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                       <XAxis 
                         dataKey="month" 
                         stroke="#888888" 
                         fontSize={12} 
                         tickLine={false} 
                         axisLine={false} 
                         dy={10}
                       />
                       <Tooltip 
                          cursor={{ fill: '#f4f4f5' }}
                          contentStyle={{ 
                            backgroundColor: '#1f1f1f', 
                            borderColor: '#1f1f1f', 
                            borderRadius: '6px',
                            color: '#fff' 
                          }}
                          itemStyle={{ color: '#e5e5e5' }}
                       />
                       <Bar 
                          dataKey="orders" 
                          fill="#000000" 
                          radius={[4, 4, 0, 0]}
                       />
                     </BarChart>
                   </ResponsiveContainer>
                 ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No data available for chart
                    </div>
                 )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

        {/* Recent Orders */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-black">Recent Orders</CardTitle>
              <CardDescription className="text-gray-500">
                Latest transactions
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100" asChild>
                <a href="/admin/orders">View All</a>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayStats.recentOrders.length > 0 ? (
                displayStats.recentOrders.map((order) => (
                    <div
                    key={order._id}
                    className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                    <div className="space-y-1">
                        <p className="font-medium text-black text-sm">#{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-gray-500">{order.userId?.username || "Guest"}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-medium text-black text-sm">{formatPrice(order.totalAmount)}</p>
                        <div className="mt-1">{getStatusBadge(order.status)}</div>
                    </div>
                    </div>
                ))
              ): (
                <div className="text-center text-gray-500 text-sm py-4">No recent orders</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-black">Top Selling Products</CardTitle>
              <CardDescription className="text-gray-500">
                By sales volume
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100" asChild>
                <a href="/admin/products">View All</a>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayStats.topProducts.length > 0 ? (
                  displayStats.topProducts.map((product, index) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white overflow-hidden relative">
                           {product.images && product.images.length > 0 ? (
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover"/>
                           ) : (
                                <span className="text-xs font-bold">{index + 1}</span>
                           )}
                        </div>
                        <div>
                          <p className="font-medium text-black text-sm line-clamp-1 max-w-[150px]" title={product.name}>{product.name}</p>
                          <p className="text-xs text-gray-500">
                            {product.soldCount} sold
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-black text-sm">
                          {formatPrice(product.price.discountPrice || product.price.currentPrice)}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center text-gray-500 text-sm py-4">No top products</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
