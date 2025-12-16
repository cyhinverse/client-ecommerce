"use client";
import { Package } from "lucide-react";
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

  // Lọc đơn hàng theo status
  const filteredOrders = userOrders.filter((order) => {
    if (activeStatus === "all") return true;
    return order.status === activeStatus;
  });

  // Đếm số lượng đơn hàng theo từng status
  const getOrderCount = (status: OrderStatus) => {
    if (status === "all") return userOrders.length;
    return userOrders.filter((order) => order.status === status).length;
  };

  const statusTabs: { value: OrderStatus; label: string; count: number }[] = [
    { value: "all", label: "All", count: getOrderCount("all") },
    {
      value: "pending",
      label: "Pending",
      count: getOrderCount("pending"),
    },
    {
      value: "confirmed",
      label: "Confirmed",
      count: getOrderCount("confirmed"),
    },
    {
      value: "processing",
      label: "Processing",
      count: getOrderCount("processing"),
    },
    { value: "shipped", label: "Shipping", count: getOrderCount("shipped") },
    { value: "delivered", label: "Delivered", count: getOrderCount("delivered") },
    { value: "cancelled", label: "Cancelled", count: getOrderCount("cancelled") },
  ];

  // Loading Skeleton -> Moved to overlay inside Activity

  // Error State
  if (error) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">An error occurred</h3>
        <p className="text-muted-foreground mb-6">
          Unable to load order list. Please try again later.
        </p>
        <Button onClick={() => dispatch(getUserOrders({ limit: 50 }))}>
          Try Again
        </Button>
      </div>
    );
  }

  // NOTE: Logic for "Empty State" (lines 106-119) is partially redundant with the Tabs content (line 150)
  // but let's keep it wrapped in Activity if meaningful.
  // Actually, standardizing: Activity should handle the "loading" part.

  return (
    <div className="space-y-6 relative min-h-[200px]">
      {isLoading && <SpinnerLoading className="absolute inset-0 m-auto" />}
      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
        {!userOrders || userOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">
              Your order history will appear here
            </p>
            <Button onClick={() => router.push("/products")}>
              Shop Now
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Orders</h2>
              <Button onClick={() => router.push("/products")}>
                Continue Shopping
              </Button>
            </div>

            {/* Tabs theo status */}
            <Tabs
              value={activeStatus}
              onValueChange={(value) => setActiveStatus(value as OrderStatus)}
              className="w-full"
            >
              <TabsList className="w-full overflow-x-auto flex justify-start h-auto p-1 bg-muted/50">
                {statusTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value} // ✅ THÊM KEY Ở ĐÂY
                    value={tab.value}
                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <span>{tab.label}</span>
                    <span className="bg-muted px-1.5 py-0.5 rounded-full text-xs min-w-6 text-center">
                      {tab.count}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Content cho từng tab */}
              <TabsContent value={activeStatus} className="m-0 mt-4">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 border rounded-lg">
                    <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {activeStatus === "all"
                        ? "No orders yet"
                        : `No orders in ${statusTabs
                            .find((tab) => tab.value === activeStatus)
                            ?.label.toLowerCase()} status`}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {activeStatus === "all"
                        ? "Your order history will appear here"
                        : `No orders found in this status`}
                    </p>
                    {activeStatus === "all" && (
                      <Button onClick={() => router.push("/products")}>
                        Shop Now
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order: Order, index: number) => (
                      <OrderCard
                        key={order._id || `order-${index}`} // ✅ ĐÃ CÓ KEY Ở ĐÂY
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
