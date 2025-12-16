"use client";
import { useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Check,
} from "lucide-react";
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
import { applyDiscountCode } from "@/features/discount/discountAction";
import { clearAppliedDiscount } from "@/features/discount/discountSlice";
import SpinnerLoading from "@/components/common/SpinnerLoading";
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
  const { appliedDiscount, loading: discountLoading } = useAppSelector(
    (state) => state.discount
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ itemId, quantity: newQuantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    dispatch(clearAppliedDiscount());
    toast.success("Cart cleared successfully");
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
      toast.error("Please select at least one item to checkout");
      return;
    }
    dispatch(prepareForCheckout());
    router.push("/checkout");
  };

  const handleApplyDiscount = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a discount code");
      return;
    }

    if (!selectedItems || selectedItems.length === 0) {
      toast.error("Please select items to apply discount code");
      return;
    }

    const orderTotal = checkoutTotal || 0;
    const productIds = selectedItems.map((item) => item.productId._id);

    try {
      await dispatch(
        applyDiscountCode({
          code: promoCode,
          orderTotal,
          productIds,
        })
      ).unwrap();
      toast.success("Discount code applied successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to apply discount code");
      dispatch(clearAppliedDiscount());
    }
  };

  const handleRemoveDiscount = () => {
    dispatch(clearAppliedDiscount());
    setPromoCode("");
    toast.success("Discount code removed");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const subtotal =
    cartData?.items?.reduce(
      (sum, item) => sum + (item.price?.currentPrice || 0) * item.quantity,
      0
    ) ?? 0;

  const totalItems =
    cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const selectedItemsCount =
    selectedItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const isAllSelected =
    cartData?.items && cartData.items.length > 0
      ? cartData.items.every((item) => item.selected)
      : false;

  const hasCartItems = cartData?.items && cartData.items.length > 0;

  const hasSelectedItems = selectedItems && selectedItems.length > 0;

  if (error) {
    toast.error("Error loading cart");
  }

  // Sửa lỗi: Kiểm tra cartData?.items thay vì cartData.items
  if (!cartData?.items || cartData.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="text-center py-16">
          <CardContent>
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Cart is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Add products to your cart to continue shopping
            </p>
            <Link href="/products">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
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
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>
        <div className="w-full max-w-[820px] flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">
            Cart ({totalItems} items)
          </h1>
          <div className="flex items-center gap-4">
            {hasCartItems &&
              (isAllSelected ? (
                <Button variant="outline" onClick={handleUnselectAll}>
                  Unselect All
                </Button>
              ) : (
                <Button variant="outline" onClick={handleSelectAll}>
                  Select All
                </Button>
              ))}
            <Button onClick={handleClearCart} variant="outline">
              Clear All
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4 relative min-h-[200px]">
          {isLoading && <SpinnerLoading className="absolute inset-0 m-auto" />}
          <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
            {/* Sửa lỗi: Đảm bảo cartData.items tồn tại trước khi map */}
            {cartData.items?.map((item) => (
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
                      <div className="relative w-full sm:w-24 h-24 bg-muted shrink-0">
                        {item.variant?.images?.[0] ? (
                          <Image
                            src={item.variant.images[0]}
                            alt={item.productId.name}
                            fill
                            className="object-cover"
                          />
                        ) : item.productId.images?.[0] ? (
                          <Image
                            src={item.productId.images[0]}
                            alt={item.productId.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 pr-2">
                            <h3 className="font-semibold text-foreground text-base leading-tight">
                              {item.productId.name}
                            </h3>

                            {/* Variant Information */}
                            {item.variant && (
                              <div className="mt-2 space-y-2">
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  {/* Color */}
                                  {item.variant.color && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Color:</span>
                                      <div className="flex items-center gap-1">
                                        <div
                                          className="w-4 h-4 border border-border"
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
                                      <code className="text-xs bg-muted px-2 py-1 rounded">
                                        {item.variant.sku}
                                      </code>
                                    </div>
                                  )}
                                </div>

                                {/* Stock Information */}
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-muted-foreground">
                                    Stock: {item.variant.stock}
                                  </span>
                                  {item.quantity > item.variant.stock && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      Out of Stock
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
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                              {/* Discount Price */}
                              <span className="text-lg font-semibold text-foreground">
                                {formatPrice(item.price.discountPrice)}
                              </span>

                              {/* Original Price if different */}
                              {item.price.currentPrice >
                                item.price.discountPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatPrice(item.price.currentPrice)}
                                </span>
                              )}
                            </div>

                            {/* Savings */}
                            {item.price.currentPrice >
                              item.price.discountPrice && (
                              <span className="text-xs text-success mt-1">
                                Save{" "}
                                {formatPrice(
                                  item.price.currentPrice -
                                    item.price.discountPrice
                                )}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center border border-border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="h-8 w-8 hover:bg-muted"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center font-medium text-sm border-x border-border py-2">
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
                              className="h-8 w-8 hover:bg-muted"
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
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">
                Order Summary
                {hasSelectedItems && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({selectedItemsCount} items selected)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {hasSelectedItems ? "Subtotal" : "Cart Total"}
                    {hasSelectedItems && ` (${selectedItemsCount} items)`}
                  </span>
                  <span className="font-medium text-foreground">
                    {formatPrice(
                      hasSelectedItems ? checkoutTotal || 0 : subtotal
                    )}
                  </span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="flex items-center gap-2">
                      Discount ({appliedDiscount.code})
                      <button
                        onClick={handleRemoveDiscount}
                        className="text-xs text-red-500 hover:underline"
                      >
                        (Remove)
                      </button>
                    </span>
                    <span className="font-medium">
                      -{formatPrice(appliedDiscount.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Enter Discount Code
                  </span>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Discount Code"
                      className="w-32"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={!!appliedDiscount}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApplyDiscount}
                      disabled={!!appliedDiscount || discountLoading}
                    >
                       {discountLoading ? "..." : "Apply"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">
                    Total
                  </span>
                  <span className="text-xl font-bold text-foreground">
                    {formatPrice(
                      appliedDiscount
                        ? appliedDiscount.finalTotal
                        : hasSelectedItems
                        ? checkoutTotal || 0
                        : subtotal
                    )}
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
                    Checkout ({selectedItemsCount})
                  </>
                ) : (
                  "Select items to checkout"
                )}
              </Button>

              {!hasSelectedItems && (
                <p className="text-xs text-center text-muted-foreground">
                  Please select at least one item to proceed
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
