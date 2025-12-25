import { memo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Upload } from "lucide-react";

interface ImageSectionProps {
  existingImages: string[];
  newImages: File[];
  onRemoveExisting: (index: number) => void;
  onRemoveNew: (index: number) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isLoading: boolean;
}

export const ImageSection = memo(
  ({
    existingImages,
    newImages,
    onRemoveExisting,
    onRemoveNew,
    onImageChange,
    fileInputRef,
    isLoading,
  }: ImageSectionProps) => (
    <>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Existing Images</Label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
          {existingImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden border border-border/50 group"
            >
              <Image
                src={image}
                alt={`Existing ${index}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveExisting(index)}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Add New Images</Label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onImageChange}
          ref={fileInputRef}
          className="hidden"
        />
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl w-fit"
          >
            <Upload className="h-4 w-4" />
            Add Images
          </Button>

          {newImages.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 mt-2">
              {newImages.map((file, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden border border-border/50 group"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveNew(index)}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-all shadow-sm"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
);

ImageSection.displayName = "ImageSection";
