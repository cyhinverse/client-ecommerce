export function OrdersHeader() {
  return (
    <div className="flex items-center justify-between border-b border-border pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">
          Quản lý Đơn hàng
        </h1>
        <p className="text-muted-foreground mt-1">
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
