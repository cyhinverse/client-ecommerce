// components/admin/ProductAdminPage/CreateModelProduct.tsx
import { useState, useRef } from "react";
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
import { variants } from "@/types/product";
import { Switch } from "@/components/ui/switch";
import { X, Upload, Plus } from "lucide-react";
import Image from "next/image";

interface CreateModelProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (formData: FormData) => void;
  isLoading?: boolean;
}

export function CreateModelProduct({
  open,
  onOpenChange,
  onCreate,
  isLoading = false,
}: CreateModelProductProps) {
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
  const [newTag, setNewTag] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Thêm các trường text
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("slug", formData.slug);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("isActive", formData.isActive.toString());
    formDataToSend.append("isNewArrival", formData.isNewArrival.toString());
    formDataToSend.append("isFeatured", formData.isFeatured.toString());
    formDataToSend.append("onSale", formData.onSale.toString());

    // Thêm price object dưới dạng JSON
    formDataToSend.append("price", JSON.stringify(formData.price));

    // Thêm variants nếu có
    if (formData.variants.length > 0) {
      formDataToSend.append("variants", JSON.stringify(formData.variants));
    }

    // Thêm tags nếu có
    if (formData.tags.length > 0) {
      formDataToSend.append("tags", JSON.stringify(formData.tags));
    }

    // Thêm images
    images.forEach((file) => {
      formDataToSend.append("images", file);
    });

    onCreate(formDataToSend);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newImages]);
    }
    // Reset input value to allow re-uploading the same file
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    // Reset input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[2rem] border-border/50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl shadow-2xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader className="border-b border-border/50 pb-6">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Create Product
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new product to your inventory
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8 pt-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Thông tin cơ bản */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Basic Information
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Product Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    disabled={isLoading}
                    className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-medium">
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                    disabled={isLoading}
                    className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category
                    </Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                      disabled={isLoading}
                      className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand" className="text-sm font-medium">
                      Brand
                    </Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      required
                      disabled={isLoading}
                      className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Giá và trạng thái */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Pricing & Status
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPrice"
                      className="text-sm font-medium"
                    >
                      Current Price
                    </Label>
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
                      className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="discountPrice"
                      className="text-sm font-medium"
                    >
                      Discount Price
                    </Label>
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
                      className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50/50 rounded-xl border border-border/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="isActive"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Active Status
                    </Label>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="isNewArrival"
                      className="text-sm font-medium cursor-pointer"
                    >
                      New Arrival
                    </Label>
                    <Switch
                      id="isNewArrival"
                      checked={formData.isNewArrival}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isNewArrival: checked })
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="isFeatured"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Featured Product
                    </Label>
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isFeatured: checked })
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="onSale"
                      className="text-sm font-medium cursor-pointer"
                    >
                      On Sale
                    </Label>
                    <Switch
                      id="onSale"
                      checked={formData.onSale}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, onSale: checked })
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Details
            </h3>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                disabled={isLoading}
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm resize-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium">
                Tags
              </Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  disabled={isLoading}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  disabled={isLoading}
                  className="rounded-xl bg-black text-white hover:bg-black/90 dark:bg-[#0071e3]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg text-sm text-foreground"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-muted-foreground hover:text-foreground ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hình ảnh */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Product Images</Label>
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
                className="w-full h-32 flex flex-col items-center justify-center border-dashed border-2 border-border/50 rounded-xl hover:bg-gray-50/50 hover:border-primary/50 transition-all"
              >
                <div className="bg-gray-100 p-3 rounded-full mb-2">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  Click to upload images
                </span>
              </Button>

              {images.length > 0 && (
                <div className="grid grid-cols-5 gap-4 mt-4">
                  {images.map((file, index) => (
                    <div
                      key={index}
                      className="relative aspect-square group rounded-xl overflow-hidden border border-border/50"
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100px, 150px"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="rounded-xl h-11 px-6 border-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl h-11 px-8 bg-black text-white hover:bg-black/90 dark:bg-[#0071e3] shadow-sm"
            >
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
