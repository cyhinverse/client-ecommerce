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
          Category Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage product categories and classification
        </p>
      </div>
      <Button 
        onClick={onAddCategory}
        className="flex items-center gap-2 rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        Add Category
      </Button>
    </div>
  );
}
