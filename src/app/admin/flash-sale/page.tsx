"use client";

import { useEffect, useState } from "react";
import {
  Zap,
  Plus,
  Search,
  Clock,
  Package,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import instance from "@/api/api";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";

interface FlashSaleProduct {
  _id: string;
  name: string;
  slug: string;
  variants?: { images?: string[] }[];
  price: { currentPrice: number };
  flashSale: {
    isActive: boolean;
    salePrice: number;
    discountPercent: number;
    stock: number;
    soldCount: number;
    startTime: string;
    endTime: string;
  };
}

interface TimeSlot {
  startTime: Date;
  endTime: Date;
  status: string;
  label: string;
}

export default function AdminFlashSalePage() {
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);
  const [schedule, setSchedule] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Form state for adding product to flash sale
  const [formData, setFormData] = useState({
    salePrice: 0,
    discountPercent: 0,
    stock: 100,
    startTime: "",
    endTime: "",
  });

  const fetchFlashSale = async () => {
    try {
      setLoading(true);
      const [productsRes, scheduleRes] = await Promise.all([
        instance.get("/flash-sale"),
        instance.get("/flash-sale/schedule"),
      ]);
      setProducts(productsRes.data.data?.data || []);
      setSchedule(scheduleRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch flash sale:", error);
      toast.error("Failed to load flash sale data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashSale();
  }, []);

  const handleAddToFlashSale = async () => {
    if (
      !selectedProductId ||
      !formData.salePrice ||
      !formData.startTime ||
      !formData.endTime
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsAdding(true);
    try {
      await instance.post(`/flash-sale/${selectedProductId}`, formData);
      toast.success("Product added to flash sale");
      setAddModalOpen(false);
      setSelectedProductId("");
      setFormData({
        salePrice: 0,
        discountPercent: 0,
        stock: 100,
        startTime: "",
        endTime: "",
      });
      fetchFlashSale();
    } catch (error) {
      console.error("Failed to add to flash sale:", error);
      toast.error("Failed to add product to flash sale");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFromFlashSale = async (productId: string) => {
    if (!confirm("Remove this product from flash sale?")) return;
    try {
      await instance.delete(`/flash-sale/${productId}`);
      toast.success("Product removed from flash sale");
      fetchFlashSale();
    } catch (error) {
      console.error("Failed to remove from flash sale:", error);
      toast.error("Failed to remove product");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalProducts = products.length;
  const totalSold = products.reduce(
    (sum, p) => sum + (p.flashSale?.soldCount || 0),
    0
  );
  const avgDiscount = products.length
    ? Math.round(
        products.reduce(
          (sum, p) => sum + (p.flashSale?.discountPercent || 0),
          0
        ) / products.length
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="h-6 w-6 text-[#E53935]" />
            Flash Sale
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage flash sale campaigns
          </p>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="bg-[#E53935] hover:bg-[#D32F2F] text-white rounded-xl gap-2"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Active Products",
            value: totalProducts,
            icon: Package,
            color: "text-foreground",
          },
          {
            label: "Total Sold",
            value: totalSold,
            icon: TrendingUp,
            color: "text-green-600",
          },
          {
            label: "Avg Discount",
            value: `${avgDiscount}%`,
            icon: Zap,
            color: "text-[#E53935]",
          },
          {
            label: "Next Sale",
            value: schedule[0]?.label || "N/A",
            icon: Clock,
            color: "text-purple-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-[#f7f7f7] dark:bg-[#1C1C1E] p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Schedule */}
      <div className="rounded-2xl bg-[#f7f7f7] dark:bg-[#1C1C1E] p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4" /> Upcoming Schedule
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {schedule.map((slot, i) => (
            <div
              key={i}
              className={`shrink-0 px-4 py-3 rounded-xl ${
                slot.status === "upcoming"
                  ? "bg-[#E53935]/10"
                  : "bg-white dark:bg-black/20"
              }`}
            >
              <p className="font-bold text-lg">{slot.label}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(slot.startTime), "dd/MM")}
              </p>
            </div>
          ))}
          {schedule.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No upcoming sales scheduled
            </p>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Flash Sale Products</h3>
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded-xl border-0 bg-[#f7f7f7] dark:bg-[#1C1C1E] h-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#f7f7f7] p-4">
                <Skeleton className="aspect-square w-full rounded-xl mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground rounded-2xl bg-[#f7f7f7] dark:bg-[#1C1C1E]">
            <Zap className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No flash sale products</p>
            <p className="text-sm">
              Add products to start a flash sale campaign
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const soldPercent = product.flashSale?.stock
                ? Math.round(
                    (product.flashSale.soldCount / product.flashSale.stock) *
                      100
                  )
                : 0;
              const timeLeft = product.flashSale?.endTime
                ? formatDistanceToNow(new Date(product.flashSale.endTime), {
                    addSuffix: true,
                  })
                : "";

              return (
                <div
                  key={product._id}
                  className="group rounded-2xl bg-[#f7f7f7] dark:bg-[#1C1C1E] overflow-hidden hover:bg-[#f0f0f0] dark:hover:bg-[#252528] transition-colors"
                >
                  <div className="aspect-square relative bg-white dark:bg-black/20 m-3 rounded-xl overflow-hidden">
                    <Image
                      src={
                        product.variants?.[0]?.images?.[0] ||
                        "/images/placeholder.png"
                      }
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-[#E53935] text-white border-0">
                      -{product.flashSale?.discountPercent || 0}%
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveFromFlashSale(product._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="px-4 pb-4">
                    <h4 className="font-medium text-sm line-clamp-2 mb-2">
                      {product.name}
                    </h4>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-bold text-[#E53935]">
                        {product.flashSale?.salePrice?.toLocaleString()}đ
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        {product.price?.currentPrice?.toLocaleString()}đ
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Sold</span>
                        <span className="font-medium">
                          {product.flashSale?.soldCount || 0}/
                          {product.flashSale?.stock || 0}
                        </span>
                      </div>
                      <Progress value={soldPercent} className="h-1.5" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Ends {timeLeft}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Product to Flash Sale</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product ID</Label>
              <Input
                placeholder="Enter product ID"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sale Price</Label>
                <Input
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salePrice: Number(e.target.value),
                    })
                  }
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Discount %</Label>
                <Input
                  type="number"
                  value={formData.discountPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPercent: Number(e.target.value),
                    })
                  }
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Stock for Flash Sale</Label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddModalOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToFlashSale}
              disabled={isAdding}
              className="bg-[#E53935] hover:bg-[#D32F2F] text-white rounded-xl"
            >
              {isAdding ? "Adding..." : "Add to Flash Sale"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
