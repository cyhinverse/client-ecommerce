import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DiscountsHeaderProps {
  onOpenCreate: () => void;
}

export function DiscountsHeader({ onOpenCreate }: DiscountsHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">Discounts</h1>
        <p className="text-muted-foreground mt-1">
          Manage and create discount codes for the store
        </p>
      </div>
      <Button 
        onClick={onOpenCreate}
        className="flex items-center gap-2 rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        Create Discount
      </Button>
    </div>
  );
}