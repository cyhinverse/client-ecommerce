import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DiscountsHeaderProps {
  onOpenCreate: () => void;
}

export function DiscountsHeader({ onOpenCreate }: DiscountsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mã giảm giá</h1>
        <p className="text-muted-foreground">
          Quản lý và tạo mã giảm giá cho cửa hàng
        </p>
      </div>
      <Button onClick={onOpenCreate}>
        <Plus className="w-4 h-4 mr-2" />
        Tạo mã giảm giá
      </Button>
    </div>
  );
}