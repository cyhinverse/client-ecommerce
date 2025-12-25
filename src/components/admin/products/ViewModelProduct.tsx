import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, category } from "@/types/product";
import { Edit, Package, Tag, Box, Calendar } from "lucide-react";
import Image from "next/image";

interface ViewModelProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onEdit: (product: Product) => void;
}

export function ViewModelProduct({
  open,
  onOpenChange,
  product,
  onEdit,
}: ViewModelProductProps) {
  if (!product) return null;

  // Hàm lấy tên category
  const getCategoryName = (category: category | string | null): string => {
    if (!category) return "None";
    return typeof category === "string" ? category : category.name || "None";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-4xl border-border/50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl shadow-2xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader className="border-b border-border/50 pb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Product Details
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Comprehensive overview of product information
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {product.isActive ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 rounded-lg px-3 py-1">
                  Active
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0 rounded-lg px-3 py-1"
                >
                  Inactive
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 pt-6">
          {/* Header Card Summary */}
          <div className="flex gap-6 items-start">
            {/* Main Image */}
            <div className="shrink-0">
              {product.images && product.images.length > 0 ? (
                <div className="relative h-32 w-32 rounded-2xl overflow-hidden border border-border/50 shadow-sm">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-32 w-32 rounded-2xl bg-gray-100 flex items-center justify-center border border-border/50 text-muted-foreground">
                  <Package className="h-8 w-8 opacity-50" />
                </div>
              )}
            </div>

            {/* Title & Stats */}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground font-mono mt-1">
                  {product._id}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.isNewArrival && (
                  <Badge
                    variant="outline"
                    className="rounded-md border-blue-200 bg-blue-50 text-blue-700"
                  >
                    New Arrival
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge
                    variant="outline"
                    className="rounded-md border-purple-200 bg-purple-50 text-purple-700"
                  >
                    Featured
                  </Badge>
                )}
                {product.onSale && (
                  <Badge
                    variant="outline"
                    className="rounded-md border-red-200 bg-red-50 text-red-700"
                  >
                    On Sale
                  </Badge>
                )}
              </div>
            </div>

            {/* Price Large Display */}
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">
                {product.price?.currentPrice?.toLocaleString()}₫
              </div>
              {product.price?.discountPrice &&
                product.price.discountPrice > 0 && (
                  <div className="text-sm text-muted-foreground line-through mt-1">
                    {product.price.discountPrice.toLocaleString()}₫
                  </div>
                )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Product Info */}
            <div className="p-5 rounded-2xl bg-gray-50/50 border border-border/50 space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <Box className="h-4 w-4" />
                Details
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Brand</span>
                  <span className="font-medium">{product.brand || "—"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">
                    {getCategoryName(product.category)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Slug</span>
                  <span
                    className="font-medium max-w-[150px] truncate"
                    title={product.slug}
                  >
                    {product.slug}
                  </span>
                </div>
                <div className="flex justify-between py-1 pt-2">
                  <span className="text-muted-foreground">Stock Status</span>
                  <span className="font-medium">
                    {/* Just a simple text or logic here */}
                    {product.variants?.reduce(
                      (acc, v) => acc + (v.stock || 0),
                      0
                    ) || 0}{" "}
                    in stock
                  </span>
                </div>
              </div>
            </div>

            {/* Timing & Metadata */}
            <div className="p-5 rounded-2xl bg-gray-50/50 border border-border/50 space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-4 w-4" />
                History
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 pt-2">
                  <span className="text-muted-foreground">Total Sold</span>
                  <span className="font-medium">
                    {product.soldCount || 0} units
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Description
              </h4>
              <div className="p-4 rounded-2xl bg-white border border-border/50 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </div>
            </div>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Variants ({product.variants.length})
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((variant, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-white"
                  >
                    {variant.images && variant.images.length > 0 ? (
                      <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-border/30">
                        <Image
                          src={variant.images[0]}
                          alt="v"
                          width={40}
                          height={40}
                          className="object-cover h-full w-full"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-100 shrink-0"></div>
                    )}
                    <div className="text-sm">
                      <div className="font-medium">{variant.sku}</div>
                      <div className="text-muted-foreground text-xs">
                        {variant.color && <span>{variant.color}</span>}
                        {variant.color && variant.size && <span> • </span>}
                        {variant.size && <span>{variant.size}</span>}
                        <span className="ml-2 px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">
                          Stock: {variant.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {product.images && product.images.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Gallery
              </h4>
              <div className="grid grid-cols-6 gap-3">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden border border-border/50"
                  >
                    <Image
                      src={img}
                      alt="Product gallery"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border/50 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl h-10 border-gray-200"
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={() => onEdit(product)}
            className="rounded-xl h-10 bg-black text-white hover:bg-black/90 dark:bg-[#0071e3] gap-2 px-5"
          >
            <Edit className="h-4 w-4" />
            Edit Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
