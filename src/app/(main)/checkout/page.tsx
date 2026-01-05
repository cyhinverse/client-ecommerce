"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { applyDiscountCode } from "@/features/discount/discountAction";
import { clearAppliedDiscount } from "@/features/discount/discountSlice";
import { motion } from "framer-motion";
import {
  Check,
  CreditCard,
  Truck,
  ChevronLeft,
  MapPin,
  Ticket,
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "vnpay">("cod");
  const [promoCode, setPromoCode] = useState<string>("");
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
  const { data: cartData, checkoutTotal } = useAppSelector(
    (state) => state.cart
  );
  const { appliedDiscount, loading: discountLoading } = useAppSelector(
    (state) => state.discount
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cartItems = useMemo(() => {
    return cartData?.items || [];
  }, [cartData]);

  const discount = appliedDiscount ? appliedDiscount.discountAmount : 0;
  const finalTotal = appliedDiscount
    ? appliedDiscount.finalTotal
    : checkoutTotal || 0;
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
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
        discountCode: appliedDiscount?.code,
        note: formData.note,
      };

      console.log("Creating order with data:", orderData);

      const result = await dispatch(createOrder(orderData)).unwrap();

      console.log("Order created result:", result);

      if (result) {
        dispatch(clearCart()).unwrap().catch(console.error);

        if (paymentMethod === "vnpay") {
          try {
            toast.loading("Redirecting to VNPay...");
            // Use result.data._id or result._id dependent on api response structure
            const orderId = result.data ? result.data._id : result._id;
            if (!orderId) throw new Error("Missing order ID");

            const paymentResult = await dispatch(
              createPaymentUrl(orderId)
            ).unwrap();

            if (paymentResult.paymentUrl) {
              window.location.href = paymentResult.paymentUrl;
              return;
            }
          } catch (paymentError) {
            console.error("Payment error:", paymentError);
            toast.error(
              "Could not create VNPay payment. Please pay again in order history."
            );
            router.push("/");
          }
        } else {
          toast.success("Order placed successfully!");
          router.push(`/`);
        }
      }
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An unknown error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyDiscount = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a discount code");
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
      toast.success("Discount code applied successfully!");
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Failed to apply discount code";
      toast.error(errorMessage);
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
      <div className="w-full min-h-screen bg-[#F5F5F7] dark:bg-black py-20 flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting to cart...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F5F5F7] dark:bg-black/90 py-10 transition-colors duration-500">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Navigation Back */}
        <Link
          href="/cart"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ChevronLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Bag
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Checkout Form */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Checkout
              </h1>
              <p className="text-muted-foreground">
                Complete your order details.
              </p>
            </motion.div>

            <form
              id="checkout-form"
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Shipping Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 sm:p-8 shadow-sm border border-border/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="0123 456 789"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Street Name"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) =>
                          handleSelectChange(value, "city")
                        }
                      >
                        <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-transparent focus:ring-primary">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="hanoi">Hà Nội</SelectItem>
                          <SelectItem value="hcm">TP.HCM</SelectItem>
                          <SelectItem value="danang">Đà Nẵng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        placeholder="District"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ward">Ward</Label>
                      <Input
                        id="ward"
                        placeholder="Ward"
                        value={formData.ward}
                        onChange={handleInputChange}
                        className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Order Note (Optional)</Label>
                    <Input
                      id="note"
                      placeholder="Special instructions for delivery..."
                      value={formData.note}
                      onChange={handleInputChange}
                      className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background transition-all"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 sm:p-8 shadow-sm border border-border/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`relative flex flex-col p-4 cursor-pointer rounded-2xl border transition-all ${
                      paymentMethod === "cod"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-border/80 hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      className="sr-only"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <div className="flex items-center justify-between mb-2">
                      <Truck
                        className={`h-5 w-5 ${
                          paymentMethod === "cod"
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      {paymentMethod === "cod" && (
                        <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="h-2.5 w-2.5" />
                        </div>
                      )}
                    </div>
                    <span
                      className={`font-medium ${
                        paymentMethod === "cod"
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      Cash on Delivery
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Pay when you receive.
                    </span>
                  </label>

                  <label
                    className={`relative flex flex-col p-4 cursor-pointer rounded-2xl border transition-all ${
                      paymentMethod === "vnpay"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-border/80 hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      className="sr-only"
                      checked={paymentMethod === "vnpay"}
                      onChange={() => setPaymentMethod("vnpay")}
                    />
                    <div className="flex items-center justify-between mb-2">
                      <CreditCard
                        className={`h-5 w-5 ${
                          paymentMethod === "vnpay"
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      {paymentMethod === "vnpay" && (
                        <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="h-2.5 w-2.5" />
                        </div>
                      )}
                    </div>
                    <span
                      className={`font-medium ${
                        paymentMethod === "vnpay"
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      VNPay / Banking
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Instant secure payment.
                    </span>
                  </label>
                </div>
              </motion.div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sticky top-24"
            >
              <Card className="rounded-3xl border-0 shadow-2xl bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6 sm:p-8 bg-muted/20 border-b border-border/50">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {cartItems.map((item) => (
                        <div key={item._id} className="flex gap-4">
                          <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden shadow-sm shrink-0 border border-border/20">
                            {item.variant?.images?.[0] ||
                            item.productId.images?.[0] ? (
                              <Image
                                src={
                                  item.variant?.images?.[0] ||
                                  item.productId.images?.[0] ||
                                  ""
                                }
                                alt={item.productId.name}
                                fill
                                className="object-contain p-2"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted text-[10px]">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-foreground truncate">
                              {item.productId.name}
                            </h4>
                            <div className="text-xs text-muted-foreground mt-0.5 space-x-2">
                              {item.variant?.color && (
                                <span>{item.variant.color}</span>
                              )}
                              {item.variant?.size && (
                                <span>{item.variant.size}</span>
                              )}
                              <span>x{item.quantity}</span>
                            </div>
                            <div className="font-medium text-sm mt-1">
                              {formatPrice(
                                (item.price.discountPrice > 0 &&
                                item.price.discountPrice <
                                  item.price.currentPrice
                                  ? item.price.discountPrice
                                  : item.price.currentPrice) * item.quantity
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Discount Code */}
                    <div>
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                        Discount Code
                      </Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Enter code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            disabled={!!appliedDiscount}
                            className="pl-9 rounded-xl bg-muted/40 border-transparent focus:bg-background h-10"
                          />
                        </div>
                        <Button
                          onClick={
                            appliedDiscount
                              ? handleRemoveDiscount
                              : handleApplyDiscount
                          }
                          variant={
                            appliedDiscount ? "destructive" : "secondary"
                          }
                          className="rounded-xl h-10 px-4"
                          disabled={discountLoading}
                        >
                          {appliedDiscount ? "Remove" : "Apply"}
                        </Button>
                      </div>
                      {appliedDiscount && (
                        <p className="text-xs text-green-600 mt-2 font-medium flex items-center">
                          <Check className="h-3 w-3 mr-1" /> Code{" "}
                          {appliedDiscount.code} applied successfully
                        </p>
                      )}
                    </div>

                    <div className="h-px bg-border/50" />

                    {/* Totals */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>{formatPrice(checkoutTotal || 0)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600 font-medium">
                          <span>Discount</span>
                          <span>-{formatPrice(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span className="text-foreground font-medium">
                          Free
                        </span>
                      </div>

                      <div className="flex justify-between items-end pt-3 text-foreground">
                        <div className="flex flex-col">
                          <span className="font-bold text-lg">Total</span>
                          <span className="text-xs text-muted-foreground">
                            Including VAT
                          </span>
                        </div>
                        <span className="font-bold text-2xl">
                          {formatPrice(finalTotal)}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      form="checkout-form"
                      className="w-full rounded-full h-12 text-base font-semibold shadow-lg shadow-primary/25"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Processing..."
                        : `Place Order • ${formatPrice(finalTotal)}`}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <CreditCard className="h-3 w-3" /> Secure Payment
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
