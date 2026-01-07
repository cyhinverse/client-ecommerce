import { useState, useEffect, useCallback } from "react";
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
import { Plus, X, Trash2, Upload, ImageIcon } from "lucide-react";
import { Product, TierVariation, ProductModel, ProductAttribute } from "@/types/product";
import { Category } from "@/types/category";
import { TagItem } from "@/components/product/forms/TagItem";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getTreeCategories } from "@/features/category/categoryAction";

interface UpdateModelProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onUpdate: (formData: FormData) => void;
  isLoading?: boolean;
}

// Extended TierVariation with images per option
interface TierVariationWithImages extends TierVariation {
  optionImages: { 
    existing: string[]; // URLs from server
    newFiles: File[]; 
    newPreviews: string[];
  }[];
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Bản nháp" },
  { value: "published", label: "Đang bán" },
  { value: "suspended", label: "Tạm ngưng" },
];

// Flatten categories tree for dropdown
const flattenCategories = (categories: Category[], prefix = ""): { _id: string; name: string; displayName: string }[] => {
  const result: { _id: string; name: string; displayName: string }[] = [];
  categories.forEach((cat) => {
    if (cat._id && cat.name) {
      const displayName = prefix ? `${prefix} > ${cat.name}` : cat.name;
      result.push({ _id: cat._id, name: cat.name, displayName });
      if (cat.subcategories && cat.subcategories.length > 0) {
        result.push(...flattenCategories(cat.subcategories, displayName));
      }
    }
  });
  return result;
};

export function UpdateModelProduct({
  open,
  onOpenChange,
  product,
  onUpdate,
  isLoading = false,
}: UpdateModelProductProps) {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);
  const flatCategories = flattenCategories(categories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    category: "",
    brand: "",
    status: "published" as "draft" | "published" | "suspended" | "deleted",
    isNewArrival: false,
    isFeatured: false,
    price: {
      currentPrice: 0,
      discountPrice: 0,
      currency: "VND",
    },
    stock: 0,
    weight: 0,
    dimensions: { height: 0, width: 0, length: 0 },
    tierVariations: [] as TierVariationWithImages[],
    models: [] as ProductModel[],
    attributes: [] as ProductAttribute[],
    tags: [] as string[],
    descriptionImages: { 
      existing: [] as string[],
      newFiles: [] as File[], 
      newPreviews: [] as string[] 
    },
  });

  const [newTag, setNewTag] = useState("");
  const [newAttribute, setNewAttribute] = useState({ name: "", value: "" });
  const [newTierVariation, setNewTierVariation] = useState({ name: "", options: "" });

  // Fetch categories when dialog opens
  useEffect(() => {
    if (open && categories.length === 0) {
      dispatch(getTreeCategories());
    }
  }, [open, categories.length, dispatch]);

  useEffect(() => {
    if (product) {
      const categoryValue = typeof product.category === "string" ? product.category : product.category?._id || "";
      const productPrice = product.price || { currentPrice: 0, discountPrice: 0, currency: "VND" };

      // Convert tierVariations to include image structure
      const tierVariationsWithImages: TierVariationWithImages[] = (product.tierVariations || []).map((tier, tierIdx) => {
        if (tierIdx === 0) {
          // First tier has images - map existing images to options
          // tier.images can be string[] (flat) or string[][] (per option)
          const tierImages = tier.images || [];
          return {
            name: tier.name,
            options: tier.options,
            optionImages: tier.options.map((_, optIdx) => {
              // Check if images is array of arrays (per option) or flat array
              const optionImgs = Array.isArray(tierImages[optIdx]) 
                ? (tierImages[optIdx] as unknown as string[])
                : (typeof tierImages[optIdx] === 'string' ? [tierImages[optIdx] as string] : []);
              return {
                existing: optionImgs,
                newFiles: [] as File[],
                newPreviews: [] as string[],
              };
            }),
          };
        }
        return {
          name: tier.name,
          options: tier.options,
          optionImages: [],
        };
      });

      setFormData({
        name: product.name || "",
        description: product.description || "",
        slug: product.slug || "",
        category: categoryValue,
        brand: product.brand || "",
        status: product.status || "published",
        isNewArrival: product.isNewArrival || false,
        isFeatured: product.isFeatured || false,
        price: {
          currentPrice: productPrice.currentPrice ?? 0,
          discountPrice: productPrice.discountPrice ?? 0,
          currency: productPrice.currency ?? "VND",
        },
        stock: product.stock || 0,
        weight: product.weight || 0,
        dimensions: {
          height: product.dimensions?.height || 0,
          width: product.dimensions?.width || 0,
          length: product.dimensions?.length || 0,
        },
        tierVariations: tierVariationsWithImages,
        models: product.models || [],
        attributes: product.attributes || [],
        tags: product.tags || [],
        descriptionImages: {
          existing: product.descriptionImages || [],
          newFiles: [],
          newPreviews: [],
        },
      });
    }
  }, [product]);

  // Handle image upload for a specific option in first tierVariation
  const handleOptionImageChange = (optionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentImages = formData.tierVariations[0]?.optionImages?.[optionIndex];
    const totalImages = (currentImages?.existing?.length || 0) + (currentImages?.newFiles?.length || 0) + files.length;
    if (totalImages > 8) {
      alert("Mỗi phân loại tối đa 8 ảnh");
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => {
      const newTierVariations = [...prev.tierVariations];
      if (newTierVariations[0]) {
        const newOptionImages = [...(newTierVariations[0].optionImages || [])];
        const current = newOptionImages[optionIndex] || { existing: [], newFiles: [], newPreviews: [] };
        newOptionImages[optionIndex] = {
          existing: current.existing,
          newFiles: [...current.newFiles, ...files],
          newPreviews: [...current.newPreviews, ...newPreviews],
        };
        newTierVariations[0] = { ...newTierVariations[0], optionImages: newOptionImages };
      }
      return { ...prev, tierVariations: newTierVariations };
    });
  };

  // Remove existing image from option
  const removeExistingOptionImage = (optionIndex: number, imageIndex: number) => {
    setFormData(prev => {
      const newTierVariations = [...prev.tierVariations];
      if (newTierVariations[0]?.optionImages?.[optionIndex]) {
        const optImages = newTierVariations[0].optionImages[optionIndex];
        newTierVariations[0].optionImages[optionIndex] = {
          ...optImages,
          existing: optImages.existing.filter((_, i) => i !== imageIndex),
        };
      }
      return { ...prev, tierVariations: newTierVariations };
    });
  };

  // Remove new image from option
  const removeNewOptionImage = (optionIndex: number, imageIndex: number) => {
    setFormData(prev => {
      const newTierVariations = [...prev.tierVariations];
      if (newTierVariations[0]?.optionImages?.[optionIndex]) {
        const optImages = newTierVariations[0].optionImages[optionIndex];
        URL.revokeObjectURL(optImages.newPreviews[imageIndex]);
        newTierVariations[0].optionImages[optionIndex] = {
          ...optImages,
          newFiles: optImages.newFiles.filter((_, i) => i !== imageIndex),
          newPreviews: optImages.newPreviews.filter((_, i) => i !== imageIndex),
        };
      }
      return { ...prev, tierVariations: newTierVariations };
    });
  };

  // Handle description images upload
  const handleDescriptionImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const totalImages = formData.descriptionImages.existing.length + formData.descriptionImages.newFiles.length + files.length;
    if (totalImages > 20) {
      alert("Tối đa 20 ảnh mô tả chi tiết");
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      descriptionImages: {
        ...prev.descriptionImages,
        newFiles: [...prev.descriptionImages.newFiles, ...files],
        newPreviews: [...prev.descriptionImages.newPreviews, ...newPreviews],
      },
    }));
  };

  const removeExistingDescriptionImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      descriptionImages: {
        ...prev.descriptionImages,
        existing: prev.descriptionImages.existing.filter((_, i) => i !== index),
      },
    }));
  };

  const removeNewDescriptionImage = (index: number) => {
    setFormData(prev => {
      URL.revokeObjectURL(prev.descriptionImages.newPreviews[index]);
      return {
        ...prev,
        descriptionImages: {
          ...prev.descriptionImages,
          newFiles: prev.descriptionImages.newFiles.filter((_, i) => i !== index),
          newPreviews: prev.descriptionImages.newPreviews.filter((_, i) => i !== index),
        },
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const formDataToSend = new FormData();
    formDataToSend.append("id", product._id);

    // Only send changed fields
    if (formData.name !== product.name) formDataToSend.append("name", formData.name);
    if (formData.description !== product.description) formDataToSend.append("description", formData.description);
    if (formData.slug !== product.slug) formDataToSend.append("slug", formData.slug);

    const originalCategory = typeof product.category === "string" ? product.category : product.category?._id || "";
    if (formData.category !== originalCategory) formDataToSend.append("category", formData.category);
    if (formData.brand !== product.brand) formDataToSend.append("brand", formData.brand);
    if (formData.status !== product.status) formDataToSend.append("status", formData.status);
    if (formData.isNewArrival !== product.isNewArrival) formDataToSend.append("isNewArrival", formData.isNewArrival.toString());
    if (formData.isFeatured !== product.isFeatured) formDataToSend.append("isFeatured", formData.isFeatured.toString());
    if (formData.stock !== product.stock) formDataToSend.append("stock", formData.stock.toString());
    if (formData.weight !== product.weight) formDataToSend.append("weight", formData.weight.toString());

    // Price
    const productPrice = product.price || { currentPrice: 0, discountPrice: 0, currency: "VND" };
    if (formData.price.currentPrice !== productPrice.currentPrice || formData.price.discountPrice !== productPrice.discountPrice) {
      formDataToSend.append("price", JSON.stringify(formData.price));
    }

    // Dimensions
    if (JSON.stringify(formData.dimensions) !== JSON.stringify(product.dimensions)) {
      formDataToSend.append("dimensions", JSON.stringify(formData.dimensions));
    }

    // Tier Variations - convert back to server format
    const tierVariationsForServer = formData.tierVariations.map((tier, tierIdx) => {
      if (tierIdx === 0 && tier.optionImages) {
        return {
          name: tier.name,
          options: tier.options,
        };
      }
      return { name: tier.name, options: tier.options };
    });
    formDataToSend.append("tierVariations", JSON.stringify(tierVariationsForServer));

    // Append variant images for first tier
    if (formData.tierVariations[0]?.optionImages) {
      // Send existing images mapping
      const existingImagesMapping = formData.tierVariations[0].optionImages.map((opt, idx) => ({
        optionIndex: idx,
        existing: opt.existing,
      }));
      formDataToSend.append("existingVariantImages", JSON.stringify(existingImagesMapping));

      // Send new files
      formData.tierVariations[0].optionImages.forEach((optImages, optIdx) => {
        optImages.newFiles.forEach((file) => {
          formDataToSend.append(`variantImages_${optIdx}`, file);
        });
      });
      
      // Send new image mapping
      const newImageMapping = formData.tierVariations[0].optionImages.map((opt, idx) => ({
        optionIndex: idx,
        count: opt.newFiles.length,
      }));
      formDataToSend.append("variantImageMapping", JSON.stringify(newImageMapping));
    }

    // Models with SKU - remove temp _id for new models
    const modelsForServer = formData.models.map(model => {
      // If _id starts with 'temp-', it's a new model - don't send _id
      if (model._id.startsWith('temp-')) {
        const { _id, ...modelWithoutId } = model;
        return modelWithoutId;
      }
      return model;
    });
    formDataToSend.append("models", JSON.stringify(modelsForServer));

    // Attributes
    if (JSON.stringify(formData.attributes) !== JSON.stringify(product.attributes)) {
      formDataToSend.append("attributes", JSON.stringify(formData.attributes));
    }

    // Tags
    if (JSON.stringify(formData.tags) !== JSON.stringify(product.tags)) {
      formDataToSend.append("tags", JSON.stringify(formData.tags));
    }

    // Description Images
    const originalDescImages = product.descriptionImages || [];
    const hasDescImageChanges = 
      JSON.stringify(formData.descriptionImages.existing) !== JSON.stringify(originalDescImages) ||
      formData.descriptionImages.newFiles.length > 0;
    
    if (hasDescImageChanges) {
      formDataToSend.append("existingDescriptionImages", JSON.stringify(formData.descriptionImages.existing));
      formData.descriptionImages.newFiles.forEach((file) => {
        formDataToSend.append("descriptionImages", file);
      });
    }

    onUpdate(formDataToSend);
  };

  const addTag = useCallback(() => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  }, [newTag, formData.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }));
  }, []);

  const addAttribute = () => {
    if (newAttribute.name.trim() && newAttribute.value.trim()) {
      setFormData((prev) => ({ ...prev, attributes: [...prev.attributes, { ...newAttribute }] }));
      setNewAttribute({ name: "", value: "" });
    }
  };

  const removeAttribute = (index: number) => {
    setFormData((prev) => ({ ...prev, attributes: prev.attributes.filter((_, i) => i !== index) }));
  };

  const addTierVariation = () => {
    if (newTierVariation.name.trim() && newTierVariation.options.trim()) {
      const options = newTierVariation.options.split(",").map((o) => o.trim()).filter(Boolean);
      if (options.length > 0) {
        // Check if tier with same name already exists
        const existingTierIndex = formData.tierVariations.findIndex(
          t => t.name.toLowerCase() === newTierVariation.name.trim().toLowerCase()
        );

        if (existingTierIndex >= 0) {
          // Add options to existing tier
          setFormData((prev) => {
            const newTierVariations = [...prev.tierVariations];
            const existingTier = newTierVariations[existingTierIndex];
            
            // Filter out options that already exist
            const newOptions = options.filter(opt => !existingTier.options.includes(opt));
            if (newOptions.length === 0) return prev;

            // Add new options
            newTierVariations[existingTierIndex] = {
              ...existingTier,
              options: [...existingTier.options, ...newOptions],
              // Add image slots for new options if this is the first tier
              optionImages: existingTierIndex === 0 
                ? [...(existingTier.optionImages || []), ...newOptions.map(() => ({ existing: [], newFiles: [], newPreviews: [] }))]
                : existingTier.optionImages,
            };

            return {
              ...prev,
              tierVariations: newTierVariations,
              models: [], // Reset models when options change
            };
          });
        } else {
          // Add new tier
          const isFirstTier = formData.tierVariations.length === 0;
          const newTier: TierVariationWithImages = {
            name: newTierVariation.name.trim(),
            options,
            optionImages: isFirstTier ? options.map(() => ({ existing: [], newFiles: [], newPreviews: [] })) : [],
          };
          setFormData((prev) => ({
            ...prev,
            tierVariations: [...prev.tierVariations, newTier],
            models: [],
          }));
        }
        setNewTierVariation({ name: "", options: "" });
      }
    }
  };

  // Remove a single option from a tier
  const removeOptionFromTier = (tierIndex: number, optionIndex: number) => {
    setFormData((prev) => {
      const newTierVariations = [...prev.tierVariations];
      const tier = newTierVariations[tierIndex];
      
      // If only one option left, remove the entire tier
      if (tier.options.length <= 1) {
        // Cleanup images if removing first tier
        if (tierIndex === 0) {
          tier.optionImages?.forEach(opt => {
            opt.newPreviews.forEach(url => URL.revokeObjectURL(url));
          });
        }
        return {
          ...prev,
          tierVariations: prev.tierVariations.filter((_, i) => i !== tierIndex),
          models: [],
        };
      }

      // Remove the option and its images
      if (tierIndex === 0 && tier.optionImages?.[optionIndex]) {
        tier.optionImages[optionIndex].newPreviews.forEach(url => URL.revokeObjectURL(url));
      }

      newTierVariations[tierIndex] = {
        ...tier,
        options: tier.options.filter((_, i) => i !== optionIndex),
        optionImages: tierIndex === 0 
          ? (tier.optionImages || []).filter((_, i) => i !== optionIndex)
          : tier.optionImages,
      };

      return {
        ...prev,
        tierVariations: newTierVariations,
        models: [], // Reset models when options change
      };
    });
  };

  const removeTierVariation = (index: number) => {
    // Cleanup images if removing first tier
    if (index === 0) {
      formData.tierVariations[0]?.optionImages?.forEach(opt => {
        opt.newPreviews.forEach(url => URL.revokeObjectURL(url));
      });
    }
    setFormData((prev) => ({
      ...prev,
      tierVariations: prev.tierVariations.filter((_, i) => i !== index),
      models: [],
    }));
  };

  const generateModels = () => {
    if (formData.tierVariations.length === 0) return;

    const generateCombinations = (tiers: TierVariationWithImages[], current: number[] = []): number[][] => {
      if (current.length === tiers.length) return [current];
      const tier = tiers[current.length];
      const combinations: number[][] = [];
      for (let i = 0; i < tier.options.length; i++) {
        combinations.push(...generateCombinations(tiers, [...current, i]));
      }
      return combinations;
    };

    const combinations = generateCombinations(formData.tierVariations);
    const newModels: ProductModel[] = combinations.map((tierIndex, idx) => ({
      _id: `temp-${idx}`,
      tierIndex,
      price: formData.price.currentPrice,
      stock: 0,
      sold: 0,
      sku: "",
    }));

    setFormData((prev) => ({ ...prev, models: newModels }));
  };

  const updateModel = (index: number, field: keyof ProductModel, value: number | string) => {
    setFormData((prev) => ({
      ...prev,
      models: prev.models.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    }));
  };

  const getModelLabel = (model: ProductModel): string => {
    return model.tierIndex.map((idx, i) => formData.tierVariations[i]?.options[idx] || "").join(" / ");
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] rounded-4xl border-border/50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">Cập nhật sản phẩm</DialogTitle>
          <DialogDescription className="text-muted-foreground">Chỉnh sửa thông tin sản phẩm</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-b pb-2">Thông tin cơ bản</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tên sản phẩm <span className="text-red-500">*</span></Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  required 
                  disabled={isLoading} 
                  className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white" 
                  placeholder="VD: Áo thun nam cotton" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Slug (URL)</Label>
                <Input 
                  value={formData.slug} 
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })} 
                  disabled={isLoading} 
                  className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white" 
                  placeholder="Để trống sẽ tự tạo từ tên" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Danh mục</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })} 
                  disabled={isLoading}
                >
                  <SelectTrigger className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white">
                    <SelectValue placeholder="Chọn danh mục sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    {flatCategories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>{cat.displayName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Thương hiệu</Label>
                <Input 
                  value={formData.brand} 
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })} 
                  disabled={isLoading} 
                  className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white" 
                  placeholder="VD: Nike, Adidas, Uniqlo" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Mô tả sản phẩm</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                rows={3} 
                disabled={isLoading} 
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white resize-none" 
                placeholder="Mô tả chi tiết về sản phẩm, chất liệu, công dụng..." 
              />
            </div>
          </div>

          {/* Description Images */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Ảnh mô tả chi tiết</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Thêm ảnh mô tả chi tiết sản phẩm (tối đa 20 ảnh). Ảnh này sẽ hiển thị trong phần mô tả chi tiết.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Existing images from server */}
              {formData.descriptionImages.existing.map((url, index) => (
                <div key={`existing-${index}`} className="relative w-24 h-24 rounded-xl overflow-hidden border group">
                  <Image src={url} alt={`Mô tả ${index + 1}`} fill className="object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeExistingDescriptionImage(index)} 
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {/* New images to upload */}
              {formData.descriptionImages.newPreviews.map((preview, index) => (
                <div key={`new-${index}`} className="relative w-24 h-24 rounded-xl overflow-hidden border group border-green-300">
                  <Image src={preview} alt={`Mô tả mới ${index + 1}`} fill className="object-cover" />
                  <span className="absolute bottom-1 left-1 text-[10px] bg-green-500 text-white px-1 rounded">Mới</span>
                  <button 
                    type="button" 
                    onClick={() => removeNewDescriptionImage(index)} 
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {(formData.descriptionImages.existing.length + formData.descriptionImages.newFiles.length) < 20 && (
                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#E53935] hover:bg-red-50/50 transition-colors">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Thêm ảnh</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleDescriptionImageChange} 
                    className="hidden" 
                    disabled={isLoading} 
                  />
                </label>
              )}
            </div>
            {(formData.descriptionImages.existing.length + formData.descriptionImages.newFiles.length) > 0 && (
              <p className="text-xs text-muted-foreground">
                Đã chọn {formData.descriptionImages.existing.length + formData.descriptionImages.newFiles.length}/20 ảnh
              </p>
            )}
          </div>

          {/* Pricing & Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-b pb-2">Giá & Trạng thái</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Giá bán (VND) <span className="text-red-500">*</span></Label>
                <Input 
                  type="number" 
                  value={formData.price.currentPrice || ""} 
                  onChange={(e) => setFormData({ ...formData, price: { ...formData.price, currentPrice: Number(e.target.value) } })} 
                  disabled={isLoading} 
                  className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white" 
                  placeholder="150000" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Giá khuyến mãi</Label>
                <Input 
                  type="number" 
                  value={formData.price.discountPrice || ""} 
                  onChange={(e) => setFormData({ ...formData, price: { ...formData.price, discountPrice: Number(e.target.value) || 0 } })} 
                  disabled={isLoading} 
                  className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white" 
                  placeholder="120000" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tồn kho</Label>
                <Input 
                  type="number" 
                  value={formData.stock || ""} 
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} 
                  disabled={isLoading} 
                  className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white" 
                  placeholder="100" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Trạng thái</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as typeof formData.status })} disabled={isLoading}>
                  <SelectTrigger className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUS_OPTIONS.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-border/50">
                <Switch checked={formData.isNewArrival} onCheckedChange={(checked) => setFormData({ ...formData, isNewArrival: checked })} disabled={isLoading} />
                <Label className="text-sm font-medium cursor-pointer">Sản phẩm mới</Label>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-border/50">
                <Switch checked={formData.isFeatured} onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })} disabled={isLoading} />
                <Label className="text-sm font-medium cursor-pointer">Sản phẩm nổi bật</Label>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-b pb-2">Thông tin vận chuyển</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Cân nặng (gram)</Label>
                <Input type="number" value={formData.weight || ""} onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })} disabled={isLoading} className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white" placeholder="500" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Dài (cm)</Label>
                <Input type="number" value={formData.dimensions.length || ""} onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, length: Number(e.target.value) } })} disabled={isLoading} className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white" placeholder="30" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Rộng (cm)</Label>
                <Input type="number" value={formData.dimensions.width || ""} onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, width: Number(e.target.value) } })} disabled={isLoading} className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white" placeholder="20" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Cao (cm)</Label>
                <Input type="number" value={formData.dimensions.height || ""} onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, height: Number(e.target.value) } })} disabled={isLoading} className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white" placeholder="5" />
              </div>
            </div>
          </div>

          {/* Tier Variations */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Phân loại hàng</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Thêm phân loại đầu tiên (VD: Màu sắc) để upload ảnh cho từng tùy chọn. Ảnh của tùy chọn đầu tiên sẽ là ảnh chính của sản phẩm.
              </p>
            </div>
            <div className="grid grid-cols-[1fr_2fr_auto] gap-2">
              <Input 
                value={newTierVariation.name} 
                onChange={(e) => setNewTierVariation({ ...newTierVariation, name: e.target.value })} 
                placeholder={formData.tierVariations.length === 0 ? "VD: Màu sắc" : "VD: Kích thước"} 
                disabled={isLoading} 
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white" 
              />
              <Input 
                value={newTierVariation.options} 
                onChange={(e) => setNewTierVariation({ ...newTierVariation, options: e.target.value })} 
                placeholder={formData.tierVariations.length === 0 ? "VD: Đỏ, Xanh, Đen" : "VD: S, M, L, XL"} 
                disabled={isLoading} 
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white" 
              />
              <Button type="button" onClick={addTierVariation} disabled={isLoading || formData.tierVariations.length >= 3} className="rounded-xl bg-black text-white hover:bg-black/90">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Display added tier variations */}
            {formData.tierVariations.length > 0 && (
              <div className="space-y-4">
                {formData.tierVariations.map((tier, tierIndex) => (
                  <div key={tierIndex} className="border rounded-xl p-4 bg-gray-50/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">{tier.name}</span>
                        {tierIndex === 0 && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Có ảnh</span>
                        )}
                      </div>
                      <button type="button" onClick={() => removeTierVariation(tierIndex)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Options with images (only for first tier) */}
                    <div className="space-y-3">
                      {tier.options.map((option, optIndex) => (
                        <div key={optIndex} className="bg-white rounded-lg p-3 border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{option}</span>
                              {tierIndex === 0 && optIndex === 0 && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Ảnh chính</span>
                              )}
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeOptionFromTier(tierIndex, optIndex)} 
                              className="text-red-400 hover:text-red-600 p-1"
                              title="Xóa tùy chọn này"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          
                          {/* Image upload for first tier only */}
                          {tierIndex === 0 && (
                            <div className="flex flex-wrap gap-2">
                              {/* Existing images */}
                              {tier.optionImages?.[optIndex]?.existing?.map((url, imgIndex) => (
                                <div key={`existing-${imgIndex}`} className="relative w-16 h-16 rounded-lg overflow-hidden border group">
                                  <Image src={url} alt={`${option} ${imgIndex}`} fill className="object-cover" />
                                  <button 
                                    type="button" 
                                    onClick={() => removeExistingOptionImage(optIndex, imgIndex)} 
                                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              ))}
                              {/* New images */}
                              {tier.optionImages?.[optIndex]?.newPreviews?.map((preview, imgIndex) => (
                                <div key={`new-${imgIndex}`} className="relative w-16 h-16 rounded-lg overflow-hidden border group border-green-300">
                                  <Image src={preview} alt={`${option} new ${imgIndex}`} fill className="object-cover" />
                                  <span className="absolute bottom-0.5 left-0.5 text-[8px] bg-green-500 text-white px-1 rounded">Mới</span>
                                  <button 
                                    type="button" 
                                    onClick={() => removeNewOptionImage(optIndex, imgIndex)} 
                                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              ))}
                              {/* Upload button */}
                              {((tier.optionImages?.[optIndex]?.existing?.length || 0) + (tier.optionImages?.[optIndex]?.newFiles?.length || 0)) < 8 && (
                                <label className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#E53935] hover:bg-red-50/50 transition-colors">
                                  <Upload className="h-4 w-4 text-gray-400" />
                                  <span className="text-[10px] text-gray-400">Thêm</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    multiple 
                                    onChange={(e) => handleOptionImageChange(optIndex, e)} 
                                    className="hidden" 
                                    disabled={isLoading} 
                                  />
                                </label>
                              )}
                              {((tier.optionImages?.[optIndex]?.existing?.length || 0) + (tier.optionImages?.[optIndex]?.newFiles?.length || 0)) === 0 && (
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <ImageIcon className="h-3 w-3" />
                                  <span>Chưa có ảnh</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <Button 
                  type="button" 
                  onClick={generateModels} 
                  variant="outline" 
                  className="rounded-xl border-[#E53935] text-[#E53935] hover:bg-red-50"
                >
                  Tạo danh sách SKU ({formData.tierVariations.reduce((acc, t) => acc * t.options.length, 1)} phiên bản)
                </Button>
              </div>
            )}
          </div>

          {/* Models (SKU Table) */}
          {formData.models.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-b pb-2">
                Danh sách phiên bản ({formData.models.length} SKU)
              </h3>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Phân loại</th>
                      <th className="px-4 py-3 text-left font-medium w-36">Giá (VND)</th>
                      <th className="px-4 py-3 text-left font-medium w-28">Tồn kho</th>
                      <th className="px-4 py-3 text-left font-medium w-36">SKU</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {formData.models.map((model, index) => (
                      <tr key={model._id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium">{getModelLabel(model)}</td>
                        <td className="px-4 py-3">
                          <Input type="number" value={model.price || ""} onChange={(e) => updateModel(index, "price", Number(e.target.value))} className="h-8 rounded-lg" disabled={isLoading} placeholder="0" />
                        </td>
                        <td className="px-4 py-3">
                          <Input type="number" value={model.stock || ""} onChange={(e) => updateModel(index, "stock", Number(e.target.value))} className="h-8 rounded-lg" disabled={isLoading} placeholder="0" />
                        </td>
                        <td className="px-4 py-3">
                          <Input value={model.sku || ""} onChange={(e) => updateModel(index, "sku", e.target.value)} className="h-8 rounded-lg" disabled={isLoading} placeholder="SKU-001" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Attributes */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Thông số kỹ thuật</h3>
              <p className="text-xs text-muted-foreground mt-1">Thêm các thông số như Chất liệu, Xuất xứ, Bảo hành...</p>
            </div>
            <div className="grid grid-cols-[1fr_2fr_auto] gap-2">
              <Input 
                value={newAttribute.name} 
                onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })} 
                placeholder="Tên thông số" 
                disabled={isLoading} 
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white" 
              />
              <Input 
                value={newAttribute.value} 
                onChange={(e) => setNewAttribute({ ...newAttribute, value: e.target.value })} 
                placeholder="Giá trị" 
                disabled={isLoading} 
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white" 
              />
              <Button type="button" onClick={addAttribute} disabled={isLoading} className="rounded-xl bg-black text-white hover:bg-black/90">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.attributes.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {formData.attributes.map((attr, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm">
                    <span className="font-medium">{attr.name}:</span>
                    <span className="text-muted-foreground">{attr.value}</span>
                    <button type="button" onClick={() => removeAttribute(index)} className="ml-auto text-red-500 hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Tags</h3>
              <p className="text-xs text-muted-foreground mt-1">Thêm tags để dễ tìm kiếm sản phẩm</p>
            </div>
            <div className="flex gap-2">
              <Input 
                value={newTag} 
                onChange={(e) => setNewTag(e.target.value)} 
                placeholder="Nhập tag và nhấn Enter hoặc nút +" 
                disabled={isLoading} 
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} 
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white" 
              />
              <Button type="button" onClick={addTag} disabled={isLoading} className="rounded-xl bg-black text-white hover:bg-black/90">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <TagItem key={index} tag={tag} onRemove={removeTag} />
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="rounded-xl border-gray-200">
              Hủy
            </Button>
            <Button type="submit" className="rounded-xl bg-[#E53935] hover:bg-[#D32F2F] text-white px-8" disabled={isLoading}>
              {isLoading ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
