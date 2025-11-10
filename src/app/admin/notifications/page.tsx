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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  Bell,
  Send,
  Plus,
  Filter,
  Users,
  Mail,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for notifications
const mockNotifications = [
  {
    id: "1",
    title: "Đơn hàng mới #ORD-001",
    message: "Bạn có đơn hàng mới từ Nguyễn Văn A",
    type: "order",
    priority: "high",
    status: "sent",
    recipients: "all_customers",
    sentAt: "2024-01-15 14:30:00",
    createdBy: "Admin System",
  },
  {
    id: "2",
    title: "Khuyến mãi cuối tuần",
    message: "Giảm giá 20% cho tất cả sản phẩm điện tử",
    type: "promotion",
    priority: "medium",
    status: "scheduled",
    recipients: "subscribed_users",
    sentAt: "2024-01-16 09:00:00",
    createdBy: "Marketing Team",
  },
  {
    id: "3",
    title: "Bảo trì hệ thống",
    message: "Hệ thống sẽ bảo trì từ 2:00 - 4:00 sáng mai",
    type: "system",
    priority: "high",
    status: "sent",
    recipients: "all_users",
    sentAt: "2024-01-14 20:15:00",
    createdBy: "Tech Team",
  },
  {
    id: "4",
    title: "Chào mừng thành viên mới",
    message: "Cảm ơn bạn đã đăng ký tài khoản!",
    type: "welcome",
    priority: "low",
    status: "draft",
    recipients: "new_users",
    sentAt: "-",
    createdBy: "Admin System",
  },
  {
    id: "5",
    title: "Cập nhật chính sách bảo mật",
    message: "Chúng tôi đã cập nhật điều khoản sử dụng",
    type: "announcement",
    priority: "medium",
    status: "sent",
    recipients: "all_users",
    sentAt: "2024-01-13 10:00:00",
    createdBy: "Admin System",
  },
];

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
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">Cao</Badge>;
    case "medium":
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
          Trung bình
        </Badge>
      );
    case "low":
      return <Badge variant="outline">Thấp</Badge>;
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "sent":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Đã gửi
        </Badge>
      );
    case "scheduled":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Clock className="h-3 w-3 mr-1" />
          Đã lên lịch
        </Badge>
      );
    case "draft":
      return <Badge variant="outline">Bản nháp</Badge>;
    case "failed":
      return <Badge variant="destructive">Thất bại</Badge>;
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

const getRecipientsLabel = (recipients: string) => {
  switch (recipients) {
    case "all_users":
      return "Tất cả người dùng";
    case "all_customers":
      return "Tất cả khách hàng";
    case "subscribed_users":
      return "Người dùng đã đăng ký";
    case "new_users":
      return "Thành viên mới";
    case "specific_group":
      return "Nhóm cụ thể";
    default:
      return "Không xác định";
  }
};

const formatDateTime = (dateTime: string) => {
  if (dateTime === "-") return "-";
  return new Date(dateTime).toLocaleString("vi-VN");
};

export default function NotificationAdminPage() {
  return (
    <div className="space-y-6">
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tạo thông báo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng thông báo
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              +24 so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã gửi</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,156</div>
            <p className="text-xs text-muted-foreground">
              Thông báo thành công
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang chờ</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Đã lên lịch gửi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ mở</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.5%</div>
            <p className="text-xs text-muted-foreground">
              +5.2% so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Notification Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Tạo thông báo mới</CardTitle>
            <CardDescription>
              Gửi thông báo đến người dùng của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input id="title" placeholder="Nhập tiêu đề thông báo" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Nội dung</Label>
              <Textarea
                id="message"
                placeholder="Nhập nội dung thông báo"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Loại thông báo</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại thông báo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order">Đơn hàng</SelectItem>
                  <SelectItem value="promotion">Khuyến mãi</SelectItem>
                  <SelectItem value="system">Hệ thống</SelectItem>
                  <SelectItem value="announcement">Thông báo</SelectItem>
                  <SelectItem value="welcome">Chào mừng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipients">Người nhận</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhóm người nhận" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_users">Tất cả người dùng</SelectItem>
                  <SelectItem value="all_customers">
                    Tất cả khách hàng
                  </SelectItem>
                  <SelectItem value="subscribed_users">
                    Người dùng đã đăng ký
                  </SelectItem>
                  <SelectItem value="new_users">Thành viên mới</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Mức độ ưu tiên</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức độ ưu tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="schedule" />
              <Label htmlFor="schedule">Lên lịch gửi</Label>
            </div>

            <Button className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Gửi thông báo
            </Button>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Lịch sử thông báo</CardTitle>
                <CardDescription>
                  Danh sách các thông báo đã gửi và đang chờ
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Tìm kiếm thông báo..."
                    className="pl-9 w-[200px]"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
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
                  <TableHead>Người nhận</TableHead>
                  <TableHead>Ưu tiên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockNotifications.map((notification) => (
                  <TableRow key={notification.id}>
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
                      <span className="text-sm">
                        {getRecipientsLabel(notification.recipients)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(notification.priority)}
                    </TableCell>
                    <TableCell>{getStatusBadge(notification.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDateTime(notification.sentAt)}</div>
                        <div className="text-gray-500 text-xs">
                          bởi {notification.createdBy}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Gửi lại
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa thông báo
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Hiển thị 1 đến 5 của 124 thông báo
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Trước
                </Button>
                <Button variant="outline" size="sm" className="bg-gray-100">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Sau
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
