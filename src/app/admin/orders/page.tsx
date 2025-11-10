import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StatsCard from "@/components/admin/StatsCard";
import SearchFilterBar from "@/components/admin/SearchFilterBar";
import DataTable from "@/components/admin/DataTable";
import {
  Download,
  ShoppingCart,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Edit,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatPrice } from "@/components/admin/utils";

// Mock data for orders
const mockOrders = [
  {
    id: "ORD-001",
    customer: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    amount: 1250000,
    status: "delivered",
    payment: "paid",
    items: 3,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16",
  },
  {
    id: "ORD-002",
    customer: "Trần Thị B",
    email: "tranthib@email.com",
    amount: 850000,
    status: "shipped",
    payment: "paid",
    items: 2,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: "Lê Văn C",
    email: "levanc@email.com",
    amount: 2100000,
    status: "processing",
    payment: "pending",
    items: 4,
    createdAt: "2024-01-14",
    updatedAt: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "Phạm Thị D",
    email: "phamthid@email.com",
    amount: 450000,
    status: "cancelled",
    payment: "failed",
    items: 1,
    createdAt: "2024-01-14",
    updatedAt: "2024-01-14",
  },
  {
    id: "ORD-005",
    customer: "Hoàng Văn E",
    email: "hoangvane@email.com",
    amount: 1890000,
    status: "pending",
    payment: "pending",
    items: 2,
    createdAt: "2024-01-13",
    updatedAt: "2024-01-13",
  },
];

export default function OrdersAdminPage() {
  const stats = [
    {
      title: "Tổng đơn hàng",
      value: "1,248",
      description: "+24 so với tháng trước",
      icon: ShoppingCart,
    },
    {
      title: "Đang xử lý",
      value: "18",
      description: "Cần xác nhận",
      icon: Clock,
    },
    {
      title: "Đang giao",
      value: "42",
      description: "Đang vận chuyển",
      icon: Truck,
    },
    {
      title: "Doanh thu",
      value: "45.2M",
      description: "+12.5% so với tháng trước",
      icon: CheckCircle,
    },
  ];

  const quickStats = [
    { title: "Chờ xác nhận", value: "18", icon: Clock, color: "text-orange-600" },
    { title: "Đang xử lý", value: "24", icon: Clock, color: "text-blue-600" },
    { title: "Đang giao", value: "42", icon: Truck, color: "text-purple-600" },
    { title: "Thành công", value: "1,164", icon: CheckCircle, color: "text-green-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <SearchFilterBar
        title="Quản lý đơn hàng"
        description="Theo dõi và quản lý tất cả đơn hàng của khách hàng"
        actionButton={{
          label: "Export",
          icon: <Download className="h-4 w-4 mr-2" />,
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

      {/* Orders Table */}
      <DataTable
        title="Danh sách đơn hàng"
        description="Quản lý và cập nhật trạng thái đơn hàng"
        columns={[
          { key: "id", title: "Mã đơn", className: "font-medium" },
          { 
            key: "customer", 
            title: "Khách hàng",
            render: (item) => (
              <div>
                <p className="font-medium">{item.customer}</p>
                <p className="text-sm text-gray-600">{item.email}</p>
              </div>
            )
          },
          { 
            key: "items", 
            title: "Số lượng",
            render: (item) => `${item.items} sản phẩm`
          },
          { 
            key: "amount", 
            title: "Tổng tiền",
            render: (item) => <span className="font-semibold">{formatPrice(item.amount)}</span>
          },
          { 
            key: "payment", 
            title: "Thanh toán",
            render: (item) => <StatusBadge status={item.payment} type="order" />
          },
          { 
            key: "status", 
            title: "Trạng thái",
            render: (item) => <StatusBadge status={item.status} type="order" />
          },
          { key: "createdAt", title: "Ngày đặt" }
        ]}
        data={mockOrders}
        actions={[
          {
            label: "Xem chi tiết",
            icon: <Eye className="h-4 w-4 mr-2" />,
            onClick: () => {}
          },
          {
            label: "Cập nhật vận chuyển",
            icon: <Truck className="h-4 w-4 mr-2" />,
            onClick: () => {}
          },
          {
            label: "Xác nhận đơn",
            icon: <CheckCircle className="h-4 w-4 mr-2" />,
            onClick: () => {}
          },
          {
            label: "Hủy đơn hàng",
            icon: <XCircle className="h-4 w-4 mr-2" />,
            onClick: () => {},
            variant: "destructive"
          }
        ]}
        pagination={{
          totalItems: 1248,
          currentPage: 1,
          totalPages: 25
        }}
      />

      {/* Quick Status Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color.replace('text-', 'text-')}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}