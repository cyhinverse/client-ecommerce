import {
  ShoppingCart,
  Users,
  Package,
  Settings,
  Bell,
  Album,
  TicketPercent,
  LayoutDashboardIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAVIGATION: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboardIcon,
  },
  {
    name: "Sản phẩm",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Đơn hàng",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Khách hàng",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Thông báo",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    name: "Danh mục",
    href: "/admin/categories",
    icon: Album,
  },
  {
    name: "Mã giảm giá",
    href: "/admin/discounts",
    icon: TicketPercent,
  },
  {
    name: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];
