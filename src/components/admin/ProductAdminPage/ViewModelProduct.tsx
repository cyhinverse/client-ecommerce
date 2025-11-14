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
import { Product } from "@/types/product";
import { Edit, Package, Tag, DollarSign, Calendar } from "lucide-react";

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
  const getCategoryName = (category: any): string => {
    if (!category) return "Không có";
    return typeof category === "string"
      ? category
      : category.name || "Không có";
  };

  // Hàm lấy slug category
  const getCategorySlug = (category: any): string => {
    if (!category) return "";
    return typeof category === "string" ? "" : category.slug || "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-4xl">
        <DialogHeader>
          <DialogTitle>Chi tiết sản phẩm</DialogTitle>
          <DialogDescription>Thông tin chi tiết về sản phẩm</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Thông tin cơ bản
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Tên:</span> {product.name}
                  </div>
                  <div>
                    <span className="font-medium">Slug:</span> {product.slug}
                  </div>
                  <div>
                    <span className="font-medium">Danh mục:</span>{" "}
                    {getCategoryName(product.category)}
                    {getCategorySlug(product.category) && (
                      <span className="text-muted-foreground ml-2">
                        ({getCategorySlug(product.category)})
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Thương hiệu:</span>{" "}
                    {product.brand || "Không có"}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Giá
                </h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Giá hiện tại:</span>{" "}
                    {product.price?.currentPrice?.toLocaleString()}₫
                  </div>
                  {product.price?.discountPrice &&
                    product.price.discountPrice > 0 && (
                      <div>
                        <span className="font-medium">Giá gốc:</span>{" "}
                        <span className="line-through">
                          {product.price.discountPrice.toLocaleString()}₫
                        </span>
                      </div>
                    )}
                  <div>
                    <span className="font-medium">Tiền tệ:</span>{" "}
                    {product.price?.currency || "VND"}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Trạng thái
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Đang bán" : "Ngừng bán"}
                    </Badge>
                  </div>
                  {product.isNewArrival && (
                    <Badge variant="secondary">Sản phẩm mới</Badge>
                  )}
                  {product.isFeatured && (
                    <Badge variant="secondary">Nổi bật</Badge>
                  )}
                  {product.onSale && (
                    <Badge variant="secondary">Đang giảm giá</Badge>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Thời gian
                </h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Ngày tạo:</span>{" "}
                    {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                  <div>
                    <span className="font-medium">Cập nhật:</span>{" "}
                    {new Date(product.updatedAt).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              {/* Số lượng đã bán */}
              <div>
                <h3 className="font-semibold mb-2">Thống kê bán hàng</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Đã bán:</span>{" "}
                    {product.soldCount || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Mô tả</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Biến thể sản phẩm</h3>
              <div className="space-y-3">
                {product.variants.map((variant, index) => (
                  <div key={variant._id} className="border rounded-lg p-3">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">SKU:</span> {variant.sku}
                      </div>
                      <div>
                        <span className="font-medium">Màu:</span>{" "}
                        {variant.color || "Không có"}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span>{" "}
                        {variant.size || "Không có"}
                      </div>
                      <div>
                        <span className="font-medium">Tồn kho:</span>{" "}
                        {variant.stock}
                      </div>
                    </div>
                    {variant.images && variant.images.length > 0 && (
                      <div className="mt-2">
                        <span className="font-medium text-sm">
                          Hình ảnh biến thể:
                        </span>
                        <div className="flex gap-2 mt-1">
                          {variant.images.map((image, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={image}
                              alt={`Variant ${index + 1} - ${imgIndex + 1}`}
                              className="h-12 w-12 object-cover rounded"
                            />
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
              <h3 className="font-semibold mb-2">Hình ảnh sản phẩm</h3>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-20 w-20 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Reviews count */}
          {product.reviews && product.reviews.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Đánh giá</h3>
              <div className="text-sm">
                <span className="font-medium">Số lượng đánh giá:</span>{" "}
                {product.reviews.length}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
          <Button
            type="button"
            onClick={() => onEdit(product)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
