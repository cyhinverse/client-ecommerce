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
import Image from "next/image";

interface UpdateModelProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onUpdate: (formData: FormData) => void;
  onDeleteVariant?: (variantId: string) => Promise<void>;
  isLoading?: boolean;
}

export function UpdateModelProduct({
  open,
  onOpenChange,
  product,
  onUpdate,
  onDeleteVariant,
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
// ...
  const removeVariant = async (index: number) => {
    const variantToDelete = formData.variants[index];
    
    // Check if it's an existing variant (has real ID) or a new temp one
    if (variantToDelete._id && !variantToDelete._id.startsWith("temp-")) {
      if (onDeleteVariant) {
        // Confirmation could be added here or in parent
        if (confirm("Are you sure you want to delete this variant?")) {
           try {
             await onDeleteVariant(variantToDelete._id);
             // Remove from local UI only after success
             setFormData((prev) => ({
               ...prev,
               variants: prev.variants.filter((_, i) => i !== index),
             }));
           } catch (error) {
             // Error handled by parent usually
             console.error("Failed to delete variant", error);
           }
        }
      } else {
        // If no handler provided, just remove from UI (fallback behavior, though risky for synced data)
        setFormData((prev) => ({
          ...prev,
          variants: prev.variants.filter((_, i) => i !== index),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }));
    }
  };
  const [images, setImages] = useState<File[]>([]);
  const [variantImages, setVariantImages] = useState<Record<string, File[]>>({});
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const variantFileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleVariantImageChange = (variantId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setVariantImages((prev) => ({
        ...prev,
        [variantId]: [...(prev[variantId] || []), ...newFiles],
      }));
    }
  };

  const removeVariantImage = (variantId: string, imageIndex: number) => {
    setVariantImages((prev) => ({
      ...prev,
      [variantId]: prev[variantId].filter((_, i) => i !== imageIndex),
    }));
  };

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

      // eslint-disable-next-line react-hooks/set-state-in-effect
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

    // Check if images changed (existing removed or new added)
    const originalImages = product.images || [];
    const hasImagesChanged =
      existingImages.length !== originalImages.length ||
      existingImages.some((img, index) => img !== originalImages[index]) ||
      images.length > 0;

    if (hasImagesChanged) {
      formDataToSend.append("existingImages", JSON.stringify(existingImages));

      // Add new images
      if (images.length > 0) {
        images.forEach((file) => {
          formDataToSend.append("images", file);
        });
      }
    }

    // Add new variant images (Process all variants to maintain index alignment)
    formData.variants.forEach((variant, index) => {
        const files = variantImages[variant._id];
        if (files && files.length > 0) {
            files.forEach((file) => {
                formDataToSend.append(`variantImages_${index}`, file);
            });
        }
    });

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

  const updateVariant = (
    index: number,
    field: string,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      ),
    }));
  };



  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border text-foreground max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>Edit product information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
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
                <Label htmlFor="category">Category *</Label>
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
                <Label htmlFor="brand">Brand *</Label>
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
                <Label htmlFor="currentPrice">Current Price *</Label>
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
                <Label htmlFor="discountPrice">Discount Price</Label>
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
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isNewArrival">New Arrival</Label>
                <Switch
                  checked={formData.isNewArrival}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isNewArrival: checked })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Featured</Label>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isFeatured: checked })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="onSale">On Sale</Label>
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
            <Label htmlFor="description">Product Description</Label>
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
                placeholder="Add tag..."
                disabled={isLoading}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} disabled={isLoading}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-muted px-2 py-1 rounded"
                >
                  <span className="text-sm">{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Product Variants</Label>
              <Button
                type="button"
                onClick={addVariant}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Variant
              </Button>
            </div>

            {formData.variants.map((variant, index) => (
              <div
                key={variant._id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Variant #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(index)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
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
                    <Label>Color</Label>
                    <Input
                      value={variant.color}
                      onChange={(e) =>
                        updateVariant(index, "color", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Size</Label>
                    <Input
                      value={variant.size}
                      onChange={(e) =>
                        updateVariant(index, "size", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
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

                {/* Variant Images Section */}
                <div className="space-y-2 border-t pt-3 mt-3">
                  <Label className="text-sm">Variant Images</Label>
                   
                   {/* Existing Images Display */}
                   {variant.images && variant.images.length > 0 && (
                       <div className="flex flex-wrap gap-2 mb-2">
                           {variant.images.map((img, imgIdx) => (
                               <div key={imgIdx} className="relative h-16 w-16 group">
                                   <Image 
                                       src={img} 
                                       alt="Variant" 
                                       fill 
                                       className="object-cover rounded border"
                                   />
                                   {/* Note: Deleting existing variant images not implemented yet, user can delete entire variant or we add specific handler */}
                               </div>
                           ))}
                       </div>
                   )}

                   {/* New Images Upload */}
                   <div className="flex flex-col gap-2">
                       <input
                           type="file"
                           multiple
                           accept="image/*"
                           onChange={(e) => handleVariantImageChange(variant._id, e)}
                           ref={(el) => { variantFileInputRefs.current[variant._id] = el; }}
                           className="hidden"
                       />
                       <Button
                           type="button"
                           variant="outline"
                           size="sm"
                           onClick={() => variantFileInputRefs.current[variant._id]?.click()}
                           disabled={isLoading}
                           className="w-fit"
                       >
                           <Upload className="h-3 w-3 mr-2" />
                           Add Images
                       </Button>

                       {variantImages[variant._id]?.length > 0 && (
                           <div className="flex flex-wrap gap-2">
                               {variantImages[variant._id].map((file, fileIdx) => (
                                   <div key={fileIdx} className="relative h-16 w-16 group">
                                       <Image
                                           src={URL.createObjectURL(file)}
                                           alt="New Variant Ref"
                                           fill
                                           className="object-cover rounded border"
                                       />
                                       <button
                                           type="button"
                                           onClick={() => removeVariantImage(variant._id, fileIdx)}
                                           className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                       >
                                           <X className="h-3 w-3" />
                                       </button>
                                   </div>
                               ))}
                           </div>
                       )}
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Existing Images</Label>
            <div className="grid grid-cols-4 gap-4">
              {existingImages.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={image}
                    alt={`Existing ${index}`}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Add New Images</Label>
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
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    fill
                    className="h-20 w-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
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
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
