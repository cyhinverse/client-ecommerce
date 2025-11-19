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
      <Badge className="bg-black text-white border-black">
        <CheckCircle className="h-3 w-3 mr-1" />
        Đã xác thực email
      </Badge>
    ) : (
      <Badge variant="outline" className="border-gray-400 text-gray-700">
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
      <DialogContent className="bg-white border-gray-300 text-gray-900 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Chi tiết người dùng</DialogTitle>
          <DialogDescription className="text-gray-600">
            Thông tin chi tiết về người dùng trong hệ thống
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info Card */}
          <Card className="bg-gray-50 border-gray-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-8 w-8 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {user.username}
                  </h3>
                  {getVerifiedBadge(user.isVerifiedEmail)}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">{user.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">
                    Tham gia: {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Card */}
          <Card className="bg-gray-50 border-gray-300">
            <CardContent className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                Địa chỉ
              </h4>
              {user.addresses && user.addresses.length > 0 ? (
                <div className="space-y-3">
                  {user.addresses.map((addr, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-gray-400 pl-3"
                    >
                      <p className="font-medium text-gray-900">
                        {addr.fullName}
                      </p>
                      <p className="text-sm text-gray-600">{addr.phone}</p>
                      <p className="text-sm text-gray-600">{addr.address}</p>
                      <p className="text-sm text-gray-600">
                        {addr.ward}, {addr.district}, {addr.city}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Chưa có địa chỉ</p>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              Đóng
            </Button>
            {onEdit && (
              <Button
                onClick={handleEdit}
                className="bg-black text-white hover:bg-gray-800"
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