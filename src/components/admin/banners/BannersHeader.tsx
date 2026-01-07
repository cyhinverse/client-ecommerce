import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BannersHeaderProps {
  onAddBanner: () => void;
}

export function BannersHeader({ onAddBanner }: BannersHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">
          Banner Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Control the homepage hero experience and promotions
        </p>
      </div>
      <Button 
        onClick={onAddBanner}
        className="flex items-center gap-2 rounded-xl bg-[#E53935] hover:bg-[#D32F2F] text-white"
      >
        <Plus className="h-4 w-4" />
        Add Banner
      </Button>
    </div>
  );
}
