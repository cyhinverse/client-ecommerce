import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useLayoutEffect } from "react";
import { User } from "@/types/user";

interface UpdateUserData {
  id: string;
  username: string;
  email: string;
  roles: string;
  isVerifiedEmail: boolean;
}

interface UpdateModelUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onUpdate: (userData: UpdateUserData) => void;
  isLoading?: boolean;
}

export function UpdateModelUser({
  open,
  onOpenChange,
  user,
  onUpdate,
  isLoading = false,
}: UpdateModelUserProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    roles: "user",
    isVerifiedEmail: false,
  });

  useLayoutEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        roles: user.roles || "user",
        isVerifiedEmail: user.isVerifiedEmail || false,
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onUpdate({
        ...formData,
        id: user._id,
      });
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[2rem] border-border/50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl shadow-2xl p-6 max-w-md max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader className="border-b border-border/50 pb-6">
          <DialogTitle className="text-2xl font-bold tracking-tight">Edit User</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update user account information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-6">
           <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                Username
                </Label>
                <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                }
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                required
                disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                Email
                </Label>
                <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                required
                disabled={isLoading}
                />
            </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="roles" className="text-sm font-medium">
                    Role
                    </Label>
                    <Select
                    value={formData.roles}
                    onValueChange={(value) =>
                        setFormData({ ...formData, roles: value })
                    }
                    disabled={isLoading}
                    >
                    <SelectTrigger className="rounded-xl border-gray-200 bg-gray-50/50 focus:ring-0 shadow-sm h-10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50 shadow-lg">
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="isVerifiedEmail" className="text-sm font-medium">
                    Verification
                    </Label>
                    <Select
                    value={formData.isVerifiedEmail.toString()}
                    onValueChange={(value) =>
                        setFormData({ ...formData, isVerifiedEmail: value === "true" })
                    }
                    disabled={isLoading}
                    >
                    <SelectTrigger className="rounded-xl border-gray-200 bg-gray-50/50 focus:ring-0 shadow-sm h-10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50 shadow-lg">
                        <SelectItem value="true">Verified</SelectItem>
                        <SelectItem value="false">Unverified</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="rounded-xl h-10 px-5 border-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl h-10 px-6 bg-black text-white hover:bg-black/90 dark:bg-[#0071e3] shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
