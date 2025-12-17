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
import { Plus } from "lucide-react";

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
       <DialogContent className="rounded-[2rem] border-border/50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl shadow-2xl p-6 max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader className="border-b border-border/50 pb-6">
          <DialogTitle className="text-2xl font-bold tracking-tight">Add New User</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter new user information below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-6">
          <div className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                Full Name
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
                placeholder="Enter full name"
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
                placeholder="Enter email address"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
                </Label>
                <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                }
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                required
                disabled={isLoading}
                placeholder="Enter phone number"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                Password
                </Label>
                <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                }
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                required
                disabled={isLoading}
                placeholder="Enter password (at least 6 characters)"
                minLength={6}
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
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50 shadow-lg">
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
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
                        <SelectValue placeholder="Status" />
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
              onClick={handleClose}
              className="rounded-xl h-10 px-5 border-gray-200"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl h-10 px-6 bg-black text-white hover:bg-black/90 dark:bg-[#0071e3] shadow-sm flex items-center gap-2"
              disabled={isLoading}
            >
               {isLoading ? "Creating..." : (
                   <>
                    <Plus className="h-4 w-4" />
                    Create User
                   </>
               )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
