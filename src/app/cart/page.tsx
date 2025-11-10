"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getCart, updateCartItem } from "@/features/cart/cartAction";
import SpinnerLoading from "@/components/common/SpinerLoading";
import { toast } from "sonner";

export default function CartPage() {
  const { data, isLoading, error } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ itemId, quantity: newQuantity }));
  };

  const removeItem = (id: string) => {
    data?.items.filter((item) => item._id !== id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // THÊM TÍNH TOÁN AN TOÀN
  const subtotal =
    data?.items?.reduce(
      (sum, item) => sum + (item.price?.currentPrice || 0) * item.quantity,
      0,
    ) ?? 0;
  const shipping = 50000;
  const total = subtotal + shipping;
  const totalItems =
    data?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (error) {
    toast.error("Đã xảy ra lỗi khi tải giỏ hàng");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tiếp tục mua sắm
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Giỏ hàng ({totalItems} sản phẩm)
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {data?.items?.map((item) => {
            console.log("📦 Rendering item:", item);
            return (
              <Card key={item._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image - THÊM FALLBACK */}
                      <div className="relative w-full sm:w-24 h-24 bg-gray-50 rounded-lg shrink-0">
                        {item.productId?.images?.[0] ? (
                          <Image
                            src={item.productId.images[0]}
                            alt={item.productId.name || "Product image"}
                            fill
                            className="object-cover rounded-lg"
                            onError={(e) => {
                              console.log("🖼️ Image error for item:", item._id);
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 pr-2">
                            <h3 className="font-semibold text-gray-900 text-base leading-tight">
                              {item.productId?.name || "Unknown Product"}
                            </h3>
                            {item.variantId && (
                              <p className="text-sm text-gray-600 mt-1">
                                Variant: {item.variantId}
                              </p>
                            )}
                            {item.productId?.category?.name && (
                              <Badge variant="secondary" className="mt-1">
                                {item.productId.category.name}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item._id)}
                            className="text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-semibold text-gray-900">
                                {formatPrice(
                                  item.price?.discountPrice ||
                                    item.price?.currentPrice ||
                                    0,
                                )}
                              </span>
                              {item.price?.currentPrice &&
                                item.price.currentPrice >
                                  (item.price.discountPrice || 0) && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(item.price.currentPrice)}
                                  </span>
                                )}
                            </div>
                            {item.price?.currentPrice &&
                              item.price.currentPrice >
                                (item.price.discountPrice || 0) && (
                                <span className="text-xs text-green-600 mt-1">
                                  Tiết kiệm{" "}
                                  {formatPrice(
                                    item.price.currentPrice -
                                      (item.price.discountPrice || 0),
                                  )}
                                </span>
                              )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="h-8 w-8 hover:bg-gray-100"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center font-medium text-sm border-x border-gray-300 py-2">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              className="h-8 w-8 hover:bg-gray-100"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Order Summary - BỎ COMMENT */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Tạm tính ({totalItems} sản phẩm)
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Tổng cộng</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Thanh toán
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Miễn phí vận chuyển cho đơn hàng trên 1.000.000đ
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
