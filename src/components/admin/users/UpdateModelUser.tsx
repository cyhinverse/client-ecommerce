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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <DialogContent className="bg-background border-border text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information about user in the system
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-muted-foreground">
              Username
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="bg-background border-border text-foreground"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="bg-background border-border text-foreground"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roles" className="text-muted-foreground">
              Role
            </Label>
            <Select
              value={formData.roles}
              onValueChange={(value) =>
                setFormData({ ...formData, roles: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border text-foreground">
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isVerifiedEmail" className="text-muted-foreground">
              Email Verification
            </Label>
            <Select
              value={formData.isVerifiedEmail.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, isVerifiedEmail: value === "true" })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border text-foreground">
                <SelectItem value="true">Verified</SelectItem>
                <SelectItem value="false">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
