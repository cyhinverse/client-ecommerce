import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface UsersHeaderProps {
  onOpenCreate: () => void;
}

export function UsersHeader({ onOpenCreate }: UsersHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">
          User Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage all users in the system
        </p>
      </div>
      <Button
        onClick={onOpenCreate}
        className="flex items-center gap-2 rounded-xl bg-black text-white hover:bg-black/90 dark:bg-[#0071e3] transition-colors shadow-sm h-10 px-5"
      >
        <Plus className="h-4 w-4" />
        Add User
      </Button>
    </div>
  );
}
