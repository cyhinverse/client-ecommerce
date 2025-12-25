import { memo, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Trash2 } from "lucide-react";
import { variants } from "@/types/product";

interface VariantItemProps {
  variant: variants;
  index: number;
  isLoading: boolean;
  onUpdateVariant: (
    index: number,
    field: string,
    value: string | number | string[]
  ) => void;
  onUpdateVariantPrice: (
    index: number,
    field: "currentPrice" | "discountPrice",
    value: string
  ) => void;
  onRemoveVariant: (index: number) => void;
  onImageChange: (
    variantId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onRemoveNewImage: (variantId: string, imageIndex: number) => void;
  onRemoveExistingImage: (variantIndex: number, imageIndex: number) => void;
  onRegisterRef: (variantId: string, el: HTMLInputElement | null) => void;
  variantImages: File[];
}

export const VariantItem = memo(
  ({
    variant,
    index,
    isLoading,
    onUpdateVariant,
    onUpdateVariantPrice,
    onRemoveVariant,
    onImageChange,
    onRemoveNewImage,
    onRemoveExistingImage,
    onRegisterRef,
    variantImages,
  }: VariantItemProps) => {
    // Local state or ref for the input to avoid prop mutation
    const localInputRef = useRef<HTMLInputElement>(null);

    return (
      <div className="border border-border/50 rounded-xl p-4 space-y-3 bg-gray-50/30">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">Variant #{index + 1}</h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemoveVariant(index)}
            disabled={isLoading}
            className="hover:bg-destructive/10 hover:text-destructive rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-5 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">SKU</Label>
            <Input
              value={variant.sku}
              onChange={(e) => onUpdateVariant(index, "sku", e.target.value)}
              disabled={isLoading}
              className="rounded-lg border-gray-200 bg-white h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Color</Label>
            <Input
              value={variant.color}
              onChange={(e) => onUpdateVariant(index, "color", e.target.value)}
              disabled={isLoading}
              className="rounded-lg border-gray-200 bg-white h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Size</Label>
            <Input
              value={variant.size}
              onChange={(e) => onUpdateVariant(index, "size", e.target.value)}
              disabled={isLoading}
              className="rounded-lg border-gray-200 bg-white h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Stock</Label>
            <Input
              type="number"
              value={variant.stock}
              onChange={(e) =>
                onUpdateVariant(
                  index,
                  "stock",
                  e.target.value === "" ? 0 : Number(e.target.value)
                )
              }
              onBlur={(e) => {
                if (e.target.value === "") {
                  onUpdateVariant(index, "stock", 0);
                }
              }}
              disabled={isLoading}
              className="rounded-lg border-gray-200 bg-white h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Price (VND)</Label>
            <Input
              type="number"
              value={variant.price?.currentPrice}
              onChange={(e) =>
                onUpdateVariantPrice(index, "currentPrice", e.target.value)
              }
              onBlur={(e) => {
                if (e.target.value === "") {
                  onUpdateVariantPrice(index, "currentPrice", "0");
                }
              }}
              disabled={isLoading}
              className="rounded-lg border-gray-200 bg-white h-9"
            />
          </div>
        </div>

        {/* Variant Images Section */}
        <div className="space-y-2 border-t border-border/50 pt-3 mt-3">
          <Label className="text-xs font-medium">Variant Images</Label>

          {/* Existing Images Display */}
          {variant.images && variant.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {variant.images.map((img, imgIdx) => (
                <div
                  key={imgIdx}
                  className="relative h-16 w-16 group rounded-lg overflow-hidden border border-border/50"
                >
                  <Image
                    src={img}
                    alt="Variant"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveExistingImage(index, imgIdx)}
                    className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  >
                    <X className="h-3 w-3" />
                  </button>
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
              onChange={(e) => onImageChange(variant._id, e)}
              ref={(el) => {
                localInputRef.current = el;
                onRegisterRef(variant._id, el);
              }}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => localInputRef.current?.click()}
              disabled={isLoading}
              className="w-fit rounded-lg h-8 text-xs"
            >
              <Upload className="h-3 w-3 mr-2" />
              Add Images
            </Button>

            {variantImages && variantImages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {variantImages.map((file, fileIdx) => (
                  <div
                    key={fileIdx}
                    className="relative h-16 w-16 group rounded-lg overflow-hidden border border-border/50"
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="New Variant Ref"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveNewImage(variant._id, fileIdx)}
                      className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
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
    );
  }
);

VariantItem.displayName = "VariantItem";
