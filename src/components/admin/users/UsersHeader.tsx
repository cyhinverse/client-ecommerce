import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface UsersHeaderProps {
  onOpenCreate: () => void;
}

export function UsersHeader({ onOpenCreate }: UsersHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-6">
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
        className="flex items-center gap-2 rounded-xl bg-[#E53935] text-white hover:bg-[#D32F2F] transition-colors h-10 px-5"
      >
        <Plus className="h-4 w-4" />
        Add User
      </Button>
    </div>
  );
}
