"use client";
import React, { useState, useEffect, useMemo } from "react";
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
import { createPaymentUrl } from "@/features/payment/paymentAction";
import { applyDiscountCode } from "@/features/discount/discountAction";
import { clearAppliedDiscount } from "@/features/discount/discountSlice";

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
  const { appliedDiscount, loading: discountLoading } = useAppSelector(
    (state) => state.discount
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cartItems = useMemo(() => {
    return cartData?.items || [];
  }, [cartData]);
  
  const discount = appliedDiscount ? appliedDiscount.discountAmount : 0;
  const finalTotal = appliedDiscount ? appliedDiscount.finalTotal : (checkoutTotal || 0);
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
  }, [userData,cartItems, router]);

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
        discountCode: appliedDiscount?.code,
        note: note || undefined
      };

      console.log("Creating order with data:", orderData);

      const result = await dispatch(createOrder(orderData)).unwrap();

      console.log("Order created result:", result);

      if (result) {
        dispatch(clearCart()).unwrap().catch(console.error);

        if (paymentMethod === "vnpay") {
          try {
            toast.loading("Đang chuyển hướng đến VNPay...");
            // Use result.data._id or result._id dependent on api response structure
            const orderId = result.data ? result.data._id : result._id; 
            if(!orderId) throw new Error("Missing order ID");
            
            const paymentResult = await dispatch(createPaymentUrl(orderId)).unwrap();

            if (paymentResult.paymentUrl) {
              window.location.href = paymentResult.paymentUrl;
              return;
            }
          } catch (paymentError) {
            console.error("Payment error:", paymentError);
            toast.error("Could not create VNPay payment. Please pay again in order history.");
            router.push("/");
          }
        } else {
          toast.success("Order placed successfully!");
          router.push(`/`);
        }
      }

    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyDiscount = async () => {
    if (!promoCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    const orderTotal = checkoutTotal || 0;
    const productIds = cartItems.map((item) => item.productId._id);

    try {
      await dispatch(
        applyDiscountCode({
          code: promoCode,
          orderTotal,
          productIds,
        })
      ).unwrap();
      toast.success("Áp dụng mã giảm giá thành công!");
    } catch (err: any) {
      toast.error(err.message || "Không thể áp dụng mã giảm giá");
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

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="w-full min-h-screen bg-muted/30 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Loading order information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-muted/30 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Thông tin thanh toán */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter full name"
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
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="0123 456 789"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="Enter shipping address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => handleSelectChange(value, "city")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hanoi">Hà Nội</SelectItem>
                        <SelectItem value="hcm">TP.HCM</SelectItem>
                        <SelectItem value="danang">Đà Nẵng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Input
                      id="district"
                      placeholder="Enter district"
                      value={formData.district}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ward">Ward *</Label>
                    <Input
                      id="ward"
                      placeholder="Enter ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Note (optional)</Label>
                  <Input
                    id="note"
                    placeholder="Order notes..."
                    value={formData.note}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Method</CardTitle>
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
                      Cash on Delivery (COD)
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
                      Pay via VNPay
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
                <CardTitle className="text-lg">Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-3 pb-3 border-b">
                      <div className="relative w-16 h-16 bg-muted/50 rounded-lg shrink-0">
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
                          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground truncate">
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
                          <span className="text-xs text-muted-foreground">
                            Quantity: {item.quantity}
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
                    <span className="text-muted-foreground">
                      Subtotal ({cartItems.length} items)
                    </span>
                    <span className="font-medium text-foreground">
                      {formatPrice(checkoutTotal || 0)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="text-success font-medium">
                        -{formatPrice(discount)}
                      </span>
                    </div>
                  )}

                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
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
                      <Label htmlFor="promoCode">Discount Code</Label>
                      {appliedDiscount && (
                        <div className="text-sm text-green-600 mb-2 flex justify-between items-center">
                          <span>
                            Applied: <strong>{appliedDiscount.code}</strong> (-
                            {formatPrice(appliedDiscount.discountAmount)})
                          </span>
                          <button
                            type="button"
                            onClick={handleRemoveDiscount}
                            className="text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Input
                          id="promoCode"
                          placeholder="Enter discount code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          disabled={!!appliedDiscount}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleApplyDiscount}
                          disabled={!!appliedDiscount || discountLoading}
                        >
                          {discountLoading ? "..." : "Apply"}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orderNote">Order Note</Label>
                      <Input
                        id="orderNote"
                        placeholder="Additional notes..."
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
                      {isLoading ? "Processing..." : `Place Order - ${formatPrice(finalTotal)}`}
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