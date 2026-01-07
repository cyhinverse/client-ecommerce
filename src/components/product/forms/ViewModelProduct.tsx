import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, Category } from "@/types/product";
import { Package, Tag, Box, Calendar, Store, ImageIcon } from "lucide-react";
import Image from "next/image";

interface ViewModelProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onEdit?: (product: Product) => void;
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
    return typeof category === "string" ? category : category.name || "Chưa phân loại";
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-700 border-0 rounded-lg">Đang bán</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-700 border-0 rounded-lg">Bản nháp</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-700 border-0 rounded-lg">Tạm ngưng</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-600 border-0 rounded-lg">Không xác định</Badge>;
    }
  };

  // Get first image from tierVariations or fallback to images array
  const getMainImage = (): string | null => {
    if (product.tierVariations?.[0]?.images?.[0]) {
      const firstImage = product.tierVariations[0].images[0];
      // Handle both 2D array (new) and flat array (old) structure
      if (Array.isArray(firstImage)) {
        return firstImage[0] || null;
      }
      return typeof firstImage === 'string' ? firstImage : null;
    }
    if (product.images?.[0]) {
      return product.images[0];
    }
    return null;
  };

  // Calculate total stock from models
  const getTotalStock = (): number => {
    if (product.models && product.models.length > 0) {
      return product.models.reduce((sum, m) => sum + (m.stock || 0), 0);
    }
    return product.stock || 0;
  };

  // Get model label from tierIndex
  const getModelLabel = (tierIndex: number[]): string => {
    if (!product.tierVariations) return "";
    return tierIndex.map((idx, i) => product.tierVariations[i]?.options[idx] || "").join(" / ");
  };

  const mainImage = getMainImage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-4xl border-border/50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl shadow-2xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader className="border-b border-border/50 pb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold tracking-tight">Chi tiết sản phẩm</DialogTitle>
              <DialogDescription className="text-muted-foreground">Xem thông tin chi tiết sản phẩm</DialogDescription>
            </div>
            {getStatusBadge(product.status)}
          </div>
        </DialogHeader>

        <div className="space-y-8 pt-6">
          {/* Header Card */}
          <div className="flex gap-6 items-start">
            <div className="shrink-0">
              {mainImage ? (
                <div className="relative h-32 w-32 rounded-2xl overflow-hidden border border-border/50 shadow-sm">
                  <Image src={mainImage} alt={product.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-32 w-32 rounded-2xl bg-gray-100 flex items-center justify-center border border-border/50">
                  <Package className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground font-mono mt-1">{product.slug}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.isNewArrival && <Badge variant="outline" className="rounded-md border-blue-200 bg-blue-50 text-blue-700">Mới</Badge>}
                {product.isFeatured && <Badge variant="outline" className="rounded-md border-purple-200 bg-purple-50 text-purple-700">Nổi bật</Badge>}
                {product.onSale && <Badge variant="outline" className="rounded-md border-red-200 bg-red-50 text-red-700">Giảm giá</Badge>}
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{product.price?.currentPrice?.toLocaleString()}₫</div>
              {product.price?.discountPrice && product.price.discountPrice > 0 && (
                <div className="text-sm text-muted-foreground line-through mt-1">{product.price.discountPrice.toLocaleString()}₫</div>
              )}
            </div>
          </div>


          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-gray-50/50 border border-border/50 space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <Box className="h-4 w-4" />
                Thông tin
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Thương hiệu</span>
                  <span className="font-medium">{product.brand || "—"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Danh mục</span>
                  <span className="font-medium">{getCategoryName(product.category)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Tồn kho</span>
                  <span className="font-medium">{getTotalStock()} sản phẩm</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Đã bán</span>
                  <span className="font-medium">{product.soldCount || 0} sản phẩm</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50/50 border border-border/50 space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Thời gian
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Ngày tạo</span>
                  <span className="font-medium">{new Date(product.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Cập nhật</span>
                  <span className="font-medium">{new Date(product.updatedAt).toLocaleDateString("vi-VN")}</span>
                </div>
                {product.shop && (
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground flex items-center gap-1"><Store className="h-3 w-3" /> Shop</span>
                    <span className="font-medium">{typeof product.shop === "string" ? product.shop : product.shop.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Mô tả</h4>
              <div className="p-4 rounded-2xl bg-white border border-border/50 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </div>
            </div>
          )}

          {/* Tier Variations & Images */}
          {product.tierVariations && product.tierVariations.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Phân loại hàng ({product.tierVariations.length})
              </h4>
              <div className="space-y-4">
                {product.tierVariations.map((tier, tierIdx) => {
                  // Helper to get image for an option
                  const getOptionImage = (optIdx: number): string | null => {
                    if (!tier.images?.[optIdx]) return null;
                    const img = tier.images[optIdx];
                    if (Array.isArray(img)) return img[0] || null;
                    return typeof img === 'string' ? img : null;
                  };

                  return (
                    <div key={tierIdx} className="p-4 rounded-xl border border-border/50 bg-white">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-medium text-gray-700">{tier.name}</span>
                        {tierIdx === 0 && tier.images && tier.images.length > 0 && (
                          <Badge variant="outline" className="text-xs">Có ảnh</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tier.options.map((opt, optIdx) => {
                          const optionImage = getOptionImage(optIdx);
                          return (
                            <div key={optIdx} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border">
                              {tierIdx === 0 && optionImage && (
                                <div className="relative w-8 h-8 rounded overflow-hidden">
                                  <Image src={optionImage} alt={opt} fill className="object-cover" />
                                </div>
                              )}
                              <span className="text-sm">{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Models (SKU) */}
          {product.models && product.models.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Danh sách SKU ({product.models.length})
              </h4>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Phân loại</th>
                      <th className="px-4 py-3 text-left font-medium">SKU</th>
                      <th className="px-4 py-3 text-right font-medium">Giá</th>
                      <th className="px-4 py-3 text-right font-medium">Tồn kho</th>
                      <th className="px-4 py-3 text-right font-medium">Đã bán</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {product.models.map((model, idx) => (
                      <tr key={model._id || idx} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium">{getModelLabel(model.tierIndex)}</td>
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{model.sku || "—"}</td>
                        <td className="px-4 py-3 text-right">{model.price?.toLocaleString()}₫</td>
                        <td className="px-4 py-3 text-right">{model.stock}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{model.sold || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Attributes */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Thông số kỹ thuật</h4>
              <div className="grid grid-cols-2 gap-2">
                {product.attributes.map((attr, idx) => (
                  <div key={idx} className="flex justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm">
                    <span className="text-muted-foreground">{attr.name}</span>
                    <span className="font-medium">{attr.value}</span>
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
                  <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* All Images Gallery */}
          {product.tierVariations?.[0]?.images && product.tierVariations[0].images.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Tất cả hình ảnh
              </h4>
              <div className="flex flex-wrap gap-3">
                {product.tierVariations[0].options.map((opt, optIdx) => {
                  const tierImages = product.tierVariations[0].images;
                  if (!tierImages?.[optIdx]) return null;
                  const img = tierImages[optIdx];
                  const imageUrl = Array.isArray(img) ? img[0] : (typeof img === 'string' ? img : null);
                  if (!imageUrl) return null;
                  
                  return (
                    <div key={optIdx} className="space-y-1">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border">
                        <Image src={imageUrl} alt={opt} fill className="object-cover" />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">{opt}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border/50 mt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl h-10 border-gray-200">
            Đóng
          </Button>
          {onEdit && (
            <Button type="button" onClick={() => onEdit(product)} className="rounded-xl h-10 bg-[#E53935] hover:bg-[#D32F2F] text-white gap-2 px-5">
              Chỉnh sửa
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
