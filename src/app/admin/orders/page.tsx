"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  deleteOrder,
  getListOrders,
  getOrderById,
  changeOrderStatus,
  getOrderStatistics,
} from "@/features/order/orderAction";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { EditOrderModal } from "@/components/admin/OrdersAdminPage/UpdateOrderModel";
// import { ViewOrderModal } from "@/components/admin/OrdersAdminPage/ViewModal";
import { toast } from "sonner";
import { PaginationControls } from "@/components/admin/CategoriesAdminPage/PaginationContro";
import { Order, PaginationData } from "@/types/order";
import { OrdersHeader } from "@/components/admin/OrderAdminPage/OrdersHeader";
import { OrdersStats } from "@/components/admin/OrderAdminPage/OrderStats";
import { OrdersTable } from "@/components/admin/OrderAdminPage/OrderTable";
import {EditOrderModal} from "@/components/admin/OrderAdminPage/UpdateOrderModel"
import {ViewOrderModal} from "@/components/admin/OrderAdminPage/ViewOrderModel"

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

  const [currentPage, setCurrentPage] = useState(urlPage);
  const [pageSize, setPageSize] = useState(urlLimit);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [statusFilter, setStatusFilter] = useState(urlStatus);
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
        changeOrderStatus({
          orderId: selectedOrder._id,
          status: orderData.status,
        })
      ).unwrap();

      // Refresh danh sách sau khi update
      dispatch(
        getListOrders({
          page: currentPage,
          limit: pageSize,
          search: searchTerm,
          status: statusFilter,
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
  const updateURL = (page: number, limit: number, search: string, status: string) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (search) params.set("search", search);
    if (status) params.set("status", status);

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

    dispatch(getListOrders(params));
  }, [dispatch, currentPage, pageSize, searchTerm, statusFilter]);

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

  useEffect(() => {
    setCurrentPage(urlPage);
    setPageSize(urlLimit);
    setSearchTerm(urlSearch);
    setStatusFilter(urlStatus);
  }, [urlPage, urlLimit, urlSearch, urlStatus]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, pageSize, searchTerm, statusFilter);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    updateURL(1, size, searchTerm, statusFilter);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateURL(1, pageSize, value, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    updateURL(1, pageSize, searchTerm, status);
  };

  const handleCloseModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async (order: Order) => {
    if (confirm(`Bạn có chắc muốn xóa đơn hàng ${order._id}?`)) {
      try {
        await dispatch(deleteOrder(order._id)).unwrap();
        toast.success("Xóa đơn hàng thành công");
        // Refresh danh sách
        dispatch(
          getListOrders({
            page: currentPage,
            limit: pageSize,
            search: searchTerm,
            status: statusFilter,
          })
        );
      } catch (error) {
        toast.error("Xóa đơn hàng thất bại");
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
            pageSize={pageSize}
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
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