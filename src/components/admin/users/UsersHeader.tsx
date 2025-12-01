import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

interface UsersHeaderProps {
  onOpenCreate: () => void;
}

export function UsersHeader({ onOpenCreate }: UsersHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">
          Quản lý người dùng
        </h1>
        <p className="text-muted-foreground mt-1">
          Quản lý tất cả người dùng trong hệ thống
        </p>
      </div>
      <Button
        onClick={onOpenCreate}
        className="flex items-center gap-2 rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        Thêm người dùng
      </Button>
    </div>
  );
}
