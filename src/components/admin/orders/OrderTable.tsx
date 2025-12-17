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
  paymentStatusFilter: string;
  paymentMethodFilter: string;
  userIdFilter: string;
  pageSize: number;
  isLoading?: boolean;
  onSearch: (value: string) => void;
  onStatusFilter: (status: string) => void;
  onPaymentStatusFilter: (status: string) => void;
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
  const debouncedSearch = useDebounce(localSearch, 500);

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
        className?: string;
      };
    } = {
      pending: { label: "Pending", variant: "secondary", className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
      confirmed: { label: "Confirmed", variant: "outline", className: "bg-blue-50 text-blue-700 border-blue-200" },
      processing: { label: "Processing", variant: "default", className: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100" },
      shipped: { label: "Shipped", variant: "default", className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
      delivered: { label: "Delivered", variant: "outline", className: "bg-green-50 text-green-700 border-green-200" },
      cancelled: { label: "Cancelled", variant: "destructive", className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50" },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: "secondary",
      className: "bg-gray-100 text-gray-700"
    };

    return <Badge variant={config.variant} className={`rounded-lg font-medium px-2.5 py-0.5 border-0 shadow-none ${config.className}`}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig: {
      [key: string]: {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
        className?: string; // Add className property
      };
    } = {
      unpaid: { label: "Unpaid", variant: "secondary", className: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
      paid: { label: "Paid", variant: "outline", className: "bg-green-50 text-green-700 border border-green-200" },
      refunded: { label: "Refunded", variant: "destructive" },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: "secondary",
    };

    return <Badge variant={config.variant} className={`rounded-lg font-medium px-2.5 py-0.5 border-0 shadow-none ${config.className}`}>{config.label}</Badge>;
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white/50 dark:bg-white/5 p-4 rounded-[1.5rem] backdrop-blur-xl border border-border/50">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, customer name..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9 rounded-xl border-gray-200 bg-white/80 focus-visible:ring-0 focus-visible:border-primary transition-all shadow-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilter}>
            <SelectTrigger className="w-[180px] rounded-xl border-gray-200 bg-white/80 focus:ring-0 shadow-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[120px] rounded-xl border-gray-200 bg-white/80 focus:ring-0 shadow-sm">
            <SelectValue placeholder="Show" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50">
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="20">20 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-[2rem] border border-border/50 bg-white/60 dark:bg-[#1C1C1E]/60 backdrop-blur-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground pl-6">Order ID</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Customer</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Date</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Total</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Status</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Payment</TableHead>
              <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground w-[80px] text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
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
                  className="text-center py-12 text-muted-foreground"
                >
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order._id}
                  className={`border-border/50 hover:bg-gray-50/50 transition-colors ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
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
                  <TableCell className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-border/50 shadow-lg">
                        <DropdownMenuItem onClick={() => onView(order)} className="cursor-pointer gap-2">
                          <Eye className="w-4 h-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(order)} className="cursor-pointer gap-2">
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
  );
}
