"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getUserOrders, getOrderById, cancelOrder } from "@/features/order/orderAction";
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
import { Eye, Package, Truck, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Order } from "@/types/order";
import { ViewOrderModal } from "@/components/admin/OrderAdminPage/ViewOrderModel";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "shipped":
      return <Truck className="h-4 w-4 text-blue-600" />;
    case "processing":
      return <Package className="h-4 w-4 text-orange-600" />;
    case "confirmed":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Chờ xác nhận
        </Badge>
      );
    case "confirmed":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Đã xác nhận
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          Đang xử lý
        </Badge>
      );
    case "shipped":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Đang giao
        </Badge>
      );
    case "delivered":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Đã giao
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Đã hủy
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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const orderState = useAppSelector((state) => state.order);
  console.log('Order State:', orderState);
  console.log('All Orders:', orderState.allOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const orders: Order[] = orderState?.allOrders ?? [];
  const pagination = orderState?.Pagination;

  console.log(`Check order from order page`, orderState.allOrders, orderState.Pagination)

  // Fetch orders khi component mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        await dispatch(getUserOrders({
          page: 1,
          limit: 10,
        })).unwrap();
      } catch (error) {
        toast.error("Không thể tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dispatch]);

  const handleViewOrder = async (order: Order) => {
    try {
      const result = await dispatch(getOrderById(order._id)).unwrap();
      setSelectedOrder(result);
      setViewModalOpen(true);
    } catch (error) {
      toast.error("Không thể tải chi tiết đơn hàng");
    }
  };

  const handleCancelOrder = async (order: Order) => {
    if (order.status !== "pending" && order.status !== "confirmed") {
      toast.error("Chỉ có thể hủy đơn hàng ở trạng thái chờ xác nhận hoặc đã xác nhận");
      return;
    }

    if (confirm(`Bạn có chắc muốn hủy đơn hàng ${order.orderCode || order._id}?`)) {
      try {
        await dispatch(cancelOrder(order._id)).unwrap();
        toast.success("Hủy đơn hàng thành công");
        // Refresh danh sách
        dispatch(getUserOrders({
          page: pagination?.currentPage || 1,
          limit: pagination?.limit || 10,
        }));
      } catch (error) {
        toast.error("Hủy đơn hàng thất bại");
      }
    }
  };

  const handleContinueShopping = () => {
    router.push("/products");
  };

  const getTotalItems = (order: Order) => {
    return order.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const processingOrders = orders.filter(order =>
      order.status === "pending" || order.status === "confirmed" || order.status === "processing"
    ).length;
    const deliveredOrders = orders.filter(order => order.status === "delivered").length;
    const cancelledOrders = orders.filter(order => order.status === "cancelled").length;

    return { totalOrders, processingOrders, deliveredOrders, cancelledOrders };
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Đang tải đơn hàng...</div>
        </div>
      </div>
    );
  }

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Tất cả đơn hàng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processingOrders}</div>
            <p className="text-xs text-muted-foreground">Đơn hàng đang xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã giao</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveredOrders}</div>
            <p className="text-xs text-muted-foreground">
              Đơn hàng đã hoàn thành
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã hủy</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cancelledOrders}</div>
            <p className="text-xs text-muted-foreground">
              Đơn hàng đã hủy
            </p>
          </CardContent>
        </Card>
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
                <TableHead>Phương thức thanh toán</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">
                    {order.orderCode || order._id}
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{getTotalItems(order)} sản phẩm</TableCell>
                  <TableCell className="font-semibold">
                    {formatPrice(order.totalAmount || 0)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {order.paymentMethod === "cod" ? "COD" : "VNPay"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      {getStatusBadge(order.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Chi tiết
                      </Button>
                      {(order.status === "pending" || order.status === "confirmed") && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelOrder(order)}
                        >
                          Hủy
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Empty State */}
          {orders.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có đơn hàng
              </h3>
              <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
              <Button onClick={handleContinueShopping}>
                Tiếp tục mua sắm
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="text-gray-500">Đang tải đơn hàng...</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Order Modal */}
      <ViewOrderModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onCancel={handleCancelOrder}
      />
    </div>
  );
}

