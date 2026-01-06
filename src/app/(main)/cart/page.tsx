// CartPage - Taobao Style with Shop Grouping
"use client";
import { useEffect, useState, useMemo } from "react";
import { Plus, Minus, ShoppingBag, ArrowRight, Store, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
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
import { motion, AnimatePresence } from "framer-motion";
import { groupCartItemsByShop, CartItem } from "@/types/cart";

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
    toast.success("Đã xóa giỏ hàng");
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart({ itemId }));
    toast.success("Đã xóa sản phẩm");
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
      toast.error("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }
    dispatch(prepareForCheckout());
    router.push("/checkout");
  };

  const handleApplyDiscount = async () => {
    if (!promoCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    if (!selectedItems || selectedItems.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để áp dụng mã giảm giá");
      return;
    }

    const orderTotal = checkoutTotal || 0;
    const productIds = selectedItems.map((item) => 
      typeof item.productId === 'object' ? item.productId._id : item.productId
    );

    try {
      await dispatch(
        applyDiscountCode({
          code: promoCode,
          orderTotal,
          productIds,
        })
      ).unwrap();
      toast.success("Áp dụng mã giảm giá thành công!");
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Không thể áp dụng mã giảm giá";
      toast.error(errorMessage);
      dispatch(clearAppliedDiscount());
    }
  };

  const handleRemoveDiscount = () => {
    dispatch(clearAppliedDiscount());
    setPromoCode("");
    toast.success("Đã xóa mã giảm giá");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const subtotal =
    cartData?.items?.reduce((sum, item) => {
      const discountPrice = item.price?.discountPrice ?? 0;
      const currentPrice = item.price?.currentPrice ?? 0;
      const effectivePrice =
        discountPrice > 0 && discountPrice < currentPrice
          ? discountPrice
          : currentPrice;
      return sum + (effectivePrice || 0) * item.quantity;
    }, 0) ?? 0;

  const selectedItemsCount =
    selectedItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const isAllSelected =
    cartData?.items && cartData.items.length > 0
      ? cartData.items.every((item) => item.selected)
      : false;

  const hasCartItems = cartData?.items && cartData.items.length > 0;
  const hasSelectedItems = selectedItems && selectedItems.length > 0;

  // Group cart items by shop for display
  const itemsByShop = useMemo(() => {
    if (!cartData?.items) return [];
    return groupCartItemsByShop(cartData.items);
  }, [cartData?.items]);

  // Helper to get item image
  const getItemImage = (item: CartItem): string | null => {
    if (item.variant?.images?.[0]) return item.variant.images[0];
    if (typeof item.productId === 'object' && item.productId.images?.[0]) {
      return item.productId.images[0];
    }
    return null;
  };

  // Helper to get effective price
  const getEffectivePrice = (item: CartItem): number => {
    const discountPrice = item.price?.discountPrice ?? 0;
    const currentPrice = item.price?.currentPrice ?? 0;
    return discountPrice > 0 && discountPrice < currentPrice
      ? discountPrice
      : currentPrice;
  };

  if (error) {
    toast.error("Lỗi khi tải giỏ hàng");
  }

  // Empty State - Taobao Style
  if (!isLoading && (!cartData?.items || cartData.items.length === 0)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md space-y-4"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-10 w-10 text-gray-300" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-500 text-sm">
              Hãy thêm sản phẩm vào giỏ hàng của bạn
            </p>
          </div>

          <Link href="/products" className="block pt-4">
            <Button
              className="rounded bg-[#E53935] hover:bg-[#D32F2F] px-8 h-10 text-sm"
            >
              Mua sắm ngay <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 -mt-4 -mx-4 px-4">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="bg-[#f7f7f7] rounded-sm mb-4 p-4">
          <h1 className="text-xl font-bold text-gray-800">Giỏ hàng của bạn</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {isLoading && <SpinnerLoading className="py-20" />}

            {/* Select All Header */}
            {hasCartItems && (
              <div className="bg-[#f7f7f7] rounded-sm p-4 flex items-center gap-4 text-sm">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={() => isAllSelected ? handleUnselectAll() : handleSelectAll()}
                  className="h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-[#E53935] data-[state=checked]:border-[#E53935]"
                />
                <span className="text-gray-600">Chọn tất cả ({cartData?.items?.length || 0} sản phẩm)</span>
                <button
                  onClick={handleClearCart}
                  className="ml-auto text-gray-500 hover:text-red-500 flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa tất cả
                </button>
              </div>
            )}

            {/* Items Grouped by Shop */}
            <AnimatePresence mode="popLayout">
              {itemsByShop.map((shopGroup) => (
                <motion.div
                  key={shopGroup.shop._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#f7f7f7] rounded-sm overflow-hidden"
                >
                  {/* Shop Header */}
                  <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                    <Checkbox
                      checked={shopGroup.items.every(item => item.selected)}
                      onCheckedChange={() => {
                        const allSelected = shopGroup.items.every(item => item.selected);
                        shopGroup.items.forEach(item => {
                          if (allSelected ? item.selected : !item.selected) {
                            handleToggleSelect(item._id);
                          }
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-[#E53935] data-[state=checked]:border-[#E53935]"
                    />
                    <Store className="h-4 w-4 text-[#E53935]" />
                    <span className="font-medium text-gray-800">{shopGroup.shop.name}</span>
                    <span className="text-xs text-[#E53935] border border-[#E53935] px-1.5 py-0.5 rounded">Mall</span>
                  </div>

                  {/* Shop Items */}
                  {shopGroup.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-start gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Checkbox */}
                      <Checkbox
                        checked={item.selected || false}
                        onCheckedChange={() => handleToggleSelect(item._id)}
                        className="h-4 w-4 mt-4 rounded border-gray-300 data-[state=checked]:bg-[#E53935] data-[state=checked]:border-[#E53935]"
                      />

                      {/* Image */}
                      <Link
                        href={`/products/${typeof item.productId === 'object' ? item.productId.slug || item.productId._id : item.productId}`}
                        className="shrink-0"
                      >
                        <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden">
                          {getItemImage(item) ? (
                            <Image
                              src={getItemImage(item)!}
                              alt={typeof item.productId === 'object' ? item.productId.name : 'Product'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${typeof item.productId === 'object' ? item.productId.slug || item.productId._id : item.productId}`}
                          className="hover:text-[#E53935] transition-colors"
                        >
                          <h3 className="text-sm text-gray-800 line-clamp-2 mb-1">
                            {typeof item.productId === 'object' ? item.productId.name : 'Sản phẩm'}
                          </h3>
                        </Link>
                        
                        {/* Variation Info */}
                        {(item.variationInfo || item.variant) && (
                          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block mb-2">
                            {item.variationInfo || 
                              [item.variant?.color, item.variant?.size && `Size: ${item.variant.size}`]
                                .filter(Boolean)
                                .join(', ')
                            }
                          </div>
                        )}

                        {/* Price & Quantity Row */}
                        <div className="flex items-center justify-between mt-2">
                          {/* Price */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-[#E53935] font-bold">
                              {formatPrice(getEffectivePrice(item))}
                            </span>
                            {(item.price?.discountPrice ?? 0) > 0 &&
                              (item.price?.currentPrice ?? 0) > (item.price?.discountPrice ?? 0) && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(item.price?.currentPrice ?? 0)}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-l text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <input
                              type="text"
                              value={item.quantity}
                              readOnly
                              className="w-10 h-7 text-center text-sm border-y border-gray-200 focus:outline-none"
                            />
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-r text-gray-500 hover:bg-gray-50"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <span className="text-[#E53935] font-bold min-w-[100px] text-right">
                            {formatPrice(getEffectivePrice(item) * item.quantity)}
                          </span>

                          {/* Remove */}
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-gray-400 hover:text-red-500 ml-4"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-[320px] shrink-0">
            <div className="bg-[#f7f7f7] rounded-sm p-4 lg:sticky lg:top-[140px]">
              <h2 className="text-base font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">
                Thông tin đơn hàng
              </h2>

              {/* Promo Code */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-[#E53935]" />
                  <span className="text-sm text-gray-600">Mã giảm giá</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={!!appliedDiscount}
                    className="h-9 text-sm rounded border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
                  />
                  {appliedDiscount ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRemoveDiscount}
                      className="h-9 px-3 text-red-500 border-red-200 hover:bg-red-50"
                    >
                      Xóa
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleApplyDiscount}
                      disabled={discountLoading || !promoCode}
                      className="h-9 px-4 bg-[#E53935] hover:bg-[#D32F2F] rounded"
                    >
                      Áp dụng
                    </Button>
                  )}
                </div>
                {appliedDiscount && (
                  <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                    <span>✓</span>
                    <span>Đã áp dụng mã: {appliedDiscount.code}</span>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="space-y-3 py-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tạm tính ({selectedItemsCount} sản phẩm)</span>
                  <span className="text-gray-800">
                    {formatPrice(hasSelectedItems ? checkoutTotal || 0 : subtotal)}
                  </span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(appliedDiscount.discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phí vận chuyển</span>
                  <span className="text-gray-800">Miễn phí</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4 border-t border-gray-100">
                <span className="text-gray-800 font-medium">Tổng cộng</span>
                <span className="text-xl font-bold text-[#E53935]">
                  {formatPrice(
                    appliedDiscount
                      ? (appliedDiscount.finalTotal ?? 0)
                      : hasSelectedItems
                      ? checkoutTotal || 0
                      : subtotal
                  )}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full h-11 bg-[#E53935] hover:bg-[#D32F2F] rounded text-base font-medium"
                onClick={handleCheckout}
                disabled={!hasSelectedItems}
              >
                {hasSelectedItems
                  ? `Mua hàng (${selectedItemsCount})`
                  : "Chọn sản phẩm để mua"}
              </Button>

              <p className="text-center text-xs text-gray-400 mt-3">
                Miễn phí vận chuyển cho đơn hàng từ ₫500.000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
