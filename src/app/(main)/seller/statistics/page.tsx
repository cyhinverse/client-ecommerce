"use client";
import { useState, useEffect } from "react";
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, 
  ShoppingCart, Package, Users, Calendar, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/hooks";
import api from "@/api/api";

interface Stats {
  revenue: { total: number; change: number };
  orders: { total: number; change: number };
  products: { total: number; sold: number };
  customers: { total: number; new: number };
}

const formatPrice = (price: number): string => {
  if (price >= 1000000000) return (price / 1000000000).toFixed(1) + "B";
  if (price >= 1000000) return (price / 1000000).toFixed(1) + "M";
  if (price >= 1000) return (price / 1000).toFixed(0) + "K";
  return price.toString();
};

export default function SellerStatisticsPage() {
  const { myShop } = useAppSelector((state) => state.shop);
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [stats, setStats] = useState<Stats>({
    revenue: { total: 0, change: 0 },
    orders: { total: 0, change: 0 },
    products: { total: 0, sold: 0 },
    customers: { total: 0, new: 0 },
  });

  useEffect(() => {
    if (myShop?._id) {
      fetchStats();
    }
  }, [myShop, period]);

  const fetchStats = async () => {
    try {
      const productsRes = await api.get(`/products?shop=${myShop?._id}&limit=1`);
      const totalProducts = productsRes.data?.data?.pagination?.total || 0;
      setStats(prev => ({
        ...prev,
        products: { ...prev.products, total: totalProducts },
      }));
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const periods = [
    { key: "week", label: "7 ngày" },
    { key: "month", label: "30 ngày" },
    { key: "year", label: "12 tháng" },
  ];

  if (!myShop) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#f7f7f7] rounded-xl flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Thống kê</h1>
            <p className="text-sm text-gray-500">Phân tích hiệu suất shop của bạn</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#f7f7f7] p-1 rounded-xl">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key as typeof period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                period === p.key
                  ? "bg-white text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Doanh thu"
          value={`₫${formatPrice(stats.revenue.total)}`}
          change={stats.revenue.change}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Đơn hàng"
          value={stats.orders.total}
          change={stats.orders.change}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Sản phẩm đã bán"
          value={stats.products.sold}
          subtext={`${stats.products.total} sản phẩm`}
          icon={Package}
          color="purple"
        />
        <StatCard
          title="Khách hàng"
          value={stats.customers.total}
          subtext={`+${stats.customers.new} mới`}
          icon={Users}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-[#f7f7f7] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-800">Doanh thu theo thời gian</h3>
            <Button variant="ghost" size="sm" className="text-primary">
              <Calendar className="h-4 w-4 mr-1" />
              Chi tiết
            </Button>
          </div>
          <div className="h-64 flex items-center justify-center bg-white rounded-xl">
            <div className="text-center text-gray-400">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Biểu đồ doanh thu</p>
              <p className="text-xs mt-1">Chưa có dữ liệu</p>
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-[#f7f7f7] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-800">Đơn hàng theo trạng thái</h3>
            <Button variant="ghost" size="sm" className="text-primary">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              Xem tất cả
            </Button>
          </div>
          <div className="h-64 flex items-center justify-center bg-white rounded-xl">
            <div className="text-center text-gray-400">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Biểu đồ đơn hàng</p>
              <p className="text-xs mt-1">Chưa có dữ liệu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-[#f7f7f7] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-800">Sản phẩm bán chạy</h3>
          <Button variant="ghost" size="sm" className="text-primary">
            Xem tất cả
          </Button>
        </div>
        <div className="h-48 flex items-center justify-center bg-white rounded-xl">
          <div className="text-center text-gray-400">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Chưa có dữ liệu sản phẩm bán chạy</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  subtext?: string;
  icon: React.ElementType;
  color: "green" | "blue" | "purple" | "orange";
}

const colorMap = {
  green: { icon: "bg-green-100", text: "text-green-600" },
  blue: { icon: "bg-blue-100", text: "text-blue-600" },
  purple: { icon: "bg-purple-100", text: "text-purple-600" },
  orange: { icon: "bg-orange-100", text: "text-orange-600" },
};

const StatCard = ({ title, value, change, subtext, icon: Icon, color }: StatCardProps) => {
  const colors = colorMap[color];
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-[#f7f7f7] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 ${colors.icon} rounded-xl flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${colors.text}`} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-500"}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtext || title}</p>
    </div>
  );
};
