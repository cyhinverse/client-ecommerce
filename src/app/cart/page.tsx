"use client";
import { useEffect, useState } from "react";
import {
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
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
import { motion, AnimatePresence } from "framer-motion";

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
    } catch (err) {
      const errorMessage = (err as Error).message || "Failed to apply discount code";
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

  const subtotal =
    cartData?.items?.reduce(
      (sum, item) => sum + (item.price?.currentPrice || 0) * item.quantity,
      0
    ) ?? 0;



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

  // Empty State
  if (!isLoading && (!cartData?.items || cartData.items.length === 0)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="text-center max-w-md space-y-6"
        >
          <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
             <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Your bag is empty.
            </h2>
            <p className="text-muted-foreground text-lg">
              Start shopping to add items to your bag.
            </p>
          </div>

          <Link href="/products" className="block pt-4">
            <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all">
              Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black/50 py-12 md:py-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Apple Style: Big, bold typography */}
        <div className="mb-12 border-b border-border/40 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
             <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-2">
               Review your bag.
             </h1>
             <p className="text-muted-foreground text-lg">
               Free delivery and free returns.
             </p>
           </div>
           
           <div className="flex items-center gap-3">
             {hasCartItems && (
               <>
                 <Button 
                   variant="ghost" 
                   onClick={isAllSelected ? handleUnselectAll : handleSelectAll}
                   className="text-primary hover:text-primary/80 font-medium"
                 >
                   {isAllSelected ? "Deselect All" : "Select All Items"}
                 </Button>
                 
                 <div className="h-4 w-px bg-border/50 mx-2" />
                 
                 <Button 
                   variant="ghost" 
                   onClick={handleClearCart}
                   className="text-muted-foreground hover:text-destructive transition-colors"
                 >
                   Clear Cart
                 </Button>
               </>
             )}
           </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {isLoading && <SpinnerLoading className="py-20" />}
            
            <AnimatePresence mode="popLayout">
              {cartData?.items?.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative bg-white dark:bg-[#1c1c1e] rounded-3xl p-6 shadow-sm border border-border/20 overflow-hidden"
                >
                  <div className="flex gap-6 sm:gap-8">
                     {/* Checkbox - Custom Style */}
                     <div className="pt-2">
                        <Checkbox
                           checked={item.selected || false}
                           onCheckedChange={() => handleToggleSelect(item._id)}
                           className="h-5 w-5 rounded-full border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
                        />
                     </div>

                     {/* Image */}
                     <Link href={`/products/${item.productId._id}`} className="shrink-0">
                       <div className="relative w-28 h-28 sm:w-36 sm:h-36 bg-[#F5F5F7] dark:bg-black/20 rounded-2xl overflow-hidden">
                         {item.variant?.images?.[0] ? (
                           <Image
                             src={item.variant.images[0]}
                             alt={item.productId.name}
                             fill
                             className="object-contain p-2 hover:scale-105 transition-transform duration-500"
                           />
                         ) : item.productId.images?.[0] ? (
                           <Image
                             src={item.productId.images[0]}
                             alt={item.productId.name}
                             fill
                             className="object-contain p-2 hover:scale-105 transition-transform duration-500"
                           />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                             No Image
                           </div>
                         )}
                       </div>
                     </Link>

                     {/* Content */}
                     <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div>
                           <div className="flex justify-between items-start gap-4">
                             <Link href={`/products/${item.productId._id}`} className="hover:underline">
                                <h3 className="font-semibold text-lg sm:text-xl text-foreground truncate max-w-[200px] sm:max-w-md">
                                  {item.productId.name}
                                </h3>
                             </Link>
                             <div className="text-right">
                                <p className="font-semibold text-lg text-foreground">
                                   {formatPrice(item.price.discountPrice)}
                                </p>
                                {item.price.currentPrice > item.price.discountPrice && (
                                   <p className="text-sm text-muted-foreground line-through">
                                      {formatPrice(item.price.currentPrice)}
                                   </p>
                                )}
                             </div>
                           </div>

                           <div className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                             {item.productId.category?.name && (
                               <span>{item.productId.category.name}</span>
                             )}
                             
                             {item.variant?.color && (
                               <div className="flex items-center gap-1.5">
                                 <div 
                                    className="w-3 h-3 rounded-full border border-border shadow-sm"
                                    style={{ backgroundColor: item.variant.color }} 
                                 />
                                 <span className="capitalize">{item.variant.color}</span>
                               </div>
                             )}

                             {item.variant?.size && (
                               <span>Size: {item.variant.size}</span>
                             )}
                           </div>
                           
                           {item.variant?.stock !== undefined && item.variant.stock < 5 && (
                              <p className="text-xs text-orange-600 mt-2 font-medium">
                                 Only {item.variant.stock} left in stock - order soon.
                              </p>
                           )}
                        </div>

                        <div className="flex items-center justify-between mt-6">
                           <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="h-8 w-8 rounded-full hover:bg-muted text-foreground"
                                 >
                                    <Minus className="h-3.5 w-3.5" />
                                 </Button>
                                 <span className="w-8 text-center font-medium text-lg">
                                    {item.quantity}
                                 </span>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    disabled={item.variant && item.quantity >= item.variant.stock}
                                    className="h-8 w-8 rounded-full hover:bg-muted text-primary"
                                 >
                                    <Plus className="h-3.5 w-3.5" />
                                 </Button>
                              </div>
                              
                              <Button 
                                variant="ghost" 
                                className="text-primary hover:text-primary/80 hover:bg-transparent p-0 h-auto font-medium text-sm"
                                onClick={() => handleRemoveItem(item._id)}
                              >
                                Remove
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary - Sticky Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <Card className="rounded-3xl border-0 shadow-xl bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div>
                   <h2 className="text-2xl font-bold mb-6">Summary</h2>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between text-base">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">{formatPrice(hasSelectedItems ? checkoutTotal || 0 : subtotal)}</span>
                      </div>
                      
                      {appliedDiscount && (
                        <div className="flex justify-between text-base text-green-600">
                          <span className="flex items-center gap-1">
                             Discount <Badge variant="secondary" className="text-[10px] h-4 ml-1">{appliedDiscount.code}</Badge>
                          </span>
                          <span>-{formatPrice(appliedDiscount.discountAmount)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-base pt-4 border-t border-dashed border-border/50">
                        <span className="font-medium text-lg">Total</span>
                        <div className="text-right">
                           <span className="font-bold text-2xl block text-foreground">
                              {formatPrice(
                                appliedDiscount
                                  ? appliedDiscount.finalTotal
                                  : hasSelectedItems
                                  ? checkoutTotal || 0
                                  : subtotal
                              )}
                           </span>
                           <span className="text-xs text-muted-foreground">Including VAT</span>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="relative">
                      <Input 
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={!!appliedDiscount}
                        className="rounded-xl pr-20 h-11 bg-muted/40 border-transparent focus:bg-background transition-all"
                      />
                      {appliedDiscount ? (
                         <Button
                           size="sm"
                           variant="ghost" 
                           onClick={handleRemoveDiscount}
                           className="absolute right-1 top-1 h-9 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                         >
                            Remove
                         </Button>
                      ) : (
                         <Button
                           size="sm"
                           onClick={handleApplyDiscount}
                           disabled={discountLoading || !promoCode}
                           className="absolute right-1 top-1 h-9 rounded-lg"
                         >
                            Apply
                         </Button>
                      )}
                   </div>
                   
                   <Button 
                     className="w-full rounded-full h-12 text-base font-semibold shadow-lg shadow-primary/25"
                     size="lg"
                     onClick={handleCheckout}
                     disabled={!hasSelectedItems}
                   >
                     {hasSelectedItems ? `Check Out (${selectedItemsCount})` : "Select Items to Checkout"}
                   </Button>
                   
                   <p className="text-center text-xs text-muted-foreground pt-2">
                     Free shipping on all orders.
                   </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
