"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  ShoppingCart, Search, Filter, Eye, Loader2, MoreHorizontal,
  Clock, Package, Truck, CheckCircle2, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { getOrdersByShop } from "@/features/order/orderAction";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images: string[];
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: { name: string; email: string };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
  };
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: "Chờ xác nhận", color: "text-yellow-600", bg: "bg-yellow-50", icon: Clock },
  processing: { label: "Đang xử lý", color: "text-blue-600", bg: "bg-blue-50", icon: Package },
  shipping: { label: "Đang giao", color: "text-purple-600", bg: "bg-purple-50", icon: Truck },
  delivered: { label: "Hoàn thành", color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 },
  cancelled: { label: "Đã hủy", color: "text-red-600", bg: "bg-red-50", icon: XCircle },
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
  const { shopOrders, shopOrdersPagination, isLoadingShopOrders } = useAppSelector((state) => state.order);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (myShop?._id) {
      dispatch(getOrdersByShop({
        shopId: myShop._id,
        page,
        limit,
        status: statusFilter,
        search: searchTerm,
      }));
    }
  }, [dispatch, myShop, page, statusFilter]);

  const handleSearch = () => {
    if (myShop?._id) {
      setPage(1);
      dispatch(getOrdersByShop({
        shopId: myShop._id,
        page: 1,
        limit,
        status: statusFilter,
        search: searchTerm,
      }));
    }
  };

  const statusTabs = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "processing", label: "Đang xử lý" },
    { key: "shipping", label: "Đang giao" },
    { key: "delivered", label: "Hoàn thành" },
    { key: "cancelled", label: "Đã hủy" },
  ];

  // Cast shopOrders to local Order type for rendering
  const orders = shopOrders as unknown as Order[];
  const total = shopOrdersPagination?.totalItems || 0;
  const totalPages = shopOrdersPagination?.totalPages || 0;

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
        <div className="flex gap-1">
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
                return (
                  <div key={order._id} className={`p-5 ${idx % 2 === 0 ? "bg-white" : "bg-white/50"}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-800">#{order.orderNumber}</span>
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
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            Chi tiết
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex gap-6">
                      {/* Products */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {order.items.slice(0, 3).map((item, i) => (
                            <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#f7f7f7]">
                              {item.product?.images?.[0] ? (
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name}
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
                          {order.items.length > 3 && (
                            <div className="w-14 h-14 rounded-lg bg-[#f7f7f7] flex items-center justify-center text-sm text-gray-500">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {order.items.length} sản phẩm
                        </p>
                      </div>

                      {/* Customer */}
                      <div className="w-48">
                        <p className="text-sm font-medium text-gray-800">{order.shippingAddress?.fullName || order.user?.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{order.shippingAddress?.phone}</p>
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
    </div>
  );
}
