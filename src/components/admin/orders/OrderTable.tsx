import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Order } from "@/types/order";
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
import { Search, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import SpinnerLoading from "@/components/common/SpinnerLoading";

export interface OrdersTableProps {
  orders: Order[];
  searchTerm: string;
  statusFilter: string;
  paymentStatusFilter: string; // Đổi từ function thành string
  paymentMethodFilter: string;
  userIdFilter: string;
  pageSize: number;
  isLoading?: boolean;
  onSearch: (value: string) => void;
  onStatusFilter: (status: string) => void;
  onPaymentStatusFilter: (status: string) => void; // Giữ nguyên function cho handler
  onPaymentMethodFilter: (method: string) => void;
  onUserIdFilter: (userId: string) => void;
  onResetFilters: () => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
  onView: (order: Order) => void;
}

export function OrdersTable({
  orders,
  searchTerm,
  statusFilter,
  pageSize,
  onSearch,
  onStatusFilter,
  onPageSizeChange,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}: OrdersTableProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearch !== searchTerm) {
       onSearch(debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);
  const getStatusBadge = (status: string) => {
    const statusConfig: {
      [key: string]: {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      };
    } = {
      pending: { label: "Chờ xác nhận", variant: "secondary" },
      confirmed: { label: "Đã xác nhận", variant: "outline" },
      processing: { label: "Đang xử lý", variant: "default" },
      shipped: { label: "Đang giao", variant: "default" },
      delivered: { label: "Thành công", variant: "outline" },
      cancelled: { label: "Đã hủy", variant: "destructive" },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: "secondary",
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig: {
      [key: string]: {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      };
    } = {
      unpaid: { label: "Chưa thanh toán", variant: "secondary" },
      paid: { label: "Đã thanh toán", variant: "outline" },
      refunded: { label: "Đã hoàn tiền", variant: "destructive" },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: "secondary",
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã đơn hàng, tên KH..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-8 rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilter}>
            <SelectTrigger className="w-[180px] rounded-none border-border focus:ring-0 focus:border-primary">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ xác nhận</SelectItem>
              <SelectItem value="confirmed">Đã xác nhận</SelectItem>
              <SelectItem value="processing">Đang xử lý</SelectItem>
              <SelectItem value="shipped">Đang giao</SelectItem>
              <SelectItem value="delivered">Thành công</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[120px] rounded-none border-border focus:ring-0 focus:border-primary">
            <SelectValue placeholder="Hiển thị" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-border">
            <SelectItem value="10">10 / trang</SelectItem>
            <SelectItem value="20">20 / trang</SelectItem>
            <SelectItem value="50">50 / trang</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-x-auto no-scrollbar">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thanh toán</TableHead>
              <TableHead className="w-[80px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <SpinnerLoading />
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  Không có đơn hàng nào
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order._id}
                  className={isLoading ? "opacity-50 pointer-events-none" : ""}
                >
                  <TableCell className="font-medium">
                    #{order._id.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {order.shippingAddress.fullName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.shippingAddress.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(order)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(order)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Cập nhật trạng thái
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(order)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
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
  );
}
