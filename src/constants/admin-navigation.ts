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
  Shield,
  Star,
  Bot,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { PERMISSIONS } from "./permissions";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  permission?: string; // Required permission to view this item
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
    permission: PERMISSIONS.PRODUCT_READ,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    permission: PERMISSIONS.ORDER_READ,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    permission: PERMISSIONS.USER_READ,
  },
  {
    name: "Permissions",
    href: "/admin/permissions",
    icon: Shield,
    permission: PERMISSIONS.USER_MANAGE,
  },
  {
    name: "Shops",
    href: "/admin/shops",
    icon: Store,
    permission: PERMISSIONS.SHOP_READ,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Album,
    permission: PERMISSIONS.CATEGORY_READ,
  },
  {
    name: "Vouchers",
    href: "/admin/vouchers",
    icon: Tag,
    permission: PERMISSIONS.VOUCHER_READ,
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    name: "Flash Sale",

    href: "/admin/flash-sale",
    icon: Zap,
    badge: "New",
    permission: PERMISSIONS.FLASH_SALE_READ,
  },
  {
    name: "Banners",
    href: "/admin/banners",
    icon: ImageIcon,
    permission: PERMISSIONS.BANNER_READ,
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    permission: PERMISSIONS.NOTIFICATION_READ,
  },
  {
    name: "Chatbot AI",
    href: "/admin/chatbot",
    icon: Bot,
    permission: PERMISSIONS.ADMIN_ACCESS,
  },
  {
    name: "Settings",

    href: "/admin/settings",
    icon: Settings,
    permission: PERMISSIONS.ADMIN_ACCESS,
  },
];
