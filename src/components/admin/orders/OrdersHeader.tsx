export function OrdersHeader() {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">
          Order Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage and track all orders in the system
        </p>
      </div>
    </div>
  );
}
