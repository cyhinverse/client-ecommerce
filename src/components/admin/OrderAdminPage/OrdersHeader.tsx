import { Button } from "@/components/ui/button";

interface OrdersHeaderProps {
  onAddOrder?: () => void;
}

export function OrdersHeader({ onAddOrder }: OrdersHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Đơn hàng</h1>
        <p className="text-muted-foreground">
          Quản lý và theo dõi tất cả đơn hàng trong hệ thống
        </p>
      </div>
      {/* Có thể thêm nút tạo đơn hàng mới nếu cần */}
      {/* <Button onClick={onAddOrder}>
        <Plus className="w-4 h-4 mr-2" />
        Thêm đơn hàng
      </Button> */}
    </div>
  );
}