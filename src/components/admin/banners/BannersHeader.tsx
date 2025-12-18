import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BannersHeaderProps {
  onAddBanner: () => void;
}

export function BannersHeader({ onAddBanner }: BannersHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-6">
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
        className="flex items-center gap-2 rounded-xl bg-black hover:bg-black/90 text-white dark:bg-[#0071e3] dark:hover:bg-[#0077ED] border border-transparent shadow-sm"
      >
        <Plus className="h-4 w-4" />
        Add Banner
      </Button>
    </div>
  );
}
