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
    roles: "user", 
    isVerifiedEmail: false,
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  const handleClose = () => {
    onOpenChange(false);
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
      <DialogContent className="bg-background border-border text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin người dùng mới vào form dưới đây
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-muted-foreground">
              Họ và tên
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="bg-background border-border text-foreground"
              required
              disabled={isLoading}
              placeholder="Nhập họ và tên"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="bg-background border-border text-foreground"
              required
              disabled={isLoading}
              placeholder="Nhập địa chỉ email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-muted-foreground">
              Số điện thoại
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="bg-background border-border text-foreground"
              required
              disabled={isLoading}
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="bg-background border-border text-foreground"
              required
              disabled={isLoading}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roles" className="text-muted-foreground">
              Vai trò
            </Label>
            <Select
              value={formData.roles}
              onValueChange={(value) =>
                setFormData({ ...formData, roles: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border text-foreground">
                <SelectItem value="user">Người dùng</SelectItem>
                <SelectItem value="admin">Quản trị viên</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isVerifiedEmail" className="text-muted-foreground">
              Xác thực email
            </Label>
            <Select
              value={formData.isVerifiedEmail.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, isVerifiedEmail: value === "true" })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Chọn trạng thái xác thực" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border text-foreground">
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
              className="border-border text-muted-foreground hover:bg-muted"
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
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
