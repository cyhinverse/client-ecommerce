import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Activity } from "react";
import { Discount } from "@/types/discount";
import SpinnerLoading from "@/components/common/SpinnerLoading";

interface DiscountsTableProps {
  discounts: Discount[];
  searchTerm: string;
  pageSize: number;
  isLoading?: boolean;
  onSearch: (value: string) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (discount: Discount) => void;
  onDelete: (discount: Discount) => void;
  onView: (discount: Discount) => void;
  onDiscountTypeFilterChange: (type: string) => void;
  onActiveFilterChange: (isActive: boolean | null) => void;
  selectedDiscountType: string;
  selectedIsActive: boolean | null;
}

export function DiscountsTable({
  discounts,
  searchTerm,
  pageSize,
  onSearch,
  onPageSizeChange,
  onEdit,
  onDelete,
  onView,
  onDiscountTypeFilterChange,
  onActiveFilterChange,
  selectedDiscountType,
  selectedIsActive,
  isLoading = false,
}: DiscountsTableProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearch);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const getStatusBadge = (discount: Discount) => {
    if (!discount.isActive) {
      return <Badge variant="secondary">Đã tắt</Badge>;
    }
    if (isExpired(discount.endDate)) {
      return <Badge variant="destructive">Hết hạn</Badge>;
    }
    if (discount.usedCount >= discount.usageLimit) {
      return <Badge variant="destructive">Hết lượt</Badge>;
    }
    return <Badge variant="default">Đang hoạt động</Badge>;
  };

  const getDiscountTypeText = (type: string) => {
    return type === "percent" ? "Phần trăm" : "Số tiền";
  };

  const getDiscountValueText = (discount: Discount) => {
    return discount.discountType === "percent" 
      ? `${discount.discountValue}%`
      : `${discount.discountValue.toLocaleString()}đ`;
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-8 rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>
          </form>

          <Select 
            value={selectedDiscountType} 
            onValueChange={onDiscountTypeFilterChange}
          >
            <SelectTrigger className="w-[180px] rounded-none border-border focus:ring-0 focus:border-primary">
              <SelectValue placeholder="Loại giảm giá" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border">
              {/* Sử dụng "all" thay vì chuỗi rỗng */}
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="percent">Phần trăm</SelectItem>
              <SelectItem value="fixed">Số tiền</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={selectedIsActive === null ? "all" : selectedIsActive.toString()} 
            onValueChange={(value) => 
              onActiveFilterChange(value === "all" ? null : value === "true")
            }
          >
            <SelectTrigger className="w-[180px] rounded-none border-border focus:ring-0 focus:border-primary">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border">
              {/* Sử dụng "all" thay vì chuỗi rỗng */}
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="true">Đang hoạt động</SelectItem>
              <SelectItem value="false">Đã tắt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select 
          value={pageSize.toString()} 
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[130px] rounded-none border-border focus:ring-0 focus:border-primary">
            <SelectValue placeholder="Hiển thị" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / trang</SelectItem>
            <SelectItem value="20">20 / trang</SelectItem>
            <SelectItem value="50">50 / trang</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Giá trị</TableHead>
              <TableHead>Ngày bắt đầu</TableHead>
              <TableHead>Ngày kết thúc</TableHead>
              <TableHead>Đã sử dụng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[80px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <SpinnerLoading />
                  </div>
                </TableCell>
              </TableRow>
            )}
            <Activity mode={isLoading ? "hidden" : "visible"}>
              {discounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    Không tìm thấy mã giảm giá nào.
                  </TableCell>
                </TableRow>
              ) : (
                discounts.map((discount) => (
                  <TableRow key={discount._id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-bold">{discount.code}</span>
                        {discount.description && (
                          <span className="text-sm text-muted-foreground">
                            {discount.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getDiscountTypeText(discount.discountType)}</TableCell>
                    <TableCell>{getDiscountValueText(discount)}</TableCell>
                    <TableCell>{formatDate(discount.startDate)}</TableCell>
                    <TableCell>{formatDate(discount.endDate)}</TableCell>
                    <TableCell>
                      {discount.usedCount} / {discount.usageLimit}
                    </TableCell>
                    <TableCell>{getStatusBadge(discount)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onView(discount)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(discount)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(discount)}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </Activity>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}