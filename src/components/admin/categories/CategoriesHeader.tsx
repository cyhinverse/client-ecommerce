import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CategoriesHeaderProps {
  onAddCategory: () => void;
}

export function CategoriesHeader({ onAddCategory }: CategoriesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">
          Category Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage product categories and classification
        </p>
      </div>
      <Button 
        onClick={onAddCategory}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E53935] text-white hover:bg-[#D32F2F] sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        Add Category
      </Button>
    </div>
  );
}
