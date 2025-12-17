// components/EditCategoryModal.tsx
"use client";
import { useEffect } from "react";
import { useForm, Resolver } from "react-hook-form";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, X } from "lucide-react";
import { Category } from "@/types/category";

// Define Zod validation schema với giá trị mặc định rõ ràng
const formSchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  slug: z
    .string()
    .min(1, { message: "Slug is required" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
  description: z.string().default(""),
  isActive: z.boolean().default(true),
});

// Type inference với giá trị mặc định
type FormData = z.infer<typeof formSchema>;

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: FormData & { id: string }) => void;
  category: Category | null;
  isLoading?: boolean;
}

export function EditCategoryModal({
  isOpen,
  onClose,
  onSave,
  category,
  isLoading = false,
}: EditCategoryModalProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as Resolver<FormData>,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      isActive: true,
    },
  });

  // Reset form khi category thay đổi
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        isActive: category.isActive ?? true,
      });
    }
  }, [category, form]);

  // Auto-generate slug từ name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");
  };

  // Xử lý khi name thay đổi
  const handleNameChange = (name: string) => {
    const currentSlug = form.getValues("slug");
    const originalSlug = category ? generateSlug(category.name || "") : "";

    // Auto-generate slug nếu slug chưa được chỉnh sửa thủ công
    if (!currentSlug || currentSlug === originalSlug) {
      form.setValue("slug", generateSlug(name), { shouldValidate: true });
    }
  };

  const onSubmit = (data: FormData) => {
    if (!category) return;

    onSave({
      ...data,
      id: category._id as string,
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-border/50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl shadow-2xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                Edit Category
                <Badge variant="outline" className="text-sm rounded-lg bg-white/50 border-border/50">
                   {/* {category._id.slice(-8)} */}
                   ID: {category._id.slice(-4)}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Update product category information
              </DialogDescription>
            </DialogHeader>

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Category Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleNameChange(e.target.value);
                      }}
                       className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
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
                      placeholder="category-slug" 
                      {...field} 
                      className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                    />
                  </FormControl>
                  <FormDescription>
                    SEO URL: /categories/{field.value}
                  </FormDescription>
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
                  <FormLabel className="text-sm font-medium">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description"
                      rows={3}
                      {...field}
                      value={field.value || ""}
                      className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Field */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status</FormLabel>
                    <div className="flex items-center gap-2">
                       {field.value ? (
                          <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Active</Badge>
                       ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600">Inactive</Badge>
                       )}
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

            {/* Read-only Information */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div>
                <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                  Created At
                </FormLabel>
                <p className="text-sm font-medium mt-1">
                  {new Date(category.createdAt || "").toLocaleDateString(
                    "en-US"
                  )}
                </p>
              </div>
              <div>
                <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                  Product Count
                </FormLabel>
                <p className="text-sm font-medium mt-1">
                  {category.productCount || 0} products
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="rounded-xl border-gray-200"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
                className="rounded-xl bg-black hover:bg-black/90 text-white dark:bg-[#0071e3] dark:hover:bg-[#0077ED]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
