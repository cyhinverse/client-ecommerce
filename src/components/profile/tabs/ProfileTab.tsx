"use client";
import { uploadAvatar } from "@/features/user/userAction";
import { useAppDispatch } from "@/hooks/hooks";
import { useState } from "react";
import Image from "next/image";
import { Plus, User, Mail, MapPin, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Address, ProfileTabProps } from "@/types/address";


export default function ProfileTab({ user }: ProfileTabProps) {
  const dispatch = useAppDispatch();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleUploadAvatar = () => {
    const file = document.createElement("input");
    file.type = "file";
    file.accept = "image/*";
    file.onchange = () => {
      const selectedFile = file.files?.item(0);
      if (!selectedFile) return;

      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      dispatch(uploadAvatar(formData))
        .unwrap()
        .then(() => {
          toast.success("Cập nhật ảnh đại diện thành công");
        })
        .catch((error) => {
          toast.error("Cập nhật ảnh đại diện thất bại");
        })
        .finally(() => {
          setIsUploadingAvatar(false);
        });
    };
    file.click();
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="w-[120px] h-[120px] rounded-full border-4 border-background shadow-lg overflow-hidden">
            <Image
              src={user.avatar || "/placeholder-avatar.jpg"}
              alt={user.username}
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
          <h3 className="text-xl font-semibold">{user.username}</h3>
          <p className="text-muted-foreground">
            Thành viên từ {new Date(user.createdAt).getFullYear()}
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
                  <p className="font-medium">Tên người dùng</p>
                  <p className="text-sm text-muted-foreground">
                    Tên hiển thị của bạn
                  </p>
                </div>
              </div>
              <p className="font-medium">{user.username}</p>
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
                <p className="font-medium">{user.email}</p>
                {user.isVerifiedEmail ? (
                  <Badge className="bg-success text-success-foreground hover:bg-success/90">
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
                {user.addresses && user.addresses.length > 0 ? (
                  <p className="text-sm font-medium">
                    {user.addresses.find((addr: Address) => addr.isDefault)?.district || user.addresses[0]?.district}, {" "}
                    {user.addresses.find((addr: Address) => addr.isDefault)?.city || user.addresses[0]?.city}
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
    </div>
  );
}