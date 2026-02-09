import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BannersHeaderProps {
  onAddBanner: () => void;
}

export function BannersHeader({ onAddBanner }: BannersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">
          Quản lý Banner
        </h1>
        <p className="text-muted-foreground mt-1">
          Kiểm soát trải nghiệm trang chủ và khuyến mãi
        </p>
      </div>
      <Button 
        onClick={onAddBanner}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E53935] text-white hover:bg-[#D32F2F] sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        Thêm Banner
      </Button>
    </div>
  );
}
