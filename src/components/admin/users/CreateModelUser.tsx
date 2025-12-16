import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { useState } from "react";

interface CreateUserData {
  username: string;
  email: string;
  password: string;
  roles: string;
  isVerifiedEmail: boolean;
}

interface CreateModelUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (userData: CreateUserData) => void;
  isLoading?: boolean;
}

export function CreateModelUser({
  open,
  onOpenChange,
  onCreate,
  isLoading = false,
}: CreateModelUserProps) {
  // Trong CreateModelUser và UpdateModelUser
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    roles: "user",
    isVerifiedEmail: false,
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  const handleClose = () => {
    onOpenChange(false);
    setFormData({
      username: "",
      email: "",
      phone: "",
      roles: "user",
      isVerifiedEmail: false,
      password: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-background border-border text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Enter new user information below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-muted-foreground">
              Full Name
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
              placeholder="Enter full name"
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
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-muted-foreground">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="bg-background border-border text-foreground"
              required
              disabled={isLoading}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="bg-background border-border text-foreground"
              required
              disabled={isLoading}
              placeholder="Enter password (at least 6 characters)"
              minLength={6}
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
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border text-foreground">
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
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
                <SelectValue placeholder="Select verification status" />
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
              onClick={handleClose}
              className="border-border text-muted-foreground hover:bg-muted"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
