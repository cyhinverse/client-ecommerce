"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Settings,
  Store,
  BarChart3,
  MessageSquare,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/hooks/hooks";
import { useMyShop } from "@/hooks/queries/useShop";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequireRole } from "@/components/common/PermissionGate";

const menuItems = [
  {
    title: "TỔNG QUAN",
    items: [{ name: "Dashboard", href: "/seller", icon: LayoutDashboard }],
  },
  {
    title: "QUẢN LÝ ĐƠN HÀNG",
    items: [
      { name: "Tất cả đơn hàng", href: "/seller/orders", icon: ShoppingCart },
      { name: "Vận chuyển", href: "/seller/shipping", icon: Truck },
    ],
  },
  {
    title: "QUẢN LÝ SẢN PHẨM",
    items: [
      { name: "Tất cả sản phẩm", href: "/seller/products", icon: Package },
      { name: "Danh mục shop", href: "/seller/categories", icon: Tag },
    ],
  },
  {
    title: "KHÁC",
    items: [
      { name: "Thống kê", href: "/seller/statistics", icon: BarChart3 },
      { name: "Chat", href: "/seller/chat", icon: MessageSquare },
      { name: "Cài đặt Shop", href: "/seller/settings", icon: Settings },
    ],
  },
];

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: myShop, isLoading } = useMyShop();
  const { isAuthenticated, data } = useAppSelector((state) => state.auth);

  const canHaveShop =
    data?.roles === "seller" ||
    data?.roles === "admin" ||
    (Array.isArray(data?.roles) &&
      (data.roles.includes("seller") || data.roles.includes("admin")));

  const isRegisterPage = pathname === "/seller/register";

  // Register page uses default layout
  if (isRegisterPage) {
    return <>{children}</>;
  }

  // Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // No shop
  if (!myShop && !isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Store className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-bold mb-2">Bạn chưa có shop</h2>
          <p className="text-gray-500 mb-6">Đăng ký để bắt đầu bán hàng</p>
          <Button
            onClick={() => router.push("/seller/register")}
            className="bg-primary"
          >
            Đăng ký bán hàng
          </Button>
        </div>
      </div>
    );
  }

  return (
    <RequireRole roles={["seller", "admin"]} redirectTo="/">
      <div className="min-h-screen bg-white -mt-4 -mx-4">
        <div className="max-w-[1400px] mx-auto flex gap-6 p-6">
          {/* Sidebar */}
          <aside className="w-[240px] shrink-0">
            {/* Shop Card */}
            <div className="bg-[#f7f7f7] rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white">
                  {myShop?.logo ? (
                    <Image
                      src={myShop.logo}
                      alt={myShop.name}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800 truncate">
                    {myShop?.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        myShop?.status === "active"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <span className="text-xs text-gray-500">
                      {myShop?.status === "active"
                        ? "Hoạt động"
                        : myShop?.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-[#f7f7f7] rounded-xl overflow-hidden">
              {menuItems.map((section, idx) => (
                <div key={section.title}>
                  <p className="px-4 pt-4 pb-2 text-[11px] font-semibold text-gray-400 tracking-wider">
                    {section.title}
                  </p>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-sm transition-all relative",
                          isActive
                            ? "text-primary bg-primary/5 font-medium"
                            : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                        )}
                        <Icon
                          className={cn(
                            "h-[18px] w-[18px]",
                            isActive && "text-primary"
                          )}
                        />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </RequireRole>
  );
}
