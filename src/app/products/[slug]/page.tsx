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
  Shield,
  Truck,
  RotateCcw,
  ChevronRight,
  Home,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getProductBySlug } from "@/features/product/productAction";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewDialog from "@/components/common/ReviewModel";
import { addToCart } from "@/features/cart/cartAction";
import Link from "next/link";

export default function ProductDetailPage() {
  const dispatch = useAppDispatch();
  const path = useParams();
  const { currentProduct, isLoading, error } = useAppSelector(
    (state) => state.product,
  );
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const router = useRouter();

  const hasVariant = currentProduct?.variants[selectedVariant] && currentProduct.variants.length > 0
  const variant = hasVariant ? currentProduct.variants[selectedVariant] : null

  const HandleAddToCart = async () => {
    const result = await dispatch(
      addToCart({
        productId: currentProduct?._id as string,
        quantity,
        variantId: variant?._id,
      }),
    );
    if (result) {
      toast.success("Product added to cart");
      router.push("/cart");
    } else {
      toast.error("Failed to add product to cart");
    }
  };

  useEffect(() => {
    dispatch(getProductBySlug(path.slug as string));
  }, [dispatch, path.slug]);

  if (error) {
    toast.error(error);
  }

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!currentProduct) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 text-center">
        <p className="text-muted-foreground">Product not found</p>
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

  const calculateDiscount = () => {
    if (product.price?.discountPrice && product.price.currentPrice) {
      return Math.round(
        ((product.price.currentPrice - product.price.discountPrice) /
          product.price.currentPrice) *
        100,
      );
    }
    return 0;
  };

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground">
        <Link
          href="/"
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <Home className="h-3 w-3" />
          Home
        </Link>
        <ChevronRight className="h-3 w-3 mx-2" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                width={600}
                height={600}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-muted/30">
                <div className="mb-3 h-16 w-16 rounded-xl bg-muted flex items-center justify-center">
                  <span className="text-2xl">👗</span>
                </div>
                <p className="font-medium">{product.brand}</p>
                <p className="text-sm text-muted-foreground">Product Image</p>
              </div>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`shrink-0 w-16 h-16 rounded-md border transition-all ${selectedImageIndex === index
                    ? "border-foreground"
                    : "border-border hover:border-foreground/50"
                    }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover rounded-md"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isNewArrival && (
                <Badge variant="outline" className="text-xs">
                  New Arrival
                </Badge>
              )}
              {product.onSale && (
                <Badge className="bg-red-500 text-white hover:bg-red-600 text-xs">
                  Sale {calculateDiscount()}% Off
                </Badge>
              )}
              {product.isFeatured && (
                <Badge variant="secondary" className="text-xs">
                  Featured
                </Badge>
              )}
            </div>

            {/* Brand & Title */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {product.brand}
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                (4.8) • {product.reviews?.length || 0} reviews
              </span>
            </div>

            {/* Price */}
            <div>
              {product.price?.discountPrice &&
                product.price?.currentPrice &&
                product.price.discountPrice < product.price.currentPrice ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price.discountPrice)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price.currentPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-semibold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price?.currentPrice || 0)}
                </span>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <p className="text-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Tags</p>
              <div className="flex flex-wrap gap-1">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted text-xs rounded-md text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <p className="font-medium mb-3">Options</p>
              <div className="grid gap-2">
                {product.variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(index)}
                    className={`p-3 border rounded-lg text-left transition-colors ${selectedVariant === index
                      ? "border-foreground bg-muted/50"
                      : "border-border hover:bg-muted/30"
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">
                          {variant.color} - {variant.size}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Stock: {variant.stock}
                        </p>
                      </div>
                      <p className="font-semibold text-sm">
                        {variant.price?.discountPrice &&
                          variant.price.discountPrice <
                          variant.price.currentPrice ? (
                          <span className="text-red-600">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(variant.price.discountPrice)}
                          </span>
                        ) : (
                          <span>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(variant.price?.currentPrice || 0)}
                          </span>
                        )}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="font-medium mb-3">Quantity</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                  className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">Max: 10 items</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <Button
                onClick={() => HandleAddToCart()}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" className="w-full" size="lg">
              Buy Now
            </Button>
          </div>

          {/* Features */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Free shipping on orders over ₫500,000
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                30-day return policy
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                2-year warranty included
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t pt-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Customer Reviews</h2>
            <ReviewDialog productId={product._id} />
          </div>

          {/* Review Summary */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-semibold mb-1">4.8</div>
              <div className="flex justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {product.reviews?.length || 0} reviews
              </p>
            </div>

            <div className="md:col-span-2 space-y-2">
              {product.reviews?.map((review) => (
                <div key={review._id} className="flex items-center gap-3">
                  <span className="text-sm w-6 text-muted-foreground">
                    {review.rating} stars
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-1.5">
                    <div
                      className="bg-yellow-400 h-1.5 rounded-full"
                      style={{
                        width:
                          review.rating === 5
                            ? "70%"
                            : review.rating === 4
                              ? "20%"
                              : "5%",
                      }}
                    />
                  </div>
                  <span className="text-sm w-10 text-muted-foreground">
                    {review.rating === 5
                      ? "70%"
                      : review.rating === 4
                        ? "20%"
                        : "5%"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {product.reviews && product.reviews.length > 0 ? (
            product.reviews?.map((review) => (
              <div key={review._id} className="space-y-6">
                <ReviewItem
                  initial={review.username.charAt(0)}
                  name={review.username}
                  rating={review.rating}
                  date={review.createdAt}
                  verified
                  comment={review.comment}
                />
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No reviews yet.</p>
          )}

          {/* Load More Reviews */}
          <div className="text-center">
            <Button variant="outline" size="sm">
              Load More Reviews
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Component
function ProductDetailSkeleton() {
  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 space-y-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-3 w-32" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-16 rounded-md" />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-28" />
          </div>

          <Separator />

          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-5 w-16" />
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-14 rounded-md" />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-5 w-20" />
            <div className="flex gap-4">
              <Skeleton className="h-9 w-28 rounded-lg" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <Skeleton className="h-11 flex-1 rounded-lg" />
              <Skeleton className="h-11 w-11 rounded-lg" />
            </div>
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Review Item Component
function ReviewItem({
  initial,
  name,
  rating,
  date,
  verified,
  comment,
}: {
  initial: string;
  name: string;
  rating: number;
  date: string;
  verified?: boolean;
  comment: string;
}) {
  return (
    <div className="border-b pb-6 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
          <span className="text-sm font-medium text-muted-foreground">
            {initial}
          </span>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-medium text-sm">{name}</h4>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{date}</span>
              </div>
            </div>
            {verified && (
              <Badge variant="outline" className="text-xs bg-green-50">
                Verified
              </Badge>
            )}
          </div>
          <p className="text-foreground text-sm leading-relaxed">{comment}</p>
        </div>
      </div>
    </div>
  );
}
