import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Discount } from "@/types/discount";
import { Edit, Calendar, Tag, DollarSign, Package, BarChart3 } from "lucide-react";

interface ViewModelDiscountProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discount: Discount | null;
  onEdit: (discount: Discount) => void;
}

export function ViewModelDiscount({
  open,
  onOpenChange,
  discount,
  onEdit,
}: ViewModelDiscountProps) {
  if (!discount) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = () => {
    if (!discount.isActive) {
      return <Badge variant="secondary">Đã tắt</Badge>;
    }
    if (new Date(discount.endDate) < new Date()) {
      return <Badge variant="destructive">Hết hạn</Badge>;
    }
    if (discount.usedCount >= discount.usageLimit) {
      return <Badge variant="destructive">Hết lượt</Badge>;
    }
    return <Badge variant="default">Đang hoạt động</Badge>;
  };

  const getDiscountTypeText = () => {
    return discount.discountType === "percent" ? "Phần trăm" : "Số tiền cố định";
  };

  const getDiscountValueText = () => {
    return discount.discountType === "percent" 
      ? `${discount.discountValue}%`
      : `${discount.discountValue.toLocaleString()} VNĐ`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Chi tiết mã giảm giá
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về mã giảm giá {discount.code}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{discount.code}</h3>
                {discount.description && (
                  <p className="text-muted-foreground mt-1">{discount.description}</p>
                )}
              </div>
              {getStatusBadge()}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="font-medium">Loại giảm giá:</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{getDiscountTypeText()}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="font-medium">Giá trị:</span>
                <div className="text-success font-semibold">
                  {getDiscountValueText()}
                </div>
              </div>
            </div>
          </div>

          {/* Usage Info */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Thông tin sử dụng
            </h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="font-medium">Đã sử dụng:</span>
                <div>
                  {discount.usedCount} / {discount.usageLimit} lượt
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="font-medium">Tỷ lệ sử dụng:</span>
                <div>
                  {((discount.usedCount / discount.usageLimit) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {discount.minOrderValue > 0 && (
              <div className="text-sm">
                <span className="font-medium">Đơn hàng tối thiểu: </span>
                <span>{discount.minOrderValue.toLocaleString()} VNĐ</span>
              </div>
            )}
          </div>

          {/* Date Info */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Thời gian hiệu lực
            </h4>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Bắt đầu: </span>
                <span>{formatDate(discount.startDate)}</span>
              </div>
              <div>
                <span className="font-medium">Kết thúc: </span>
                <span>{formatDate(discount.endDate)}</span>
              </div>
            </div>
          </div>

          {/* Products Info */}
          {discount.applicableProducts && discount.applicableProducts.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Sản phẩm áp dụng
              </h4>
              <div className="text-sm">
                <span className="font-medium">Áp dụng cho: </span>
                <span>{discount.applicableProducts.length} sản phẩm</span>
              </div>
            </div>
          )}

          {/* Created Info */}
          <div className="text-xs text-muted-foreground border-t pt-4">
            <div>Được tạo: {formatDate(discount.createdAt)}</div>
            {discount.updatedAt !== discount.createdAt && (
              <div>Cập nhật lần cuối: {formatDate(discount.updatedAt)}</div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
          <Button
            onClick={() => onEdit(discount)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}