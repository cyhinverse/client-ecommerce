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
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
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
  searchPlaceholder = "Search...",
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
        className="bg-white/50 p-4 rounded-[1.5rem] backdrop-blur-xl border border-border/50"
      />

      {/* Table */}
      <div className="rounded-[2rem] border border-border/50 bg-white/60 dark:bg-[#1C1C1E]/60 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="border-border/50 hover:bg-transparent">
                    {columns.map((column) => (
                      <TableHead key={column.key} className={`uppercase text-xs font-bold tracking-wider text-muted-foreground ${column.className || ""}`}>
                        {column.title}
                      </TableHead>
                    ))}
                    {actions.length > 0 && (
                      <TableHead className="text-right uppercase text-xs font-bold tracking-wider text-muted-foreground pr-6">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      <TableRow key={(item as any).id || index} className="border-border/50 hover:bg-gray-50/50 transition-colors">
                        {columns.map((column) => (
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          <TableCell key={`${(item as any).id || index}-${column.key}`} className="py-4">
                            {column.render
                              ? column.render(item)
                              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                ((item as any)[column.key] as React.ReactNode)}
                          </TableCell>
                        ))}
                        {actions.length > 0 && (
                          <TableCell className="text-right pr-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl border-border/50 shadow-lg p-1">
                                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 py-1.5">Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border/50 my-1" />
                                {actions.map((action, idx) => (
                                  <DropdownMenuItem
                                    key={idx}
                                    onClick={() => handleAction(action, item)}
                                    className={`cursor-pointer rounded-lg gap-2 ${
                                      action.variant === "destructive"
                                        ? "text-destructive focus:text-destructive focus:bg-destructive/10"
                                        : ""
                                    }`}
                                  >
                                    {action.icon && (
                                      <span className="h-4 w-4 flex items-center justify-center">
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
                        className="text-center py-12 text-muted-foreground"
                      >
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
        </div>
      </div>

       {/* Pagination */}
       {pagination && (
        <div className="flex items-center justify-between px-2 w-full mt-4">
            <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{(pagination.currentPage - 1) * (pagination.itemsPerPage || 10) + 1}</span> to <span className="font-medium text-foreground">{Math.min(pagination.currentPage * (pagination.itemsPerPage || 10), pagination.totalItems)}</span> of <span className="font-medium text-foreground">{pagination.totalItems}</span> entries
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
                    disabled={pagination.currentPage === 1}
                    onClick={() => onPageChange?.(pagination.currentPage - 1)}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {/* Simplified pagination numbers for cleaner look, mirroring other components */}
                <span className="text-sm font-medium text-foreground min-w-[3rem] text-center">
                    {pagination.currentPage} / {pagination.totalPages}
                </span>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => onPageChange?.(pagination.currentPage + 1)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
        )}
    </div>
  );
};

export default DataTable;
