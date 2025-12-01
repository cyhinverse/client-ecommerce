"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Cài đặt</h3>
        <p className="text-sm text-muted-foreground">
          Quản lý cài đặt hệ thống và tùy chọn hiển thị.
        </p>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Tổng quan</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="display">Hiển thị</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cửa hàng</CardTitle>
              <CardDescription>
                Cập nhật thông tin cơ bản của cửa hàng.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Tên cửa hàng</Label>
                <Input id="name" defaultValue="My E-commerce Store" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email liên hệ</Label>
                <Input id="email" defaultValue="contact@example.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" defaultValue="+84 123 456 789" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cấu hình thông báo</CardTitle>
              <CardDescription>
                Chọn các sự kiện bạn muốn nhận thông báo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="new-orders" className="flex flex-col space-y-1">
                  <span>Đơn hàng mới</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Nhận thông báo khi có khách đặt hàng mới.
                  </span>
                </Label>
                <Switch id="new-orders" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="low-stock" className="flex flex-col space-y-1">
                  <span>Sắp hết hàng</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Cảnh báo khi sản phẩm sắp hết trong kho.
                  </span>
                </Label>
                <Switch id="low-stock" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Giao diện</CardTitle>
              <CardDescription>
                Tùy chỉnh giao diện trang quản trị.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                  <span>Chế độ tối</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Chuyển đổi giữa giao diện sáng và tối.
                  </span>
                </Label>
                <Switch id="dark-mode" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
