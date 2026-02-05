import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Order } from "@/types/order";
import { Shop } from "@/types/shop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, Eye, Edit, Trash2, Store, Calendar } from "lucide-react";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import Image from "next/image";

export interface OrdersTableProps {
  orders: Order[];
  searchTerm: string;
  statusFilter: string;
  paymentStatusFilter: string;
  paymentMethodFilter: string;
  userIdFilter: string;
  startDate?: string;
  endDate?: string;
  pageSize: number;
  isLoading?: boolean;
  onSearch: (value: string) => void;
  onStatusFilter: (status: string) => void;
  onPaymentStatusFilter: (status: string) => void;
  onPaymentMethodFilter: (method: string) => void;
  onUserIdFilter: (userId: string) => void;
  onDateFilter?: (start: string, end: string) => void;
  onResetFilters: () => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
  onView: (order: Order) => void;
  onShopFilterChange?: (shopId: string) => void;
  selectedShop?: string;
  shops?: Shop[];
}

export function OrdersTable({
  orders,
  searchTerm,
  statusFilter,
  startDate = "",
  endDate = "",
  pageSize,
  onSearch,
  onStatusFilter,
  onDateFilter,
  onPageSizeChange,
  onEdit,
  onDelete,
  onView,
  onShopFilterChange,
  selectedShop = "all",
  shops = [],
  isLoading = false,
}: OrdersTableProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 500);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (debouncedSearch !== searchTerm) {
      onSearchRef.current(debouncedSearch);
    }
  }, [debouncedSearch, searchTerm]);
  const getStatusBadge = (status: string) => {
    const statusConfig: {
      [key: string]: {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
        className?: string;
      };
    } = {
      pending: {
        label: "Pending",
        variant: "secondary",
        className: "bg-gray-100 text-gray-700 hover:bg-gray-100",
      },
      confirmed: {
        label: "Confirmed",
        variant: "outline",
        className: "bg-blue-50 text-blue-700 border-blue-200",
      },
      processing: {
        label: "Processing",
        variant: "default",
        className: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
      },
      shipped: {
        label: "Shipped",
        variant: "default",
        className: "bg-purple-100 text-purple-700 hover:bg-purple-100",
      },
      delivered: {
        label: "Delivered",
        variant: "outline",
        className: "bg-green-50 text-green-700 border-green-200",
      },
      cancelled: {
        label: "Cancelled",
        variant: "destructive",
        className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
      },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: "secondary",
      className: "bg-gray-100 text-gray-700",
    };

    return (
      <Badge
        variant={config.variant}
        className={`rounded-lg font-medium px-2.5 py-0.5 border-0 shadow-none ${config.className}`}
      >
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig: {
      [key: string]: {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
        className?: string; // Add className property
      };
    } = {
      unpaid: {
        label: "Unpaid",
        variant: "secondary",
        className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      },
      paid: {
        label: "Paid",
        variant: "outline",
        className: "bg-green-50 text-green-700 border border-green-200",
      },
      refunded: { label: "Refunded", variant: "destructive" },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: "secondary",
    };

    return (
      <Badge
        variant={config.variant}
        className={`rounded-lg font-medium px-2.5 py-0.5 border-0 shadow-none ${config.className}`}
      >
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getShopInfo = (
    shopId: string | Shop | undefined,
  ): { name: string; logo?: string } => {
    if (!shopId) return { name: "N/A" };
    if (typeof shopId === "string") return { name: shopId };
    return { name: shopId.name || "N/A", logo: shopId.logo };
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 bg-[#f7f7f7] p-4 rounded-2xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full sm:flex-1 sm:min-w-[220px] sm:max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, customer name..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9 rounded-xl border-0 bg-white focus-visible:ring-0 transition-all"
            />
          </div>

          {/* Date Range Filter */}
          {onDateFilter && (
            <div className="flex w-full flex-wrap items-center gap-2 rounded-xl bg-white px-3 py-2 sm:h-10 sm:w-auto sm:py-0">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => onDateFilter(e.target.value, endDate)}
                className="text-sm bg-transparent border-0 focus:ring-0 w-[120px] min-w-[110px]"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onDateFilter(startDate, e.target.value)}
                className="text-sm bg-transparent border-0 focus:ring-0 w-[120px] min-w-[110px]"
              />
            </div>
          )}

          <Select value={statusFilter} onValueChange={onStatusFilter}>
            <SelectTrigger className="w-full rounded-xl border-0 bg-white focus:ring-0 sm:w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-0">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Shop Filter */}
          {onShopFilterChange && shops.length > 0 && (
            <Select value={selectedShop} onValueChange={onShopFilterChange}>
              <SelectTrigger className="w-full rounded-xl border-0 bg-white focus:ring-0 sm:w-[160px]">
                <Store className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Shop" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0">
                <SelectItem value="all">All Shops</SelectItem>
                {shops.map((shop) => (
                  <SelectItem key={shop._id} value={shop._id}>
                    {shop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="w-full sm:w-auto">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-full rounded-xl border-0 bg-white focus:ring-0 sm:w-[120px]">
              <SelectValue placeholder="Show" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-0">
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl bg-white overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <Table>
            <TableHeader className="bg-[#f7f7f7]">
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground pl-6">
                  Order ID
                </TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">
                  Customer
                </TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">
                  Shop
                </TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">
                  Date
                </TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">
                  Total
                </TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">
                  Payment
                </TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground w-[80px] text-right pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex justify-center items-center">
                      <SpinnerLoading />
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order._id}
                    className={`border-0 hover:bg-[#f7f7f7]/50 transition-colors ${
                      isLoading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <TableCell className="font-medium pl-6 text-sm">
                      #{order._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-foreground">
                          {order.shippingAddress.fullName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order.shippingAddress.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 max-w-[140px]">
                        {getShopInfo(order.shopId).logo ? (
                          <div className="relative h-6 w-6 rounded-md overflow-hidden bg-[#f7f7f7] shrink-0">
                            <Image
                              src={getShopInfo(order.shopId).logo!}
                              alt={getShopInfo(order.shopId).name}
                              width={24}
                              height={24}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-md bg-[#f7f7f7] flex items-center justify-center shrink-0">
                            <Store className="h-3 w-3 text-muted-foreground" />
                          </div>
                        )}
                        <span
                          className="text-sm text-muted-foreground truncate"
                          title={getShopInfo(order.shopId).name}
                        >
                          {getShopInfo(order.shopId).name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-lg hover:bg-[#f7f7f7]"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl border-0 shadow-lg"
                        >
                          <DropdownMenuItem
                            onClick={() => onView(order)}
                            className="cursor-pointer gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEdit(order)}
                            className="cursor-pointer gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(order)}
                            className="text-destructive cursor-pointer gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
