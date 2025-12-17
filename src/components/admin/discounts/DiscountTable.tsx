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
import { Search, MoreHorizontal, Eye, Edit, Trash2, Filter } from "lucide-react";
import { Discount } from "@/types/discount";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { cn } from "@/lib/utils";

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
  }, [debouncedSearch, searchTerm, onSearch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US");
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const getStatusBadge = (discount: Discount) => {
    if (!discount.isActive) {
      return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0 rounded-lg px-2.5 py-0.5 shadow-none font-medium">Inactive</Badge>;
    }
    if (isExpired(discount.endDate)) {
      return <Badge className="bg-red-50 text-red-600 hover:bg-red-50 border-red-100 rounded-lg px-2.5 py-0.5 shadow-none font-medium">Expired</Badge>;
    }
    if (discount.usedCount >= discount.usageLimit) {
      return <Badge className="bg-orange-50 text-orange-600 hover:bg-orange-50 border-orange-100 rounded-lg px-2.5 py-0.5 shadow-none font-medium">Limit Reached</Badge>;
    }
    return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 rounded-lg px-2.5 py-0.5 shadow-none font-medium">Active</Badge>;
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
      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white/50 dark:bg-white/5 p-4 rounded-[1.5rem] backdrop-blur-xl border border-border/50">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by code..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-9 rounded-xl border-gray-200 bg-white/80 focus:bg-white transition-all shadow-sm"
              />
          </div>

          <div className="flex items-center gap-2">
            <Select
                value={selectedDiscountType}
                onValueChange={onDiscountTypeFilterChange}
            >
                <SelectTrigger className="w-[160px] rounded-xl border-gray-200 bg-white/80 shadow-sm hover:bg-gray-50 h-10">
                <SelectValue placeholder="Discount Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 shadow-lg">
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
                <SelectTrigger className="w-[140px] rounded-xl border-gray-200 bg-white/80 shadow-sm hover:bg-gray-50 h-10">
                <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 shadow-lg">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Show:</span>
            <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
            >
            <SelectTrigger className="w-[100px] h-9 rounded-lg border-gray-200 bg-white/80 shadow-sm">
                <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-[2rem] border border-border/50 bg-white/60 dark:bg-[#1C1C1E]/60 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
            <Table>
            <TableHeader className="bg-gray-50/50">
                <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground pl-6">Code</TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Type</TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Value</TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Start Date</TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">End Date</TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Used / Limit</TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground text-right pr-6">Actions</TableHead>
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
                {!isLoading && discounts.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center justify-center">
                            <span className="bg-gray-100 p-3 rounded-full mb-3">
                                <Filter className="h-6 w-6 text-gray-400" />
                            </span>
                             No discount codes found.
                        </div>
                    </TableCell>
                </TableRow>
                ) : (
                discounts.map((discount) => (
                    <TableRow
                    key={discount._id}
                    className={cn("border-border/50 transition-colors hover:bg-gray-50/50", isLoading && "opacity-50 pointer-events-none")}
                    >
                    <TableCell className="pl-6 align-top py-4">
                        <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-foreground">{discount.code}</span>
                        {discount.description && (
                            <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                            {discount.description}
                            </span>
                        )}
                        </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium align-top py-4">
                        {getDiscountTypeText(discount.discountType)}
                    </TableCell>
                    <TableCell className="text-foreground font-bold align-top py-4">{getDiscountValueText(discount)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm align-top py-4">{formatDate(discount.startDate)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm align-top py-4">{formatDate(discount.endDate)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm align-top py-4">
                        <span className="font-medium text-foreground">{discount.usedCount}</span> / {discount.usageLimit}
                    </TableCell>
                    <TableCell className="align-top py-4">{getStatusBadge(discount)}</TableCell>
                    <TableCell className="text-right pr-6 align-top py-4">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-border/50 shadow-lg p-1 bg-white/95 backdrop-blur-xl">
                            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 py-1.5">Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onView(discount)} className="focus:bg-gray-100 rounded-lg cursor-pointer gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(discount)} className="focus:bg-gray-100 rounded-lg cursor-pointer gap-2">
                            <Edit className="h-4 w-4" />
                            Edit Discount
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/50 my-1" />
                            <DropdownMenuItem
                            onClick={() => onDelete(discount)}
                            className="text-red-600 focus:text-red-700 focus:bg-red-50 rounded-lg cursor-pointer gap-2"
                            >
                            <Trash2 className="h-4 w-4" />
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
