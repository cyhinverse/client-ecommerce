"use client";
import { useState, useEffect } from "react";
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
import NotificationModel from "@/components/notifications/NotificationModel";
import { countUnreadNotification } from "@/features/notification/notificationAction";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  useEffect(() => {
    if (data?.roles !== "admin") {
      router.replace("/");
    }
  }, [data, router]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#000000] flex">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[280px] p-0 border-r-0 bg-background/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl"
        >
          <SheetTitle className="sr-only">Admin Navigation Menu</SheetTitle>
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center px-6">
              <span className="text-lg font-semibold tracking-tight">
                Admin Panel
              </span>
            </div>
            <ScrollArea className="flex-1 px-4 py-2">
              <nav className="flex flex-col gap-1">
                {ADMIN_NAVIGATION.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-white dark:bg-white/10 text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border/40 bg-background/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl fixed inset-y-0 z-50 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-[280px]"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-border/40">
          {!isCollapsed && (
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "h-8 w-8 ml-auto text-muted-foreground hover:text-foreground",
              isCollapsed && "mx-auto"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1 py-4 px-3">
          <nav className="flex flex-col gap-1">
            {ADMIN_NAVIGATION.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                    isActive
                      ? "bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                  {isActive && !isCollapsed && (
                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-border/40">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors",
              isCollapsed && "justify-center px-0"
            )}
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && "Sign Out"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          isCollapsed ? "lg:ml-20" : "lg:ml-[280px]"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 border-b border-border/40 bg-white/70 dark:bg-[#000000]/70 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden -ml-2 text-muted-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h2 className="text-sm font-medium text-muted-foreground hidden sm:block">
              Dashboard Overview
            </h2>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-3 border-l border-border/40 pl-6 ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-muted/50"
                onClick={() => setNotificationOpen(true)}
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-black" />
                )}
              </Button>

              {data && (
                <div className="flex items-center gap-3 pl-2">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium leading-none">
                      {data.username}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Admin</p>
                  </div>
                  <div className="relative h-9 w-9 rounded-full overflow-hidden shadow-sm ring-2 ring-border/20">
                    <Image
                      src={data.avatar || "/default-avatar.png"}
                      alt={data.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Notification Drawer */}
        <NotificationModel
          isOpen={notificationOpen}
          onClose={() => setNotificationOpen(false)}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
