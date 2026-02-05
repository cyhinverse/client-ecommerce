import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface VouchersHeaderProps {
  onOpenCreate: () => void;
}

export function VouchersHeader({ onOpenCreate }: VouchersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/50 pb-6 mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">Vouchers</h1>
        <p className="text-muted-foreground mt-1 text-sm bg-transparent">
          Manage and create voucher codes for the store
        </p>
      </div>
      <Button 
        onClick={onOpenCreate}
        className="w-full rounded-xl h-10 gap-2 text-sm font-medium transition-all shadow-lg hover:shadow-xl bg-black hover:bg-black/90 text-white dark:bg-[#0071e3] dark:hover:bg-[#0077ED] border border-transparent sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        Create Voucher
      </Button>
    </div>
  );
}
