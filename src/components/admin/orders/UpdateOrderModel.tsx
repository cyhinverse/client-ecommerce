import { useState, useLayoutEffect } from "react";
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
  const [status, setStatus] = useState("");

  useLayoutEffect(() => {
    if (order) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus(order.status);
    }
  }, [order]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ status });
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Order Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
