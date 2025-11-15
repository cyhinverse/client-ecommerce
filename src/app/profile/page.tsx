"use client";
import { getProfile, uploadAvatar } from "@/features/user/userAction";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Check,
  SquarePen,
  Plus,
  Mail,
  MapPin,
  User,
  Settings,
  Package,
  LogOut,
} from "lucide-react";
import UpdateUserProfile from "@/components/profile/UpdateUserModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SpinnerLoading from "@/components/common/SpinerLoading";
import { logout } from "@/features/auth/authAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const {loading,data} = useAppSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState("profile");
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Đăng xuất thành công");
    router.push("/");
  };

  const handleUploadAvatar = () => {
    const file = document.createElement("input");
    file.type = "file";
    file.accept = "image/*";
    file.onchange = () => {
      const selectedFile = file.files?.item(0);
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("avatar", selectedFile);
      dispatch(uploadAvatar(formData));
    };
    file.click();
  };

  if (loading) {
    return <SpinnerLoading />;
  }

  const tabs = [
    { value: "profile", label: "Hồ sơ", icon: User },
    { value: "orders", label: "Đơn hàng", icon: Package },
    { value: "address", label: "Địa chỉ", icon: MapPin },
    { value: "settings", label: "Cài đặt", icon: Settings },
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <Card className="lg:w-80 h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Tài khoản</CardTitle>
              <CardDescription>
                Quản lý thông tin tài khoản của bạn
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
                  className="w-full justify-start px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Đăng xuất
                </Button>
              </TabsList>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-2xl">
                  {activeTab === "profile" && "Thông tin cá nhân"}
                  {activeTab === "orders" && "Lịch sử đơn hàng"}
                  {activeTab === "address" && "Sổ địa chỉ"}
                  {activeTab === "settings" && "Cài đặt tài khoản"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "profile" &&
                    "Quản lý thông tin cá nhân của bạn"}
                  {activeTab === "orders" && "Theo dõi và quản lý đơn hàng"}
                  {activeTab === "address" && "Quản lý địa chỉ giao hàng"}
                  {activeTab === "settings" && "Tùy chỉnh cài đặt tài khoản"}
                </CardDescription>
              </div>
              {activeTab === "profile" && (
                <Button onClick={() => setOpen(true)}>
                  <SquarePen className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              )}
            </CardHeader>

            <CardContent>
              {!isAuthenticated ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Chưa đăng nhập</h3>
                  <p className="text-muted-foreground mb-4">
                    Vui lòng đăng nhập để xem thông tin cá nhân
                  </p>
                  <Button onClick={() => router.push("/login")}>
                    Đăng nhập ngay
                  </Button>
                </div>
              ) : (
                <>
                  {/* Profile Tab */}
                  <TabsContent value="profile" className="space-y-6 m-0">
                    {data && (
                      <>
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4 text-center">
                          <div className="relative">
                            <Image
                              src={data.avatar || "/placeholder-avatar.jpg"}
                              alt={data.avatar}
                              width={120}
                              height={120}
                          
                              className="rounded-full border-4 border-background shadow-lg"
                            />
                            <Button
                              size="icon"
                              className="absolute bottom-2 right-2 h-8 w-8 rounded-full"
                              onClick={handleUploadAvatar}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">
                              {data.username}
                            </h3>
                            <p className="text-muted-foreground">
                              Thành viên từ 2024
                            </p>
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <User className="h-5 w-5 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">
                                      Tên người dùng
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Tên hiển thị của bạn
                                    </p>
                                  </div>
                                </div>
                                <p className="font-medium">{data.username}</p>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Mail className="h-5 w-5 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">Địa chỉ email</p>
                                    <p className="text-sm text-muted-foreground">
                                      Email liên hệ của bạn
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{data.email}</p>
                                  {data.isVerifiedEmail ? (
                                    <Badge className="bg-green-500">
                                      <Check className="h-3 w-3 mr-1" />
                                      Đã xác thực
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline">
                                      Chưa xác thực
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <MapPin className="h-5 w-5 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">Địa chỉ</p>
                                    <p className="text-sm text-muted-foreground">
                                      Địa chỉ giao hàng mặc định
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {Array.isArray(data.addresses) &&
                                  data.addresses.length > 0 ? (
                                    <p className="text-sm font-medium">
                                      {data.addresses[0]?.district},{" "}
                                      {data.addresses[0]?.city}
                                    </p>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">
                                      Chưa thêm địa chỉ
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    )}
                  </TabsContent>

                  {/* Orders Tab */}
                  <TabsContent value="orders" className="m-0">
                    <div className="text-center py-12">
                      <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Chưa có đơn hàng
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Lịch sử đơn hàng của bạn sẽ xuất hiện tại đây
                      </p>
                      <Button onClick={() => router.push("/products")}>
                        Mua sắm ngay
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Address Tab */}
                  <TabsContent value="address" className="m-0">
                    <div className="text-center py-12">
                      <MapPin className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Chưa có địa chỉ
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Thêm địa chỉ giao hàng đầu tiên của bạn
                      </p>
                      <Button>Thêm địa chỉ mới</Button>
                    </div>
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="m-0">
                    <div className="text-center py-12">
                      <Settings className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Cài đặt tài khoản
                      </h3>
                      <p className="text-muted-foreground">
                        Quản lý tùy chọn và cài đặt bảo mật tài khoản
                      </p>
                    </div>
                  </TabsContent>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </Tabs>

      <UpdateUserProfile open={open} setOpen={setOpen} />
    </div>
  );
}
