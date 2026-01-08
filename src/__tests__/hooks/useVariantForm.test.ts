/**
 * Unit tests for useVariantForm hooks
 * Feature: code-cleanup-audit
 * Validates: Requirements 6.3, 6.4
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useVariantFormCreate,
  useVariantFormUpdate,
  prepareVariantsForCreate,
  prepareVariantsForUpdate,
} from "@/hooks/useVariantForm";
import { VariantWithFilesCreate, VariantWithFilesUpdate } from "@/types/product";

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = vi.fn((file: File) => `blob:${file.name}`);
const mockRevokeObjectURL = vi.fn();

beforeEach(() => {
  vi.stubGlobal('URL', {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  mockCreateObjectURL.mockClear();
  mockRevokeObjectURL.mockClear();
});

describe("useVariantFormCreate", () => {
  it("should initialize with empty variants array", () => {
    const { result } = renderHook(() => useVariantFormCreate());
    expect(result.current.variants).toEqual([]);
  });

  it("should add a new variant with default price", () => {
    const { result } = renderHook(() => useVariantFormCreate(100));
    
    act(() => {
      result.current.addVariant();
    });
    
    expect(result.current.variants).toHaveLength(1);
    expect(result.current.variants[0].price).toBe(100);
    expect(result.current.variants[0]._id).toMatch(/^temp-\d+$/);
    expect(result.current.variants[0].images.files).toEqual([]);
    expect(result.current.variants[0].images.previews).toEqual([]);
  });

  it("should update variant field", () => {
    const { result } = renderHook(() => useVariantFormCreate());
    
    act(() => {
      result.current.addVariant();
    });
    
    act(() => {
      result.current.updateVariant(0, "name", "Red");
    });
    
    expect(result.current.variants[0].name).toBe("Red");
  });

  it("should update color field directly", () => {
    const { result } = renderHook(() => useVariantFormCreate());
    
    act(() => {
      result.current.addVariant();
    });
    
    act(() => {
      result.current.updateVariant(0, "color", "Red");
    });
    
    expect(result.current.variants[0].color).toBe("Red");
  });

  it("should remove variant and cleanup previews", () => {
    const { result } = renderHook(() => useVariantFormCreate());
    
    act(() => {
      result.current.addVariant();
      result.current.addVariant();
    });
    
    // Manually set some previews to test cleanup
    act(() => {
      result.current.setVariants(prev => prev.map((v, i) => 
        i === 0 ? { ...v, images: { ...v.images, previews: ["blob:test1", "blob:test2"] } } : v
      ));
    });
    
    act(() => {
      result.current.removeVariant(0);
    });
    
    expect(result.current.variants).toHaveLength(1);
    expect(mockRevokeObjectURL).toHaveBeenCalledTimes(2);
  });

  it("should handle variant image change", () => {
    const { result } = renderHook(() => useVariantFormCreate());
    
    act(() => {
      result.current.addVariant();
    });
    
    const files = [
      new File([""], "image1.jpg", { type: "image/jpeg" }),
      new File([""], "image2.jpg", { type: "image/jpeg" }),
    ];
    
    let success: boolean;
    act(() => {
      success = result.current.handleVariantImageChange(0, files);
    });
    
    expect(success!).toBe(true);
    expect(result.current.variants[0].images.files).toHaveLength(2);
    expect(result.current.variants[0].images.previews).toHaveLength(2);
    expect(mockCreateObjectURL).toHaveBeenCalledTimes(2);
  });

  it("should reject images exceeding max limit", () => {
    const { result } = renderHook(() => useVariantFormCreate());
    
    act(() => {
      result.current.addVariant();
    });
    
    // Add 7 images first
    const files = Array.from({ length: 7 }, (_, i) => 
      new File([""], `image${i}.jpg`, { type: "image/jpeg" })
    );
    
    act(() => {
      result.current.handleVariantImageChange(0, files);
    });
    
    expect(result.current.variants[0].images.files).toHaveLength(7);
    
    // Try to add 2 more (would exceed max of 8)
    const extraFiles = [
      new File([""], "extra1.jpg", { type: "image/jpeg" }),
      new File([""], "extra2.jpg", { type: "image/jpeg" }),
    ];
    
    act(() => {
      result.current.handleVariantImageChange(0, extraFiles);
    });
    
    // Should remain 7 because 7 + 2 = 9 > 8 (max)
    expect(result.current.variants[0].images.files).toHaveLength(7);
  });

  it("should remove variant image and cleanup preview", () => {
    const { result } = renderHook(() => useVariantFormCreate());
    
    act(() => {
      result.current.addVariant();
    });
    
    const files = [
      new File([""], "image1.jpg", { type: "image/jpeg" }),
      new File([""], "image2.jpg", { type: "image/jpeg" }),
    ];
    
    act(() => {
      result.current.handleVariantImageChange(0, files);
    });
    
    mockRevokeObjectURL.mockClear();
    
    act(() => {
      result.current.removeVariantImage(0, 0);
    });
    
    expect(result.current.variants[0].images.files).toHaveLength(1);
    expect(result.current.variants[0].images.previews).toHaveLength(1);
    expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1);
  });

  it("should get correct image count", () => {
    const { result } = renderHook(() => useVariantFormCreate());
    
    act(() => {
      result.current.addVariant();
    });
    
    expect(result.current.getVariantImageCount(0)).toBe(0);
    
    const files = [new File([""], "image.jpg", { type: "image/jpeg" })];
    
    act(() => {
      result.current.handleVariantImageChange(0, files);
    });
    
    expect(result.current.getVariantImageCount(0)).toBe(1);
  });
});

describe("useVariantFormUpdate", () => {
  it("should initialize with empty variants array", () => {
    const { result } = renderHook(() => useVariantFormUpdate());
    expect(result.current.variants).toEqual([]);
  });

  it("should add a new variant for update form", () => {
    const { result } = renderHook(() => useVariantFormUpdate(200));
    
    act(() => {
      result.current.addVariant();
    });
    
    expect(result.current.variants).toHaveLength(1);
    expect(result.current.variants[0].price).toBe(200);
    expect(result.current.variants[0].images.existing).toEqual([]);
    expect(result.current.variants[0].images.newFiles).toEqual([]);
    expect(result.current.variants[0].images.newPreviews).toEqual([]);
  });

  it("should identify new variants", () => {
    const { result } = renderHook(() => useVariantFormUpdate());
    
    act(() => {
      result.current.addVariant();
    });
    
    expect(result.current.isNewVariant(0)).toBe(true);
    
    // Set an existing variant
    act(() => {
      result.current.setVariants([{
        _id: "existing-id-123",
        name: "Existing",
        color: "Red",
        price: 100,
        stock: 10,
        images: { existing: [], newFiles: [], newPreviews: [] },
      }]);
    });
    
    expect(result.current.isNewVariant(0)).toBe(false);
  });

  it("should remove existing image", () => {
    const { result } = renderHook(() => useVariantFormUpdate());
    
    act(() => {
      result.current.setVariants([{
        _id: "test-id",
        name: "Test",
        color: "Blue",
        price: 100,
        stock: 10,
        images: { 
          existing: ["url1", "url2", "url3"], 
          newFiles: [], 
          newPreviews: [] 
        },
      }]);
    });
    
    act(() => {
      result.current.removeExistingImage(0, 1);
    });
    
    expect(result.current.variants[0].images.existing).toEqual(["url1", "url3"]);
  });

  it("should remove new image and cleanup preview", () => {
    const { result } = renderHook(() => useVariantFormUpdate());
    
    act(() => {
      result.current.addVariant();
    });
    
    const files = [
      new File([""], "new1.jpg", { type: "image/jpeg" }),
      new File([""], "new2.jpg", { type: "image/jpeg" }),
    ];
    
    act(() => {
      result.current.handleVariantImageChange(0, files);
    });
    
    mockRevokeObjectURL.mockClear();
    
    act(() => {
      result.current.removeNewImage(0, 0);
    });
    
    expect(result.current.variants[0].images.newFiles).toHaveLength(1);
    expect(result.current.variants[0].images.newPreviews).toHaveLength(1);
    expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1);
  });

  it("should count both existing and new images", () => {
    const { result } = renderHook(() => useVariantFormUpdate());
    
    act(() => {
      result.current.setVariants([{
        _id: "test-id",
        name: "Test",
        color: "Green",
        price: 100,
        stock: 10,
        images: { 
          existing: ["url1", "url2"], 
          newFiles: [], 
          newPreviews: [] 
        },
      }]);
    });
    
    expect(result.current.getVariantImageCount(0)).toBe(2);
    
    const files = [new File([""], "new.jpg", { type: "image/jpeg" })];
    
    act(() => {
      result.current.handleVariantImageChange(0, files);
    });
    
    expect(result.current.getVariantImageCount(0)).toBe(3);
  });
});

describe("prepareVariantsForCreate", () => {
  it("should append variants data to FormData", () => {
    const formData = new FormData();
    const variants: VariantWithFilesCreate[] = [
      {
        _id: "temp-1",
        name: "Red",
        color: "Red",
        price: 100,
        stock: 10,
        sold: 0,
        images: { 
          files: [new File([""], "img.jpg", { type: "image/jpeg" })], 
          previews: ["blob:img"], 
          existing: [] 
        },
      },
    ];
    
    prepareVariantsForCreate(variants, formData);
    
    expect(formData.has("variants")).toBe(true);
    expect(formData.has("variantImages_0")).toBe(true);
    
    const variantsJson = JSON.parse(formData.get("variants") as string);
    expect(variantsJson[0].name).toBe("Red");
    expect(variantsJson[0].color).toBe("Red");
  });

  it("should not append anything for empty variants", () => {
    const formData = new FormData();
    prepareVariantsForCreate([], formData);
    
    expect(formData.has("variants")).toBe(false);
  });
});

describe("prepareVariantsForUpdate", () => {
  it("should append variants data with existing images mapping", () => {
    const formData = new FormData();
    const variants: VariantWithFilesUpdate[] = [
      {
        _id: "existing-id",
        name: "Blue",
        color: "Blue",
        price: 150,
        stock: 5,
        sold: 2,
        images: { 
          existing: ["url1", "url2"],
          newFiles: [new File([""], "new.jpg", { type: "image/jpeg" })], 
          newPreviews: ["blob:new"],
        },
      },
    ];
    
    prepareVariantsForUpdate(variants, formData);
    
    expect(formData.has("variants")).toBe(true);
    expect(formData.has("existingVariantImages")).toBe(true);
    expect(formData.has("variantImages_0")).toBe(true);
    
    const variantsJson = JSON.parse(formData.get("variants") as string);
    expect(variantsJson[0]._id).toBe("existing-id");
    
    const existingMapping = JSON.parse(formData.get("existingVariantImages") as string);
    expect(existingMapping[0].existing).toEqual(["url1", "url2"]);
  });

  it("should not include _id for new variants", () => {
    const formData = new FormData();
    const variants: VariantWithFilesUpdate[] = [
      {
        _id: "temp-123",
        name: "New Variant",
        color: "Yellow",
        price: 100,
        stock: 10,
        images: { existing: [], newFiles: [], newPreviews: [] },
      },
    ];
    
    prepareVariantsForUpdate(variants, formData);
    
    const variantsJson = JSON.parse(formData.get("variants") as string);
    expect(variantsJson[0]._id).toBeUndefined();
  });
});
