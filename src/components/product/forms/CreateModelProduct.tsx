import { useState, useCallback, useEffect } from "react";
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
import { TierVariation, ProductModel, ProductAttribute } from "@/types/product";
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

interface CreateModelProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (formData: FormData) => void;
  isLoading?: boolean;
}

// Extended TierVariation with images per option
interface TierVariationWithImages extends TierVariation {
  optionImages: { files: File[]; previews: string[] }[];
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Bản nháp" },
  { value: "published", label: "Đang bán" },
  { value: "suspended", label: "Tạm ngưng" },
];

const initialFormData = {
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
  descriptionImages: { files: [] as File[], previews: [] as string[] },
};

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

export function CreateModelProduct({
  open,
  onOpenChange,
  onCreate,
  isLoading = false,
}: CreateModelProductProps) {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);
  const flatCategories = flattenCategories(categories);

  const [formData, setFormData] = useState(initialFormData);
  const [newTag, setNewTag] = useState("");
  const [newAttribute, setNewAttribute] = useState({ name: "", value: "" });
  const [newTierVariation, setNewTierVariation] = useState({ name: "", options: "" });

  // Fetch categories when dialog opens
  useEffect(() => {
    if (open && categories.length === 0) {
      dispatch(getTreeCategories());
    }
  }, [open, categories.length, dispatch]);

  const resetForm = () => {
    // Cleanup image previews
    formData.tierVariations.forEach(tier => {
      tier.optionImages?.forEach(opt => {
        opt.previews.forEach(url => URL.revokeObjectURL(url));
      });
    });
    // Cleanup description images previews
    formData.descriptionImages.previews.forEach(url => URL.revokeObjectURL(url));
    setFormData(initialFormData);
    setNewTag("");
    setNewAttribute({ name: "", value: "" });
    setNewTierVariation({ name: "", options: "" });
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) resetForm();
    onOpenChange(isOpen);
  };


  // Handle image upload for a specific option in first tierVariation
  const handleOptionImageChange = (optionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentImages = formData.tierVariations[0]?.optionImages?.[optionIndex] || { files: [], previews: [] };
    if (currentImages.files.length + files.length > 8) {
      alert("Mỗi phân loại tối đa 8 ảnh");
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => {
      const newTierVariations = [...prev.tierVariations];
      if (newTierVariations[0]) {
        const newOptionImages = [...(newTierVariations[0].optionImages || [])];
        newOptionImages[optionIndex] = {
          files: [...currentImages.files, ...files],
          previews: [...currentImages.previews, ...newPreviews],
        };
        newTierVariations[0] = { ...newTierVariations[0], optionImages: newOptionImages };
      }
      return { ...prev, tierVariations: newTierVariations };
    });
  };

  // Remove image from option
  const removeOptionImage = (optionIndex: number, imageIndex: number) => {
    setFormData(prev => {
      const newTierVariations = [...prev.tierVariations];
      if (newTierVariations[0]?.optionImages?.[optionIndex]) {
        const optImages = newTierVariations[0].optionImages[optionIndex];
        URL.revokeObjectURL(optImages.previews[imageIndex]);
        newTierVariations[0].optionImages[optionIndex] = {
          files: optImages.files.filter((_, i) => i !== imageIndex),
          previews: optImages.previews.filter((_, i) => i !== imageIndex),
        };
      }
      return { ...prev, tierVariations: newTierVariations };
    });
  };

  // Handle description images upload
  const handleDescriptionImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (formData.descriptionImages.files.length + files.length > 20) {
      alert("Tối đa 20 ảnh mô tả chi tiết");
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      descriptionImages: {
        files: [...prev.descriptionImages.files, ...files],
        previews: [...prev.descriptionImages.previews, ...newPreviews],
      },
    }));
  };

  // Remove description image
  const removeDescriptionImage = (index: number) => {
    setFormData(prev => {
      URL.revokeObjectURL(prev.descriptionImages.previews[index]);
      return {
        ...prev,
        descriptionImages: {
          files: prev.descriptionImages.files.filter((_, i) => i !== index),
          previews: prev.descriptionImages.previews.filter((_, i) => i !== index),
        },
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    if (formData.slug) formDataToSend.append("slug", formData.slug);
    if (formData.category) formDataToSend.append("category", formData.category);
    if (formData.brand) formDataToSend.append("brand", formData.brand);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("isNewArrival", formData.isNewArrival.toString());
    formDataToSend.append("isFeatured", formData.isFeatured.toString());
    formDataToSend.append("price", JSON.stringify(formData.price));
    formDataToSend.append("stock", formData.stock.toString());
    if (formData.weight) formDataToSend.append("weight", formData.weight.toString());
    if (formData.dimensions.height || formData.dimensions.width || formData.dimensions.length) {
      formDataToSend.append("dimensions", JSON.stringify(formData.dimensions));
    }

    // Process tierVariations - convert optionImages to images array for server
    if (formData.tierVariations.length > 0) {
      const tierVariationsForServer = formData.tierVariations.map((tier, tierIdx) => {
        if (tierIdx === 0 && tier.optionImages) {
          // First tier has images - we'll handle file upload separately
          return {
            name: tier.name,
            options: tier.options,
            // images will be populated after upload
          };
        }
        return { name: tier.name, options: tier.options };
      });
      formDataToSend.append("tierVariations", JSON.stringify(tierVariationsForServer));

      // Append images for each option of first tier
      if (formData.tierVariations[0]?.optionImages) {
        formData.tierVariations[0].optionImages.forEach((optImages, optIdx) => {
          optImages.files.forEach((file) => {
            formDataToSend.append(`variantImages_${optIdx}`, file);
          });
        });
        // Send mapping info
        const imageMapping = formData.tierVariations[0].optionImages.map((opt, idx) => ({
          optionIndex: idx,
          count: opt.files.length,
        }));
        formDataToSend.append("variantImageMapping", JSON.stringify(imageMapping));
      }
    }

    if (formData.models.length > 0) {
      // Remove temp _id for new models - server will generate real ObjectIds
      const modelsForServer = formData.models.map(model => {
        if (model._id.startsWith('temp-')) {
          const { _id, ...modelWithoutId } = model;
          return modelWithoutId;
        }
        return model;
      });
      formDataToSend.append("models", JSON.stringify(modelsForServer));
    }
    if (formData.attributes.length > 0) {
      formDataToSend.append("attributes", JSON.stringify(formData.attributes));
    }
    if (formData.tags.length > 0) {
      formDataToSend.append("tags", JSON.stringify(formData.tags));
    }

    // Append description images
    if (formData.descriptionImages.files.length > 0) {
      formData.descriptionImages.files.forEach((file) => {
        formDataToSend.append("descriptionImages", file);
      });
    }

    onCreate(formDataToSend);
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
                ? [...(existingTier.optionImages || []), ...newOptions.map(() => ({ files: [], previews: [] }))]
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
            // Only first tier has images
            optionImages: isFirstTier ? options.map(() => ({ files: [], previews: [] })) : [],
          };
          setFormData((prev) => ({
            ...prev,
            tierVariations: [...prev.tierVariations, newTier],
            models: [], // Reset models when tiers change
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
            opt.previews.forEach(url => URL.revokeObjectURL(url));
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
        tier.optionImages[optionIndex].previews.forEach(url => URL.revokeObjectURL(url));
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
        opt.previews.forEach(url => URL.revokeObjectURL(url));
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


  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[1000px] rounded-4xl border-border/50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">Tạo sản phẩm mới</DialogTitle>
          <DialogDescription className="text-muted-foreground">Điền đầy đủ thông tin để tạo sản phẩm</DialogDescription>
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
              {formData.descriptionImages.previews.map((preview, index) => (
                <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border group">
                  <Image src={preview} alt={`Mô tả ${index + 1}`} fill className="object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeDescriptionImage(index)} 
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {formData.descriptionImages.files.length < 20 && (
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
            {formData.descriptionImages.files.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Đã chọn {formData.descriptionImages.files.length}/20 ảnh
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
                              {tier.optionImages?.[optIndex]?.previews.map((preview, imgIndex) => (
                                <div key={imgIndex} className="relative w-16 h-16 rounded-lg overflow-hidden border group">
                                  <Image src={preview} alt={`${option} ${imgIndex}`} fill className="object-cover" />
                                  <button 
                                    type="button" 
                                    onClick={() => removeOptionImage(optIndex, imgIndex)} 
                                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              ))}
                              {(tier.optionImages?.[optIndex]?.files.length || 0) < 8 && (
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
                              {(tier.optionImages?.[optIndex]?.files.length || 0) === 0 && (
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
            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={isLoading} className="rounded-xl border-gray-200">
              Hủy
            </Button>
            <Button type="submit" className="rounded-xl bg-[#E53935] hover:bg-[#D32F2F] text-white px-8" disabled={isLoading}>
              {isLoading ? "Đang tạo..." : "Tạo sản phẩm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
