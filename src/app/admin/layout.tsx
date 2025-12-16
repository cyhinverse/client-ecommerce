"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { logout } from "@/features/auth/authAction";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { toast } from "sonner";
import Image from "next/image";
import { ADMIN_NAVIGATION } from "@/constants";
import { useEffect } from "react";
import NotificationModel from "@/components/notifications/NotificationModel";
import { countUnreadNotification } from "@/features/notification/notificationAction";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notification);

  useEffect(() => {
    if (data) {
      dispatch(countUnreadNotification());
    }
  }, [data, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 no-scrollbar">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Admin Navigation Menu</SheetTitle>

          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <nav className="flex-1 space-y-2 px-4 py-4">
              {ADMIN_NAVIGATION.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                      isActive
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 no-scrollbar",
          isCollapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        <div
          className={cn(
            "flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white transition-all duration-300 no-scrollbar",
            isCollapsed ? "px-2" : "px-6"
          )}
        >
          <div
            className={cn(
              "flex h-16 shrink-0 items-center",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-gray-900 truncate">
                Admin Panel
              </h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn("ml-auto", isCollapsed && "mx-auto")}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {ADMIN_NAVIGATION.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                            isActive
                              ? "bg-gray-100 text-gray-900 font-medium"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                            isCollapsed && "justify-center px-2"
                          )}
                          title={isCollapsed ? item.name : undefined}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-gray-600 hover:text-gray-900",
                    isCollapsed && "justify-center px-2"
                  )}
                  onClick={handleLogout}
                  title={isCollapsed ? "Logout" : undefined}
                >
                  <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                  {!isCollapsed && "Logout"}
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-300 no-scrollbar",
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4  sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 no-scrollbar">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9"
                onClick={() => setNotificationOpen(true)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white pointer-events-none">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Button>
              <div className="h-6 w-px bg-gray-200" aria-hidden="true" />
              {data && (
                <Link
                  href={"/admin"}
                  className="flex items-center justify-center  rounded-full overflow-hidden"
                >
                  <Image
                    className="rounded-full object-cover aspect-square"
                    src={data.avatar}
                    alt={data.username}
                    height={30}
                    width={30}
                  />
                </Link>
              )}
            </div>
            <NotificationModel
              isOpen={notificationOpen}
              onClose={() => setNotificationOpen(false)}
            />
          </div>
        </div>

        {/* Page content */}
        <main className="py-8 no-scrollbar">
          <div className="px-4 sm:px-6 lg:px-8 no-scrollbar">{children}</div>
        </main>
      </div>
    </div>
  );
}
