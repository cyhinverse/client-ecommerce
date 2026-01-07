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
  Store,
  Zap,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
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
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Shops",
    href: "/admin/shops",
    icon: Store,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Album,
  },
  {
    name: "Vouchers",
    href: "/admin/vouchers",
    icon: Tag,
  },
  {
    name: "Flash Sale",
    href: "/admin/flash-sale",
    icon: Zap,
    badge: "New",
  },
  {
    name: "Banners",
    href: "/admin/banners",
    icon: ImageIcon,
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];
