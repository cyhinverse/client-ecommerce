import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface CreateModelUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (userData: any) => void;
  isLoading?: boolean;
}

export function CreateModelUser({
  open,
  onOpenChange,
  onCreate,
  isLoading = false,
}: CreateModelUserProps) {
  // Trong CreateModelUser và UpdateModelUser
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    roles: "user", // ← Đảm bảo đúng field name
    isVerifiedEmail: false,
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
    // KHÔNG reset form ở đây nữa, để component cha xử lý
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form khi đóng modal
    setFormData({
      username: "",
      email: "",
      phone: "",
      roles: "user",
      isVerifiedEmail: false,
      password: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white border-gray-200 text-gray-900 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin người dùng mới vào form dưới đây
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-700">
              Họ và tên
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="bg-white border-gray-300 text-gray-900"
              required
              disabled={isLoading}
              placeholder="Nhập họ và tên"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="bg-white border-gray-300 text-gray-900"
              required
              disabled={isLoading}
              placeholder="Nhập địa chỉ email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700">
              Số điện thoại
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="bg-white border-gray-300 text-gray-900"
              required
              disabled={isLoading}
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="bg-white border-gray-300 text-gray-900"
              required
              disabled={isLoading}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roles" className="text-gray-700">
              Vai trò
            </Label>
            <Select
              value={formData.roles}
              onValueChange={(value) =>
                setFormData({ ...formData, roles: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-900">
                <SelectItem value="user">Người dùng</SelectItem>
                <SelectItem value="admin">Quản trị viên</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isVerifiedEmail" className="text-gray-700">
              Xác thực email
            </Label>
            <Select
              value={formData.isVerifiedEmail.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, isVerifiedEmail: value === "true" })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Chọn trạng thái xác thực" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-900">
                <SelectItem value="true">Đã xác thực</SelectItem>
                <SelectItem value="false">Chưa xác thực</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-gray-900 text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? "Đang tạo..." : "Tạo người dùng"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
