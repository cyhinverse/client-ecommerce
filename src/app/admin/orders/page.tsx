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

  const orders: Order[] = orderState?.orders ?? [];
  const pagination: PaginationData | null = orderState?.pagination;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

  // Hàm lưu thay đổi trạng thái
  const handleSaveOrder = async (orderData: { status: string }) => {
    if (!selectedOrder) return;

    setIsUpdating(true);
    try {
      await dispatch(
        updateOrderStatus({
          orderId: selectedOrder._id,
          status: orderData.status as "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
        })
      ).unwrap();

      // Refresh danh sách sau khi update
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

  // Fetch orders khi URL params thay đổi
  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: pageSize
    };

    if (searchTerm) params.search = searchTerm;
    if (statusFilter) params.status = statusFilter;
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
        console.error("Failed to fetch statistics:", error);
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

  if (orderState?.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Lỗi: {orderState.error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrdersHeader />

      {statistics && (
        <OrdersStats
          totalOrders={statistics.totalOrders}
          pendingOrders={statistics.pendingOrders}
          processingOrders={statistics.processingOrders}
          confirmedOrders={statistics.confirmedOrders}
          shippedOrders={statistics.shippedOrders}
          deliveredOrders={statistics.deliveredOrders}
          cancelledOrders={statistics.cancelledOrders}
          totalRevenue={statistics.totalRevenue}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>Quản lý tất cả đơn hàng trong hệ thống</CardDescription>
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
