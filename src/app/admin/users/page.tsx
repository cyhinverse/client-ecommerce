import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StatsCard from "@/components/admin/StatsCard";
import SearchFilterBar from "@/components/admin/SearchFilterBar";
import DataTable from "@/components/admin/DataTable";
import {
  UserPlus,
  Users,
  UserCheck,
  UserX,
  Shield,
  Eye,
  Edit,
  Mail,
  Trash2,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatPrice, getInitials } from "@/components/admin/utils";

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    avatar: "/avatars/01.png",
    role: "customer",
    status: "active",
    orders: 12,
    totalSpent: 12500000,
    joinedDate: "2023-12-15",
    lastLogin: "2024-01-15",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@email.com",
    avatar: "/avatars/02.png",
    role: "customer",
    status: "active",
    orders: 8,
    totalSpent: 8500000,
    joinedDate: "2024-01-05",
    lastLogin: "2024-01-15",
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@email.com",
    avatar: "/avatars/03.png",
    role: "admin",
    status: "active",
    orders: 0,
    totalSpent: 0,
    joinedDate: "2023-11-20",
    lastLogin: "2024-01-15",
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "phamthid@email.com",
    avatar: "/avatars/04.png",
    role: "customer",
    status: "inactive",
    orders: 3,
    totalSpent: 4500000,
    joinedDate: "2024-01-10",
    lastLogin: "2024-01-12",
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    email: "hoangvane@email.com",
    avatar: "/avatars/05.png",
    role: "customer",
    status: "active",
    orders: 15,
    totalSpent: 18900000,
    joinedDate: "2023-12-28",
    lastLogin: "2024-01-14",
  },
];

export default function UsersAdminPage() {
  const stats = [
    {
      title: "Tổng người dùng",
      value: "1,248",
      description: "+24 so với tháng trước",
      icon: Users,
    },
    {
      title: "Đang hoạt động",
      value: "1,156",
      description: "Người dùng tích cực",
      icon: UserCheck,
    },
    {
      title: "Không hoạt động",
      value: "92",
      description: "Người dùng không hoạt động",
      icon: UserX,
    },
    {
      title: "Quản trị viên",
      value: "8",
      description: "Người dùng có quyền admin",
      icon: Shield,
    },
  ];

  const roleStats = [
    { title: "Khách hàng", value: "1,240", description: "99.4% tổng số người dùng", icon: Users },
    { title: "Quản trị viên", value: "8", description: "0.6% tổng số người dùng", icon: Shield },
    { title: "Tỷ lệ hoạt động", value: "92.7%", description: "1,156/1,248 người dùng", icon: UserCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <SearchFilterBar
        title="Quản lý người dùng"
        description="Quản lý tất cả người dùng và phân quyền trong hệ thống"
        actionButton={{
          label: "Thêm người dùng",
          icon: <UserPlus className="h-4 w-4 mr-2" />,
          onClick: () => {}
        }}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Users Table */}
      <DataTable
        title="Danh sách người dùng"
        description="Quản lý thông tin và phân quyền người dùng"
        columns={[
          { 
            key: "name", 
            title: "Người dùng",
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {getInitials(item.name)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.email}</p>
                </div>
              </div>
            )
          },
          { 
            key: "role", 
            title: "Vai trò",
            render: (item) => <StatusBadge status={item.role} type="role" />
          },
          { 
            key: "orders", 
            title: "Đơn hàng",
            render: (item) => <span className="font-medium">{item.orders}</span>
          },
          { 
            key: "totalSpent", 
            title: "Tổng chi tiêu",
            render: (item) => <span className="font-semibold">{formatPrice(item.totalSpent)}</span>
          },
          { 
            key: "status", 
            title: "Trạng thái",
            render: (item) => <StatusBadge status={item.status} type="user" />
          },
          { key: "joinedDate", title: "Ngày tham gia" },
          { key: "lastLogin", title: "Lần đăng nhập cuối" }
        ]}
        data={mockUsers}
        actions={[
          {
            label: "Xem chi tiết",
            icon: <Eye className="h-4 w-4 mr-2" />,
            onClick: () => {}
          },
          {
            label: "Chỉnh sửa",
            icon: <Edit className="h-4 w-4 mr-2" />,
            onClick: () => {}
          },
          {
            label: "Gửi email",
            icon: <Mail className="h-4 w-4 mr-2" />,
            onClick: () => {}
          },
          {
            label: "Xóa người dùng",
            icon: <Trash2 className="h-4 w-4 mr-2" />,
            onClick: () => {},
            variant: "destructive"
          }
        ]}
        enableExport={true}
        pagination={{
          totalItems: 1248,
          currentPage: 1,
          totalPages: 25
        }}
      />

      {/* User Roles Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {roleStats.map((stat, index) => (
          <Card key={index}>
            <div className="p-4">
              <div className="pb-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <stat.icon className="h-4 w-4" />
                  {stat.title}
                </h3>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}