"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { createOrder } from "@/features/order/orderAction";
import { clearCart } from "@/features/cart/cartAction";
import { toast } from "sonner";

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "vnpay">("cod");
  const [promoCode, setPromoCode] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    note: ""
  });

  const { data: userData } = useAppSelector((state) => state.auth);
  const { data: cartData, checkoutTotal } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cartItems = cartData?.items || [];
  const shippingFee = 30000;
  const discount = 0;
  const finalTotal = (checkoutTotal || 0) + shippingFee - discount;

  const cartItemIds = cartItems.map(item => item._id);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      router.push("/cart");
      return;
    }

    if (userData) {
      const defaultAddress = userData.addresses?.[0] || {};

      setFormData(prev => ({
        ...prev,
        fullName: defaultAddress.fullName || userData.username || "",
        email: userData.email || "",
        phone: defaultAddress.phone || "",
        address: defaultAddress.address || "",
        city: defaultAddress.city || "",
        district: defaultAddress.district || "",
        ward: defaultAddress.ward || ""
      }));
    }
  }, [userData, cartItems, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentMethodChange = (method: "cod" | "vnpay") => {
    setPaymentMethod(method);
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
          note: formData.note
        },
        paymentMethod,
        discountCode: promoCode || undefined,
        note: note || undefined
      };

      console.log("Creating order with data:", orderData);

      const result = await dispatch(createOrder(orderData)).unwrap();

      if (result) {
        toast.success("Đặt hàng thành công!");

        router.push(`/`);

        setTimeout(() => {
          dispatch(clearCart()).unwrap().catch(error => {
          });
        }, 1000);
      }

    } catch (error: any) {
      console.error("Checkout failed:", error);

      let errorMessage = "Đặt hàng thất bại. Vui lòng thử lại.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gray-50 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center py-16">
            <p className="text-lg text-gray-600">Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Thông tin thanh toán */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên *</Label>
                  <Input
                    id="fullName"
                    placeholder="Nhập họ và tên"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    placeholder="0123 456 789"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ *</Label>
                  <Input
                    id="address"
                    placeholder="Nhập địa chỉ giao hàng"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Thành phố *</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => handleSelectChange(value, "city")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hanoi">Hà Nội</SelectItem>
                        <SelectItem value="hcm">TP.HCM</SelectItem>
                        <SelectItem value="danang">Đà Nẵng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">Quận/Huyện *</Label>
                    <Input
                      id="district"
                      placeholder="Nhập quận/huyện"
                      value={formData.district}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ward">Phường/Xã *</Label>
                    <Input
                      id="ward"
                      placeholder="Nhập phường/xã"
                      value={formData.ward}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú (tuỳ chọn)</Label>
                  <Input
                    id="note"
                    placeholder="Ghi chú về đơn hàng..."
                    value={formData.note}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cod"
                      checked={paymentMethod === "cod"}
                      onCheckedChange={() => handlePaymentMethodChange("cod")}
                    />
                    <Label htmlFor="cod" className="cursor-pointer">
                      Thanh toán khi nhận hàng (COD)
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vnpay"
                      checked={paymentMethod === "vnpay"}
                      onCheckedChange={() => handlePaymentMethodChange("vnpay")}
                    />
                    <Label htmlFor="vnpay" className="cursor-pointer">
                      Thanh toán qua VNPay
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Đơn hàng của bạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-3 pb-3 border-b">
                      <div className="relative w-16 h-16 bg-gray-50 rounded-lg shrink-0">
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
                          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {item.productId.name}
                        </h4>
                        {item.variant && (
                          <div className="flex items-center gap-2 mt-1">
                            {item.variant.color && (
                              <Badge variant="outline" className="text-xs">
                                {item.variant.color}
                              </Badge>
                            )}
                            {item.variant.size && (
                              <Badge variant="outline" className="text-xs">
                                {item.variant.size}
                              </Badge>
                            )}
                          </div>
                        )}
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">
                            Số lượng: {item.quantity}
                          </span>
                          <span className="font-medium text-sm">
                            {formatPrice(item.price.discountPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Tạm tính ({cartItems.length} sản phẩm)
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(checkoutTotal || 0)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(shippingFee)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giảm giá</span>
                      <span className="text-green-600 font-medium">
                        -{formatPrice(discount)}
                      </span>
                    </div>
                  )}

                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="promoCode">Mã giảm giá</Label>
                      <div className="flex gap-2">
                        <Input
                          id="promoCode"
                          placeholder="Nhập mã giảm giá"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button type="button" variant="outline">
                          Áp dụng
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orderNote">Ghi chú đơn hàng</Label>
                      <Input
                        id="orderNote"
                        placeholder="Ghi chú thêm cho đơn hàng..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? "Đang xử lý..." : `Đặt hàng - ${formatPrice(finalTotal)}`}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}