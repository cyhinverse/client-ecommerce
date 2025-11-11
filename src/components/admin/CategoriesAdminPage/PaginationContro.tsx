import { Button } from "@/components/ui/button";
import { PaginationData } from "@/types/category";

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
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">
        Hiển thị {startItem} đến {endItem} của {pagination.totalItems} danh mục
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!pagination.hasPrevPage}
          onClick={() => onPageChange(pagination.prevPage || 1)}
        >
          Trước
        </Button>

        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
          let pageNum;
          if (pagination.totalPages <= 5) {
            pageNum = i + 1;
          } else if (pagination.currentPage <= 3) {
            pageNum = i + 1;
          } else if (pagination.currentPage >= pagination.totalPages - 2) {
            pageNum = pagination.totalPages - 4 + i;
          } else {
            pageNum = pagination.currentPage - 2 + i;
          }

          return (
            <Button
              key={pageNum}
              variant="outline"
              size="sm"
              className={
                pagination.currentPage === pageNum ? "bg-gray-100" : ""
              }
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          disabled={!pagination.hasNextPage}
          onClick={() =>
            onPageChange(pagination.nextPage || pagination.totalPages)
          }
        >
          Sau
        </Button>
      </div>
    </div>
  );
}
