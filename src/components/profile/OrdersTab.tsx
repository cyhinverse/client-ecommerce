"use client";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function OrdersTab() {
  const router = useRouter();

  return (
    <div className="text-center py-12">
      <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Chưa có đơn hàng</h3>
      <p className="text-muted-foreground mb-6">
        Lịch sử đơn hàng của bạn sẽ xuất hiện tại đây
      </p>
      <Button onClick={() => router.push("/products")}>
        Mua sắm ngay
      </Button>
    </div>
  );
}