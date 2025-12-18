"use client";
import { useState, useRef } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Save,
  Upload,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { BannerItem, UpdateBannerPayload } from "@/types/banner";

// Zod validation schema
const editBannerSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  subtitle: z.string().min(1, { message: "Subtitle is required" }),
  imageUrl: z.string().min(1, { message: "Image is required" }),
  link: z.string().optional(),
  theme: z.enum(["light", "dark"]),
  isActive: z.boolean(),
  order: z.number(),
});

type EditBannerData = z.infer<typeof editBannerSchema>;

interface EditBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, bannerData: UpdateBannerPayload) => void;
  banner: BannerItem | null;
  isLoading?: boolean;
}

export function EditBannerModal({
  isOpen,
  onClose,
  onUpdate,
  banner,
  isLoading = false,
}: EditBannerModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initialize form
  const form = useForm<EditBannerData>({
    resolver: zodResolver(editBannerSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      imageUrl: "",
      link: "",
      theme: "dark",
      isActive: true,
      order: 0,
    },
    // Form reset is handled by mounting/unmounting via 'key' prop in parent
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    form.setValue("imageUrl", previewUrl, { shouldValidate: true });
  };

  const removeImage = () => {
    setSelectedFile(null);
    form.setValue("imageUrl", "", { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = (data: EditBannerData) => {
    if (!banner) return;
    onUpdate(banner._id, { ...data, imageFile: selectedFile });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[2rem] border-border/50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl shadow-2xl p-6 sm:max-w-[550px] max-h-[90vh] flex flex-col no-scrollbar">
        <DialogHeader className="shrink-0 pb-6 border-b border-border/50">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            Edit Banner
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Make changes to your homepage hero slide
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 min-h-0 pt-6"
          >
            <div className="space-y-4 flex-1 overflow-y-auto pr-1 no-scrollbar">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Banner Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. The Future of Fluidity"
                        {...field}
                        className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Subtitle</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Experience the ultimate collection..."
                        {...field}
                        className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Action Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="/shop"
                          {...field}
                          className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Text Theme</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-gray-200 bg-gray-50/50">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="dark">Dark (White Text)</SelectItem>
                          <SelectItem value="light">Light (Black Text)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Slide Image</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div
                          className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50/50 hover:border-primary/50 transition-all"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          {field.value ? (
                            <div className="relative aspect-[21/9] w-full rounded-lg overflow-hidden border border-border/50 group">
                              <Image
                                src={field.value}
                                alt="Preview"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 500px"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage();
                                  }}
                                  className="rounded-full shadow-lg"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Replace
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <div className="bg-gray-100 p-3 rounded-full mb-3">
                                <Upload className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <p className="text-sm font-medium text-foreground">
                                Click to upload new image
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border border-border/50 bg-gray-50/50 p-4 mt-2">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-medium block">Active Status</FormLabel>
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
            </div>

            <DialogFooter className="shrink-0 pt-6 border-t border-border/50 gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 rounded-xl h-11 border-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-xl h-11 bg-black text-white hover:bg-black/90 dark:bg-[#0071e3] shadow-sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
