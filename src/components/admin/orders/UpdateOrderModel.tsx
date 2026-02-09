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
            Cập nhật trạng thái đơn hàng
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Trạng thái đơn hàng
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50">
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="shipped">Đang giao</SelectItem>
                <SelectItem value="delivered">Đã giao</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
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
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-black hover:bg-black/90 text-white dark:bg-[#0071e3] dark:hover:bg-[#0077ED]"
            >
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
