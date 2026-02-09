import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NotificationsHeaderProps {
  onOpenCreate: () => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export function NotificationsHeader({ onOpenCreate, onMarkAllRead, onClearAll }: NotificationsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">Thông báo</h1>
        <p className="text-muted-foreground mt-1 text-sm bg-transparent">
           Quản lý cảnh báo và cập nhật hệ thống
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
            variant="outline" 
            onClick={onMarkAllRead}
            className="rounded-xl border-0 bg-[#f7f7f7] hover:bg-[#eeeeee] h-10"
        >
            Đánh dấu đã đọc
        </Button>
        <Button 
            variant="destructive" 
            onClick={onClearAll}
            className="rounded-xl h-10"
        >
            Xóa tất cả
        </Button>
        <Button 
          onClick={onOpenCreate}
          className="rounded-xl h-10 gap-2 text-sm font-medium transition-all bg-[#E53935] hover:bg-[#D32F2F] text-white"
        >
          <Plus className="h-4 w-4" />
          Tạo thông báo
        </Button>
      </div>
    </div>
  );
}
