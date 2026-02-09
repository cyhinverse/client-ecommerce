export function OrdersHeader() {
  return (
    <div className="flex flex-col gap-3 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">
          Quản lý Đơn hàng
        </h1>
        <p className="text-muted-foreground mt-1">
          Quản lý và theo dõi tất cả đơn hàng trong hệ thống
        </p>
      </div>
    </div>
  );
}
