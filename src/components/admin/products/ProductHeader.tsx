import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductsHeaderProps {
  onOpenCreate: () => void;
}

export function ProductsHeader({ onOpenCreate }: ProductsHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">Product Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage all products in store
        </p>
      </div>
      <Button 
        onClick={onOpenCreate} 
        className="flex items-center gap-2 rounded-xl bg-[#E53935] hover:bg-[#D32F2F] text-white"
      >
        <Plus className="h-4 w-4" />
        Add Product
      </Button>
    </div>
  );
}
