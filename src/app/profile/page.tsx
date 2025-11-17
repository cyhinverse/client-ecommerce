"use client";
import { getProfile, uploadAvatar, changePassword, verifyEmail, enableTwoFactor, verifyTwoFactor, createAddress, updateAddress, deleteAddress, setDefaultAddress } from "@/features/user/userAction";
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
  Key,
  Shield,
  MailCheck,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Star,
  Edit,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Interface cho địa chỉ
interface Address {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

// Interface cho form địa chỉ
interface AddressFormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { loading, data } = useAppSelector((state) => state.auth);
  const { user, isLoading, isUploadingAvatar, isChangingPassword } = useAppSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("profile");
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // State for 2FA
  const currentUser = user.length > 0 ? user[0] : null;
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser?.isTwoFactorEnabled || false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  // State for address management
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<AddressFormData>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    isDefault: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for cities, districts, wards
  const cities = [
    { id: "hcm", name: "Hồ Chí Minh" },
    { id: "hn", name: "Hà Nội" },
    { id: "dn", name: "Đà Nẵng" },
  ];

  const districts = [
    { id: "q1", name: "Quận 1", cityId: "hcm" },
    { id: "q3", name: "Quận 3", cityId: "hcm" },
    { id: "qbt", name: "Quận Bình Thạnh", cityId: "hcm" },
    { id: "ch", name: "Quận Cầu Giấy", cityId: "hn" },
    { id: "hd", name: "Quận Hải Châu", cityId: "dn" },
  ];

  const wards = [
    { id: "p1", name: "Phường Bến Nghé", districtId: "q1" },
    { id: "p2", name: "Phường Bến Thành", districtId: "q1" },
    { id: "p3", name: "Phường Võ Thị Sáu", districtId: "q3" },
    { id: "p4", name: "Phường 14", districtId: "qbt" },
  ];

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setTwoFactorEnabled(currentUser.isTwoFactorEnabled || false);
      setAddresses(currentUser.addresses || []);
    }
  }, [currentUser]);

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

      dispatch(uploadAvatar(formData))
        .unwrap()
        .then(() => {
          toast.success("Cập nhật ảnh đại diện thành công");
          // UI sẽ tự động cập nhật nhờ Redux state
        })
        .catch((error) => {
          toast.error("Cập nhật ảnh đại diện thất bại");
          console.error("Upload error:", error);
        });
    };
    file.click();
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      await dispatch(changePassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })).unwrap();

      toast.success("Đổi mật khẩu thành công");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại");
    }
  };

  const handleEmailVerification = async () => {
    try {
      await dispatch(verifyEmail()).unwrap();
      toast.success("Đã gửi email xác minh. Vui lòng kiểm tra hộp thư của bạn.");
    } catch (error) {
      toast.error("Gửi email xác minh thất bại");
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    if (enabled) {
      try {
        const result = await dispatch(enableTwoFactor()).unwrap();
        if (result.success) {
          setShowVerificationInput(true);
          toast.success("Quét mã QR bằng ứng dụng xác thực của bạn");
        }
      } catch (error) {
        toast.error("Kích hoạt xác thực 2 lớp thất bại");
      }
    } else {
      setTwoFactorEnabled(false);
      // Call API to disable 2FA
      toast.success("Đã tắt xác thực 2 lớp");
    }
  };

  const handleVerifyTwoFactor = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Mã xác minh phải có 6 chữ số");
      return;
    }

    try {
      const result = await dispatch(verifyTwoFactor(verificationCode)).unwrap();
      if (result.success) {
        setTwoFactorEnabled(true);
        setShowVerificationInput(false);
        setVerificationCode("");
        toast.success("Kích hoạt xác thực 2 lớp thành công");
      }
    } catch (error) {
      toast.error("Mã xác minh không hợp lệ");
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Address Management Functions
  const openAddAddressDialog = () => {
    setEditingAddress(null);
    setAddressForm({
      fullName: currentUser?.username || "",
      phone: currentUser?.phone || "",
      address: "",
      city: "",
      district: "",
      ward: "",
      isDefault: addresses.length === 0,
    });
    setIsAddressDialogOpen(true);
  };

  const openEditAddressDialog = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      district: address.district,
      ward: address.ward,
      isDefault: address.isDefault,
    });
    setIsAddressDialogOpen(true);
  };

  const closeAddressDialog = () => {
    setIsAddressDialogOpen(false);
    setEditingAddress(null);
    setAddressForm({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      district: "",
      ward: "",
      isDefault: false,
    });
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingAddress) {
        await dispatch(updateAddress({
          addressId: editingAddress._id,
          addressData: addressForm
        })).unwrap();
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        await dispatch(createAddress(addressForm)).unwrap();
        toast.success("Thêm địa chỉ thành công");
      }

      closeAddressDialog();
      dispatch(getProfile()); // Refresh profile data
    } catch (error) {
      toast.error(editingAddress ? "Cập nhật địa chỉ thất bại" : "Thêm địa chỉ thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      try {
        await dispatch(deleteAddress(addressId)).unwrap();
        toast.success("Xóa địa chỉ thành công");
        dispatch(getProfile());
      } catch (error) {
        toast.error("Xóa địa chỉ thất bại");
      }
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await dispatch(setDefaultAddress(addressId)).unwrap();
      toast.success("Đã đặt làm địa chỉ mặc định");
      dispatch(getProfile());
    } catch (error) {
      toast.error("Thay đổi địa chỉ mặc định thất bại");
    }
  };

  const filteredDistricts = districts.filter(district =>
    district.cityId === addressForm.city
  );

  const filteredWards = wards.filter(ward =>
    ward.districtId === addressForm.district
  );

  if (loading || isLoading) {
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
                  {activeTab === "profile" && "Quản lý thông tin cá nhân của bạn"}
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
              {activeTab === "address" && (
                <Button onClick={openAddAddressDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm địa chỉ mới
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
                    {currentUser && (
                      <>
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4 text-center">
                          <div className="relative">
                            <div className="w-[120px] h-[120px] rounded-full border-4 border-background shadow-lg overflow-hidden">
                              <Image
                                src={currentUser.avatar || "/placeholder-avatar.jpg"}
                                alt={currentUser.username}
                                width={120}
                                height={120}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              size="icon"
                              className="absolute bottom-2 right-2 h-8 w-8 rounded-full"
                              onClick={handleUploadAvatar}
                              disabled={isUploadingAvatar}
                            >
                              {isUploadingAvatar ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">
                              {currentUser.username}
                            </h3>
                            <p className="text-muted-foreground">
                              Thành viên từ {new Date(currentUser.createdAt).getFullYear()}
                            </p>
                          </div>
                        </div>                        {/* Info Grid */}
                        <div className="grid gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <User className="h-5 w-5 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">Tên người dùng</p>
                                    <p className="text-sm text-muted-foreground">
                                      Tên hiển thị của bạn
                                    </p>
                                  </div>
                                </div>
                                <p className="font-medium">{currentUser.username}</p>
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
                                  <p className="font-medium">{currentUser.email}</p>
                                  {currentUser.isVerifiedEmail ? (
                                    <Badge className="bg-green-500">
                                      <Check className="h-3 w-3 mr-1" />
                                      Đã xác thực
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline">Chưa xác thực</Badge>
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
                                  {currentUser.addresses && currentUser.addresses.length > 0 ? (
                                    <p className="text-sm font-medium">
                                      {currentUser.addresses.find(addr => addr.isDefault)?.district || currentUser.addresses[0]?.district}, {" "}
                                      {currentUser.addresses.find(addr => addr.isDefault)?.city || currentUser.addresses[0]?.city}
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
                      <h3 className="text-lg font-semibold mb-2">Chưa có đơn hàng</h3>
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
                    <div className="space-y-4">
                      {addresses.length === 0 ? (
                        <div className="text-center py-12">
                          <MapPin className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Chưa có địa chỉ</h3>
                          <p className="text-muted-foreground mb-6">
                            Thêm địa chỉ giao hàng đầu tiên của bạn
                          </p>
                          <Button onClick={openAddAddressDialog}>
                            Thêm địa chỉ mới
                          </Button>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {addresses.map((address) => (
                            <Card
                              key={address._id}
                              className={`relative ${address.isDefault ? 'border-primary border-2' : ''}`}
                            >
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="font-semibold">{address.fullName}</h4>
                                      {address.isDefault && (
                                        <Badge className="bg-blue-500">
                                          <Star className="h-3 w-3 mr-1 fill-current" />
                                          Mặc định
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                      {address.phone}
                                    </p>
                                    <p className="text-sm mb-1">{address.address}</p>
                                    <p className="text-sm">
                                      {address.ward}, {address.district}, {address.city}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 ml-4">
                                    {!address.isDefault && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSetDefaultAddress(address._id)}
                                      >
                                        <Star className="h-4 w-4 mr-1" />
                                        Đặt mặc định
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openEditAddressDialog(address)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteAddress(address._id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="m-0">
                    <div className="space-y-6">
                      {/* Security Settings Card */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Bảo mật tài khoản
                          </CardTitle>
                          <CardDescription>
                            Quản lý mật khẩu và các cài đặt bảo mật
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Change Password Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Key className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <Label className="font-medium">Thay đổi mật khẩu</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Cập nhật mật khẩu mới cho tài khoản
                                  </p>
                                </div>
                              </div>
                            </div>

                            <form onSubmit={handlePasswordChange} className="space-y-4">
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                                  <div className="relative">
                                    <Input
                                      id="currentPassword"
                                      type={showPasswords.current ? "text" : "password"}
                                      value={passwordData.currentPassword}
                                      onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        currentPassword: e.target.value
                                      })}
                                      placeholder="Nhập mật khẩu hiện tại"
                                      required
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                      onClick={() => togglePasswordVisibility('current')}
                                    >
                                      {showPasswords.current ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                                  <div className="relative">
                                    <Input
                                      id="newPassword"
                                      type={showPasswords.new ? "text" : "password"}
                                      value={passwordData.newPassword}
                                      onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        newPassword: e.target.value
                                      })}
                                      placeholder="Nhập mật khẩu mới"
                                      required
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                      onClick={() => togglePasswordVisibility('new')}
                                    >
                                      {showPasswords.new ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                                  <div className="relative">
                                    <Input
                                      id="confirmPassword"
                                      type={showPasswords.confirm ? "text" : "password"}
                                      value={passwordData.confirmPassword}
                                      onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        confirmPassword: e.target.value
                                      })}
                                      placeholder="Xác nhận mật khẩu mới"
                                      required
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                      onClick={() => togglePasswordVisibility('confirm')}
                                    >
                                      {showPasswords.confirm ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              <Button type="submit" className="w-full" disabled={isChangingPassword}>
                                <Lock className="h-4 w-4 mr-2" />
                                {isChangingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
                              </Button>
                            </form>
                          </div>

                          <Separator />

                          {/* Email Verification Section */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <MailCheck className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <Label className="font-medium">Xác minh email</Label>
                                <p className="text-sm text-muted-foreground">
                                  {currentUser?.isVerifiedEmail
                                    ? "Email của bạn đã được xác minh"
                                    : "Xác minh email để bảo vệ tài khoản"
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {currentUser?.isVerifiedEmail ? (
                                <Badge className="bg-green-500">
                                  <Check className="h-3 w-3 mr-1" />
                                  Đã xác minh
                                </Badge>
                              ) : (
                                <Button
                                  onClick={handleEmailVerification}
                                  variant="outline"
                                  size="sm"
                                >
                                  Gửi email xác minh
                                </Button>
                              )}
                            </div>
                          </div>

                          <Separator />

                          {/* Two-Factor Authentication Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <Label className="font-medium">Xác thực 2 lớp (2FA)</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Thêm lớp bảo mật bổ sung cho tài khoản
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={twoFactorEnabled}
                                onCheckedChange={handleTwoFactorToggle}
                              />
                            </div>

                            {showVerificationInput && (
                              <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                                <Label htmlFor="verificationCode">Nhập mã xác minh 6 số</Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="verificationCode"
                                    type="text"
                                    placeholder="123456"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="flex-1"
                                  />
                                  <Button
                                    onClick={handleVerifyTwoFactor}
                                    disabled={verificationCode.length !== 6}
                                  >
                                    Xác minh
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Nhập mã từ ứng dụng xác thực của bạn
                                </p>
                              </div>
                            )}

                            {twoFactorEnabled && (
                              <Badge className="bg-green-500">
                                <Check className="h-3 w-3 mr-1" />
                                Đã bật xác thực 2 lớp
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Account Status Card */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Trạng thái tài khoản</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Xác minh email</span>
                              {currentUser?.isVerifiedEmail ? (
                                <Badge className="bg-green-500">Đã xác minh</Badge>
                              ) : (
                                <Badge variant="outline">Chưa xác minh</Badge>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Xác thực 2 lớp</span>
                              {twoFactorEnabled ? (
                                <Badge className="bg-green-500">Đã bật</Badge>
                              ) : (
                                <Badge variant="outline">Chưa bật</Badge>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Tài khoản</span>
                              <Badge className="bg-blue-500">Đang hoạt động</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </Tabs>

      {/* Address Dialog */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
            </DialogTitle>
            <DialogDescription>
              {editingAddress
                ? "Cập nhật thông tin địa chỉ của bạn"
                : "Thêm địa chỉ giao hàng mới"
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddressSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input
                    id="fullName"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ cụ thể</Label>
                <Input
                  id="address"
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  placeholder="Số nhà, tên đường"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Tỉnh/Thành phố</Label>
                  <Select
                    value={addressForm.city}
                    onValueChange={(value) => setAddressForm({ ...addressForm, city: value, district: "", ward: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tỉnh/thành" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">Quận/Huyện</Label>
                  <Select
                    value={addressForm.district}
                    onValueChange={(value) => setAddressForm({ ...addressForm, district: value, ward: "" })}
                    disabled={!addressForm.city}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn quận/huyện" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredDistricts.map((district) => (
                        <SelectItem key={district.id} value={district.id}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ward">Phường/Xã</Label>
                  <Select
                    value={addressForm.ward}
                    onValueChange={(value) => setAddressForm({ ...addressForm, ward: value })}
                    disabled={!addressForm.district}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phường/xã" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredWards.map((ward) => (
                        <SelectItem key={ward.id} value={ward.id}>
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onCheckedChange={(checked) => setAddressForm({ ...addressForm, isDefault: checked })}
                />
                <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeAddressDialog}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : editingAddress ? "Cập nhật" : "Thêm địa chỉ"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <UpdateUserProfile open={open} setOpen={setOpen} />
    </div>
  );
}
