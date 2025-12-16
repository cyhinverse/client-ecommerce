import { PaginationData } from "@/types/order";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  pagination: PaginationData | null;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  pagination,
  onPageChange,
}: PaginationControlsProps) {
  if (!pagination) return null;

  const { currentPage, totalPages, hasNextPage, hasPrevPage, totalItems, pageSize } = pagination;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-2 mt-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} orders
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className="rounded-none border-border hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-foreground">
            Page {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="rounded-none border-border hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}