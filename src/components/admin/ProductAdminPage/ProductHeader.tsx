import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductsHeaderProps {
  onOpenCreate: () => void;
}

export function ProductsHeader({ onOpenCreate }: ProductsHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 uppercase">Quản lý sản phẩm</h1>
        <p className="text-gray-500 mt-1">
          Quản lý tất cả sản phẩm trong cửa hàng
        </p>
      </div>
      <Button 
        onClick={onOpenCreate} 
        className="flex items-center gap-2 rounded-none bg-black text-white hover:bg-gray-800"
      >
        <Plus className="h-4 w-4" />
        Thêm sản phẩm
      </Button>
    </div>
  );
}
