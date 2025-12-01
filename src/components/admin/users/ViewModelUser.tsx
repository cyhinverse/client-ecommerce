import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  User as UserIcon,
  Mail,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";
import { User } from "@/types/user";
import Image from "next/image";

interface ViewModelUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onEdit?: (user: User) => void;
}

export function ViewModelUser({
  open,
  onOpenChange,
  user,
  onEdit,
}: ViewModelUserProps) {
  if (!user) return null;

  const getVerifiedBadge = (isVerified: boolean) => {
    return isVerified ? (
      <Badge className="bg-primary text-primary-foreground border-primary">
        <CheckCircle className="h-3 w-3 mr-1" />
        Đã xác thực email
      </Badge>
    ) : (
      <Badge variant="outline" className="border-muted-foreground/50 text-muted-foreground">
        <XCircle className="h-3 w-3 mr-1" />
        Chưa xác thực email
      </Badge>
    );
  };

  const handleEdit = () => {
    if (onEdit && user) {
      onOpenChange(false);
      onEdit(user);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chi tiết người dùng</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Thông tin chi tiết về người dùng trong hệ thống
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info Card */}
          <Card className="bg-muted/30 border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <UserIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {user.username}
                  </h3>
                  {getVerifiedBadge(user.isVerifiedEmail)}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{user.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    Tham gia: {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Card */}
          <Card className="bg-muted/30 border-border">
            <CardContent className="p-6">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Địa chỉ
              </h4>
              {user.addresses && user.addresses.length > 0 ? (
                <div className="space-y-3">
                  {user.addresses.map((addr, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-muted-foreground/50 pl-3"
                    >
                      <p className="font-medium text-foreground">
                        {addr.fullName}
                      </p>
                      <p className="text-sm text-muted-foreground">{addr.phone}</p>
                      <p className="text-sm text-muted-foreground">{addr.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {addr.ward}, {addr.district}, {addr.city}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Chưa có địa chỉ</p>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>
            {onEdit && (
              <Button
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}