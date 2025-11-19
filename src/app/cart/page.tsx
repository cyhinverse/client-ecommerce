"use client";
import { useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "@/features/cart/cartAction";
import {
  toggleSelectItem,
  selectAllItems,
  unselectAllItems,
  prepareForCheckout,
} from "@/features/cart/cartSlice";
import SpinnerLoading from "@/components/common/SpinerLoading";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    data: cartData,
    isLoading,
    error,
    selectedItems,
    checkoutTotal,
  } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ itemId, quantity: newQuantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Giỏ hàng đã được xóa thành công");
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart({ itemId }));
  };

  const handleToggleSelect = (itemId: string) => {
    dispatch(toggleSelectItem(itemId));
  };

  const handleSelectAll = () => {
    dispatch(selectAllItems());
  };

  const handleUnselectAll = () => {
    dispatch(unselectAllItems());
  };

  const handleCheckout = () => {
    if (selectedItemsCount === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }
    dispatch(prepareForCheckout());
    router.push("/checkout");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const subtotal = cartData?.items?.reduce(
    (sum, item) => sum + (item.price?.currentPrice || 0) * item.quantity,
    0
  ) ?? 0;

  const totalItems = cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const selectedItemsCount = selectedItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const isAllSelected = cartData?.items && cartData.items.length > 0
    ? cartData.items.every(item => item.selected)
    : false;

  const hasCartItems = cartData?.items && cartData.items.length > 0;

  const hasSelectedItems = selectedItems && selectedItems.length > 0;

  if (error) {
    toast.error("Đã xảy ra lỗi khi tải giỏ hàng");
  }

  // Sửa lỗi: Kiểm tra cartData?.items thay vì cartData.items
  if (!cartData?.items || cartData.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="text-center py-16">
          <CardContent>
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-6">
              Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
            </p>
            <Link href="/products">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
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
        <div className="w-full max-w-[820px] flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Giỏ hàng ({totalItems} sản phẩm)
          </h1>
          <div className="flex items-center gap-4">
            {hasCartItems && (
              isAllSelected ? (
                <Button variant="outline" onClick={handleUnselectAll}>
                  Bỏ chọn tất cả
                </Button>
              ) : (
                <Button variant="outline" onClick={handleSelectAll}>
                  Chọn tất cả
                </Button>
              )
            )}
            <Button onClick={handleClearCart} variant="outline">
              Xóa tất cả
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <SpinnerLoading />
          ) : (
            // Sửa lỗi: Đảm bảo cartData.items tồn tại trước khi map
            cartData.items?.map((item) => (
              <Card key={item._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Checkbox for selection */}
                      <div className="flex items-start">
                        <Checkbox
                          checked={item.selected || false}
                          onCheckedChange={() => handleToggleSelect(item._id)}
                          className="mt-1"
                        />
                      </div>

                      {/* Product Image */}
                      <div className="relative w-full sm:w-24 h-24 bg-gray-50 rounded-lg shrink-0">
                        {item.variant?.images?.[0] ? (
                          <Image
                            src={item.variant.images[0]}
                            alt={item.productId.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        ) : item.productId.images?.[0] ? (
                          <Image
                            src={item.productId.images[0]}
                            alt={item.productId.name}
                            fill
                            className="object-cover rounded-lg"
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
                              {item.productId.name}
                            </h3>

                            {/* Variant Information */}
                            {item.variant && (
                              <div className="mt-2 space-y-2">
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                  {/* Color */}
                                  {item.variant.color && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Màu:</span>
                                      <div className="flex items-center gap-1">
                                        <div
                                          className="w-4 h-4 rounded-full border border-gray-300"
                                          style={{
                                            backgroundColor:
                                              item.variant.color.toLowerCase(),
                                          }}
                                        />
                                        <span>{item.variant.color}</span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Size */}
                                  {item.variant.size && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Size:</span>
                                      <Badge
                                        variant="outline"
                                        className="font-normal"
                                      >
                                        {item.variant.size}
                                      </Badge>
                                    </div>
                                  )}

                                  {/* SKU */}
                                  {item.variant.sku && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">SKU:</span>
                                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {item.variant.sku}
                                      </code>
                                    </div>
                                  )}
                                </div>

                                {/* Stock Information */}
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-gray-500">
                                    Tồn kho: {item.variant.stock}
                                  </span>
                                  {item.quantity > item.variant.stock && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      Vượt quá tồn kho
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Category */}
                            {item.productId.category?.name && (
                              <Badge variant="secondary" className="mt-2">
                                {item.productId.category.name}
                              </Badge>
                            )}
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                              {/* Discount Price */}
                              <span className="text-lg font-semibold text-gray-900">
                                {formatPrice(item.price.discountPrice)}
                              </span>

                              {/* Original Price if different */}
                              {item.price.currentPrice >
                                item.price.discountPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(item.price.currentPrice)}
                                  </span>
                                )}
                            </div>

                            {/* Savings */}
                            {item.price.currentPrice >
                              item.price.discountPrice && (
                                <span className="text-xs text-green-600 mt-1">
                                  Tiết kiệm{" "}
                                  {formatPrice(
                                    item.price.currentPrice -
                                    item.price.discountPrice
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
                              disabled={
                                item.variant &&
                                item.quantity >= item.variant.stock
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
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">
                Tóm tắt đơn hàng
                {hasSelectedItems && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    ({selectedItemsCount} sản phẩm được chọn)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {hasSelectedItems ? "Tạm tính" : "Tổng giỏ hàng"}
                    {hasSelectedItems && ` (${selectedItemsCount} sản phẩm)`}
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(hasSelectedItems ? (checkoutTotal || 0) : subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Nhập mã giảm giá</span>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Mã giảm giá"
                      className="w-32"
                    />
                    <Button variant="outline" size="sm">
                      Áp dụng
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Tổng cộng</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(hasSelectedItems ? (checkoutTotal || 0) : subtotal)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full cursor-pointer"
                size="lg"
                onClick={handleCheckout}
                disabled={!hasSelectedItems}
              >
                {hasSelectedItems ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Thanh toán ({selectedItemsCount})
                  </>
                ) : (
                  "Chọn sản phẩm để thanh toán"
                )}
              </Button>

              {!hasSelectedItems && (
                <p className="text-xs text-center text-gray-500">
                  Vui lòng chọn ít nhất một sản phẩm để tiếp tục thanh toán
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}