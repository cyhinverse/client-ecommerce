import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US");
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const getStatusBadge = (discount: Discount) => {
    if (!discount.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (isExpired(discount.endDate)) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (discount.usedCount >= discount.usageLimit) {
      return <Badge variant="destructive">Limit Reached</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  const getDiscountTypeText = (type: string) => {
    return type === "percent" ? "Percentage" : "Fixed Amount";
  };

  const getDiscountValueText = (discount: Discount) => {
    return discount.discountType === "percent"
      ? `${discount.discountValue}%`
      : `${(discount.discountValue ?? 0).toLocaleString()}đ`;
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by code..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-8 rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
              />
          </div>

          <Select
            value={selectedDiscountType}
            onValueChange={onDiscountTypeFilterChange}
          >
            <SelectTrigger className="w-[180px] rounded-none border-border focus:ring-0 focus:border-primary">
              <SelectValue placeholder="Discount Type" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border">
              {/* Using "all" instead of empty string */}
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="percent">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={
              selectedIsActive === null ? "all" : selectedIsActive.toString()
            }
            onValueChange={(value) =>
              onActiveFilterChange(value === "all" ? null : value === "true")
            }
          >
            <SelectTrigger className="w-[180px] rounded-none border-border focus:ring-0 focus:border-primary">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border">
              {/* Using "all" instead of empty string */}
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[130px] rounded-none border-border focus:ring-0 focus:border-primary">
            <SelectValue placeholder="Show" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="20">20 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto no-scrollbar">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Used</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
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
            {!isLoading && discounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  No discount codes found.
                </TableCell>
              </TableRow>
            ) : (
              discounts.map((discount) => (
                <TableRow
                  key={discount._id}
                  className={isLoading ? "opacity-50 pointer-events-none" : ""}
                >
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
                  <TableCell>
                    {getDiscountTypeText(discount.discountType)}
                  </TableCell>
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onView(discount)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(discount)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(discount)}
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
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
