// CheckoutPage - Taobao Style
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createOrder } from "@/features/order/orderAction";
import { clearCart } from "@/features/cart/cartAction";
import { toast } from "sonner";
import { createPaymentUrl } from "@/features/payment/paymentAction";
import { applyVoucherCode } from "@/features/voucher/voucherAction";
import { clearAppliedVouchers, setAppliedShopVoucher, setAppliedPlatformVoucher } from "@/features/voucher/voucherSlice";
import {
  Check,
  CreditCard,
  Truck,
  ChevronLeft,
  MapPin,
  Tag,
  Store,
  ChevronRight,
  Shield,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { groupCartItemsByShop } from "@/types/cart";

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "vnpay" | "momo">("cod");
  const [promoCode, setPromoCode] = useState<string>("");
  const [shopVoucherCode, setShopVoucherCode] = useState<string>("");
  const [platformVoucherCode, setPlatformVoucherCode] = useState<string>("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    note: "",
  });

  const { data: userData } = useAppSelector((state) => state.auth);
  const { data: cartData, checkoutTotal, selectedItems } = useAppSelector(
    (state) => state.cart
  );
  const { appliedShopVoucher, appliedPlatformVoucher, loading: voucherLoading } = useAppSelector(
    (state) => state.voucher
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cartItems = useMemo(() => {
    return selectedItems || cartData?.items || [];
  }, [selectedItems, cartData]);

  // Group items by shop
  const itemsByShop = useMemo(() => {
    return groupCartItemsByShop(cartItems);
  }, [cartItems]);

  // Calculate discounts
  const shopDiscount = appliedShopVoucher?.discountAmount || 0;
  const platformDiscount = appliedPlatformVoucher?.discountAmount || 0;
  const totalDiscount = shopDiscount + platformDiscount;
  
  const finalTotal = (checkoutTotal || 0) - totalDiscount;
  const cartItemIds = cartItems.map((item) => item._id);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      router.push("/cart");
      return;
    }

    if (userData && !formData.email) {
      const defaultAddress = userData.addresses?.[0] || {};
      setFormData((prev) => ({
        ...prev,
        fullName: defaultAddress.fullName || userData.username || "",
        email: userData.email || "",
        phone: defaultAddress.phone || "",
        address: defaultAddress.address || "",
        city: defaultAddress.city || "",
        district: defaultAddress.district || "",
        ward: defaultAddress.ward || "",
      }));
    }
  }, [userData, cartItems, router, formData.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const orderData = {
        cartItemIds,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          ward: formData.ward,
          note: formData.note,
        },
        paymentMethod,
        voucherShopCode: appliedShopVoucher?.code,
        voucherPlatformCode: appliedPlatformVoucher?.code,
        note: formData.note,
      };

      const result = await dispatch(createOrder(orderData)).unwrap();

      if (result) {
        dispatch(clearCart()).unwrap().catch(console.error);

        if (paymentMethod === "vnpay") {
          try {
            toast.loading("Đang chuyển đến VNPay...");
            const orderId = result.data ? result.data._id : result._id;
            if (!orderId) throw new Error("Missing order ID");

            const paymentResult = await dispatch(createPaymentUrl(orderId)).unwrap();

            if (paymentResult.paymentUrl) {
              window.location.href = paymentResult.paymentUrl;
              return;
            }
          } catch (paymentError) {
            console.error("Payment error:", paymentError);
            toast.error("Không thể tạo thanh toán VNPay. Vui lòng thanh toán lại trong lịch sử đơn hàng.");
            router.push("/");
          }
        } else {
          toast.success("Đặt hàng thành công!");
          router.push(`/`);
        }
      }
    } catch (error) {
      const errorMessage = (error as Error).message || "Đã xảy ra lỗi";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyVoucher = async () => {
    if (!promoCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    const orderTotal = checkoutTotal || 0;

    try {
      await dispatch(
        applyVoucherCode({ code: promoCode, orderTotal })
      ).unwrap();
      toast.success("Áp dụng mã giảm giá thành công!");
    } catch (err) {
      const errorMessage = (err as Error).message || "Không thể áp dụng mã giảm giá";
      toast.error(errorMessage);
      dispatch(clearAppliedVouchers());
    }
  };

  const handleRemoveVoucher = () => {
    dispatch(clearAppliedVouchers());
    setPromoCode("");
    setShopVoucherCode("");
    setPlatformVoucherCode("");
    toast.success("Đã xóa mã giảm giá");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Helper to get item image
  const getItemImage = (item: typeof cartItems[0]): string | null => {
    if (item.variant?.images?.[0]) return item.variant.images[0];
    if (typeof item.productId === 'object' && item.productId.images?.[0]) {
      return item.productId.images[0];
    }
    return null;
  };

  // Helper to get effective price
  const getEffectivePrice = (item: typeof cartItems[0]): number => {
    const discountPrice = item.price?.discountPrice ?? 0;
    const currentPrice = item.price?.currentPrice ?? 0;
    return discountPrice > 0 && discountPrice < currentPrice
      ? discountPrice
      : currentPrice;
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="w-full min-h-screen bg-background py-20 flex items-center justify-center">
        <p className="text-gray-500">Đang chuyển đến giỏ hàng...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background py-4 -mt-4 -mx-4 px-4">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="bg-[#f7f7f7] rounded-sm mb-4 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/cart" className="text-gray-500 hover:text-[#E53935]">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-gray-800">Thanh toán</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Thanh toán an toàn</span>
          </div>
        </div>

        <form id="checkout-form" onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main Content */}
            <div className="flex-1 space-y-4">
              {/* Shipping Address */}
              <div className="bg-[#f7f7f7] rounded-sm p-4">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <MapPin className="h-5 w-5 text-[#E53935]" />
                  <h2 className="font-semibold text-gray-800">Địa chỉ nhận hàng</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-sm text-gray-600">Họ và tên</Label>
                    <Input
                      id="fullName"
                      placeholder="Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="h-10 rounded border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm text-gray-600">Số điện thoại</Label>
                    <Input
                      id="phone"
                      placeholder="0123 456 789"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-10 rounded border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
                      required
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="email" className="text-sm text-gray-600">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-10 rounded border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
                      required
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="address" className="text-sm text-gray-600">Địa chỉ</Label>
                    <Input
                      id="address"
                      placeholder="Số nhà, tên đường"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="h-10 rounded border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-sm text-gray-600">Tỉnh/Thành phố</Label>
                    <Select value={formData.city} onValueChange={(value) => handleSelectChange(value, "city")}>
                      <SelectTrigger className="h-10 rounded border-gray-200 focus:ring-[#E53935]/20">
                        <SelectValue placeholder="Chọn tỉnh/thành" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hanoi">Hà Nội</SelectItem>
                        <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                        <SelectItem value="danang">Đà Nẵng</SelectItem>
                        <SelectItem value="haiphong">Hải Phòng</SelectItem>
                        <SelectItem value="cantho">Cần Thơ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="district" className="text-sm text-gray-600">Quận/Huyện</Label>
                    <Input
                      id="district"
                      placeholder="Quận/Huyện"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="h-10 rounded border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ward" className="text-sm text-gray-600">Phường/Xã</Label>
                    <Input
                      id="ward"
                      placeholder="Phường/Xã"
                      value={formData.ward}
                      onChange={handleInputChange}
                      className="h-10 rounded border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="note" className="text-sm text-gray-600">Ghi chú</Label>
                    <Input
                      id="note"
                      placeholder="Ghi chú cho người giao hàng..."
                      value={formData.note}
                      onChange={handleInputChange}
                      className="h-10 rounded border-gray-200 focus:border-[#E53935] focus:ring-[#E53935]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Order Items by Shop */}
              {itemsByShop.map((shopGroup) => (
                <div key={shopGroup.shop._id} className="bg-[#f7f7f7] rounded-sm overflow-hidden">
                  {/* Shop Header */}
                  <div className="flex items-center gap-2 p-4 border-b border-gray-100">
                    <Store className="h-4 w-4 text-[#E53935]" />
                    <span className="font-medium text-gray-800">{shopGroup.shop.name}</span>
                    <span className="text-xs text-[#E53935] border border-[#E53935] px-1.5 py-0.5 rounded">Mall</span>
                  </div>

                  {/* Items */}
                  {shopGroup.items.map((item) => (
                    <div key={item._id} className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0">
                      <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
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
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-gray-800 line-clamp-1">
                          {typeof item.productId === 'object' ? item.productId.name : 'Sản phẩm'}
                        </h4>
                        {(item.variationInfo || item.variant) && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.variationInfo || 
                              [item.variant?.color, item.variant?.size && `Size: ${item.variant.size}`]
                                .filter(Boolean)
                                .join(', ')
                            }
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">x{item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[#E53935] font-medium">
                          {formatPrice(getEffectivePrice(item) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Shop Voucher */}
                  <div className="flex items-center justify-between p-4 bg-gray-50/50 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Tag className="h-4 w-4 text-[#E53935]" />
                      <span>Voucher của Shop</span>
                    </div>
                    <button type="button" className="flex items-center gap-1 text-sm text-[#E53935]">
                      <span>Chọn voucher</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Platform Voucher */}
              <div className="bg-[#f7f7f7] rounded-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-[#E53935]" />
                    <span className="font-medium text-gray-800">Voucher nền tảng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Nhập mã voucher"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={!!appliedPlatformVoucher}
                      className="h-9 w-40 text-sm rounded border-gray-200"
                    />
                    {appliedPlatformVoucher ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleRemoveVoucher}
                        className="h-9 text-red-500 border-red-200 hover:bg-red-50"
                      >
                        Xóa
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleApplyVoucher}
                        disabled={voucherLoading || !promoCode}
                        className="h-9 bg-[#E53935] hover:bg-[#D32F2F]"
                      >
                        Áp dụng
                      </Button>
                    )}
                  </div>
                </div>
                {appliedPlatformVoucher && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Đã áp dụng mã: {appliedPlatformVoucher.code} (-{formatPrice(appliedPlatformVoucher.discountAmount)})
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-[#f7f7f7] rounded-sm p-4">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <Wallet className="h-5 w-5 text-[#E53935]" />
                  <h2 className="font-semibold text-gray-800">Phương thức thanh toán</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`flex items-center gap-3 p-3 rounded border-2 cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#E53935] bg-[#E53935]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      className="sr-only"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <Truck className={`h-5 w-5 ${paymentMethod === "cod" ? "text-[#E53935]" : "text-gray-400"}`} />
                    <div>
                      <span className={`text-sm font-medium ${paymentMethod === "cod" ? "text-[#E53935]" : "text-gray-700"}`}>
                        Thanh toán khi nhận hàng
                      </span>
                      <p className="text-xs text-gray-500">COD</p>
                    </div>
                    {paymentMethod === "cod" && (
                      <Check className="h-4 w-4 text-[#E53935] ml-auto" />
                    )}
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded border-2 cursor-pointer transition-all ${
                      paymentMethod === "vnpay"
                        ? "border-[#E53935] bg-[#E53935]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      className="sr-only"
                      checked={paymentMethod === "vnpay"}
                      onChange={() => setPaymentMethod("vnpay")}
                    />
                    <CreditCard className={`h-5 w-5 ${paymentMethod === "vnpay" ? "text-[#E53935]" : "text-gray-400"}`} />
                    <div>
                      <span className={`text-sm font-medium ${paymentMethod === "vnpay" ? "text-[#E53935]" : "text-gray-700"}`}>
                        VNPay
                      </span>
                      <p className="text-xs text-gray-500">Thẻ ATM/Visa/Master</p>
                    </div>
                    {paymentMethod === "vnpay" && (
                      <Check className="h-4 w-4 text-[#E53935] ml-auto" />
                    )}
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded border-2 cursor-pointer transition-all ${
                      paymentMethod === "momo"
                        ? "border-[#E53935] bg-[#E53935]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      className="sr-only"
                      checked={paymentMethod === "momo"}
                      onChange={() => setPaymentMethod("momo")}
                    />
                    <Wallet className={`h-5 w-5 ${paymentMethod === "momo" ? "text-[#E53935]" : "text-gray-400"}`} />
                    <div>
                      <span className={`text-sm font-medium ${paymentMethod === "momo" ? "text-[#E53935]" : "text-gray-700"}`}>
                        Ví MoMo
                      </span>
                      <p className="text-xs text-gray-500">Ví điện tử</p>
                    </div>
                    {paymentMethod === "momo" && (
                      <Check className="h-4 w-4 text-[#E53935] ml-auto" />
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:w-[320px] shrink-0">
              <div className="bg-[#f7f7f7] rounded-sm p-4 lg:sticky lg:top-[140px]">
                <h2 className="font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">
                  Chi tiết thanh toán
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tạm tính ({cartItems.length} sản phẩm)</span>
                    <span className="text-gray-800">{formatPrice(checkoutTotal || 0)}</span>
                  </div>

                  {shopDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Voucher Shop</span>
                      <span>-{formatPrice(shopDiscount)}</span>
                    </div>
                  )}

                  {platformDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Voucher nền tảng</span>
                      <span>-{formatPrice(platformDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-500">Phí vận chuyển</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">Tổng thanh toán</span>
                      <span className="text-xl font-bold text-[#E53935]">
                        {formatPrice(finalTotal > 0 ? finalTotal : 0)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 text-right mt-1">Đã bao gồm VAT</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  form="checkout-form"
                  className="w-full h-11 mt-4 bg-[#E53935] hover:bg-[#D32F2F] rounded text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Đặt hàng"}
                </Button>

                <p className="text-center text-xs text-gray-400 mt-3">
                  Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản của chúng tôi
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
