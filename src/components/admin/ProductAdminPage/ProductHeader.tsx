import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductsHeaderProps {
  onOpenCreate: () => void;
}

export function ProductsHeader({ onOpenCreate }: ProductsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h1>
        <p className="text-muted-foreground">
          Quản lý tất cả sản phẩm trong cửa hàng
        </p>
      </div>
      <Button onClick={onOpenCreate} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Thêm sản phẩm
      </Button>
    </div>
  );
}
