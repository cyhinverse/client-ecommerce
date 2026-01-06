"use client";

import { useState, useEffect, useMemo } from "react";
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
  ChevronRight,
  Share2,
  Home,
  User,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getProductBySlug } from "@/features/product/productAction";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { addToCart } from "@/features/cart/cartAction";
import { cn } from "@/lib/utils";
import { Product, ProductModel, findModelByTierIndex, getVariationDisplay } from "@/types/product";

export default function ProductDetailPage() {
  const dispatch = useAppDispatch();
  const path = useParams();
  const { currentProduct, isLoading, error } = useAppSelector(
    (state) => state.product
  );
  
  // State for tier variation selection (new structure)
  const [selectedTierIndexes, setSelectedTierIndexes] = useState<number[]>([]);
  // State for old variant selection (backward compatibility)
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const router = useRouter();

  // Determine if product uses new tier variation structure
  const usesTierVariations = useMemo(() => {
    return currentProduct?.tierVariations && currentProduct.tierVariations.length > 0;
  }, [currentProduct]);

  // Get selected model based on tier indexes (new structure)
  const selectedModel = useMemo(() => {
    if (!usesTierVariations || !currentProduct) return null;
    return findModelByTierIndex(currentProduct, selectedTierIndexes);
  }, [usesTierVariations, currentProduct, selectedTierIndexes]);

  // Old variant logic (backward compatibility)
  const hasVariant =
    !usesTierVariations &&
    currentProduct?.variants?.[selectedVariant] &&
    currentProduct.variants.length > 0;
  const variant = hasVariant ? currentProduct.variants![selectedVariant] : null;

  // Get active price based on selection
  const activePrice = useMemo(() => {
    if (usesTierVariations && selectedModel) {
      return { currentPrice: selectedModel.price, discountPrice: null };
    }
    if (variant?.price) {
      return variant.price;
    }
    return currentProduct?.price;
  }, [usesTierVariations, selectedModel, variant, currentProduct]);

  // Get shop info
  const shopInfo = useMemo(() => {
    if (!currentProduct?.shop) return null;
    if (typeof currentProduct.shop === 'string') return { _id: currentProduct.shop, name: 'Shop' };
    return currentProduct.shop;
  }, [currentProduct]);

  // Get display images - MUST be before early return to maintain hooks order
  const displayImages = useMemo(() => {
    if (!currentProduct) return [];
    // Try tier variation images first
    if (usesTierVariations && currentProduct.tierVariations?.[0]?.images?.length) {
      const tierImages = currentProduct.tierVariations[0].images;
      if (tierImages[selectedTierIndexes[0]]) {
        return [tierImages[selectedTierIndexes[0]], ...currentProduct.images.filter(img => img !== tierImages[selectedTierIndexes[0]])];
      }
    }
    // Try variant images (old structure)
    if (variant?.images && variant.images.length > 0) {
      return variant.images;
    }
    return currentProduct.images || [];
  }, [usesTierVariations, currentProduct, variant, selectedTierIndexes]);

  const HandleAddToCart = async () => {
    if (!currentProduct) return;
    
    const result = await dispatch(
      addToCart({
        productId: currentProduct._id,
        shopId: shopInfo?._id || '',
        quantity,
        // Use modelId for new structure, variantId for old
        modelId: selectedModel?._id,
        variantId: variant?._id ?? undefined,
      })
    );
    if (result) {
      toast.success("Added to cart successfully");
    } else {
      toast.error("Failed to add to cart");
    }
  };

  useEffect(() => {
    dispatch(getProductBySlug(path.slug as string));
  }, [dispatch, path.slug]);

  // Initialize tier indexes when product loads
  useEffect(() => {
    if (currentProduct?.tierVariations && currentProduct.tierVariations.length > 0) {
      // Initialize with first option of each tier
      setSelectedTierIndexes(currentProduct.tierVariations.map(() => 0));
    }
  }, [currentProduct]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  // Handle tier option selection
  const handleTierOptionSelect = (tierIndex: number, optionIndex: number) => {
    const newIndexes = [...selectedTierIndexes];
    newIndexes[tierIndex] = optionIndex;
    setSelectedTierIndexes(newIndexes);
    
    // Update image if tier has images
    const tier = currentProduct?.tierVariations?.[tierIndex];
    if (tier?.images?.[optionIndex]) {
      setSelectedImageIndex(0);
    }
  };

  if (isLoading || !currentProduct) return <ProductDetailSkeleton />;

  const product = currentProduct;

  const parameters = [
    { label: "Model", value: "304" },
    { label: "Insulation Performance", value: "6-12 hours" },
    { label: "Style", value: "Cartoon" },
    { label: "Capacity", value: "350ml/450ml" },
    { label: "Inner Material", value: "316 Stainless Steel" },
    { label: "Outer Material", value: "304 Stainless Steel" },
    { label: "Shell Material", value: "304 Stainless Steel" },
    { label: "Function", value: "Portable, Vacuum" },
  ];

  const reviews = [
    {
      id: 1,
      user: "c***8",
      rating: 5,
      date: "2024-03-12",
      content:
        "Very beautiful cup, high quality finish. It looks just like the pictures. My daughter loves it!",
      images: [product.images?.[0] || ""],
      variant: "Sky Blue / 350ml",
    },
    {
      id: 2,
      user: "m***i",
      rating: 5,
      date: "2024-03-10",
      content:
        "Excellent insulation. Kept my tea hot for over 8 hours. Highly recommend.",
      images: [],
      variant: "Pearl White / 450ml",
    },
  ];

  return (
    <div className="bg-white min-h-screen pb-24 text-[#333] font-sans">
      {/* 1. Shop Header Bar (Tmall Style) */}
      <div className="border-b border-gray-100 hidden lg:block bg-white sticky top-0 z-40">
        <div className="max-w-[1240px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">
                Star Mall Official Store
              </span>
              <span className="bg-[#ff0036] text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold">
                Tmall
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="text-gray-400">Description:</span>
                <span className="text-[#ff0036] font-bold">4.9 ↑</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">Service:</span>
                <span className="text-[#ff0036] font-bold">4.9 ↑</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">Logistics:</span>
                <span className="text-[#ff0036] font-bold">4.9 ↑</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs border-gray-200 rounded-sm hover:text-[#E53935] hover:border-[#E53935]"
            >
              <Heart className="w-3.5 h-3.5 mr-1" /> Collection
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs border-gray-200 rounded-sm"
            >
              <Share2 className="w-3.5 h-3.5 mr-1" /> Buy
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 lg:py-6">
        {/* 2. Main Layout Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
          {/* Left: Desktop Gallery */}
          <div className="hidden lg:flex gap-4 shrink-0">
            {/* Vertical Thumbnails */}
            <div className="flex flex-col gap-2 w-[60px]">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => setSelectedImageIndex(idx)}
                  className={cn(
                    "w-[60px] h-[60px] border-2 rounded-sm overflow-hidden relative transition-all",
                    selectedImageIndex === idx
                      ? "border-[#E53935]"
                      : "border-transparent"
                  )}
                >
                  <Image src={img} alt="thumb" fill className="object-cover" />
                </button>
              ))}
              <div className="w-[60px] h-10 flex flex-col items-center justify-center text-[10px] text-gray-400 border border-gray-100 bg-gray-50/50 cursor-pointer hover:bg-gray-100">
                <span>More</span>
              </div>
            </div>

            {/* Main Primary Image */}
            <div className="w-[420px] h-[420px] relative border border-gray-100 rounded-sm overflow-hidden bg-white">
              <Image
                src={displayImages[selectedImageIndex] || ""}
                alt="Main"
                fill
                className="object-contain p-2"
                priority
              />
              {/* Image Navigation Mockups */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium text-gray-600">
                <span className="cursor-pointer hover:text-[#E53935]">
                  Video
                </span>
                <span className="w-px h-3 bg-gray-200 mx-1"></span>
                <span className="cursor-pointer text-[#E53935]">Image</span>
                <span className="w-px h-3 bg-gray-200 mx-1"></span>
                <span className="cursor-pointer hover:text-[#E53935]">
                  Params
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Gallery (Carousel) */}
          <div className="lg:hidden -mx-4">
            <div className="relative aspect-square w-full">
              <Image
                src={displayImages[selectedImageIndex] || ""}
                alt="Main"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-black/30 text-white text-[10px] px-2 py-0.5 rounded-full">
                {selectedImageIndex + 1} / {displayImages.length}
              </div>
            </div>
          </div>

          {/* Right: Detailed Product Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg lg:text-xl font-bold text-[#111] leading-snug mb-4">
              {product.name}
            </h1>
            <p className="text-[#E53935] text-sm mb-6 leading-relaxed">
              Specializing in high-quality minimalist design for modern
              lifestyle.
            </p>

            {/* Price Box */}
            <div className="bg-[#fef9f9] lg:bg-transparent p-4 lg:p-0 rounded-lg lg:rounded-none mb-8">
              <div className="flex items-baseline gap-2 text-[#ff0036]">
                <span className="text-lg font-bold">¥</span>
                <span className="text-[36px] font-bold leading-none tracking-tight">
                  {activePrice?.currentPrice?.toLocaleString() || "10.01"}
                </span>
                <span className="text-gray-400 text-sm line-through ml-3 font-normal">
                  ¥100.00+
                </span>
              </div>
              <div className="flex items-center gap-6 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-400" /> 48h
                  Delivery
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-gray-400" /> Free Returns
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-gray-400" /> Guaranteed
                  Quality
                </div>
              </div>
            </div>

            {/* Selection Grid */}
            <div className="space-y-6">
              {/* NEW: Tier Variations (Taobao-style) */}
              {usesTierVariations && product.tierVariations?.map((tier, tierIdx) => (
                <div key={tierIdx} className="flex items-start gap-4">
                  <span className="text-sm text-gray-400 w-12 pt-2">{tier.name}</span>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {tier.options.map((option, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleTierOptionSelect(tierIdx, optIdx)}
                        className={cn(
                          "flex items-center gap-2 p-1 border rounded-sm transition-all overflow-hidden bg-white",
                          selectedTierIndexes[tierIdx] === optIdx
                            ? "border-[#E53935] ring-1 ring-[#E53935]"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {tier.images?.[optIdx] && (
                          <div className="w-10 h-10 relative bg-gray-50 shrink-0">
                            <Image
                              src={tier.images[optIdx]}
                              alt={option}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="text-[11px] truncate pr-2 text-gray-700">
                          {option}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* OLD: Variants (backward compatibility) */}
              {!usesTierVariations && product.variants && product.variants.length > 0 && (
                <div className="flex items-start gap-4">
                  <span className="text-sm text-gray-400 w-12 pt-2">Color</span>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {product.variants.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedVariant(i);
                          if (v.images && v.images.length > 0)
                            setSelectedImageIndex(0);
                        }}
                        className={cn(
                          "flex items-center gap-2 p-1 border rounded-sm transition-all overflow-hidden bg-white",
                          selectedVariant === i
                            ? "border-[#E53935] ring-1 ring-[#E53935]"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className="w-10 h-10 relative bg-gray-50 shrink-0">
                          <Image
                            src={v.images?.[0] || product.images?.[0] || ""}
                            alt="v"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-[11px] truncate pr-2 text-gray-700">
                          {v.color || v.size || `Option ${i + 1}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Model Info (new structure) */}
              {usesTierVariations && selectedModel && (
                <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-sm">
                  <span>Selected: {getVariationDisplay(product, selectedModel)}</span>
                  <span className="text-gray-400">|</span>
                  <span>Stock: {selectedModel.stock}</span>
                  {selectedModel.sku && (
                    <>
                      <span className="text-gray-400">|</span>
                      <span>SKU: {selectedModel.sku}</span>
                    </>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-sm text-gray-400 w-12">Total</span>
                <div className="flex items-center h-9 border border-gray-300 rounded-sm">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-9 h-full flex items-center justify-center bg-gray-50 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 h-full text-center text-sm font-bold border-x border-gray-300 focus:outline-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-9 h-full flex items-center justify-center bg-gray-50 text-gray-400 hover:text-gray-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-gray-400 ml-2">
                  Estimated Arrival 3-5 days
                </span>
              </div>
            </div>

            {/* Action Buttons (Desktop Only) */}
            <div className="hidden lg:flex items-center gap-4 mt-12 pb-10">
              <button
                onClick={HandleAddToCart}
                className="w-[180px] h-12 rounded-full border border-[#E53935] text-[#E53935] font-bold text-sm bg-[#FFEBEE] hover:bg-[#FFCDD2] transition-colors"
              >
                Add to Cart
              </button>
              <button className="w-[180px] h-12 rounded-full bg-[#E53935] text-white font-bold text-sm hover:bg-[#D32F2F] active:scale-95 transition-all">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* 3. Detail Tabs & Bottom Sections */}
        <div className="mt-16 border-b border-gray-100 sticky top-0 lg:top-14 bg-white z-20">
          <div className="flex items-center gap-12 max-w-[800px] overflow-x-auto no-scrollbar">
            <button className="px-2 py-4 text-sm font-bold text-[#E53935] border-b-2 border-[#E53935] whitespace-nowrap">
              User Reviews
            </button>
            <button className="px-2 py-4 text-sm font-medium text-gray-500 hover:text-[#E53935] whitespace-nowrap">
              Parameters
            </button>
            <button className="px-2 py-4 text-sm font-medium text-gray-500 hover:text-[#E53935] whitespace-nowrap">
              Graphics Details
            </button>
            <button className="px-2 py-4 text-sm font-medium text-gray-500 hover:text-[#E53935] whitespace-nowrap">
              See Also
            </button>
          </div>
        </div>

        <div className="py-10 space-y-20 max-w-[900px]">
          {/* Reviews Section */}
          <section id="reviews">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-8">
              Buyer Reviews{" "}
              <span className="text-sm font-normal text-gray-400">
                ({reviews.length})
              </span>
            </h2>
            <div className="space-y-12">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="flex gap-4 border-b border-gray-50 pb-10 last:border-0"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-gray-300" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-[#111]">
                        {r.user}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {r.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="flex text-yellow-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span>|</span>
                      <span>{r.variant}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed font-light">
                      {r.content}
                    </p>
                    {r.images.length > 0 && (
                      <div className="flex gap-2 pt-2">
                        {r.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="w-24 h-24 relative rounded-sm border border-gray-100 overflow-hidden cursor-zoom-in"
                          >
                            <Image
                              src={img}
                              alt="rev"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center pt-6">
              <Button
                variant="ghost"
                className="text-xs text-gray-400 hover:text-[#E53935]"
              >
                View All Reviews <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </section>

          <Separator className="bg-gray-100" />

          {/* Parameters Section */}
          <section id="parameters">
            <h2 className="text-lg font-bold mb-8">Product Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 bg-[#fdfdfd] border border-gray-100">
              {parameters.map((p, i) => (
                <div
                  key={i}
                  className="flex border-b border-r border-gray-50 last:border-b-0"
                >
                  <div className="w-1/3 bg-[#f7f7f7] px-4 py-3 text-xs text-gray-500 font-medium">
                    {p.label}
                  </div>
                  <div className="flex-1 px-4 py-3 text-xs text-gray-700">
                    {p.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Separator className="bg-gray-100" />

          {/* Graphic Details Section */}
          <section id="graphics" className="space-y-0">
            <h2 className="text-lg font-bold mb-8">Visual Gallery</h2>
            <div className="flex flex-col">
              {displayImages.map((img, i) => (
                <div
                  key={i}
                  className="w-full relative aspect-square md:aspect-[2/1]"
                >
                  <Image src={img} alt="detail" fill className="object-cover" />
                </div>
              ))}
              <div className="w-full h-[600px] bg-[#f9f9f9] flex flex-col items-center justify-center">
                <h3 className="text-3xl font-light text-gray-300 tracking-widest uppercase mb-4">
                  Minimalist Home
                </h3>
                <div className="w-12 h-0.5 bg-gray-200"></div>
              </div>
            </div>
          </section>

          {/* Price Explanation Block */}
          <div className="bg-[#fcfcfc] p-8 lg:p-14 space-y-8 text-xs text-gray-500 leading-relaxed border-t border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm mb-4 tracking-wide uppercase">
              Price Explanation:
            </h3>

            <div className="space-y-6">
              <div>
                <strong className="text-gray-800 block mb-2 underline decoration-[#E53935]/30 underline-offset-4">
                  Underlined Price
                </strong>
                <p>
                  The underlined price is the suggested retail price, the
                  manufacturer's guide price, or the previously displayed sales
                  price. It is not the original price and is for reference only.
                </p>
              </div>
              <div>
                <strong className="text-gray-800 block mb-2 underline decoration-[#E53935]/30 underline-offset-4">
                  Uncrossed Price
                </strong>
                <p>
                  This is the real-time sales price of the product. It varies
                  based on participation in events or the use of coupons/points.
                  The final price on the order settlement page shall prevail.
                </p>
              </div>
              <div>
                <p className="opacity-70 italic border-l-2 border-gray-200 pl-4 py-1">
                  Merchant details page showing activity prices (such as flash
                  sales) may differ. Please refer to actual settlement rules.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* You Might Also Like Section */}
        <section className="mt-20 border-t border-gray-100 pt-16 pb-20">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="h-px w-20 bg-gray-200"></div>
            <h2 className="text-gray-400 font-medium tracking-widest uppercase text-sm">
              See Also
            </h2>
            <div className="h-px w-20 bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="aspect-square relative rounded-sm overflow-hidden bg-gray-50 mb-3">
                  <Image
                    src={product.images?.[0] || ""}
                    alt="rel"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="px-1 space-y-2">
                  <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed group-hover:text-[#E53935]">
                    {product.name} Variant Choice {item}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[#ff0036] font-bold text-sm">
                      ¥{89 + item}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      1000+ sold
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 5. Sticky Bottom Action Bar (Universal) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex items-center justify-between z-50 lg:px-20 h-16 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md bg-white/95">
        <div className="flex items-center gap-6 lg:gap-12">
          <div
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <Home className="w-5 h-5 text-gray-600 group-hover:text-[#E53935] transition-colors" />
            <span className="text-[10px] text-gray-400 group-hover:text-[#E53935] font-medium mt-1">
              Shop
            </span>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => router.push("/cart")}
          >
            <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-[#E53935] transition-colors" />
            <span className="text-[10px] text-gray-400 group-hover:text-[#E53935] font-medium mt-1">
              Cart
            </span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group">
            <Star className="w-5 h-5 text-gray-600 group-hover:text-[#E53935] transition-colors" />
            <span className="text-[10px] text-gray-400 group-hover:text-[#E53935] font-medium mt-1">
              Collect
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 lg:gap-4 flex-1 lg:flex-none justify-end pl-6">
          <button
            onClick={HandleAddToCart}
            className="px-6 h-11 lg:h-12 rounded-full bg-[#FFEBEE] text-[#E53935] border border-[#E53935] text-[13px] font-bold hover:bg-[#FFCDD2] active:scale-95 transition-all lg:w-[160px]"
          >
            Add to Cart
          </button>
          <button className="px-8 h-11 lg:h-12 rounded-full bg-[#E53935] text-white text-[13px] font-bold hover:bg-[#D32F2F] active:scale-95 transition-all lg:w-[160px]">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

// Optimized Skeleton for Premium Layout
function ProductDetailSkeleton() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 lg:py-8 space-y-12 bg-white min-h-screen">
      <div className="h-14 w-full bg-gray-50/50 rounded-sm mb-8" />
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
        <div className="flex gap-4 shrink-0">
          <div className="hidden lg:flex flex-col gap-2 w-[60px]">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[60px] w-[60px] rounded-sm" />
            ))}
          </div>
          <Skeleton className="w-[420px] aspect-square rounded-sm" />
        </div>
        <div className="flex-1 space-y-8">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
