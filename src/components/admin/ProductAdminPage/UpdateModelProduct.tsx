import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { Product, variants } from "@/types/product";

interface UpdateModelProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onUpdate: (formData: FormData) => void;
  isLoading?: boolean;
}

export function UpdateModelProduct({
  open,
  onOpenChange,
  product,
  onUpdate,
  isLoading = false,
}: UpdateModelProductProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    category: "",
    brand: "",
    isActive: true,
    isNewArrival: false,
    isFeatured: false,
    onSale: false,
    price: {
      currentPrice: 0,
      discountPrice: 0,
      currency: "VND",
    },
    variants: [] as variants[],
    tags: [] as string[],
  });
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      const categoryValue =
        typeof product.category === "string"
          ? product.category
          : product.category?._id || "";

      const productPrice = product.price || {
        currentPrice: 0,
        discountPrice: 0,
        currency: "VND",
        _id: "",
      };

      const safeVariants = (product.variants || []).map((variant) => ({
        ...variant,
        price: variant.price || {
          currentPrice: productPrice.currentPrice,
          discountPrice: productPrice.discountPrice,
          currency: productPrice.currency,
          _id: "",
        },
      }));

      setFormData({
        name: product.name || "",
        description: product.description || "",
        slug: product.slug || "",
        category: categoryValue,
        brand: product.brand || "",
        isActive: product.isActive || true,
        isNewArrival: product.isNewArrival || false,
        isFeatured: product.isFeatured || false,
        onSale: product.onSale || false,
        price: {
          currentPrice: productPrice.currentPrice,
          discountPrice: productPrice.discountPrice,
          currency: productPrice.currency,
        },
        variants: safeVariants,
        tags: product.tags || [],
      });
      setExistingImages(product.images || []);
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const formDataToSend = new FormData();
    formDataToSend.append("id", product._id);

    // CHỈ GỬI NHỮNG TRƯỜNG THỰC SỰ THAY ĐỔI SO VỚI PRODUCT GỐC
    if (formData.name !== product.name) {
      formDataToSend.append("name", formData.name);
    }

    if (formData.description !== product.description) {
      formDataToSend.append("description", formData.description);
    }

    if (formData.slug !== product.slug) {
      formDataToSend.append("slug", formData.slug);
    }

    const originalCategory =
      typeof product.category === "string"
        ? product.category
        : product.category?._id || "";
    if (formData.category !== originalCategory) {
      formDataToSend.append("category", formData.category);
    }

    if (formData.brand !== product.brand) {
      formDataToSend.append("brand", formData.brand);
    }

    if (formData.isActive !== (product.isActive || true)) {
      formDataToSend.append("isActive", formData.isActive.toString());
    }

    if (formData.isNewArrival !== (product.isNewArrival || false)) {
      formDataToSend.append("isNewArrival", formData.isNewArrival.toString());
    }

    if (formData.isFeatured !== (product.isFeatured || false)) {
      formDataToSend.append("isFeatured", formData.isFeatured.toString());
    }

    if (formData.onSale !== (product.onSale || false)) {
      formDataToSend.append("onSale", formData.onSale.toString());
    }

    // Kiểm tra price có thay đổi không
    const productPrice = product.price || {
      currentPrice: 0,
      discountPrice: 0,
      currency: "VND",
      _id: "",
    };
    if (
      formData.price.currentPrice !== productPrice.currentPrice ||
      formData.price.discountPrice !== productPrice.discountPrice ||
      formData.price.currency !== productPrice.currency
    ) {
      formDataToSend.append("price", JSON.stringify(formData.price));
    }

    // Kiểm tra variants có thay đổi không - CHỈ GỬI NẾU CÓ THAY ĐỔI
    const originalVariants = product.variants || [];
    const hasVariantsChanged =
      formData.variants.length !== originalVariants.length ||
      formData.variants.some((variant, index) => {
        const originalVariant = originalVariants[index];
        if (!originalVariant) return true;

        return (
          variant.sku !== originalVariant.sku ||
          variant.color !== originalVariant.color ||
          variant.size !== originalVariant.size ||
          variant.stock !== originalVariant.stock ||
          JSON.stringify(variant.images) !==
            JSON.stringify(originalVariant.images) ||
          variant.price?.currentPrice !== originalVariant.price?.currentPrice ||
          variant.price?.discountPrice !==
            originalVariant.price?.discountPrice ||
          variant.price?.currency !== originalVariant.price?.currency
        );
      });

    if (hasVariantsChanged && formData.variants.length > 0) {
      formDataToSend.append("variants", JSON.stringify(formData.variants));
    }

    // Kiểm tra tags có thay đổi không
    const originalTags = product.tags || [];
    const hasTagsChanged =
      formData.tags.length !== originalTags.length ||
      formData.tags.some((tag, index) => tag !== originalTags[index]);

    if (hasTagsChanged && formData.tags.length > 0) {
      formDataToSend.append("tags", JSON.stringify(formData.tags));
    }

    // Thêm images mới nếu có
    if (images.length > 0) {
      images.forEach((file) => {
        formDataToSend.append("images", file);
      });
    }

    console.log("Sending only changed fields to update");
    onUpdate(formDataToSend);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          sku: `SKU-${Date.now()}`,
          color: "",
          size: "",
          stock: 0,
          images: [],
          price: {
            currentPrice: formData.price.currentPrice,
            discountPrice: formData.price.discountPrice,
            currency: "VND",
            _id: "",
          },
          _id: `temp-${Date.now()}`,
        },
      ],
    }));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      ),
    }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật sản phẩm</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin sản phẩm</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên sản phẩm *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Danh mục *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Thương hiệu *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPrice">Giá hiện tại *</Label>
                <Input
                  id="currentPrice"
                  type="number"
                  value={formData.price.currentPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: {
                        ...formData.price,
                        currentPrice: Number(e.target.value),
                      },
                    })
                  }
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountPrice">Giá khuyến mãi</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  value={formData.price.discountPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: {
                        ...formData.price,
                        discountPrice: Number(e.target.value),
                      },
                    })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Đang hoạt động</Label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isNewArrival">Sản phẩm mới</Label>
                <Switch
                  checked={formData.isNewArrival}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isNewArrival: checked })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Nổi bật</Label>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isFeatured: checked })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="onSale">Đang giảm giá</Label>
                <Switch
                  checked={formData.onSale}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, onSale: checked })
                  }
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả sản phẩm</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Thêm tag..."
                disabled={isLoading}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} disabled={isLoading}>
                Thêm
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                >
                  <span className="text-sm">{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Biến thể sản phẩm</Label>
              <Button
                type="button"
                onClick={addVariant}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Thêm biến thể
              </Button>
            </div>

            {formData.variants.map((variant, index) => (
              <div
                key={variant._id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Biến thể #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(index)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input
                      value={variant.sku}
                      onChange={(e) =>
                        updateVariant(index, "sku", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Màu sắc</Label>
                    <Input
                      value={variant.color}
                      onChange={(e) =>
                        updateVariant(index, "color", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kích thước</Label>
                    <Input
                      value={variant.size}
                      onChange={(e) =>
                        updateVariant(index, "size", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tồn kho</Label>
                    <Input
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(index, "stock", Number(e.target.value))
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Hình ảnh hiện tại</Label>
            <div className="grid grid-cols-4 gap-4">
              {existingImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Existing ${index}`}
                    className="h-20 w-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Thêm hình ảnh mới</Label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Thêm hình ảnh
            </Button>
            <div className="grid grid-cols-4 gap-4 mt-2">
              {images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="h-20 w-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-gray-900 text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
