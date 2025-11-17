"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  cancelOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStatistics,
} from "@/features/order/orderAction";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { PaginationControls } from "@/components/admin/CategoriesAdminPage/PaginationContro";
import { Order, PaginationData } from "@/types/order";
import { OrdersHeader } from "@/components/admin/OrderAdminPage/OrdersHeader";
import { OrdersStats } from "@/components/admin/OrderAdminPage/OrderStats";
import { OrdersTable } from "@/components/admin/OrderAdminPage/OrderTable";
import { EditOrderModal } from "@/components/admin/OrderAdminPage/UpdateOrderModel"
import { ViewOrderModal } from "@/components/admin/OrderAdminPage/ViewOrderModel"
import { Button } from "@/components/ui/button";

interface OrderStatistics {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

export default function OrdersAdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const orderState = useAppSelector((state) => state.order);

  // Lấy params từ URL
  const urlPage = parseInt(searchParams.get("page") || "1");
  const urlLimit = parseInt(searchParams.get("limit") || "10");
  const urlSearch = searchParams.get("search") || "";
  const urlStatus = searchParams.get("status") || "";
  const urlPaymentStatus = searchParams.get("paymentStatus") || "";
  const urlPaymentMethod = searchParams.get("paymentMethod") || "";
  const urlUserId = searchParams.get("userId") || "";

  const [currentPage, setCurrentPage] = useState(urlPage);
  const [pageSize, setPageSize] = useState(urlLimit);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [statusFilter, setStatusFilter] = useState(urlStatus);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(urlPaymentStatus);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState(urlPaymentMethod);
  const [userIdFilter, setUserIdFilter] = useState(urlUserId);
  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);

  const orders: Order[] = orderState?.allOrders ?? [];
  const pagination: PaginationData | null = orderState?.pagination;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch orders khi URL params thay đổi
 // Trong OrdersAdminPage, sửa phần fetch orders
useEffect(() => {
  const params: any = {
    page: currentPage,
    limit: pageSize
  };

  if (searchTerm) params.search = searchTerm;
  if (statusFilter && statusFilter !== 'all') params.status = statusFilter; // CHỈ gửi khi không phải 'all'
  if (paymentStatusFilter) params.paymentStatus = paymentStatusFilter;
  if (paymentMethodFilter) params.paymentMethod = paymentMethodFilter;
  if (userIdFilter) params.userId = userIdFilter;

  dispatch(getAllOrders(params));
}, [dispatch, currentPage, pageSize, searchTerm, statusFilter, paymentStatusFilter, paymentMethodFilter, userIdFilter]);

  // Fetch statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const result = await dispatch(getOrderStatistics()).unwrap();
        setStatistics(result);
      } catch (error) {
        toast.error("Không thể tải thống kê đơn hàng");
      }
    };
    fetchStatistics();
  }, [dispatch]);

  // Đồng bộ state với URL params
  useEffect(() => {
    setCurrentPage(urlPage);
    setPageSize(urlLimit);
    setSearchTerm(urlSearch);
    setStatusFilter(urlStatus);
    setPaymentStatusFilter(urlPaymentStatus);
    setPaymentMethodFilter(urlPaymentMethod);
    setUserIdFilter(urlUserId);
  }, [urlPage, urlLimit, urlSearch, urlStatus, urlPaymentStatus, urlPaymentMethod, urlUserId]);

  // Hàm mở modal chỉnh sửa
  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  const handleEditFromView = (order: Order) => {
    setSelectedOrder(order);
    setViewModalOpen(false);
    setEditModalOpen(true);
  };

  // Hàm đóng modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedOrder(null);
    setIsUpdating(false);
  };

// Trong hàm handleSaveOrder hoặc component EditOrderModal
const handleSaveOrder = async (orderData: { status: string }) => {
  if (!selectedOrder) return;

  // Validation: Không cho phép chuyển từ cancelled sang trạng thái khác
  if (selectedOrder.status === 'cancelled' && orderData.status !== 'cancelled') {
    toast.error("Không thể thay đổi trạng thái đơn hàng đã hủy");
    return;
  }

  // Validation: Không cho phép hủy đơn hàng đã giao
  if (selectedOrder.status === 'delivered' && orderData.status === 'cancelled') {
    toast.error("Không thể hủy đơn hàng đã giao");
    return;
  }

  setIsUpdating(true);
  try {
    await dispatch(
      updateOrderStatus({
        orderId: selectedOrder._id,
        status: orderData.status as "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
      })
    ).unwrap();

    // Refresh danh sách
    dispatch(getAllOrders({/* params */}));
    handleCloseEditModal();
    toast.success("Cập nhật trạng thái đơn hàng thành công");
  } catch (error) {
    toast.error("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
  } finally {
    setIsUpdating(false);
  }
};

  // Hàm cập nhật URL
  const updateURL = (
    page: number,
    limit: number,
    search: string,
    status: string,
    paymentStatus: string,
    paymentMethod: string,
    userId: string
  ) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (paymentStatus) params.set("paymentStatus", paymentStatus);
    if (paymentMethod) params.set("paymentMethod", paymentMethod);
    if (userId) params.set("userId", userId);

    router.push(`/admin/orders?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, pageSize, searchTerm, statusFilter, paymentStatusFilter, paymentMethodFilter, userIdFilter);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    updateURL(1, size, searchTerm, statusFilter, paymentStatusFilter, paymentMethodFilter, userIdFilter);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateURL(1, pageSize, value, statusFilter, paymentStatusFilter, paymentMethodFilter, userIdFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    updateURL(1, pageSize, searchTerm, status, paymentStatusFilter, paymentMethodFilter, userIdFilter);
  };

  const handlePaymentStatusFilter = (paymentStatus: string) => {
    setPaymentStatusFilter(paymentStatus);
    setCurrentPage(1);
    updateURL(1, pageSize, searchTerm, statusFilter, paymentStatus, paymentMethodFilter, userIdFilter);
  };

  const handlePaymentMethodFilter = (paymentMethod: string) => {
    setPaymentMethodFilter(paymentMethod);
    setCurrentPage(1);
    updateURL(1, pageSize, searchTerm, statusFilter, paymentStatusFilter, paymentMethod, userIdFilter);
  };

  const handleUserIdFilter = (userId: string) => {
    setUserIdFilter(userId);
    setCurrentPage(1);
    updateURL(1, pageSize, searchTerm, statusFilter, paymentStatusFilter, paymentMethodFilter, userId);
  };

  const handleCloseModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async (order: Order) => {
    if (confirm(`Bạn có chắc muốn hủy đơn hàng ${order._id}?`)) {
      try {
        await dispatch(cancelOrder(order._id)).unwrap();
        toast.success("Hủy đơn hàng thành công");
        // Refresh danh sách
        dispatch(
          getAllOrders({
            page: currentPage,
            limit: pageSize,
            ...(searchTerm && { search: searchTerm }),
            ...(statusFilter && { status: statusFilter as "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" }),
            ...(paymentStatusFilter && { paymentStatus: paymentStatusFilter as "unpaid" | "paid" | "refunded" }),
            ...(paymentMethodFilter && { paymentMethod: paymentMethodFilter as "cod" | "vnpay" }),
            ...(userIdFilter && { userId: userIdFilter }),
          })
        );
      } catch (error) {
        toast.error("Hủy đơn hàng thất bại");
      }
    }
  };

  const handleViewOrder = async (order: Order) => {
    try {
      const result = await dispatch(getOrderById(order._id)).unwrap();
      setSelectedOrder(result);
      setViewModalOpen(true);
    } catch (error) {
      toast.error("Không thể tải chi tiết đơn hàng");
    }
  };

  // Reset tất cả bộ lọc
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPaymentStatusFilter("");
    setPaymentMethodFilter("");
    setUserIdFilter("");
    setCurrentPage(1);
    updateURL(1, pageSize, "", "", "", "", "");
  };

  // Thêm loading state rõ ràng
  if (orderState?.isLoading && orders.length === 0) {
    return (
      <div className="space-y-6">
        <OrdersHeader />
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <div className="text-gray-600">Đang tải đơn hàng...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orderState?.error) {
    return (
      <div className="space-y-6">
        <OrdersHeader />
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-red-500 text-center">
              <div className="text-lg font-semibold mb-2">Lỗi khi tải đơn hàng</div>
              <div>{orderState.error}</div>
              <Button
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrdersHeader />

      {statistics && (
        <OrdersStats {...statistics} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>
            Quản lý tất cả đơn hàng trong hệ thống
            {orderState?.isLoading && " - Đang tải..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
        <OrdersTable
          orders={orders}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          paymentStatusFilter={paymentStatusFilter} 
          paymentMethodFilter={paymentMethodFilter}
          userIdFilter={userIdFilter}
          pageSize={pageSize}
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
          onPaymentStatusFilter={handlePaymentStatusFilter} 
          onPaymentMethodFilter={handlePaymentMethodFilter}
          onUserIdFilter={handleUserIdFilter}
          onResetFilters={handleResetFilters}
          onPageSizeChange={handlePageSizeChange}
          onEdit={handleEditOrder}
          onDelete={handleDeleteOrder}
          onView={handleViewOrder}
        />

          <ViewOrderModal
            isOpen={viewModalOpen}
            onClose={handleCloseModals}
            onEdit={handleEditFromView}
            order={selectedOrder}
          />

          <EditOrderModal
            isOpen={editModalOpen}
            onClose={handleCloseEditModal}
            onSave={handleSaveOrder}
            order={selectedOrder}
            isLoading={isUpdating}
          />

          <PaginationControls
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}