/**
 * useVariantForm Hook
 * Shared logic for managing product variants in Create/Update forms
 * 
 * Feature: code-cleanup-audit
 * Validates: Requirements 6.3, 6.4, 9.4, 9.5
 */

import { useState, useCallback } from "react";
import {
  VariantWithFilesCreate,
  VariantWithFilesUpdate,
  createEmptyVariantForCreate,
  createEmptyVariantForUpdate,
} from "@/types/product";
import { MAX_VARIANT_IMAGES } from "@/constants/product";

/**
 * Hook for managing variants in Create form
 */
export function useVariantFormCreate(initialPrice: number = 0) {
  const [variants, setVariants] = useState<VariantWithFilesCreate[]>([]);

  const addVariant = useCallback(() => {
    setVariants(prev => [...prev, createEmptyVariantForCreate(initialPrice)]);
  }, [initialPrice]);

  const updateVariant = useCallback((
    index: number,
    field: keyof VariantWithFilesCreate,
    value: unknown
  ) => {
    setVariants(prev => prev.map((v, i) => {
      if (i !== index) return v;
      return { ...v, [field]: value };
    }));
  }, []);

  const removeVariant = useCallback((index: number) => {
    setVariants(prev => {
      const variant = prev[index];
      // Cleanup preview URLs to prevent memory leaks
      variant.images.previews.forEach(url => URL.revokeObjectURL(url));
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleVariantImageChange = useCallback((
    variantIndex: number,
    files: File[]
  ): boolean => {
    if (files.length === 0) return false;

    let success = true;
    setVariants(prev => {
      const currentImages = prev[variantIndex]?.images;
      const totalImages = (currentImages?.files.length || 0) + files.length;
      
      if (totalImages > MAX_VARIANT_IMAGES) {
        success = false;
        return prev;
      }

      const newPreviews = files.map(file => URL.createObjectURL(file));
      
      return prev.map((v, i) => {
        if (i !== variantIndex) return v;
        return {
          ...v,
          images: {
            ...v.images,
            files: [...v.images.files, ...files],
            previews: [...v.images.previews, ...newPreviews],
          },
        };
      });
    });
    
    return success;
  }, []);

  const removeVariantImage = useCallback((
    variantIndex: number,
    imageIndex: number
  ) => {
    setVariants(prev => prev.map((v, i) => {
      if (i !== variantIndex) return v;
      
      // Cleanup the preview URL
      URL.revokeObjectURL(v.images.previews[imageIndex]);
      
      return {
        ...v,
        images: {
          ...v.images,
          files: v.images.files.filter((_, idx) => idx !== imageIndex),
          previews: v.images.previews.filter((_, idx) => idx !== imageIndex),
        },
      };
    }));
  }, []);

  const resetVariants = useCallback(() => {
    // Cleanup all preview URLs
    variants.forEach(v => {
      v.images.previews.forEach(url => URL.revokeObjectURL(url));
    });
    setVariants([]);
  }, [variants]);

  const getVariantImageCount = useCallback((variantIndex: number): number => {
    return variants[variantIndex]?.images.files.length || 0;
  }, [variants]);

  return {
    variants,
    setVariants,
    addVariant,
    updateVariant,
    removeVariant,
    handleVariantImageChange,
    removeVariantImage,
    resetVariants,
    getVariantImageCount,
  };
}

/**
 * Hook for managing variants in Update form
 */
export function useVariantFormUpdate(initialPrice: number = 0) {
  const [variants, setVariants] = useState<VariantWithFilesUpdate[]>([]);

  const addVariant = useCallback(() => {
    setVariants(prev => [...prev, createEmptyVariantForUpdate(initialPrice)]);
  }, [initialPrice]);

  const updateVariant = useCallback((
    index: number,
    field: keyof VariantWithFilesUpdate,
    value: unknown
  ) => {
    setVariants(prev => prev.map((v, i) => {
      if (i !== index) return v;
      return { ...v, [field]: value };
    }));
  }, []);

  const removeVariant = useCallback((index: number) => {
    setVariants(prev => {
      const variant = prev[index];
      // Cleanup new preview URLs
      variant.images.newPreviews.forEach(url => URL.revokeObjectURL(url));
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleVariantImageChange = useCallback((
    variantIndex: number,
    files: File[]
  ): boolean => {
    if (files.length === 0) return false;

    let success = true;
    setVariants(prev => {
      const currentImages = prev[variantIndex]?.images;
      const totalImages = 
        (currentImages?.existing.length || 0) + 
        (currentImages?.newFiles.length || 0) + 
        files.length;
      
      if (totalImages > MAX_VARIANT_IMAGES) {
        success = false;
        return prev;
      }

      const newPreviews = files.map(file => URL.createObjectURL(file));
      
      return prev.map((v, i) => {
        if (i !== variantIndex) return v;
        return {
          ...v,
          images: {
            ...v.images,
            newFiles: [...v.images.newFiles, ...files],
            newPreviews: [...v.images.newPreviews, ...newPreviews],
          },
        };
      });
    });
    
    return success;
  }, []);

  const removeExistingImage = useCallback((
    variantIndex: number,
    imageIndex: number
  ) => {
    setVariants(prev => prev.map((v, i) => {
      if (i !== variantIndex) return v;
      return {
        ...v,
        images: {
          ...v.images,
          existing: v.images.existing.filter((_, idx) => idx !== imageIndex),
        },
      };
    }));
  }, []);

  const removeNewImage = useCallback((
    variantIndex: number,
    imageIndex: number
  ) => {
    setVariants(prev => prev.map((v, i) => {
      if (i !== variantIndex) return v;
      
      // Cleanup the preview URL
      URL.revokeObjectURL(v.images.newPreviews[imageIndex]);
      
      return {
        ...v,
        images: {
          ...v.images,
          newFiles: v.images.newFiles.filter((_, idx) => idx !== imageIndex),
          newPreviews: v.images.newPreviews.filter((_, idx) => idx !== imageIndex),
        },
      };
    }));
  }, []);

  const resetVariants = useCallback(() => {
    // Cleanup all new preview URLs
    variants.forEach(v => {
      v.images.newPreviews.forEach(url => URL.revokeObjectURL(url));
    });
    setVariants([]);
  }, [variants]);

  const getVariantImageCount = useCallback((variantIndex: number): number => {
    const variant = variants[variantIndex];
    if (!variant) return 0;
    return variant.images.existing.length + variant.images.newFiles.length;
  }, [variants]);

  const isNewVariant = useCallback((variantIndex: number): boolean => {
    return variants[variantIndex]?._id.startsWith('temp-') || false;
  }, [variants]);

  return {
    variants,
    setVariants,
    addVariant,
    updateVariant,
    removeVariant,
    handleVariantImageChange,
    removeExistingImage,
    removeNewImage,
    resetVariants,
    getVariantImageCount,
    isNewVariant,
  };
}

/**
 * Prepare variants data for form submission (Create form)
 */
export function prepareVariantsForCreate(
  variants: VariantWithFilesCreate[],
  formData: FormData
): void {
  if (variants.length === 0) return;

  // Prepare variant data without images (images handled separately)
  // SKU is auto-generated on server
  const variantsForServer = variants.map(v => ({
    name: v.name,
    color: v.color,
    price: v.price,
    stock: v.stock,
    sold: v.sold || 0,
  }));
  
  formData.append("variants", JSON.stringify(variantsForServer));

  // Append variant images with index
  variants.forEach((variant, idx) => {
    variant.images.files.forEach((file) => {
      formData.append(`variantImages_${idx}`, file);
    });
  });
}

/**
 * Prepare variants data for form submission (Update form)
 */
export function prepareVariantsForUpdate(
  variants: VariantWithFilesUpdate[],
  formData: FormData
): void {
  // Prepare variant data
  // SKU is auto-generated on server
  const variantsForServer = variants.map(v => ({
    _id: v._id.startsWith('temp-') ? undefined : v._id,
    name: v.name,
    color: v.color,
    price: v.price,
    stock: v.stock,
    sold: v.sold || 0,
  }));
  
  formData.append("variants", JSON.stringify(variantsForServer));

  // Send existing variant images mapping
  const existingVariantImagesMapping = variants.map((v, idx) => ({
    variantIndex: idx,
    existing: v.images.existing,
  }));
  formData.append("existingVariantImages", JSON.stringify(existingVariantImagesMapping));

  // Append new variant images with index
  variants.forEach((variant, idx) => {
    variant.images.newFiles.forEach((file) => {
      formData.append(`variantImages_${idx}`, file);
    });
  });
}
