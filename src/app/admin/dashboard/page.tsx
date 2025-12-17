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
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import  { useSocket } from "@/context/SocketContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/configStore";
import { getDashboardStats } from "@/features/statistics/statisticsAction";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0">Delivered</Badge>;
      case "shipped":
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-0">Shipped</Badge>;
      case "processing":
        return <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-0">Processing</Badge>;
      case "confirmed":
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-0">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 border-0">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-0">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
           <div className="relative w-12 h-12">
             <div className="absolute inset-0 rounded-full border-[3px] border-black/10 border-t-black animate-spin" />
           </div>
           <p className="text-sm text-gray-500 font-medium">Loading Overview...</p>
        </div>
      </div>
    );
  }

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
      description: "Total earnings",
      trend: "+12.5%",
      trendUp: true,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      name: "Orders",
      value: displayStats.counts.orders.toLocaleString(),
      icon: ShoppingCart,
      description: "Total orders",
      trend: "+8.2%",
      trendUp: true,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      name: "Customers",
      value: displayStats.counts.users.toLocaleString(),
      icon: Users,
      description: "Total users",
      trend: "+4.6%",
      trendUp: true,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      name: "Products",
      value: displayStats.counts.products.toLocaleString(),
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
          <Button variant="outline" className="rounded-xl border-border/50 bg-background/50 h-10 gap-2 text-sm font-medium">
            <Calendar className="h-3.5 w-3.5" />
            {format(new Date(), "MMM dd, yyyy")}
          </Button>
          <Button 
            onClick={handleRefresh} 
            className={cn(
               "rounded-xl h-10 gap-2 text-sm font-medium transition-all shadow-lg hover:shadow-xl",
               "bg-black hover:bg-black/90 text-white dark:bg-[#0071e3] dark:hover:bg-[#0077ED]"
            )}
            disabled={loading}
          >
            <RefreshCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div 
             key={stat.name} 
             className="group relative overflow-hidden rounded-[1.5rem] border border-border/40 bg-white/70 dark:bg-[#1C1C1E]/70 p-6 shadow-sm transition-all hover:shadow-md backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <div className={cn("p-2 rounded-xl", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div className={cn("flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full", stat.trendUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600")}>
                {stat.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-4 space-y-1">
               <h3 className="text-sm font-medium text-muted-foreground">{stat.name}</h3>
               <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
            </div>
            <div className="mt-2 text-xs text-muted-foreground/60 line-clamp-1">
               {stat.description}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
         {/* Revenue Chart */}
         <div className="rounded-[2rem] border border-border/40 bg-white/70 dark:bg-[#1C1C1E]/70 p-6 shadow-sm backdrop-blur-xl">
             <div className="mb-6 flex items-center justify-between">
                <div>
                   <h3 className="font-semibold text-lg text-foreground">Revenue</h3>
                   <p className="text-sm text-muted-foreground">Monthly revenue overview</p>
                </div>
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
             </div>
             
             <div className="h-[300px] w-full">
                 {displayStats.chartData.length > 0 ? (
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={displayStats.chartData}>
                       <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0071e3" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#0071e3" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" opacity={0.4} />
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
                            backgroundColor: 'rgba(28, 28, 30, 0.8)', 
                            borderColor: 'rgba(255,255,255,0.1)', 
                            borderRadius: '12px', 
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                            backdropFilter: 'blur(12px)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}
                          itemStyle={{ color: '#fff', fontSize: '13px' }}
                          labelStyle={{ color: '#86868B', marginBottom: '4px', fontSize: '11px' }}
                          cursor={{ stroke: '#0071e3', strokeWidth: 1, strokeDasharray: '4 4' }}
                          formatter={(value: number) => [formatPrice(value), "Revenue"]}
                       />
                       <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#0071e3" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                          activeDot={{ r: 6, strokeWidth: 0, fill: '#0071e3' }}
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
         <div className="rounded-[2rem] border border-border/40 bg-white/70 dark:bg-[#1C1C1E]/70 p-6 shadow-sm backdrop-blur-xl">
             <div className="mb-6 flex items-center justify-between">
                <div>
                   <h3 className="font-semibold text-lg text-foreground">Orders</h3>
                   <p className="text-sm text-muted-foreground">Monthly order volume</p>
                </div>
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </div>
             </div>

             <div className="h-[300px] w-full">
                 {displayStats.chartData.length > 0 ? (
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={displayStats.chartData} barSize={32}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" opacity={0.4} />
                       <XAxis 
                         dataKey="month" 
                         stroke="#86868B" 
                         fontSize={11} 
                         tickLine={false} 
                         axisLine={false} 
                         dy={10}
                       />
                       <Tooltip 
                          cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                          contentStyle={{ 
                            backgroundColor: 'rgba(28, 28, 30, 0.8)', 
                            borderColor: 'rgba(255,255,255,0.1)', 
                            borderRadius: '12px', 
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                            backdropFilter: 'blur(12px)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}
                          itemStyle={{ color: '#fff', fontSize: '13px' }}
                          labelStyle={{ color: '#86868B', marginBottom: '4px', fontSize: '11px' }}
                       />
                       <Bar 
                          dataKey="orders" 
                          fill="#3b82f6" 
                          radius={[6, 6, 6, 6]}
                          className="fill-primary dark:fill-blue-500"
                       />
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
         <div className="rounded-[2rem] border border-border/40 bg-white/70 dark:bg-[#1C1C1E]/70 p-6 shadow-sm backdrop-blur-xl flex flex-col">
             <div className="mb-6 flex items-center justify-between">
                <div>
                   <h3 className="font-semibold text-lg text-foreground">Recent Orders</h3>
                   <p className="text-sm text-muted-foreground">Latest transactions</p>
                </div>
                <Link href="/admin/orders" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                   View All <ArrowRight className="h-3 w-3" />
                </Link>
             </div>
             
             <div className="flex-1 space-y-4">
               {displayStats.recentOrders.length > 0 ? (
                 displayStats.recentOrders.map((order) => (
                     <div
                        key={order._id}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                     >
                        <div className="flex items-center gap-4">
                           <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                              <Package className="h-5 w-5 text-muted-foreground" />
                           </div>
                           <div className="space-y-1">
                              <p className="font-medium text-sm text-foreground">#{order._id.slice(-6).toUpperCase()}</p>
                              <p className="text-xs text-muted-foreground">{order.userId?.username || "Guest"}</p>
                           </div>
                        </div>
                        
                        <div className="text-right">
                           <p className="font-medium text-sm text-foreground">{formatPrice(order.totalAmount)}</p>
                           <div className="mt-1 scale-90 origin-right">{getStatusBadge(order.status)}</div>
                        </div>
                     </div>
                 ))
               ): (
                 <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <Package className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">No recent orders found</p>
                 </div>
               )}
             </div>
         </div>

         {/* Top Products List */}
         <div className="rounded-[2rem] border border-border/40 bg-white/70 dark:bg-[#1C1C1E]/70 p-6 shadow-sm backdrop-blur-xl flex flex-col">
             <div className="mb-6 flex items-center justify-between">
                <div>
                   <h3 className="font-semibold text-lg text-foreground">Top Products</h3>
                   <p className="text-sm text-muted-foreground">Best selling items</p>
                </div>
                <Link href="/admin/products" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                   View All <ArrowRight className="h-3 w-3" />
                </Link>
             </div>

             <div className="flex-1 space-y-4">
               {displayStats.topProducts.length > 0 ? (
                   displayStats.topProducts.map((product, index) => (
                     <div
                       key={product._id}
                       className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                     >
                       <div className="flex items-center gap-4">
                         <div className="relative h-12 w-12 flex-shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden border border-border/50">
                            {product.images && product.images.length > 0 ? (
                                 <Image 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                    fill
                                    className="object-cover"
                                  />
                            ) : (
                                 <div className="flex items-center justify-center h-full w-full bg-secondary text-secondary-foreground text-xs font-bold">
                                    {index + 1}
                                 </div>
                            )}
                         </div>
                         <div>
                           <p className="font-medium text-sm text-foreground line-clamp-1 max-w-[180px]" title={product.name}>{product.name}</p>
                           <p className="text-xs text-muted-foreground">
                             {product.soldCount} sales
                           </p>
                         </div>
                       </div>
                       <div className="text-right">
                         <p className="font-medium text-sm text-foreground">
                           {formatPrice(product.price.discountPrice || product.price.currentPrice)}
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
