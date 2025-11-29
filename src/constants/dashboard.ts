import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface DashboardStat {
  name: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: LucideIcon;
  description: string;
}

export interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: "completed" | "processing" | "pending" | "cancelled";
  date: string;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  growth: string;
}

export interface QuickAction {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

// Dashboard Statistics
export const DASHBOARD_STATS: DashboardStat[] = [
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

// Recent Orders (Mock Data)
export const RECENT_ORDERS: RecentOrder[] = [
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

// Top Products (Mock Data)
export const TOP_PRODUCTS: TopProduct[] = [
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

// Quick Actions
export const QUICK_ACTIONS: QuickAction[] = [
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
