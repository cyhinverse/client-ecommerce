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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Upload } from "lucide-react";
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
    variants: [] as any[],
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
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
      <DialogContent className="bg-background border-border text-foreground max-w-4xl max-h-[90vh] overflow-y-auto rounded-none p-0 gap-0">
        <DialogHeader className="p-6 border-b border-border">
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">Tạo sản phẩm mới</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Thêm sản phẩm mới vào cửa hàng của bạn
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Thông tin cơ bản */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2">Thông tin cơ bản</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase text-muted-foreground">Tên sản phẩm *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    disabled={isLoading}
                    className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-xs font-bold uppercase text-muted-foreground">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                    disabled={isLoading}
                    className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs font-bold uppercase text-muted-foreground">Danh mục *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                    disabled={isLoading}
                    className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-xs font-bold uppercase text-muted-foreground">Thương hiệu *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    required
                    disabled={isLoading}
                    className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Giá và trạng thái */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2">Giá & Trạng thái</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPrice" className="text-xs font-bold uppercase text-muted-foreground">Giá hiện tại *</Label>
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
                    className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPrice" className="text-xs font-bold uppercase text-muted-foreground">Giá khuyến mãi</Label>
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
                    className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border p-3 border-border">
                    <Label htmlFor="isActive" className="text-sm font-medium">Đang hoạt động</Label>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center justify-between border p-3 border-border">
                    <Label htmlFor="isNewArrival" className="text-sm font-medium">Sản phẩm mới</Label>
                    <Switch
                      checked={formData.isNewArrival}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isNewArrival: checked })
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center justify-between border p-3 border-border">
                    <Label htmlFor="isFeatured" className="text-sm font-medium">Nổi bật</Label>
                    <Switch
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isFeatured: checked })
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center justify-between border p-3 border-border">
                    <Label htmlFor="onSale" className="text-sm font-medium">Đang giảm giá</Label>
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
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-bold uppercase text-muted-foreground">Mô tả sản phẩm</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              disabled={isLoading}
              className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-xs font-bold uppercase text-muted-foreground">Tags</Label>
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
                className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
              />
              <Button type="button" onClick={addTag} disabled={isLoading} className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90">
                Thêm
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wide"
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
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Hình ảnh sản phẩm</Label>
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
              className="flex items-center gap-2 rounded-none border-border hover:bg-muted w-full h-24 border-dashed"
            >
              <Upload className="h-4 w-4" />
              Chọn hình ảnh
            </Button>
            <div className="grid grid-cols-4 gap-4 mt-4">
              {images.map((file, index) => (
                <div key={index} className="relative h-24 group">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    fill
                    className="object-cover border border-border"
                    sizes="25vw"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="rounded-none border-border hover:bg-muted"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none min-w-[120px]"
              disabled={isLoading}
            >
              {isLoading ? "Đang tạo..." : "Tạo sản phẩm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
