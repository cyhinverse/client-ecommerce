"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  Share2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getProductBySlug } from "@/features/product/productAction";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewDialog from "@/components/review/ReviewModal";
import { addToCart } from "@/features/cart/cartAction";
import Link from "next/link";
import { cn } from "@/lib/utils";

import RelatedProducts from "@/components/product/RelatedProducts";

export default function ProductDetailPage() {
  const dispatch = useAppDispatch();
  const path = useParams();
  const { currentProduct, isLoading, error } = useAppSelector(
    (state) => state.product
  );
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const router = useRouter();

  const hasVariant =
    currentProduct?.variants[selectedVariant] &&
    currentProduct.variants.length > 0;
  const variant = hasVariant ? currentProduct.variants[selectedVariant] : null;

  const HandleAddToCart = async () => {
    const result = await dispatch(
      addToCart({
        productId: currentProduct?._id as string,
        quantity,
        variantId: variant?._id ?? null,
      })
    );
    if (result) {
      toast.success("Added to bag successfully");
      router.push("/cart");
    } else {
      toast.error("Failed to add to bag");
    }
  };

  useEffect(() => {
    dispatch(getProductBySlug(path.slug as string));
  }, [dispatch, path.slug]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (!currentProduct && !isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground">Product not found</h2>
        <p className="text-muted-foreground mt-2">The product you are looking for does not exist.</p>
        <Button asChild className="mt-8 rounded-full" variant="outline">
           <Link href="/products">Back to Store</Link>
        </Button>
      </div>
    );
  }

  const product = currentProduct;

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading || !product) return <ProductDetailSkeleton />;

  // Calculate distinct colors and sizes if implied by variants (simple logic for now)
  // For standard variants display:
  const activePrice = variant ? variant.price : product.price;

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground/80 mb-8 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
          <Link href="/" className="hover:text-foreground transition-colors mr-2">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0 text-muted-foreground/50" />
          <Link href="/products" className="hover:text-foreground transition-colors mx-2">Products</Link>
          <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0 text-muted-foreground/50" />
          <span className="font-medium text-foreground ml-2 truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Column: Images (Impoved) - Span 7 */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-24 h-fit">
             <div className="relative aspect-[4/3] w-full bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden group border border-gray-100 dark:border-zinc-800">
                {product.images?.[selectedImageIndex] ? (
                  <Image
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    fill
                    className="object-contain p-8 lg:p-12 transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                ) : (
                   <div className="flex h-full w-full items-center justify-center text-muted-foreground/20">
                      <span className="text-6xl"></span>
                   </div>
                )}
                
                {/* Minimalist Floating Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                   {product.isNewArrival && (
                      <span className="px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/5 text-foreground text-[11px] font-semibold tracking-wide uppercase">
                         New Season
                      </span>
                   )}
                   {product.onSale && (
                      <span className="px-3 py-1.5 rounded-full bg-orange-500/10 backdrop-blur-md border border-orange-500/20 text-orange-600 text-[11px] font-semibold tracking-wide uppercase">
                         Sale
                      </span>
                   )}
                </div>

                <div className="absolute top-6 right-6">
                   <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 bg-white/50 dark:bg-black/50 backdrop-blur-md hover:bg-white dark:hover:bg-black transition-all shadow-sm border border-black/5">
                      <Share2 className="h-4 w-4" />
                   </Button>
                </div>
             </div>

             {/* Refined Thumbnails */}
             {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto p-2 no-scrollbar">
                   {product.images.map((img, idx) => (
                      <button
                         key={idx}
                         onClick={() => setSelectedImageIndex(idx)}
                         className={cn(
                            "relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden transition-all duration-300 bg-white dark:bg-zinc-900",
                            selectedImageIndex === idx 
                               ? "ring-1 ring-black dark:ring-white ring-offset-2 dark:ring-offset-black opacity-100" 
                               : "opacity-60 hover:opacity-100 border border-transparent hover:border-gray-200"
                         )}
                      >
                         <Image src={img} alt="Thumbnail" fill className="object-contain p-2" />
                      </button>
                   ))}
                </div>
             )}
          </div>

          {/* Right Column: Information & Actions - Span 5 */}
          <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-0">
             
             {/* Header Section */}
             <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                   <Link href={`/collections/${product.brand}`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline underline-offset-4">
                      {product.brand || "Apple Inc."}
                   </Link>
                   <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold ml-1">4.9</span>
                      <span className="text-sm text-muted-foreground underline decoration-dotted underline-offset-4 cursor-pointer hover:text-foreground transition-colors ml-1">(128 reviews)</span>
                   </div>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground tracking-tight leading-[1.1] mb-6">
                   {product.name}
                </h1>

                <div className="flex items-baseline gap-4 mb-6">
                   {activePrice?.discountPrice && activePrice.discountPrice < activePrice.currentPrice ? (
                     <div className="flex flex-col">
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-foreground">
                               {activePrice.discountPrice.toLocaleString('en-US', { style: 'currency', currency: 'VND' })}
                            </span>
                            <span className="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg uppercase tracking-wide">
                               Save {Math.round(((activePrice.currentPrice - activePrice.discountPrice) / activePrice.currentPrice) * 100)}%
                            </span>
                        </div>
                        <span className="text-lg text-muted-foreground line-through decoration-gray-300 dark:decoration-gray-700 mt-1">
                           {activePrice.currentPrice.toLocaleString('en-US', { style: 'currency', currency: 'VND' })}
                        </span>
                     </div>
                   ) : (
                        <span className="text-3xl font-bold text-foreground">
                           {activePrice?.currentPrice?.toLocaleString('en-US', { style: 'currency', currency: 'VND' }) || "Contact for Price"}
                        </span>
                   )}
                </div>

                <p className="text-base text-muted-foreground leading-relaxed">
                   {product.description}
                </p>
             </div>
             
             <Separator className="mb-8 opacity-50" />

             {/* Variants & Config */}
             <div className="space-y-8 mb-10">
                {product.variants && product.variants.length > 0 && (
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-semibold text-foreground">Configuration</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                         {product.variants.map((v, i) => (
                            <button
                               key={i}
                               onClick={() => setSelectedVariant(i)}
                               className={cn(
                                  "relative px-6 py-3 rounded-xl border transition-all duration-200 min-w-[100px] text-center",
                                  selectedVariant === i 
                                    ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10"
                                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-foreground bg-transparent"
                               )}
                            >
                               <span className="text-sm font-semibold block">{v.size}</span>
                               <span className={cn(
                                  "text-[10px] uppercase tracking-wider block mt-0.5",
                                   selectedVariant === i ? "opacity-80" : "text-muted-foreground"
                               )}>
                                  {v.color}
                               </span>
                            </button>
                         ))}
                      </div>
                   </div>
                )}

                {/* Actions Row */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                   {/* Quantity */}
                   <div className="flex items-center bg-gray-50 dark:bg-zinc-900 rounded-full border border-gray-200 dark:border-zinc-800 p-1 w-fit">
                      <button 
                        onClick={() => handleQuantityChange(-1)} 
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-zinc-800 shadow-sm transition-all disabled:opacity-30 disabled:hover:shadow-none disabled:hover:bg-transparent"
                      >
                         <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(1)} 
                        disabled={quantity >= 10}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-zinc-800 shadow-sm transition-all disabled:opacity-30 disabled:hover:shadow-none disabled:hover:bg-transparent"
                      >
                         <Plus className="w-4 h-4" />
                      </button>
                   </div>

                   {/* Add Button */}
                   <Button 
                     onClick={HandleAddToCart}
                     className="flex-1 h-[50px] rounded-full text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                   >
                     <ShoppingCart className="mr-2 h-5 w-5" />
                     Add to Bag
                   </Button>
                   
                   <Button variant="outline" className="h-[50px] w-[50px] rounded-full border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 p-0 flex-shrink-0">
                      <Heart className="h-5 w-5" />
                   </Button>
                </div>
             </div>

             {/* Features / Services (Vertical List for better readability) */}
             <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/50">
                   <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                      <Truck className="h-5 w-5" strokeWidth={1.5} />
                   </div>
                   <div>
                      <h4 className="text-sm font-semibold">Free Express Delivery</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Order before 2PM for same day dispatch</p>
                   </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/50">
                   <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
                      <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />
                   </div>
                   <div>
                      <h4 className="text-sm font-semibold">2 Year Warranty</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Full coverage for any manufacturing defects</p>
                   </div>
                </div>
             </div>

             <Separator className="mb-10 opacity-50" />

             {/* Reviews Section Preview */}
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-bold tracking-tight">Customer Reviews</h3>
                   <ReviewDialog productId={product._id} />
                </div>
                
                {product.reviews && product.reviews.length > 0 ? (
                   <div className="space-y-4">
                      {product.reviews.slice(0, 2).map((review) => (
                         <div key={review._id} className="border-b border-gray-100 dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-sm font-semibold">{review.username}</span>
                               <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                     <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-gray-200 dark:text-zinc-800"}`} />
                                  ))}
                               </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                         </div>
                      ))}
                      {product.reviews.length > 2 && (
                         <Button variant="link" className="p-0 h-auto text-blue-600">View all {product.reviews.length} reviews</Button>
                      )}
                   </div>
                ) : (
                   <div className="text-center py-8 bg-gray-50 dark:bg-zinc-900 rounded-xl">
                      <p className="text-sm text-muted-foreground">No reviews yet.</p>
                   </div>
                )}
             </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-24 lg:mt-32">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold tracking-tight">You might also like</h3>
                <Link href="/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center transition-colors group">
                   View Collection <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
             </div>
             <RelatedProducts productId={product._id} />
        </div>
      </div>
    </div>
  );
}

// Optimized Skeleton for Premium Layout
function ProductDetailSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 space-y-12">
       <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-4 w-12 rounded-full" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20 rounded-full" />
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="space-y-6">
             <Skeleton className="aspect-square w-full rounded-[2.5rem]" />
             <div className="flex gap-4 justify-center">
                {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-20 rounded-2xl" />)}
             </div>
          </div>
          
          <div className="space-y-8 pt-4">
             <div className="space-y-4">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-12 w-3/4 rounded-xl" />
                <Skeleton className="h-8 w-48 rounded-lg" />
                <div className="space-y-2 pt-4">
                   <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-4 w-2/3" />
                </div>
             </div>
             
             <div className="space-y-4 pt-4">
                <Skeleton className="h-5 w-32" />
                <div className="grid grid-cols-3 gap-3">
                   {[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
                </div>
             </div>
             
             <div className="h-14 w-full rounded-[1.5rem] bg-gray-100 dark:bg-gray-800" />
             
             <div className="grid grid-cols-3 gap-4">
                {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
             </div>
          </div>
       </div>
    </div>
  );
}
