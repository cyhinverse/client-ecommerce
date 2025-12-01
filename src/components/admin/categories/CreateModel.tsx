// components/CreateCategoryModal.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Save,
  X,
  Plus,
  Folder,
  ChevronDown,
  Upload,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { Category } from "@/types/category";
import Image from "next/image";


// Zod validation schema
const createFormSchema = z.object({
  name: z.string().min(1, { message: "Tên danh mục là bắt buộc" }),
  slug: z
    .string()
    .min(1, { message: "Slug là bắt buộc" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang",
    }),
  description: z.string().default(""),
  isActive: z.boolean().default(true),
  parentCategory: z.string().default(""),
  images: z.array(z.string()).default([]),
});

type CreateFormData = z.infer<typeof createFormSchema>;

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (categoryData: CreateFormData) => void;
  categories: Category[];
  isLoading?: boolean;
}

export function CreateCategoryModal({
  isOpen,
  onClose,
  onCreate,
  categories,
  isLoading = false,
}: CreateCategoryModalProps) {
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form
  const form = useForm<CreateFormData>({
    resolver: zodResolver(createFormSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      isActive: true,
      parentCategory: "",
      images: [],
    },
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset();
      setIsSlugManuallyEdited(false);
      setIsDropdownOpen(false);
    }
  }, [isOpen, form]);

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");
  };

  // Handle name change with auto-slug generation
  const handleNameChange = (name: string) => {
    form.setValue("name", name);

    // Only auto-generate slug if it hasn't been manually edited
    if (!isSlugManuallyEdited) {
      form.setValue("slug", generateSlug(name), { shouldValidate: true });
    }
  };

  // Handle slug manual edit
  const handleSlugChange = (slug: string) => {
    form.setValue("slug", slug);
    if (slug && !isSlugManuallyEdited) {
      setIsSlugManuallyEdited(true);
    }
  };

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const currentImages = form.getValues("images") || [];
      const newImageUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = await simulateImageUpload(file);
        newImageUrls.push(imageUrl);
      }

      form.setValue("images", [...currentImages, ...newImageUrls], {
        shouldValidate: true,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Simulate image upload
  const simulateImageUpload = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        resolve(dataUrl);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image from list
  const removeImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue("images", newImages, { shouldValidate: true });
  };

  const onSubmit = (data: CreateFormData) => {
    onCreate(data);
  };

  const handleClose = () => {
    form.reset();
    setIsSlugManuallyEdited(false);
    setIsDropdownOpen(false);
    onClose();
  };

  // Get available parent categories
  const availableParentCategories = categories;

  // Get selected category name for display
  const selectedCategory = availableParentCategories.find(
    (cat) => cat._id === form.watch("parentCategory")
  );

  const currentImages = form.watch("images") || [];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col">
        <DialogHeader className="shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-black-600" />
            Tạo danh mục mới
          </DialogTitle>
          <DialogDescription>
            Thêm danh mục sản phẩm mới vào hệ thống
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1  min-h-0"
          >
            {/* Scrollable Form Content */}
            <div className="space-y-4 flex-1 overflow-y-auto p-2 pb-4">
              {/* Custom scrollbar styling */}
              <style jsx>{`
                .overflow-y-auto::-webkit-scrollbar {
                  width: 6px;
                }
                .overflow-y-auto::-webkit-scrollbar-track {
                  background: #f1f5f9;
                  border-radius: 3px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb {
                  background: #cbd5e1;
                  border-radius: 3px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                  background: #94a3b8;
                }
              `}</style>

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Tên danh mục <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên danh mục"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleNameChange(e.target.value);
                        }}
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug Field */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Slug <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ten-danh-muc"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleSlugChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Đường dẫn SEO: /danh-muc/{field.value}</span>
                      {!isSlugManuallyEdited && (
                        <Badge variant="outline" className="text-xs">
                          Tự động
                        </Badge>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Parent Category Field */}
              <FormField
                control={form.control}
                name="parentCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Danh mục cha
                    </FormLabel>
                    <FormControl>
                      <div className="relative" ref={dropdownRef}>
                        <button
                          type="button"
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                          <span
                            className={
                              field.value
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }
                          >
                            {selectedCategory
                              ? selectedCategory.name
                              : "Không có danh mục cha"}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 opacity-50 transition-transform ${
                              isDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                            <div
                              className="p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer border-b border-border"
                              onClick={() => {
                                field.onChange("");
                                setIsDropdownOpen(false);
                              }}
                            >
                              <div className="flex items-center gap-2 text-sm">
                                <Folder className="h-4 w-4" />
                                <span>Không có danh mục cha</span>
                              </div>
                            </div>

                            {availableParentCategories.map((category) => (
                              <div
                                key={category._id}
                                className="p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer border-b border-border last:border-b-0"
                                onClick={() => {
                                  field.onChange(category._id);
                                  setIsDropdownOpen(false);
                                }}
                              >
                                <div className="flex items-center gap-2 text-sm">
                                  <Folder className="h-4 w-4" />
                                  <span className="flex-1">
                                    {category.name}
                                  </span>
                                  {category.parentCategory && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Con
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả cho danh mục"
                        rows={3}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Images Field */}
              <FormField
                control={form.control}
                name="images"
                render={({  }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Hình ảnh
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        {/* File Upload Input */}
                        <div
                          className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {isUploading
                              ? "Đang tải lên..."
                              : "Nhấn để tải ảnh lên"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, JPEG
                          </p>
                        </div>

                        {/* Image Preview */}
                        {currentImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {currentImages.map((image, index) => (
                              <div key={index} className="relative h-16 group">
                                <Image
                                  src={image}
                                  alt={`Preview ${index + 1}`}
                                  fill
                                  className="object-cover rounded border"
                                  sizes="33vw"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-2 w-2" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <div className="text-sm text-muted-foreground">
                      {currentImages.length > 0
                        ? `${currentImages.length} ảnh đã tải lên`
                        : "Tải lên hình ảnh cho danh mục"}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status Field */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Trạng thái</FormLabel>
                      <div className="flex items-center gap-2">
                        <Badge variant={field.value ? "default" : "secondary"}>
                          {field.value ? "Đang hoạt động" : "Không hoạt động"}
                        </Badge>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Fixed Footer - LUÔN HIỂN THỊ */}
            <DialogFooter className="shrink-0 pt-4 border-t bg-background">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 sm:flex-none"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Đang tạo..." : "Tạo danh mục"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
