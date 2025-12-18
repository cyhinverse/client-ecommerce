import {
  ShoppingCart,
  Users,
  Package,
  Settings,
  Bell,
  Album,
  TicketPercent,
  LayoutDashboardIcon,
  Image as ImageIcon,
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
    href: "/admin/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Banners",
    href: "/admin/banners",
    icon: ImageIcon,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Album,
  },
  {
    name: "Discounts",
    href: "/admin/discounts",
    icon: TicketPercent,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];
