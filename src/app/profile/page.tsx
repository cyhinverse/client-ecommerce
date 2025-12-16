"use client";
import { getProfile } from "@/features/user/userAction";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import { logout } from "@/features/auth/authAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  SquarePen,
} from "lucide-react";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);
  const { user, isLoading } = useAppSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("profile");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const currentUser = user.length > 0 ? user[0] : null;

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/");
  };

  const tabs = [
    { value: "profile", label: "Profile", icon: User },
    { value: "orders", label: "Orders", icon: Package },
    { value: "address", label: "Address", icon: MapPin },
    { value: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto  h-full m-5 relative">
      {(loading || isLoading) && (
        <SpinnerLoading className="absolute inset-0 z-50 m-auto" />
      )}
      <div
        className={loading || isLoading ? "opacity-50 pointer-events-none" : ""}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <Card className="lg:w-80 h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Account</CardTitle>
                <CardDescription>
                  Manage your account information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <TabsList className="flex flex-col h-auto w-full p-2 bg-transparent gap-1">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="w-full justify-start px-4 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                      >
                        <IconComponent className="h-4 w-4 mr-3" />
                        {tab.label}
                      </TabsTrigger>
                    );
                  })}
                  <Separator className="my-2" />
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start px-4 py-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </Button>
                </TabsList>
              </CardContent>
            </Card>

            {/* Main Content */}
            <Card className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-2xl">
                    {activeTab === "profile" && "Personal Information"}
                    {activeTab === "orders" && "Order History"}
                    {activeTab === "address" && "Address Book"}
                    {activeTab === "settings" && "Account Settings"}
                  </CardTitle>
                  <CardDescription>
                    {activeTab === "profile" &&
                      "Manage your personal information"}
                    {activeTab === "orders" && "Track and manage your orders"}
                    {activeTab === "address" && "Manage shipping addresses"}
                    {activeTab === "settings" && "Customize account settings"}
                  </CardDescription>
                </div>
                {/* CHỈ GIỮ NÚT CHO TAB PROFILE */}
                {activeTab === "profile" && (
                  <Button onClick={() => setOpen(true)}>
                    <SquarePen className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                {/* ĐÃ XÓA NÚT "THÊM ĐỊA CHỈ MỚI" Ở ĐÂY */}
              </CardHeader>

              <CardContent>
                {!isAuthenticated ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Not logged in
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Please login to view personal information
                    </p>
                    <Button onClick={() => router.push("/login")}>
                      Login now
                    </Button>
                  </div>
                ) : (
                  <>
                    <TabsContent value="profile" className="m-0">
                      {currentUser && <ProfileTab user={currentUser} />}
                    </TabsContent>

                    <TabsContent value="orders" className="m-0">
                      <OrdersTab />
                    </TabsContent>

                    <TabsContent value="address" className="m-0">
                      {currentUser && <AddressTab user={currentUser} />}
                    </TabsContent>

                    <TabsContent value="settings" className="m-0">
                      {currentUser && <SettingsTab user={currentUser} />}
                    </TabsContent>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>

      <UpdateUserProfile open={open} setOpen={setOpen} />
    </div>
  );
}
