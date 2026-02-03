/**
 * Property Tests for VariantForm Interface Consistency
 * Validates: Requirements 5.1, 5.4, 40.1-4
 * 
 * Property: VariantForm Interface Consistency
 * - Both Create and Update forms use unified types from @/types/product
 * - Type guards correctly identify variant types
 * - Helper functions create valid variant structures
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { Variant } from "@/types/product";


// Arbitrary generators for testing - simplified structure with color only
const variantFormCreateArb: fc.Arbitrary<VariantFormCreate> = fc.record({
  _id: fc.string({ minLength: 1, maxLength: 50 }),
  name: fc.string({ minLength: 0, maxLength: 100 }),
  color: fc.option(fc.string({ minLength: 0, maxLength: 20 }), { nil: undefined }),
  price: fc.nat({ max: 100000000 }),
  stock: fc.nat({ max: 10000 }),
  sold: fc.option(fc.nat({ max: 10000 }), { nil: undefined }),
  images: fc.record({
    files: fc.constant([] as File[]),
    previews: fc.array(fc.webUrl(), { maxLength: 8 }),
  }),
});

const variantFormUpdateArb: fc.Arbitrary<VariantFormUpdate> = fc.record({
  _id: fc.string({ minLength: 1, maxLength: 50 }),
  name: fc.string({ minLength: 0, maxLength: 100 }),
  color: fc.option(fc.string({ minLength: 0, maxLength: 20 }), { nil: undefined }),
  price: fc.nat({ max: 100000000 }),
  stock: fc.nat({ max: 10000 }),
  sold: fc.option(fc.nat({ max: 10000 }), { nil: undefined }),
  images: fc.record({
    existing: fc.array(fc.webUrl(), { maxLength: 8 }),
    newFiles: fc.constant([] as File[]),
    newPreviews: fc.array(fc.webUrl(), { maxLength: 8 }),
  }),
});

const serverVariantArb: fc.Arbitrary<Variant> = fc.record({
  _id: fc.string({ minLength: 1, maxLength: 50 }),
  name: fc.string({ minLength: 0, maxLength: 100 }),
  sku: fc.option(fc.string({ minLength: 0, maxLength: 50 }), { nil: undefined }),
  color: fc.option(fc.string({ minLength: 0, maxLength: 20 }), { nil: undefined }),
  price: fc.nat({ max: 100000000 }),
  stock: fc.nat({ max: 10000 }),
  sold: fc.option(fc.nat({ max: 10000 }), { nil: undefined }),
  images: fc.array(fc.webUrl(), { maxLength: 8 }),
});

describe("VariantForm Interface Consistency", () => {
  describe("Type Guards", () => {
    it("isVariantFormCreate correctly identifies Create variants", () => {
      fc.assert(
        fc.property(variantFormCreateArb, (variant) => {
          expect(isVariantFormCreate(variant)).toBe(true);
          expect(isVariantFormUpdate(variant)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("isVariantFormUpdate correctly identifies Update variants", () => {
      fc.assert(
        fc.property(variantFormUpdateArb, (variant) => {
          expect(isVariantFormUpdate(variant)).toBe(true);
          expect(isVariantFormCreate(variant)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("type guards are mutually exclusive", () => {
      fc.assert(
        fc.property(
          fc.oneof(variantFormCreateArb, variantFormUpdateArb),
          (variant: VariantForm) => {
            const isCreate = isVariantFormCreate(variant);
            const isUpdate = isVariantFormUpdate(variant);
            // Exactly one should be true
            expect(isCreate !== isUpdate).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Helper Functions", () => {
    it("createEmptyVariantForm produces valid Create variant", () => {
      fc.assert(
        fc.property(fc.nat({ max: 100000000 }), (defaultPrice) => {
          const variant = createEmptyVariantForm(defaultPrice);
          
          expect(isVariantFormCreate(variant)).toBe(true);
          expect(variant._id).toMatch(/^temp-\d+$/);
          expect(variant.name).toBe("");
          expect(variant.color).toBe("");
          expect(variant.price).toBe(defaultPrice);
          expect(variant.stock).toBe(0);
          expect(variant.images.files).toEqual([]);
          expect(variant.images.previews).toEqual([]);
        }),
        { numRuns: 100 }
      );
    });

    it("createEmptyVariantFormUpdate produces valid Update variant", () => {
      fc.assert(
        fc.property(fc.nat({ max: 100000000 }), (defaultPrice) => {
          const variant = createEmptyVariantFormUpdate(defaultPrice);
          
          expect(isVariantFormUpdate(variant)).toBe(true);
          expect(variant._id).toMatch(/^temp-\d+$/);
          expect(variant.name).toBe("");
          expect(variant.color).toBe("");
          expect(variant.price).toBe(defaultPrice);
          expect(variant.stock).toBe(0);
          expect(variant.images.existing).toEqual([]);
          expect(variant.images.newFiles).toEqual([]);
          expect(variant.images.newPreviews).toEqual([]);
        }),
        { numRuns: 100 }
      );
    });

    it("variantToForm converts server Variant to Update variant", () => {
      fc.assert(
        fc.property(serverVariantArb, (serverVariant) => {
          const editVariant = variantToForm(serverVariant);
          
          expect(isVariantFormUpdate(editVariant)).toBe(true);
          expect(editVariant._id).toBe(serverVariant._id);
          expect(editVariant.name).toBe(serverVariant.name);
          expect(editVariant.color).toBe(serverVariant.color || "");
          expect(editVariant.price).toBe(serverVariant.price);
          expect(editVariant.stock).toBe(serverVariant.stock);
          expect(editVariant.images.existing).toEqual(serverVariant.images);
          expect(editVariant.images.newFiles).toEqual([]);
          expect(editVariant.images.newPreviews).toEqual([]);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Structure Consistency", () => {
    it("Create variant has required image structure", () => {
      fc.assert(
        fc.property(variantFormCreateArb, (variant) => {
          expect(variant.images).toHaveProperty("files");
          expect(variant.images).toHaveProperty("previews");
          expect(Array.isArray(variant.images.files)).toBe(true);
          expect(Array.isArray(variant.images.previews)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it("Update variant has required image structure", () => {
      fc.assert(
        fc.property(variantFormUpdateArb, (variant) => {
          expect(variant.images).toHaveProperty("existing");
          expect(variant.images).toHaveProperty("newFiles");
          expect(variant.images).toHaveProperty("newPreviews");
          expect(Array.isArray(variant.images.existing)).toBe(true);
          expect(Array.isArray(variant.images.newFiles)).toBe(true);
          expect(Array.isArray(variant.images.newPreviews)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it("both variant types have consistent base properties", () => {
      fc.assert(
        fc.property(
          fc.oneof(variantFormCreateArb, variantFormUpdateArb),
          (variant: VariantForm) => {
            // All variants must have these base properties
            expect(typeof variant._id).toBe("string");
            expect(typeof variant.name).toBe("string");
            expect(typeof variant.price).toBe("number");
            expect(typeof variant.stock).toBe("number");
            expect(variant.images).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it("variant color is optional string", () => {
      fc.assert(
        fc.property(
          fc.oneof(variantFormCreateArb, variantFormUpdateArb),
          (variant: VariantForm) => {
            // Color should be undefined or string
            if (variant.color !== undefined) {
              expect(typeof variant.color).toBe("string");
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Default Values", () => {
    it("createEmptyVariantForm uses 0 as default price", () => {
      const variant = createEmptyVariantForm();
      expect(variant.price).toBe(0);
    });

    it("createEmptyVariantFormUpdate uses 0 as default price", () => {
      const variant = createEmptyVariantFormUpdate();
      expect(variant.price).toBe(0);
    });

    it("empty variants have empty color string", () => {
      const createVariant = createEmptyVariantForm();
      const updateVariant = createEmptyVariantFormUpdate();
      
      expect(createVariant.color).toBe("");
      expect(updateVariant.color).toBe("");
    });
  });
});
