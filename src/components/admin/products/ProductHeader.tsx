import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

interface ProductsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function ProductsHeader({ onRefresh, onExport }: ProductsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">Quản lý sản phẩm</h1>
        <p className="text-muted-foreground mt-1">
          Xem và duyệt sản phẩm từ các shop trên sàn
        </p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        {onRefresh && (
          <Button 
            onClick={onRefresh} 
            variant="outline"
            className="flex w-full items-center justify-center gap-2 rounded-xl border-gray-200 sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Làm mới
          </Button>
        )}
        {onExport && (
          <Button 
            onClick={onExport} 
            variant="outline"
            className="flex w-full items-center justify-center gap-2 rounded-xl border-gray-200 sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Xuất Excel
          </Button>
        )}
      </div>
    </div>
  );
}
