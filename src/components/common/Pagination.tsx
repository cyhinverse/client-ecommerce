import { Button } from "@/components/ui/button";
import { PaginationData } from "@/types/common";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  pagination: PaginationData | null;
  onPageChange: (page: number) => void;
  itemName?: string;
}

export function PaginationControls({
  pagination,
  onPageChange,
  itemName = "mục",
}: PaginationControlsProps) {
  if (!pagination) return null;

  const { currentPage, totalPages, hasNextPage, hasPrevPage, totalItems, pageSize, nextPage, prevPage } = pagination;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-2 w-full">
      <div className="flex-1 text-sm text-muted-foreground">
        Hiển thị <span className="font-medium text-foreground">{startItem}</span> đến <span className="font-medium text-foreground">{endItem}</span> trong tổng số <span className="font-medium text-foreground">{totalItems}</span> {itemName}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(prevPage || 1)}
            disabled={!hasPrevPage}
            className="h-9 w-9 rounded-xl border-gray-200 bg-[#f7f7f7] hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold text-foreground min-w-[3.5rem] text-center bg-[#f7f7f7] py-2 rounded-xl border border-gray-100">
             {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(nextPage || 1)}
            disabled={!hasNextPage}
            className="h-9 w-9 rounded-xl border-gray-200 bg-[#f7f7f7] hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
