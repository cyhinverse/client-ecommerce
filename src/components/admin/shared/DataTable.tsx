import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { MoreHorizontal } from "lucide-react";
import SearchFilterBar from "./SearchFilterBar";
import React from "react";

interface DataTableProps<T = Record<string, unknown>> {
  title: string;
  description: string;
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];
  enableSearch?: boolean;
  searchPlaceholder?: string;
  enableFilter?: boolean;
  enableExport?: boolean;
  pagination?: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage?: number;
  };
  onSearchChange?: (value: string) => void;
  onExport?: () => void;
  onPageChange?: (page: number) => void;
}

interface Column<T = Record<string, unknown>> {
  key: string;
  title: string;
  className?: string;
  render?: (item: T) => React.ReactNode;
}

interface Action<T = Record<string, unknown>> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: "default" | "destructive";
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  description,
  columns,
  data,
  actions = [],
  enableSearch = true,
  searchPlaceholder = "Tìm kiếm...",
  enableFilter = true,
  enableExport = false,
  pagination,
  onSearchChange,
  onExport,
  onPageChange,
}) => {
  const handleAction = <T,>(action: Action<T>, item: T) => {
    action.onClick(item);
  };

  return (
    <div className="space-y-6">
      <SearchFilterBar
        title={title}
        description={description}
        enableSearch={enableSearch}
        searchPlaceholder={searchPlaceholder}
        enableFilter={enableFilter}
        enableExport={enableExport}
        onSearchChange={onSearchChange}
        onExport={onExport}
      />

      {/* Table */}
      <Card>
        <div className="p-4">
          <div className="border rounded-lg mt-4 overflow-x-auto no-scrollbar">
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column.key} className={column.className}>
                        {column.title}
                      </TableHead>
                    ))}
                    {actions.length > 0 && (
                      <TableHead className="text-right">Thao tác</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      <TableRow key={(item as any).id || index}>
                        {columns.map((column) => (
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          <TableCell key={`${(item as any).id || index}-${column.key}`}>
                            {column.render
                              ? column.render(item)
                              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                ((item as any)[column.key] as React.ReactNode)}
                          </TableCell>
                        ))}
                        {actions.length > 0 && (
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {actions.map((action, idx) => (
                                  <DropdownMenuItem
                                    key={idx}
                                    onClick={() => handleAction(action, item)}
                                    className={
                                      action.variant === "destructive"
                                        ? "text-destructive"
                                        : ""
                                    }
                                  >
                                    {action.icon && (
                                      <span className="mr-2">
                                        {action.icon}
                                      </span>
                                    )}
                                    {action.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                        className="text-center py-8"
                      >
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị{" "}
                    {(pagination.currentPage - 1) *
                      (pagination.itemsPerPage || 10) +
                      1}{" "}
                    đến{" "}
                    {Math.min(
                      pagination.currentPage * (pagination.itemsPerPage || 10),
                      pagination.totalItems
                    )}{" "}
                    của {pagination.totalItems} mục
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.currentPage === 1}
                      onClick={() => onPageChange?.(pagination.currentPage - 1)}
                    >
                      Trước
                    </Button>
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant="outline"
                            size="sm"
                            className={
                              pagination.currentPage === pageNum
                                ? "bg-muted"
                                : ""
                            }
                            onClick={() => onPageChange?.(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      onClick={() => onPageChange?.(pagination.currentPage + 1)}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DataTable;
