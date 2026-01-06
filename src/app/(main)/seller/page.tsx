"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, ShoppingCart, DollarSign, TrendingUp,
  Eye, Star, Users, ArrowRight, Clock, CheckCircle2,
  XCircle, Truck
} from "lucide-react";
import { useAppSelector } from "@/hooks/hooks";
import api from "@/api/api";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return (price / 1000000).toFixed(1) + "M";
  }
  if (price >= 1000) {
    return (price / 1000).toFixed(0) + "K";
  }
  return price.toString();
};

export default function SellerDashboardPage() {
  const { myShop } = useAppSelector((state) => state.shop);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    if (myShop?._id) {
      fetchStats();
    }
  }, [myShop]);

  const fetchStats = async () => {
    try {
      const productsRes = await api.get(`/products?shop=${myShop?._id}&limit=1`);
      const totalProducts = productsRes.data?.data?.pagination?.total || 0;
      setStats(prev => ({ ...prev, totalProducts }));
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const orderStats = [
    { label: "Chờ xác nhận", value: 0, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Đang xử lý", value: 0, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Đang giao", value: 0, icon: Truck, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Hoàn thành", value: 0, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Đã hủy", value: 0, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-red-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2" />
        <div className="relative">
          <h1 className="text-2xl font-bold mb-1">
            Xin chào, {myShop?.name}! 👋
          </h1>
          <p className="text-white/80 text-sm">
            Chào mừng bạn đến với Kênh Người Bán. Quản lý shop của bạn tại đây.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Sản phẩm"
          value={stats.totalProducts}
          icon={Package}
          color="blue"
          href="/seller/products"
        />
        <StatCard
          title="Đơn hàng"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="green"
          href="/seller/orders"
        />
        <StatCard
          title="Doanh thu"
          value={`₫${formatPrice(stats.totalRevenue)}`}
          icon={DollarSign}
          color="yellow"
        />
        <StatCard
          title="Lượt xem"
          value="0"
          icon={Eye}
          color="purple"
        />
      </div>

      {/* Order Status */}
      <div className="bg-[#f7f7f7] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-800">Trạng thái đơn hàng</h2>
          <Link href="/seller/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {orderStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-4 text-center">
                <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shop Performance */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#f7f7f7] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đánh giá</p>
              <p className="text-xl font-bold">{myShop?.rating?.toFixed(1) || "0.0"}</p>
            </div>
          </div>
          <div className="h-1.5 bg-white rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-500 rounded-full" 
              style={{ width: `${((myShop?.rating || 0) / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#f7f7f7] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Người theo dõi</p>
              <p className="text-xl font-bold">{myShop?.followers || 0}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">+0 trong tuần này</p>
        </div>

        <div className="bg-[#f7f7f7] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tỷ lệ phản hồi</p>
              <p className="text-xl font-bold">{myShop?.metrics?.responseRate || 0}%</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">Trong 24 giờ qua</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#f7f7f7] rounded-2xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction href="/seller/products" icon={Package} label="Thêm sản phẩm" />
            <QuickAction href="/seller/orders" icon={ShoppingCart} label="Xem đơn hàng" />
            <QuickAction href="/seller/shipping" icon={Truck} label="Vận chuyển" />
            <QuickAction href="/seller/settings" icon={Star} label="Cài đặt shop" />
          </div>
        </div>

        <div className="bg-[#f7f7f7] rounded-2xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Sản phẩm bán chạy</h3>
          <div className="flex items-center justify-center py-8 text-gray-400">
            <div className="text-center">
              <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Chưa có dữ liệu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: "blue" | "green" | "yellow" | "purple";
  href?: string;
}

const colorMap = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "bg-blue-100" },
  green: { bg: "bg-green-50", text: "text-green-600", icon: "bg-green-100" },
  yellow: { bg: "bg-yellow-50", text: "text-yellow-600", icon: "bg-yellow-100" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", icon: "bg-purple-100" },
};

const StatCard = ({ title, value, icon: Icon, color, href }: StatCardProps) => {
  const colors = colorMap[color];
  const content = (
    <div className="bg-[#f7f7f7] rounded-2xl p-5 transition-all hover:bg-[#f0f0f0] cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${colors.icon} rounded-xl flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${colors.text}`} />
        </div>
        {href && <ArrowRight className="h-4 w-4 text-gray-400" />}
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
};

const QuickAction = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => (
  <Link
    href={href}
    className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-gray-50 transition-all"
  >
    <div className="w-9 h-9 bg-[#f7f7f7] rounded-lg flex items-center justify-center">
      <Icon className="h-4 w-4 text-gray-600" />
    </div>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </Link>
);
