import { useState } from "react";
import { Order } from "@/types/order";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderData: { status: string }) => void;
  order: Order | null;
  isLoading: boolean;
}

export function EditOrderModal({
  isOpen,
  onClose,
  onSave,
  order,
  isLoading,
}: EditOrderModalProps) {
  const [status, setStatus] = useState(order?.status ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ status });
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-4xl border-border/50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Update Order Status
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Order Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50">
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-black hover:bg-black/90 text-white dark:bg-[#0071e3] dark:hover:bg-[#0077ED]"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
