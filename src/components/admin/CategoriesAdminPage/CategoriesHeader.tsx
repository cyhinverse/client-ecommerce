import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CategoriesHeaderProps {
  onAddCategory: () => void;
}

export function CategoriesHeader({ onAddCategory }: CategoriesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Quản lý danh mục
        </h1>
        <p className="text-gray-600 mt-2">
          Quản lý danh mục sản phẩm và phân loại
        </p>
      </div>
      <Button onClick={onAddCategory}>
        <Plus className="h-4 w-4 mr-2" />
        Thêm danh mục
      </Button>
    </div>
  );
}
