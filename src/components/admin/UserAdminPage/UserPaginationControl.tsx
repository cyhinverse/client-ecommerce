import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export function UserPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: UserPaginationProps) {
  const startItem =
    totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem =
    totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : 0;

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="text-sm text-gray-600">
        Trang {currentPage} của {totalPages}
        {/* Hiển thị số item nếu có dữ liệu */}
        {/* Hiển thị {startItem} đến {endItem} của {totalItems} người dùng */}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </Button>

        {/* Hiển thị tối đa 5 trang với logic thông minh */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            // Nếu tổng số trang <= 5, hiển thị tất cả
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            // Nếu đang ở trang 1, 2, 3 - hiển thị trang 1-5
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            // Nếu đang ở các trang cuối - hiển thị 5 trang cuối
            pageNum = totalPages - 4 + i;
          } else {
            // Hiển thị 2 trang trước + trang hiện tại + 2 trang sau
            pageNum = currentPage - 2 + i;
          }

          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={
                currentPage === pageNum
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
              }
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}
