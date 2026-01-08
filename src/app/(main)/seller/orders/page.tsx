"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { 
  ShoppingCart, Search, Filter, Eye, Loader2, MoreHorizontal,
  Clock, Package, Truck, CheckCircle2, XCircle, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { getSellerOrders, updateSellerOrderStatus } from "@/features/order/orderAction";
import { Order } from "@/types/order";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: "Chờ xác nhận", color: "text-yellow-600", bg: "bg-yellow-50", icon: Clock },
  confirmed: { label: "Đã xác nhận", color: "text-blue-600", bg: "bg-blue-50", icon: CheckCircle2 },
  processing: { label: "Đang xử lý", color: "text-indigo-600", bg: "bg-indigo-50", icon: Package },
  shipped: { label: "Đang giao", color: "text-purple-600", bg: "bg-purple-50", icon: Truck },
  delivered: { label: "Hoàn thành", color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 },
  cancelled: { label: "Đã hủy", color: "text-red-600", bg: "bg-red-50", icon: XCircle },
};

// Allowed status transitions for seller
const allowedTransitions: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SellerOrdersPage() {
  const dispatch = useAppDispatch();
  const { myShop } = useAppSelector((state) => state.shop);
  const { shopOrders, shopOrdersPagination, isLoadingShopOrders, isUpdating } = useAppSelector((state) => state.order);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateStatusModalOpen, setUpdateStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const fetchOrders = () => {
    dispatch(getSellerOrders({
      page,
      limit,
      status: statusFilter !== "all" ? statusFilter : undefined,
    }));
  };

  const handleSearch = () => {
    setPage(1);
    fetchOrders();
  };

  const handleOpenViewModal = (order: Order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const handleOpenUpdateStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus("");
    setUpdateStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    try {
      await dispatch(updateSellerOrderStatus({
        orderId: selectedOrder._id,
        status: newStatus as "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
      })).unwrap();
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      setUpdateStatusModalOpen(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (error: unknown) {
      const err = error as string | { message?: string };
      const message = typeof err === 'string' ? err : err.message;
      toast.error(message || "Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const getAvailableStatuses = (currentStatus: string) => {
    return allowedTransitions[currentStatus] || [];
  };

  const statusTabs = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "confirmed", label: "Đã xác nhận" },
    { key: "processing", label: "Đang xử lý" },
    { key: "shipped", label: "Đang giao" },
    { key: "delivered", label: "Hoàn thành" },
    { key: "cancelled", label: "Đã hủy" },
  ];

  const orders = shopOrders;
  const total = shopOrdersPagination?.totalItems || 0;
  const totalPages = shopOrdersPagination?.totalPages || 0;

  // Get customer name from order
  const getCustomerName = (order: Order): string => {
    if (order.shippingAddress?.fullName) return order.shippingAddress.fullName;
    if (typeof order.userId === 'object' && order.userId?.username) return order.userId.username;
    return "Khách hàng";
  };

  // Get customer phone from order
  const getCustomerPhone = (order: Order): string => {
    return order.shippingAddress?.phone || "";
  };

  if (!myShop) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#f7f7f7] rounded-xl flex items-center justify-center">
          <ShoppingCart className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Quản lý đơn hàng</h1>
          <p className="text-sm text-gray-500">{total} đơn hàng</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-[#f7f7f7] rounded-2xl p-2">
        <div className="flex gap-1 flex-wrap">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusFilter(tab.key);
                setPage(1);
              }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                statusFilter === tab.key
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#f7f7f7] rounded-2xl p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm theo mã đơn, tên khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-11 h-11 rounded-xl border-0 bg-white"
            />
          </div>
          <Button variant="outline" className="h-11 rounded-xl px-4 border-0 bg-white">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-[#f7f7f7] rounded-2xl overflow-hidden">
        {isLoadingShopOrders ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-500 text-sm">Đơn hàng sẽ xuất hiện khi có khách đặt</p>
          </div>
        ) : (
          <>
            <div>
              {orders.map((order, idx) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                const availableStatuses = getAvailableStatuses(order.status);
                
                return (
                  <div key={order._id} className={`p-5 ${idx % 2 === 0 ? "bg-white" : "bg-white/50"}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-800">
                            #{order.orderCode || order._id.slice(-8).toUpperCase()}
                          </span>
                          <Badge className={`${status.bg} ${status.color} hover:${status.bg} rounded-full`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleOpenViewModal(order)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          {availableStatuses.length > 0 && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => handleOpenUpdateStatusModal(order)}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Cập nhật trạng thái
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex gap-6">
                      {/* Products */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {order.products.slice(0, 3).map((item, i) => (
                            <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#f7f7f7]">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                              {item.quantity > 1 && (
                                <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-tl">
                                  x{item.quantity}
                                </span>
                              )}
                            </div>
                          ))}
                          {order.products.length > 3 && (
                            <div className="w-14 h-14 rounded-lg bg-[#f7f7f7] flex items-center justify-center text-sm text-gray-500">
                              +{order.products.length - 3}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {order.products.length} sản phẩm
                        </p>
                      </div>

                      {/* Customer */}
                      <div className="w-48">
                        <p className="text-sm font-medium text-gray-800">{getCustomerName(order)}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{getCustomerPhone(order)}</p>
                      </div>

                      {/* Total */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{formatPrice(order.totalAmount)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 bg-white/50">
                <p className="text-sm text-gray-500">
                  Hiển thị {orders.length} / {total} đơn hàng
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="rounded-lg border-0 bg-white"
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="rounded-lg border-0 bg-white"
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Order Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
            <DialogDescription>
              Mã đơn: #{selectedOrder?.orderCode || selectedOrder?._id.slice(-8).toUpperCase()}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              {/* Order Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Trạng thái:</span>
                <Badge className={`${statusConfig[selectedOrder.status]?.bg} ${statusConfig[selectedOrder.status]?.color} rounded-full`}>
                  {statusConfig[selectedOrder.status]?.label}
                </Badge>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Thông tin khách hàng</h4>
                <p className="text-sm">{getCustomerName(selectedOrder)}</p>
                <p className="text-sm text-gray-500">{getCustomerPhone(selectedOrder)}</p>
                <p className="text-sm text-gray-500">{selectedOrder.shippingAddress?.address}</p>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-medium mb-2">Sản phẩm</h4>
                <div className="space-y-2">
                  {selectedOrder.products.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-white">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discountShop && selectedOrder.discountShop > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá shop:</span>
                    <span>-{formatPrice(selectedOrder.discountShop)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold mt-2">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={updateStatusModalOpen} onOpenChange={setUpdateStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
            <DialogDescription>
              Chọn trạng thái mới cho đơn hàng #{selectedOrder?.orderCode || selectedOrder?._id.slice(-8).toUpperCase()}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Trạng thái hiện tại:</p>
                <Badge className={`${statusConfig[selectedOrder.status]?.bg} ${statusConfig[selectedOrder.status]?.color} rounded-full`}>
                  {statusConfig[selectedOrder.status]?.label}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Chọn trạng thái mới:</p>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableStatuses(selectedOrder.status).map((status) => (
                      <SelectItem key={status} value={status}>
                        {statusConfig[status]?.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateStatusModalOpen(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleUpdateStatus} 
              disabled={!newStatus || isUpdating}
              className="bg-primary"
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
