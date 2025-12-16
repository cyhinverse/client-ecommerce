// components/admin/ProductAdminPage/ViewModelProduct.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, category } from "@/types/product";
import { Edit, Package, Tag, DollarSign, Calendar } from "lucide-react";
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
    return typeof category === "string"
      ? category
      : category.name || "None";
  };

  // Hàm lấy slug category
  const getCategorySlug = (category: category | string | null): string => {
    if (!category) return "";
    return typeof category === "string" ? "" : category.slug || "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-none p-0 gap-0">
        <DialogHeader className="p-6 border-b border-border">
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">Product Details</DialogTitle>
          <DialogDescription className="text-muted-foreground">Detailed product information</DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto no-scrollbar">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2 mb-4 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Basic Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-muted-foreground uppercase text-xs">Name:</span>
                    <span className="col-span-2 font-medium">{product.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-muted-foreground uppercase text-xs">Slug:</span>
                    <span className="col-span-2 text-muted-foreground">{product.slug}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-muted-foreground uppercase text-xs">Category:</span>
                    <div className="col-span-2">
                      <span className="font-medium">{getCategoryName(product.category)}</span>
                      {getCategorySlug(product.category) && (
                        <span className="text-muted-foreground ml-2 text-xs">
                          ({getCategorySlug(product.category)})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-muted-foreground uppercase text-xs">Brand:</span>
                    <span className="col-span-2 font-medium">{product.brand || "None"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2 mb-4 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-muted-foreground uppercase text-xs">Current Price:</span>
                    <span className="col-span-2 font-bold text-lg">{product.price?.currentPrice?.toLocaleString()}₫</span>
                  </div>
                  {product.price?.discountPrice &&
                    product.price.discountPrice > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-bold text-muted-foreground uppercase text-xs">Giá gốc:</span>
                        <span className="col-span-2 text-muted-foreground line-through">
                          {product.price.discountPrice.toLocaleString()}₫
                        </span>
                      </div>
                    )}
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-muted-foreground uppercase text-xs">Currency:</span>
                    <span className="col-span-2 text-muted-foreground">{product.price?.currency || "VND"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2 mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Status
                </h3>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={product.isActive ? "default" : "secondary"} className={`rounded-none font-normal ${product.isActive ? 'bg-success/10 text-success hover:bg-success/20' : 'bg-muted text-muted-foreground'}`}>
                      {product.isActive ? "Đang bán" : "Ngừng bán"}
                    </Badge>
                    {product.isNewArrival && (
                      <Badge variant="secondary" className="rounded-none font-normal bg-info/10 text-info hover:bg-info/20">Sản phẩm mới</Badge>
                    )}
                    {product.isFeatured && (
                      <Badge variant="secondary" className="rounded-none font-normal bg-primary/10 text-primary hover:bg-primary/20">Nổi bật</Badge>
                    )}
                    {product.onSale && (
                      <Badge variant="secondary" className="rounded-none font-normal bg-destructive/10 text-destructive hover:bg-destructive/20">Đang giảm giá</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2 mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timing & Stats
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-muted-foreground uppercase text-xs">Created At:</span>
                    <span className="col-span-2 text-muted-foreground">{new Date(product.createdAt).toLocaleDateString("en-US")}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-muted-foreground uppercase text-xs">Updated At:</span>
                    <span className="col-span-2 text-muted-foreground">{new Date(product.updatedAt).toLocaleDateString("en-US")}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-muted-foreground uppercase text-xs">Sold:</span>
                    <span className="col-span-2 font-medium">{product.soldCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2 mb-4">Description</h3>
              <div className="bg-muted/30 p-4 border border-border text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {product.description}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="rounded-none font-normal border-border text-muted-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2 mb-4">Product Variants</h3>
              <div className="space-y-3">
                {product.variants.map((variant, index) => (
                  <div key={variant._id} className="border border-border p-4 bg-muted/30">
                    <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="font-bold text-muted-foreground uppercase text-xs block mb-1">SKU</span>
                        <span className="font-medium">{variant.sku}</span>
                      </div>
                      <div>
                        <span className="font-bold text-muted-foreground uppercase text-xs block mb-1">Color</span>
                        <span className="font-medium">{variant.color || "None"}</span>
                      </div>
                      <div>
                        <span className="font-bold text-muted-foreground uppercase text-xs block mb-1">Size</span>
                        <span className="font-medium">{variant.size || "None"}</span>
                      </div>
                      <div>
                        <span className="font-bold text-muted-foreground uppercase text-xs block mb-1">Stock</span>
                        <span className="font-medium">{variant.stock}</span>
                      </div>
                    </div>
                    {variant.images && variant.images.length > 0 && (
                      <div className="border-t border-border pt-3">
                        <span className="font-bold text-muted-foreground uppercase text-xs block mb-2">
                          Variant Images
                        </span>
                        <div className="flex gap-2">
                          {variant.images.map((image, imgIndex) => (
                            <div key={imgIndex} className="relative h-12 w-12 border border-border">
                              <Image
                                src={image}
                                alt={`Variant ${index + 1} - ${imgIndex + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images */}
          {product.images && product.images.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2 mb-4">Product Images</h3>
              <div className="grid grid-cols-6 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="relative h-24 w-full border border-border">
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews count */}
          {product.reviews && product.reviews.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2 mb-4">Reviews</h3>
              <div className="text-sm">
                <span className="font-bold text-muted-foreground uppercase text-xs">Count:</span>{" "}
                <span className="font-medium">{product.reviews.length}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-border bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-none border-border hover:bg-background"
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={() => onEdit(product)}
            className="flex items-center gap-2 rounded-none"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
