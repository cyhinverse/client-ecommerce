"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, Category } from "@/types/product";
import { ShopCategory } from "@/types/shopCategory";
import {
  Package,
  Tag,
  Box,
  Calendar,
  Store,
  ImageIcon,
  Edit,
  ExternalLink,
  Layers,
  Palette,
  Ruler,
  Weight,
  ShoppingBag,
  Star,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ViewModelProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onEdit?: (product: Product) => void;
}

// Helper function to get color code from color name
function getColorCode(colorName: string): string {
  const colorMap: Record<string, string> = {
    đỏ: "#E53935",
    red: "#E53935",
    xanh: "#1976D2",
    blue: "#1976D2",
    "xanh dương": "#1976D2",
    "xanh lá": "#43A047",
    green: "#43A047",
    vàng: "#FDD835",
    yellow: "#FDD835",
    cam: "#FB8C00",
    orange: "#FB8C00",
    tím: "#8E24AA",
    purple: "#8E24AA",
    hồng: "#EC407A",
    pink: "#EC407A",
    đen: "#212121",
    black: "#212121",
    trắng: "#FAFAFA",
    white: "#FAFAFA",
    xám: "#757575",
    gray: "#757575",
    grey: "#757575",
    nâu: "#795548",
    brown: "#795548",
    be: "#D7CCC8",
    beige: "#D7CCC8",
    navy: "#1A237E",
    "xanh navy": "#1A237E",
  };
  return colorMap[colorName.toLowerCase().trim()] || "#E0E0E0";
}

export function ViewModelProduct({
  open,
  onOpenChange,
  product,
  onEdit,
}: ViewModelProductProps) {
  if (!product) return null;

  const getCategoryName = (category: Category | string | null): string => {
    if (!category) return "Chưa phân loại";
    return typeof category === "string"
      ? category
      : category.name || "Chưa phân loại";
  };

  const getShopCategoryName = (
    shopCategory: ShopCategory | string | undefined
  ): string => {
    if (!shopCategory) return "";
    return typeof shopCategory === "object" ? shopCategory.name : "";
  };

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "published":
        return {
          label: "Đang bán",
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "draft":
        return {
          label: "Bản nháp",
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "suspended":
        return {
          label: "Tạm ngưng",
          className: "bg-red-50 text-red-700 border-red-200",
        };
      default:
        return {
          label: "Không xác định",
          className: "bg-gray-50 text-gray-600 border-gray-200",
        };
    }
  };

  // Get all images from variants
  const getAllImages = (): string[] => {
    const images: string[] = [];
    if (product.variants) {
      product.variants.forEach((v) => {
        if (v.images) images.push(...v.images);
      });
    }
    return images;
  };

  // Get first image
  const getMainImage = (): string | null => {
    if (product.variants?.[0]?.images?.[0]) {
      return product.variants[0].images[0];
    }
    return null;
  };

  // Calculate total stock
  const getTotalStock = (): number => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    }
    return product.stock || 0;
  };

  // Calculate total sold
  const getTotalSold = (): number => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((sum, v) => sum + (v.sold || 0), 0);
    }
    return product.soldCount || 0;
  };

  const statusConfig = getStatusConfig(product.status);
  const mainImage = getMainImage();
  const allImages = getAllImages();
  const shopCategoryName = getShopCategoryName(product.shopCategory);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-hidden p-0 rounded-2xl border-0 shadow-2xl">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E53935]/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-[#E53935]" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">
                  Chi tiết sản phẩm
                </DialogTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  ID: {product._id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`rounded-full px-3 py-1 text-xs font-medium ${statusConfig.className}`}
              >
                {statusConfig.label}
              </Badge>
              <Link href={`/products/${product.slug}`} target="_blank">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-gray-500 hover:text-[#E53935]"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(92vh-140px)] no-scrollbar">
          <div className="p-6 space-y-6">
            {/* Product Header Card */}
            <div className="flex gap-6 p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border">
              {/* Main Image */}
              <div className="shrink-0">
                {mainImage ? (
                  <div className="relative w-36 h-36 rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-36 h-36 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Package className="w-10 h-10 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-400 font-mono mt-1">
                  /{product.slug}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {product.isNewArrival && (
                    <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                      Mới
                    </Badge>
                  )}
                  {product.isFeatured && (
                    <Badge className="bg-purple-50 text-purple-600 border-purple-200 text-xs">
                      Nổi bật
                    </Badge>
                  )}
                  {product.onSale && (
                    <Badge className="bg-red-50 text-red-600 border-red-200 text-xs">
                      Giảm giá
                    </Badge>
                  )}
                  {product.brand && (
                    <Badge variant="outline" className="text-xs">
                      {product.brand}
                    </Badge>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-medium">
                      {product.ratingAverage?.toFixed(1) || "0.0"}
                    </span>
                    <span className="text-gray-400">
                      ({product.reviewCount || 0})
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-200" />
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Đã bán {getTotalSold()}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <div className="text-2xl font-bold text-[#E53935]">
                  {product.price?.currentPrice?.toLocaleString()}₫
                </div>
                {product.price?.discountPrice &&
                  product.price.discountPrice > 0 && (
                    <div className="text-sm text-gray-400 line-through mt-1">
                      {product.price.discountPrice.toLocaleString()}₫
                    </div>
                  )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* Category Info */}
              <div className="p-4 rounded-xl bg-white border hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Danh mục
                  </span>
                </div>
                <p className="font-semibold text-gray-800">
                  {getCategoryName(product.category)}
                </p>
                {shopCategoryName && (
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <Store className="w-3 h-3" />
                    {shopCategoryName}
                  </p>
                )}
              </div>

              {/* Stock Info */}
              <div className="p-4 rounded-xl bg-white border hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <Box className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Tồn kho
                  </span>
                </div>
                <p
                  className={`font-semibold text-2xl ${
                    getTotalStock() > 10
                      ? "text-emerald-600"
                      : getTotalStock() > 0
                      ? "text-amber-600"
                      : "text-red-500"
                  }`}
                >
                  {getTotalStock()}
                </p>
                <p className="text-xs text-gray-400 mt-1">sản phẩm có sẵn</p>
              </div>

              {/* Time Info */}
              <div className="p-4 rounded-xl bg-white border hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Thời gian
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Tạo:{" "}
                  <span className="font-medium">
                    {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Sửa:{" "}
                  <span className="font-medium">
                    {new Date(product.updatedAt).toLocaleDateString("vi-VN")}
                  </span>
                </p>
              </div>
            </div>

            {/* Sizes Section */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="p-4 rounded-xl bg-white border">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <Ruler className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Kích thước có sẵn
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium border border-gray-100"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Variants Section */}
            {product.variants && product.variants.length > 0 && (
              <div className="rounded-xl border overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">
                      Phân loại màu ({product.variants.length})
                    </span>
                  </div>
                </div>
                <div className="divide-y">
                  {product.variants.map((variant, idx) => (
                    <div
                      key={variant._id || idx}
                      className="p-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Variant Image */}
                        <div className="shrink-0">
                          {variant.images?.[0] ? (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                              <Image
                                src={variant.images[0]}
                                alt={variant.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Variant Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {variant.color && (
                              <span
                                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                style={{
                                  backgroundColor: getColorCode(variant.color),
                                }}
                              />
                            )}
                            <span className="font-medium text-gray-800">
                              {variant.name}
                            </span>
                          </div>
                          {variant.sku && (
                            <p className="text-xs text-gray-400 font-mono mt-1">
                              SKU: {variant.sku}
                            </p>
                          )}
                        </div>

                        {/* Variant Stats */}
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="text-gray-400 text-xs">Giá</p>
                            <p className="font-semibold text-[#E53935]">
                              {variant.price?.toLocaleString()}₫
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400 text-xs">Tồn kho</p>
                            <p
                              className={`font-semibold ${
                                variant.stock > 10
                                  ? "text-emerald-600"
                                  : variant.stock > 0
                                  ? "text-amber-600"
                                  : "text-red-500"
                              }`}
                            >
                              {variant.stock}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400 text-xs">Đã bán</p>
                            <p className="font-medium text-gray-600">
                              {variant.sold || 0}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400 text-xs">Ảnh</p>
                            <p className="font-medium text-gray-600">
                              {variant.images?.length || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="p-4 rounded-xl bg-white border">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Mô tả sản phẩm
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Shipping Info */}
            {(product.weight || product.dimensions) && (
              <div className="p-4 rounded-xl bg-white border">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Thông tin vận chuyển
                  </span>
                </div>
                <div className="flex gap-6">
                  {product.weight && (
                    <div className="flex items-center gap-2">
                      <Weight className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Cân nặng:{" "}
                        <span className="font-medium">{product.weight}g</span>
                      </span>
                    </div>
                  )}
                  {product.dimensions &&
                    (product.dimensions.length ||
                      product.dimensions.width ||
                      product.dimensions.height) && (
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Kích thước:{" "}
                          <span className="font-medium">
                            {product.dimensions.length || 0} x{" "}
                            {product.dimensions.width || 0} x{" "}
                            {product.dimensions.height || 0} cm
                          </span>
                        </span>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Attributes */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="p-4 rounded-xl bg-white border">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <Box className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Thông số kỹ thuật
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {product.attributes.map((attr, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm"
                    >
                      <span className="text-gray-500">{attr.name}</span>
                      <span className="font-medium text-gray-700">
                        {attr.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="p-4 rounded-xl bg-white border">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Tags
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-gray-100 text-gray-600 rounded-full px-3"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* All Images Gallery */}
            {allImages.length > 0 && (
              <div className="p-4 rounded-xl bg-white border">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Tất cả hình ảnh ({allImages.length})
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {allImages.slice(0, 12).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden border hover:border-[#E53935] transition-colors"
                    >
                      <Image
                        src={img}
                        alt={`Image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {allImages.length > 12 && (
                    <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
                      +{allImages.length - 12}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl h-10 px-5 border-gray-200"
          >
            Đóng
          </Button>
          {onEdit && (
            <Button
              onClick={() => onEdit(product)}
              className="rounded-xl h-10 px-5 bg-[#E53935] hover:bg-[#D32F2F] text-white gap-2"
            >
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
