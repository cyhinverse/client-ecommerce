"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, Package, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Shop, ShopOwner, ShopStatus } from "@/types/shop";

// Extended shop interface for admin view with additional computed fields
interface AdminShopView extends Omit<Shop, 'owner' | 'status'> {
  owner: ShopOwner;
  status: ShopStatus | "pending"; // Admin may see pending status
  totalProducts?: number;
  totalOrders?: number;
}

interface ViewShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: AdminShopView | null;
}

export function ViewShopModal({ isOpen, onClose, shop }: ViewShopModalProps) {
  if (!shop) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">Active</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">Pending</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Shop Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Shop Header */}
          <div className="flex items-start gap-4">
            <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
              {shop.logo ? (
                <Image
                  src={shop.logo}
                  alt={shop.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Store className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold truncate">{shop.name}</h3>
                {getStatusBadge(shop.status)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">/{shop.slug}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Created: {new Date(shop.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Owner Information */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Owner Information
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Username</span>
                <span className="text-sm font-medium">{shop.owner?.username || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium">{shop.owner?.email || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-center">
              <Package className="h-5 w-5 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-700">{shop.totalProducts || 0}</p>
              <p className="text-xs text-blue-600/80">Products</p>
            </div>
            <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 text-center">
              <ShoppingCart className="h-5 w-5 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-700">{shop.totalOrders || 0}</p>
              <p className="text-xs text-green-600/80">Orders</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-center">
              <Star className="h-5 w-5 mx-auto mb-2 text-amber-600" />
              <p className="text-2xl font-bold text-amber-700">{shop.rating?.toFixed(1) || "0.0"}</p>
              <p className="text-xs text-amber-600/80">Rating</p>
            </div>
          </div>

          {/* Description */}
          {shop.description && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Description
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {shop.description}
              </p>
            </div>
          )}

          {/* Quick Links */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 rounded-xl" asChild>
              <Link href={`/admin/products?shop=${shop._id}`}>
                <Package className="h-4 w-4 mr-2" />
                View Products
              </Link>
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl" asChild>
              <Link href={`/admin/orders?shop=${shop._id}`}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Orders
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
