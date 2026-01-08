"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import {
  cancelOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStatistics,
} from "@/features/order/orderAction";
import { getAllShops } from "@/features/shop/shopAction";
import { toast } from "sonner";
import { PaginationControls } from "@/components/common/Pagination";
import {
  Order,
  PaginationData,
  OrderStatistics,
  OrderFilters,
} from "@/types/order";
import { Shop } from "@/types/product";
import { OrdersHeader } from "@/components/admin/orders/OrdersHeader";
import { OrdersStats } from "@/components/admin/orders/OrderStats";
import { OrdersTable } from "@/components/admin/orders/OrderTable";
import { EditOrderModal } from "@/components/admin/orders/UpdateOrderModel";
import { ViewOrderModal } from "@/components/admin/orders/ViewOrderModel";
import { Button } from "@/components/ui/button";
import SpinnerLoading from "@/components/common/SpinnerLoading";

export default function OrdersAdminPage() {
  const dispatch = useAppDispatch();
  const orderState = useAppSelector((state) => state.order);
  const shopState = useAppSelector((state) => state.shop);

  // Get shops list for filter
  const shops: Shop[] = shopState.shops || [];

  // Use URL filters hook
  const { filters, updateFilter, updateFilters, resetFilters } =
    useUrlFilters<OrderFilters>({
      defaultFilters: {
        page: 1,
        limit: 10,
        search: "",
        status: "",
        paymentStatus: "",
        paymentMethod: "",
        userId: "",
        shop: "",
      },
      basePath: "/admin/orders",
    });

  // Extract filter values
  const currentPage = Number(filters.page);
  const pageSize = Number(filters.limit);
  const searchTerm = filters.search as string;
  const statusFilter = filters.status as string;
  const paymentStatusFilter = filters.paymentStatus as string;
  const paymentMethodFilter = filters.paymentMethod as string;
  const userIdFilter = filters.userId as string;
  const shopFilter = filters.shop as string;

  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);

  const orders: Order[] = orderState?.allOrders ?? [];
  const pagination: PaginationData | null = orderState?.pagination;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch orders khi URL params thay đổi
  useEffect(() => {
    const params: Record<string, string | number | boolean> = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchTerm) params.search = searchTerm;
    if (statusFilter && statusFilter !== "all") params.status = statusFilter;
    if (paymentStatusFilter) params.paymentStatus = paymentStatusFilter;
    if (paymentMethodFilter) params.paymentMethod = paymentMethodFilter;
    if (userIdFilter) params.userId = userIdFilter;
    if (shopFilter && shopFilter !== "all") params.shop = shopFilter;

    dispatch(getAllOrders(params));
  }, [
    dispatch,
    currentPage,
    pageSize,
    searchTerm,
    statusFilter,
    paymentStatusFilter,
    paymentMethodFilter,
    userIdFilter,
    shopFilter,
  ]);

  // Fetch shops for filter dropdown
  useEffect(() => {
    dispatch(getAllShops());
  }, [dispatch]);

  const refreshData = () => {
    const params: Record<string, string | number | boolean> = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchTerm) params.search = searchTerm;
    if (statusFilter && statusFilter !== "all") params.status = statusFilter;
    if (paymentStatusFilter) params.paymentStatus = paymentStatusFilter;
    if (paymentMethodFilter) params.paymentMethod = paymentMethodFilter;
    if (userIdFilter) params.userId = userIdFilter;
    if (shopFilter && shopFilter !== "all") params.shop = shopFilter;

    dispatch(getAllOrders(params));
  };

  // Fetch statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const result = await dispatch(getOrderStatistics({})).unwrap();
        setStatistics(result);
      } catch {
        toast.error("Failed to load order statistics");
      }
    };
    fetchStatistics();
  }, [dispatch]);

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
    if (
      selectedOrder.status === "cancelled" &&
      orderData.status !== "cancelled"
    ) {
      toast.error("Cannot change status of cancelled order");
      return;
    }

    // Validation: Không cho phép hủy đơn hàng đã giao
    if (
      selectedOrder.status === "delivered" &&
      orderData.status === "cancelled"
    ) {
      toast.error("Cannot cancel delivered order");
      return;
    }

    setIsUpdating(true);
    try {
      await dispatch(
        updateOrderStatus({
          orderId: selectedOrder._id,
          status: orderData.status as
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled",
        })
      ).unwrap();

      // Refresh danh sách
      refreshData();
      handleCloseEditModal();
      toast.success("Order status updated successfully");
    } catch {
      toast.error("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePageChange = (page: number) => {
    updateFilter("page", page);
  };

  const handlePageSizeChange = (size: number) => {
    updateFilters({ limit: size, page: 1 });
  };

  const handleSearch = (value: string) => {
    updateFilters({ search: value, page: 1 });
  };

  const handleStatusFilter = (status: string) => {
    updateFilters({ status: status, page: 1 });
  };

  const handlePaymentStatusFilter = (paymentStatus: string) => {
    updateFilters({ paymentStatus: paymentStatus, page: 1 });
  };

  const handlePaymentMethodFilter = (paymentMethod: string) => {
    updateFilters({ paymentMethod: paymentMethod, page: 1 });
  };

  const handleUserIdFilter = (userId: string) => {
    updateFilters({ userId: userId, page: 1 });
  };

  const handleShopFilter = (shop: string) => {
    updateFilters({ shop: shop === "all" ? "" : shop, page: 1 });
  };

  const handleCloseModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async (order: Order) => {
    if (confirm(`Are you sure you want to cancel order ${order._id}?`)) {
      try {
        await dispatch(cancelOrder(order._id)).unwrap();
        toast.success("Order cancelled successfully");
        // Refresh danh sách
        dispatch(
          getAllOrders({
            page: currentPage,
            limit: pageSize,
            ...(searchTerm && { search: searchTerm }),
            ...(statusFilter && {
              status: statusFilter as
                | "pending"
                | "confirmed"
                | "processing"
                | "shipped"
                | "delivered"
                | "cancelled",
            }),
            ...(paymentStatusFilter && {
              paymentStatus: paymentStatusFilter as
                | "unpaid"
                | "paid"
                | "refunded",
            }),
            ...(paymentMethodFilter && {
              paymentMethod: paymentMethodFilter as "cod" | "vnpay",
            }),
            ...(userIdFilter && { userId: userIdFilter }),
          })
        );
      } catch {
        toast.error("Failed to cancel order");
      }
    }
  };

  const handleViewOrder = async (order: Order) => {
    try {
      const result = await dispatch(getOrderById(order._id)).unwrap();
      setSelectedOrder(result);
      setViewModalOpen(true);
    } catch {
      toast.error("Failed to load order details");
    }
  };

  // Reset tất cả bộ lọc
  const handleResetFilters = () => {
    resetFilters();
  };

  // Thêm loading state rõ ràng
  if (orderState?.isLoading && orders.length === 0) {
    return (
      <div className="space-y-6">
        <OrdersHeader />
        <div className="flex items-center justify-center h-64 rounded-2xl bg-[#f7f7f7] dark:bg-[#1C1C1E]">
          <SpinnerLoading />
        </div>
      </div>
    );
  }

  if (orderState?.error) {
    return (
      <div className="space-y-6">
        <OrdersHeader />
        <div className="flex items-center justify-center h-64 rounded-2xl bg-[#f7f7f7] dark:bg-[#1C1C1E]">
          <div className="text-red-500 text-center">
            <div className="text-lg font-semibold mb-2">
              Error loading orders
            </div>
            <div>{orderState.error}</div>
            <Button onClick={() => window.location.reload()} className="mt-4 rounded-xl bg-[#E53935] hover:bg-[#D32F2F] text-white">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      {/* Header Section */}
      <OrdersHeader />

      {/* Stats Section */}
      {statistics && <OrdersStats {...statistics} />}

      {/* Main Content Area */}
      <div className="space-y-6">
        <OrdersTable
            orders={orders}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            paymentStatusFilter={paymentStatusFilter}
            paymentMethodFilter={paymentMethodFilter}
            userIdFilter={userIdFilter}
            pageSize={pageSize}
            isLoading={orderState.isLoading}
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
            onShopFilterChange={handleShopFilter}
            selectedShop={shopFilter || "all"}
            shops={shops}
          />
          
          <div className="flex justify-center">
             <PaginationControls
              pagination={pagination}
              onPageChange={handlePageChange}
              itemName="orders"
             />
          </div>

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
      </div>
    </div>
  );
}
