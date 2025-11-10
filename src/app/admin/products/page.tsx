import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StatsCard from "@/components/admin/StatsCard";
import SearchFilterBar from "@/components/admin/SearchFilterBar";
import DataTable from "@/components/admin/DataTable";
import { Plus, Edit, Trash2, Eye, Package } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatPrice } from "@/components/admin/utils";

// Mock data for products
const mockProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    category: "Điện thoại",
    price: 29990000,
    stock: 45,
    status: "active",
    sales: 234,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    category: "Điện thoại",
    price: 27990000,
    stock: 32,
    status: "active",
    sales: 189,
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    name: "MacBook Air M3",
    category: "Laptop",
    price: 25990000,
    stock: 0,
    status: "out_of_stock",
    sales: 156,
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    name: "AirPods Pro 2",
    category: "Phụ kiện",
    price: 5990000,
    stock: 78,
    status: "active",
    sales: 298,
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    name: "iPad Pro 12.9",
    category: "Tablet",
    price: 32990000,
    stock: 15,
    status: "active",
    sales: 89,
    createdAt: "2024-01-11",
  },
];

export default function ProductAdminPage() {
  const stats = [
    {
      title: "Tổng sản phẩm",
      value: "124",
      description: "+12 so với tháng trước",
      icon: Package,
    },
    {
      title: "Đang bán",
      value: "98",
      description: "Sản phẩm đang kinh doanh",
      icon: Package,
    },
    {
      title: "Hết hàng",
      value: "8",
      description: "Cần nhập thêm",
      icon: Package,
    },
    {
      title: "Tồn kho TB",
      value: "42",
      description: "Số lượng trung bình",
      icon: Package,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <SearchFilterBar
        title="Quản lý sản phẩm"
        description="Quản lý danh sách sản phẩm và tồn kho"
        actionButton={{
          label: "Thêm sản phẩm",
          icon: <Plus className="h-4 w-4 mr-2" />,
          onClick: () => {},
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

      {/* Products Table */}
      <DataTable
        title="Danh sách sản phẩm"
        description="Quản lý và chỉnh sửa thông tin sản phẩm"
        columns={[
          { key: "name", title: "Sản phẩm" },
          { key: "category", title: "Danh mục" },
          {
            key: "price",
            title: "Giá",
            render: (item: any) => (
              <span className="font-semibold">{formatPrice(item.price)}</span>
            ),
          },
          {
            key: "stock",
            title: "Tồn kho",
            render: (item: any) => (
              <span
                className={
                  item.stock === 0
                    ? "text-red-600 font-medium"
                    : "text-gray-900"
                }
              >
                {item.stock}
              </span>
            ),
          },
          { key: "sales", title: "Đã bán" },
          {
            key: "status",
            title: "Trạng thái",
            render: (item: any) => (
              <StatusBadge status={item.status} type="product" />
            ),
          },
          { key: "createdAt", title: "Ngày tạo" },
        ]}
        data={mockProducts}
        actions={[
          {
            label: "Xem chi tiết",
            icon: <Eye className="h-4 w-4 mr-2" />,
            onClick: () => {},
          },
          {
            label: "Chỉnh sửa",
            icon: <Edit className="h-4 w-4 mr-2" />,
            onClick: () => {},
          },
          {
            label: "Xóa",
            icon: <Trash2 className="h-4 w-4 mr-2" />,
            onClick: () => {},
            variant: "destructive",
          },
        ]}
        enableExport={true}
        pagination={{
          totalItems: 124,
          currentPage: 1,
          totalPages: 25,
        }}
      />
    </div>
  );
}
