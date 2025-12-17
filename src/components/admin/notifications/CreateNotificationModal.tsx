import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export interface CreateNotificationForm {
  title: string;
  message: string;
  type: string;
  link: string;
  userId: string;
}

interface CreateNotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CreateNotificationForm) => void;
  isLoading: boolean;
}

export function CreateNotificationModal({
  open,
  onOpenChange,
  onCreate,
  isLoading,
}: CreateNotificationModalProps) {
  const [formData, setFormData] = useState<CreateNotificationForm>({
    title: "",
    message: "",
    type: "SYSTEM",
    link: "",
    userId: "",
  });

  const handleChange = (field: keyof CreateNotificationForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  const handleOpenChangeWrapper = (open: boolean) => {
    if (!open) {
      setFormData({
        title: "",
        message: "",
        type: "SYSTEM",
        link: "",
        userId: "",
      });
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChangeWrapper}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-border/50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">Create Notification</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Send a new notification to users or system-wide.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Notification Title"
              required
              className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50">
                <SelectItem value="SYSTEM">System</SelectItem>
                <SelectItem value="ORDER">Order</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="PROMOTION">Promotion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Notification content..."
              required
              className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all resize-none min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="userId" className="text-sm font-medium">User ID (Optional)</Label>
                <Input
                id="userId"
                value={formData.userId}
                onChange={(e) => handleChange("userId", e.target.value)}
                placeholder="Specific User ID"
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="link" className="text-sm font-medium">Link (Optional)</Label>
                <Input
                id="link"
                value={formData.link}
                onChange={(e) => handleChange("link", e.target.value)}
                placeholder="/products/..."
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChangeWrapper(false)}
              disabled={isLoading}
              className="rounded-xl border-gray-200"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-xl bg-black hover:bg-black/90 text-white dark:bg-[#0071e3] dark:hover:bg-[#0077ED]">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Notification
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
