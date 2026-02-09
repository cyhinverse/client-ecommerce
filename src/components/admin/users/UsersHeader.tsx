import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface UsersHeaderProps {
  onOpenCreate: () => void;
}

export function UsersHeader({ onOpenCreate }: UsersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">
          Quản lý Người dùng
        </h1>
        <p className="text-muted-foreground mt-1">
          Quản lý tất cả người dùng trong hệ thống
        </p>
      </div>
      <Button
        onClick={onOpenCreate}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E53935] text-white hover:bg-[#D32F2F] transition-colors h-10 px-5 sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        Thêm Người dùng
      </Button>
    </div>
  );
}
