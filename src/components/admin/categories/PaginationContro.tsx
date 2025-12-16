import { Button } from "@/components/ui/button";
import { PaginationData } from "@/types/category";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  pagination: PaginationData | null;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  pagination,
  onPageChange,
}: PaginationControlsProps) {
  // Xử lý trường hợp pagination null
  if (!pagination) {
    return null;
  }

  const startItem = (pagination.currentPage - 1) * pagination.pageSize + 1;
  const endItem = Math.min(
    pagination.currentPage * pagination.pageSize,
    pagination.totalItems
  );

  return (
    <div className="flex items-center justify-between px-2 mt-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {pagination.totalItems} categories
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.prevPage || 1)}
            disabled={!pagination.hasPrevPage}
            className="rounded-none border-border hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-foreground">
            Page {pagination.currentPage} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.nextPage || 1)}
            disabled={!pagination.hasNextPage}
            className="rounded-none border-border hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
