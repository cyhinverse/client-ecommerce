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
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
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

  // Handle URL query param for tab
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["profile", "orders", "address", "settings"].includes(tabParam)) {
        if (activeTab !== tabParam) {
            // eslint-disable-next-line
            setActiveTab(tabParam);
        }
    }
  }, [searchParams, activeTab]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/");
  };

  const tabs = [
    { value: "profile", label: "General", icon: User, description: "Personal information" },
    { value: "orders", label: "Orders", icon: Package, description: "Track & history" },
    { value: "address", label: "Address", icon: MapPin, description: "Shipping details" },
    { value: "settings", label: "Settings", icon: Settings, description: "App preferences" },
  ];

  if (!isAuthenticated && !loading) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
             <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-muted-foreground" />
             </div>
             <div className="space-y-2">
                 <h2 className="text-2xl font-bold tracking-tight">Sign in required</h2>
                 <p className="text-muted-foreground">Please login to manage your account</p>
             </div>
             <Button onClick={() => router.push("/login")} size="lg" className="rounded-full px-8">
                 Login now
             </Button>
        </div>
     )
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
      {(loading || isLoading) && (
        <SpinnerLoading className="fixed inset-0 z-50 m-auto" />
      )}
      
      <div className={cn("transition-opacity duration-300", (loading || isLoading) && "opacity-50 pointer-events-none")}>
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            
            {/* Sidebar */}
            <div className="w-full md:w-64 lg:w-72 flex-shrink-0 space-y-8">
                {/* User Snapshot (Mobile/Desktop consistent) */}
                <div className="flex items-center gap-4 px-2">
                     <Avatar className="h-14 w-14 border border-border/50">
                        <AvatarImage src={currentUser?.avatar ?? undefined} className="object-cover" />
                        <AvatarFallback className="text-lg bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                             {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                     </Avatar>
                     <div className="min-w-0 flex-1">
                         <p className="font-semibold truncate">{currentUser?.username || "Welcome"}</p>
                         <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
                     </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className={cn(
                                        "w-full justify-start px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden text-sm font-medium",
                                        "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                                        "data-[state=active]:bg-[#0071E3] data-[state=active]:text-white data-[state=active]:shadow-md",
                                        "data-[state=active]:hover:bg-[#0077ED]"
                                    )}
                                >
                                    <Icon className="h-5 w-5 mr-3 flex-shrink-0 transition-colors group-data-[state=active]:text-white text-muted-foreground group-hover:text-foreground" />
                                    <div className="flex-1 text-left">
                                        <span className="block transition-colors group-data-[state=active]:text-white text-foreground">
                                            {tab.label}
                                        </span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 ml-2 transition-colors text-transparent group-data-[state=active]:text-white/70" />
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </Tabs>

                <div className="px-2">
                     <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl px-4 py-6"
                     >
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign Out
                     </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
                <div className="bg-background rounded-3xl min-h-[400px]">
                     <Tabs value={activeTab} className="w-full">
                        <TabsContent value="profile" className="mt-0 focus-visible:ring-0">
                            {currentUser && <ProfileTab user={currentUser} />}
                        </TabsContent>
                        <TabsContent value="orders" className="mt-0 focus-visible:ring-0">
                            <OrdersTab />
                        </TabsContent>
                        <TabsContent value="address" className="mt-0 focus-visible:ring-0">
                            {currentUser && <AddressTab user={currentUser} />}
                        </TabsContent>
                        <TabsContent value="settings" className="mt-0 focus-visible:ring-0">
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
