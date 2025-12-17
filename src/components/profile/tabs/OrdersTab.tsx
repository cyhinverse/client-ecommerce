"use client";
import { Package, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { getUserOrders, cancelOrder } from "@/features/order/orderAction";
import { toast } from "sonner";
import { Order } from "@/types/order";
import OrderCard from "../order/OrderCard";
import OrderDialog from "../order/OrderDialog";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { cn } from "@/lib/utils";

type OrderStatus =
  | "all"
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export default function OrdersTab() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userOrders, isLoading, error } = useAppSelector(
    (state) => state.order
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<OrderStatus>("all");

  useEffect(() => {
    dispatch(getUserOrders({ limit: 50 }));
  }, [dispatch]);

  const handleViewOrder = (orderId: string) => {
    const order = userOrders.find((order) => order._id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setCancellingOrder(orderId);
    try {
      await dispatch(cancelOrder(orderId)).unwrap();
      toast.success("Order cancelled successfully");
      dispatch(getUserOrders({ limit: 50 }));
    } catch (error: unknown) {
      console.error("Error cancelling order:", error);
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        err.response?.data?.message || "Unable to cancel order";
      toast.error(errorMessage);
    } finally {
      setCancellingOrder(null);
    }
  };

  // Filter orders by status
  const filteredOrders = userOrders.filter((order) => {
    if (activeStatus === "all") return true;
    return order.status?.toLowerCase() === activeStatus.toLowerCase();
  });

  const getOrderCount = (status: OrderStatus) => {
    if (status === "all") return userOrders.length;
    return userOrders.filter((order) => order.status?.toLowerCase() === status.toLowerCase()).length;
  };

  const statusTabs: { value: OrderStatus; label: string; count: number }[] = [
    { value: "all", label: "All", count: getOrderCount("all") },
    { value: "pending", label: "Pending", count: getOrderCount("pending") },
    { value: "confirmed", label: "Confirmed", count: getOrderCount("confirmed") },
    { value: "processing", label: "Processing", count: getOrderCount("processing") },
    { value: "shipped", label: "Shipping", count: getOrderCount("shipped") },
    { value: "delivered", label: "Delivered", count: getOrderCount("delivered") },
    { value: "cancelled", label: "Cancelled", count: getOrderCount("cancelled") },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <Package className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="text-xl font-bold tracking-tight mb-2">Something went wrong</h3>
        <p className="text-muted-foreground mb-8 max-w-sm">
          We couldn&apos;t load your orders. This might be a temporary issue.
        </p>
        <Button onClick={() => dispatch(getUserOrders({ limit: 50 }))} size="lg" className="rounded-full">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative min-h-[400px]">
      {isLoading && <SpinnerLoading className="absolute inset-0 m-auto" />}
      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
        {!userOrders || userOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                <Package className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-8 max-w-sm">
              It looks like you haven&apos;t placed any orders yet. Start shopping to fill this page!
            </p>
            <Button onClick={() => router.push("/products")} size="lg" className="rounded-full px-8">
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold tracking-tight">Order History</h2>
              <Button variant="outline" size="sm" onClick={() => router.push("/products")} className="rounded-full">
                Continue Shopping
              </Button>
            </div>

            <Tabs
              value={activeStatus}
              onValueChange={(value) => setActiveStatus(value as OrderStatus)}
              className="w-full"
            >
              <div className="w-full overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                <TabsList className="h-auto p-1 bg-muted/50 rounded-full inline-flex w-auto min-w-full sm:min-w-0">
                    {statusTabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={cn(
                            "rounded-full px-4 py-2 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white",
                            tab.count === 0 && "text-muted-foreground/60"
                        )}
                    >
                        {tab.label}
                        {tab.count > 0 && <span className="ml-1.5 opacity-70">({tab.count})</span>}
                    </TabsTrigger>
                    ))}
                </TabsList>
              </div>

              <TabsContent value={activeStatus} className="mt-6 space-y-6">
                {filteredOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
                    <Filter className="h-10 w-10 text-muted-foreground/40 mb-4" />
                    <h3 className="text-lg font-medium mb-1">
                      No {activeStatus === "all" ? "" : activeStatus} orders
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        We couldn&apos;t find any orders with this status.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredOrders.map((order: Order, index: number) => (
                      <OrderCard
                        key={order._id || `order-${index}`}
                        order={order}
                        onViewOrder={handleViewOrder}
                        onCancelOrder={handleCancelOrder}
                        isCancelling={cancellingOrder === order._id}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <OrderDialog
              order={selectedOrder}
              open={isDialogOpen}
              onClose={handleCloseDialog}
            />
          </>
        )}
      </div>
    </div>
  );
}
