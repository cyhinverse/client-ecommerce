import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

interface UsersHeaderProps {
  onOpenCreate: () => void;
}

export function UsersHeader({ onOpenCreate }: UsersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Users className="h-6 w-6 text-gray-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý tất cả người dùng trong hệ thống
          </p>
        </div>
      </div>
      <Button
        onClick={onOpenCreate}
        className="bg-gray-900 text-white hover:bg-gray-800 font-medium"
      >
        <Plus className="h-4 w-4 mr-2" />
        Thêm người dùng
      </Button>
    </div>
  );
}
