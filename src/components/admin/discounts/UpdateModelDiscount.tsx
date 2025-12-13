import { useState, useLayoutEffect, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { Discount, UpdateDiscountData } from "@/types/discount";

interface UpdateModelDiscountProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discount: Discount | null;
  onUpdate: (discountData: UpdateDiscountData) => void;
  isLoading: boolean;
}

export function UpdateModelDiscount({
  open,
  onOpenChange,
  discount,
  onUpdate,
  isLoading,
}: UpdateModelDiscountProps) {
  const initialFormData = useMemo(
    () => ({
      code: discount?.code || "",
      description: discount?.description || "",
      discountType: discount?.discountType || "percent",
      discountValue: discount?.discountValue?.toString() || "",
      startDate: discount?.startDate?.split("T")[0] || "",
      endDate: discount?.endDate?.split("T")[0] || "",
      minOrderValue: discount?.minOrderValue?.toString() || "",
      usageLimit: discount?.usageLimit?.toString() || "1",
      isActive: discount?.isActive ?? true,
    }),
    [discount]
  );

  const [formData, setFormData] = useState(initialFormData);

  // Reset form when discount changes
  useLayoutEffect(() => {
    if (discount) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        code: discount.code,
        description: discount.description || "",
        discountType: discount.discountType,
        discountValue: discount.discountValue.toString(),
        startDate: discount.startDate.split("T")[0],
        endDate: discount.endDate.split("T")[0],
        minOrderValue: discount.minOrderValue.toString(),
        usageLimit: discount.usageLimit.toString(),
        isActive: discount.isActive,
      });
    }
  }, [discount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!discount) return;

    const discountData = {
      ...formData,
      discountValue: Number(formData.discountValue),
      minOrderValue: Number(formData.minOrderValue) || 0,
      usageLimit: Number(formData.usageLimit),
    };

    onUpdate(discountData);
  };

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cập nhật mã giảm giá</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin mã giảm giá {discount?.code}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã giảm giá *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountType">Loại giảm giá *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) => handleChange("discountType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Phần trăm (%)</SelectItem>
                    <SelectItem value="fixed">Số tiền cố định</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Giá trị giảm *{" "}
                  {formData.discountType === "percent" ? "(%)" : "(VNĐ)"}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) =>
                    handleChange("discountValue", e.target.value)
                  }
                  min="0"
                  max={formData.discountType === "percent" ? "100" : undefined}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageLimit">Giới hạn lượt dùng *</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => handleChange("usageLimit", e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrderValue">
                Giá trị đơn hàng tối thiểu (VNĐ)
              </Label>
              <Input
                id="minOrderValue"
                type="number"
                value={formData.minOrderValue}
                onChange={(e) => handleChange("minOrderValue", e.target.value)}
                min="0"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Kích hoạt mã giảm giá</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cập nhật
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
