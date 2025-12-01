import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CategoriesHeaderProps {
  onAddCategory: () => void;
}

export function CategoriesHeader({ onAddCategory }: CategoriesHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">
          Quản lý danh mục
        </h1>
        <p className="text-muted-foreground mt-1">
          Quản lý danh mục sản phẩm và phân loại
        </p>
      </div>
      <Button 
        onClick={onAddCategory}
        className="flex items-center gap-2 rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        Thêm danh mục
      </Button>
    </div>
  );
}
