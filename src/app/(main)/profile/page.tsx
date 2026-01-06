// ProfilePage - Taobao Style
"use client";
import { getProfile } from "@/features/user/userAction";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import { logout } from "@/features/auth/authAction";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import UpdateUserProfile from "@/components/profile/modals/UpdateUserModal";
import ProfileTab from "@/components/profile/tabs/ProfileTab";
import OrdersTab from "@/components/profile/tabs/OrdersTab";
import AddressTab from "@/components/profile/tabs/AddressTab";
import SettingsTab from "@/components/profile/tabs/SettingsTab";
import ShopTab from "@/components/profile/tabs/ShopTab";
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Heart,
  Wallet,
  Gift,
  Star,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);
  const { user, isLoading } = useAppSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("profile");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const currentUser = user.length > 0 ? user[0] : null;

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["profile", "orders", "address", "settings", "shop"].includes(tabParam)) {
      if (activeTab !== tabParam) {
        setActiveTab(tabParam);
      }
    }
  }, [searchParams, activeTab]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Đăng xuất thành công");
    router.push("/");
  };

  const tabs = [
    { value: "profile", label: "Hồ sơ", icon: User, description: "Thông tin cá nhân" },
    { value: "orders", label: "Đơn hàng", icon: Package, description: "Theo dõi & lịch sử" },
    { value: "address", label: "Địa chỉ", icon: MapPin, description: "Địa chỉ giao hàng" },
    { value: "shop", label: "Shop của tôi", icon: Store, description: "Quản lý shop" },
    { value: "settings", label: "Cài đặt", icon: Settings, description: "Tùy chỉnh" },
  ];

  // Quick stats for user card
  const quickStats = [
    { label: "Đơn hàng", value: "12", icon: Package },
    { label: "Yêu thích", value: "28", icon: Heart },
    { label: "Xu", value: "1,500", icon: Gift },
  ];

  if (!isAuthenticated && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center bg-background -mt-4 -mx-4 px-4 py-20">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
          <User className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Vui lòng đăng nhập</h2>
          <p className="text-muted-foreground text-sm">Đăng nhập để quản lý tài khoản của bạn</p>
        </div>
        <Button 
          onClick={() => router.push("/login")} 
          className="bg-primary hover:bg-primary/90 rounded px-8 h-10"
        >
          Đăng nhập ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background -mt-4 -mx-4 px-4 py-4">
      {(loading || isLoading) && (
        <SpinnerLoading className="fixed inset-0 z-50 m-auto" />
      )}
      
      <div className={cn("max-w-[1200px] mx-auto transition-opacity duration-300", (loading || isLoading) && "opacity-50 pointer-events-none")}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <div className="w-full md:w-[240px] shrink-0 space-y-4">
            {/* User Card */}
            <div className="bg-card rounded-sm p-4 border border-border">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <Avatar className="h-14 w-14 border-2 border-primary/20">
                  <AvatarImage src={currentUser?.avatar ?? undefined} className="object-cover" />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground truncate">
                    {currentUser?.username || "Người dùng"}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-muted-foreground">Thành viên Vàng</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 pt-4">
                {quickStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <p className="font-bold text-primary">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-card rounded-sm overflow-hidden border border-border">
              <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                <TabsList className="flex flex-col h-auto w-full bg-transparent p-0">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={cn(
                          "w-full justify-start px-4 py-3 rounded-none transition-all duration-200 text-sm font-medium border-l-2",
                          "hover:bg-muted text-muted-foreground hover:text-foreground",
                          "data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:border-l-primary",
                          "data-[state=inactive]:border-l-transparent"
                        )}
                      >
                        <Icon className="h-4 w-4 mr-3 shrink-0" />
                        <span className="flex-1 text-left">{tab.label}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground data-[state=active]:text-primary" />
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>

              {/* Logout Button */}
              <div className="border-t border-border">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-none px-4 py-3 h-auto"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Đăng xuất
                </Button>
              </div>
            </div>

            {/* Wallet Card */}
            <div className="bg-primary rounded-sm p-4 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="h-5 w-5" />
                <span className="font-medium">Ví của tôi</span>
              </div>
              <p className="text-2xl font-bold">₫0</p>
              <p className="text-xs text-white/70 mt-1">Số dư khả dụng</p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-card rounded-sm min-h-[500px] border border-border">
              <Tabs value={activeTab} className="w-full">
                <TabsContent value="profile" className="mt-0 focus-visible:ring-0 p-4">
                  {currentUser && <ProfileTab user={currentUser} />}
                </TabsContent>
                <TabsContent value="orders" className="mt-0 focus-visible:ring-0 p-4">
                  <OrdersTab />
                </TabsContent>
                <TabsContent value="address" className="mt-0 focus-visible:ring-0 p-4">
                  {currentUser && <AddressTab user={currentUser} />}
                </TabsContent>
                <TabsContent value="shop" className="mt-0 focus-visible:ring-0 p-4">
                  <ShopTab />
                </TabsContent>
                <TabsContent value="settings" className="mt-0 focus-visible:ring-0 p-4">
                  {currentUser && <SettingsTab user={currentUser} />}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <UpdateUserProfile open={open} setOpen={setOpen} />
    </div>
  );
}
