import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Package, Truck, CheckCircle, Clock } from "lucide-react";

// Mock data for orders
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    items: 3,
    total: 1250000,
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-002",
    date: "2024-01-14",
    status: "shipped",
    items: 2,
    total: 850000,
    trackingNumber: "TRK123456788",
  },
  {
    id: "ORD-003",
    date: "2024-01-13",
    status: "processing",
    items: 1,
    total: 450000,
    trackingNumber: null,
  },
  {
    id: "ORD-004",
    date: "2024-01-12",
    status: "delivered",
    items: 4,
    total: 2100000,
    trackingNumber: "TRK123456787",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "shipped":
      return <Truck className="h-4 w-4 text-blue-600" />;
    case "processing":
      return <Package className="h-4 w-4 text-orange-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "delivered":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Đã giao
        </Badge>
      );
    case "shipped":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Đang giao
        </Badge>
      );
    case "processing":
      return (
        <Badge
          variant="outline"
          className="bg-orange-50 text-orange-700 border-orange-200"
        >
          Đang xử lý
        </Badge>
      );
    default:
      return <Badge variant="outline">Chờ xác nhận</Badge>;
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("vi-VN");
};

export default function OrdersPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Đơn hàng của tôi
        </h1>
        <p className="text-gray-600 mt-2">
          Quản lý và theo dõi đơn hàng của bạn
        </p>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử đơn hàng</CardTitle>
          <CardDescription>
            Tất cả đơn hàng của bạn sẽ được hiển thị tại đây
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Số sản phẩm</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>{order.items} sản phẩm</TableCell>
                  <TableCell className="font-semibold">
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      {getStatusBadge(order.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Empty State (if needed) */}
          {mockOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có đơn hàng
              </h3>
              <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
              <Button>Tiếp tục mua sắm</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOrders.length}</div>
            <p className="text-xs text-muted-foreground">Tất cả đơn hàng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockOrders.filter((order) => order.status === "processing")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Đơn hàng chờ xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã giao</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockOrders.filter((order) => order.status === "delivered")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Đơn hàng đã hoàn thành
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
