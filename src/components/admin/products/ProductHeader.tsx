import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

interface ProductsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function ProductsHeader({ onRefresh, onExport }: ProductsHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">Quản lý sản phẩm</h1>
        <p className="text-muted-foreground mt-1">
          Xem và duyệt sản phẩm từ các shop trên sàn
        </p>
      </div>
      <div className="flex gap-2">
        {onRefresh && (
          <Button 
            onClick={onRefresh} 
            variant="outline"
            className="flex items-center gap-2 rounded-xl border-gray-200"
          >
            <RefreshCw className="h-4 w-4" />
            Làm mới
          </Button>
        )}
        {onExport && (
          <Button 
            onClick={onExport} 
            variant="outline"
            className="flex items-center gap-2 rounded-xl border-gray-200"
          >
            <Download className="h-4 w-4" />
            Xuất Excel
          </Button>
        )}
      </div>
    </div>
  );
}
