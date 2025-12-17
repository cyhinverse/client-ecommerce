import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NotificationsHeaderProps {
  onOpenCreate: () => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export function NotificationsHeader({ onOpenCreate, onMarkAllRead, onClearAll }: NotificationsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-6 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">Notifications</h1>
        <p className="text-muted-foreground mt-1 text-sm bg-transparent">
           Manage system alerts and updates
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
            variant="outline" 
            onClick={onMarkAllRead}
            className="rounded-xl border-gray-200 h-10"
        >
            Mark all read
        </Button>
        <Button 
            variant="destructive" 
            onClick={onClearAll}
            className="rounded-xl h-10"
        >
            Clear all
        </Button>
        <Button 
          onClick={onOpenCreate}
          className="rounded-xl h-10 gap-2 text-sm font-medium transition-all shadow-lg hover:shadow-xl bg-black hover:bg-black/90 text-white dark:bg-[#0071e3] dark:hover:bg-[#0077ED] border border-transparent"
        >
          <Plus className="h-4 w-4" />
          Create Notification
        </Button>
      </div>
    </div>
  );
}
