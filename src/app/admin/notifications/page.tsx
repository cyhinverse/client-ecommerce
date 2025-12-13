"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bell,
  Send,
  Users,
  MessageSquare,
  AlertTriangle,
  Clock,
  MoreHorizontal,
  Edit,
  Eye,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  createNotification,
  getListNotification,
  getNotificationById,
  updateNotification,
  CreateNotificationData,
} from "@/features/notification/notificationAction";
import { Notification } from "@/types/notification";
import { toast } from "sonner";
import SpinnerLoading from "@/components/common/SpinnerLoading";

// Helper functions (kept for UI consistency)
const getTypeBadge = (type: string) => {
  switch (type) {
    case "order":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Bell className="h-3 w-3 mr-1" />
          Đơn hàng
        </Badge>
      );
    case "promotion":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <Send className="h-3 w-3 mr-1" />
          Khuyến mãi
        </Badge>
      );
    case "system":
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Hệ thống
        </Badge>
      );
    case "welcome":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          <Users className="h-3 w-3 mr-1" />
          Chào mừng
        </Badge>
      );
    case "announcement":
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          <MessageSquare className="h-3 w-3 mr-1" />
          Thông báo
        </Badge>
      );
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

const formatDateTime = (dateTime: string) => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleString("vi-VN");
};

export default function NotificationAdminPage() {
  const dispatch = useAppDispatch();
  const { notifications, pagination, loading } = useAppSelector(
    (state) => state.notification
  );

  // Local state for Create form
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "system",
    link: "",
    orderId: "",
  });

  // Local state for Edit Dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: "",
    title: "",
    message: "",
    type: "system",
    link: "",
    orderId: "",
  });

  // Local state for View Dialog
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState<Notification | null>(null);

  useEffect(() => {
    dispatch(getListNotification({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleCreate = async () => {
    try {
      // Clean payload to match validator
      // Clean payload to match validator
      const payload: CreateNotificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
      };
      if (formData.link) payload.link = formData.link;
      if (formData.orderId) payload.orderId = formData.orderId;

      await dispatch(createNotification(payload)).unwrap();
      toast.success("Thông báo đã được tạo");
      // dispatch(getListNotification({ page: 1, limit: 10 })); // Socket handles update
      setFormData({
        title: "",
        message: "",
        type: "system",
        link: "",
        orderId: "",
      });
    } catch {
      toast.error("Tạo thông báo thất bại");
    }
  };

  const handleEditClick = async (id: string) => {
    try {
      const res = await dispatch(getNotificationById(id)).unwrap();
      const data = res.data;
      setEditFormData({
        _id: data._id,
        title: data.title,
        message: data.message,
        type: data.type,
        link: data.link || "",
        orderId: data.orderId || "",
      });
      setIsEditDialogOpen(true);
    } catch {
      toast.error("Không thể lấy chi tiết thông báo");
    }
  };

  const handleViewClick = async (id: string) => {
    try {
      const res = await dispatch(getNotificationById(id)).unwrap();
      setViewData(res.data);
      setIsViewDialogOpen(true);
    } catch {
      toast.error("Không thể xem chi tiết");
    }
  };

  const handleUpdate = async () => {
    try {
      await dispatch(
        updateNotification({
          id: editFormData._id,
          data: {
            title: editFormData.title,
            message: editFormData.message,
            type: editFormData.type,
            link: editFormData.link,
            orderId: editFormData.orderId,
          },
        })
      ).unwrap();
      toast.success("Cập nhật thành công");
      setIsEditDialogOpen(false);
      // Refresh list to show updated data
      dispatch(
        getListNotification({ page: pagination?.currentPage || 1, limit: 10 })
      );
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      dispatch(getListNotification({ page: newPage, limit: 10 }));
    }
  };

  return (
    <div className="space-y-6 no-scrollbar">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Quản lý thông báo
          </h1>
          <p className="text-gray-600 mt-2">
            Gửi và quản lý thông báo đến người dùng
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Notification Form */}
        <Card className="lg:col-span-1 h-fit sticky top-20">
          <CardHeader>
            <CardTitle>Tạo thông báo mới</CardTitle>
            <CardDescription>
              Gửi thông báo (Hiện tại: Gửi cho chính mình để test)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                placeholder="Nhập tiêu đề thông báo"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Nội dung</Label>
              <Textarea
                id="message"
                placeholder="Nhập nội dung thông báo"
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Loại thông báo</Label>
              <Select
                value={formData.type}
                onValueChange={(val) => setFormData({ ...formData, type: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại thông báo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">Hệ thống</SelectItem>
                  <SelectItem value="order_status">
                    Trạng thái đơn hàng
                  </SelectItem>
                  <SelectItem value="promotion">Khuyến mãi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link (Tuỳ chọn)</Label>
              <Input
                id="link"
                placeholder="https://..."
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
              />
            </div>

            {formData.type === "order_status" && (
              <div className="space-y-2">
                <Label htmlFor="orderId">Mã đơn hàng (Order ID)</Label>
                <Input
                  id="orderId"
                  placeholder="24 ký tự hex..."
                  value={formData.orderId}
                  onChange={(e) =>
                    setFormData({ ...formData, orderId: e.target.value })
                  }
                />
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleCreate}
              disabled={loading}
            >
              <Send className="h-4 w-4 mr-2" />
              {loading ? "Đang gửi..." : "Gửi thông báo"}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Lịch sử thông báo (Inbox của Admin)</CardTitle>
                <CardDescription>Danh sách thông báo nhận được</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    dispatch(getListNotification({ page: 1, limit: 10 }))
                  }
                >
                  <Clock className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thông báo</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <SpinnerLoading />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                <div
                  className={loading ? "opacity-50 pointer-events-none" : ""}
                >
                  {notifications && notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <TableRow key={notification._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {notification.message}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(notification.type)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDateTime(notification.createdAt)}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-muted text-muted-foreground hover:text-foreground"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleViewClick(notification._id)
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEditClick(notification._id)
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Chưa có thông báo nào
                      </TableCell>
                    </TableRow>
                  )}
                </div>
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Hiển thị{" "}
                  {(pagination.currentPage - 1) * pagination.pageSize + 1} đến{" "}
                  {Math.min(
                    pagination.currentPage * pagination.pageSize,
                    pagination.totalItems
                  )}{" "}
                  của {pagination.totalItems} thông báo
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.currentPage === 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    Trước
                  </Button>
                  <span className="text-sm font-medium mx-2">
                    Trang {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.currentPage >= pagination.totalPages}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông báo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Tiêu đề</Label>
              <Input
                id="edit-title"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-message">Nội dung</Label>
              <Textarea
                id="edit-message"
                rows={4}
                value={editFormData.message}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, message: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Loại thông báo</Label>
              <Select
                value={editFormData.type}
                onValueChange={(val) =>
                  setEditFormData({ ...editFormData, type: val })
                }
              >
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Chọn loại thông báo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">Hệ thống</SelectItem>
                  <SelectItem value="order_status">
                    Trạng thái đơn hàng
                  </SelectItem>
                  <SelectItem value="promotion">Khuyến mãi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-link">Link</Label>
              <Input
                id="edit-link"
                value={editFormData.link}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, link: e.target.value })
                }
              />
            </div>
            {editFormData.type === "order_status" && (
              <div className="space-y-2">
                <Label htmlFor="edit-orderId">Mã đơn hàng</Label>
                <Input
                  id="edit-orderId"
                  value={editFormData.orderId}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      orderId: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdate}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết thông báo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {viewData && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium text-gray-500">
                    Tiêu đề
                  </Label>
                  <div className="col-span-3 font-medium">{viewData.title}</div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right font-medium text-gray-500 mt-1">
                    Nội dung
                  </Label>
                  <div className="col-span-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                    {viewData.message}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium text-gray-500">
                    Loại
                  </Label>
                  <div className="col-span-3">
                    {getTypeBadge(viewData.type)}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium text-gray-500">
                    Thời gian
                  </Label>
                  <div className="col-span-3 text-sm text-gray-600">
                    {formatDateTime(viewData.createdAt)}
                  </div>
                </div>
                {viewData.link && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium text-gray-500">
                      Link
                    </Label>
                    <div className="col-span-3 text-sm text-blue-600 truncate">
                      {viewData.link}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
