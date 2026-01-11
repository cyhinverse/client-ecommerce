/**
 * Property Test: Populated Reference Handling
 * Validates: Requirements 5.5
 * 
 * Tests that components correctly handle both populated objects and string IDs
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { Shop, ShopOwner } from "@/types/shop";
import { Product, Category } from "@/types/product";
import { Order } from "@/types/order";

// Helper to check if value is populated object or string ID
function isPopulated<T extends { _id: string }>(value: T | string): value is T {
  return typeof value === "object" && value !== null && "_id" in value;
}

// Helper to get ID from populated or string
function getId<T extends { _id: string }>(value: T | string): string {
  return isPopulated(value) ? value._id : value;
}

// Helper to get name from populated or fallback
function getName<T extends { _id: string; name?: string }>(
  value: T | string,
  fallback: string = "Unknown"
): string {
  if (isPopulated(value)) {
    return value.name || fallback;
  }
  return fallback;
}

describe("Property: Populated Reference Handling", () => {
  describe("Shop owner reference", () => {
    const ownerArbitrary = fc.oneof(
      // String ID
      fc.string({ minLength: 24, maxLength: 24 }),
      // Populated ShopOwner
      fc.record({
        _id: fc.string({ minLength: 24, maxLength: 24 }),
        username: fc.string(),
        email: fc.emailAddress(),
        avatar: fc.option(fc.webUrl(), { nil: null }),
      })
    );

    it("should correctly identify populated vs string owner", () => {
      fc.assert(
        fc.property(ownerArbitrary, (owner) => {
          if (typeof owner === "string") {
            expect(isPopulated(owner)).toBe(false);
            expect(getId(owner)).toBe(owner);
          } else {
            expect(isPopulated(owner)).toBe(true);
            expect(getId(owner)).toBe(owner._id);
          }
        }),
        { numRuns: 50 }
      );
    });

    it("should extract owner info safely", () => {
      fc.assert(
        fc.property(ownerArbitrary, (owner) => {
          const id = getId(owner);
          expect(typeof id).toBe("string");
          expect(id.length).toBeGreaterThan(0);

          if (isPopulated(owner)) {
            expect(owner.username).toBeDefined();
            expect(owner.email).toBeDefined();
          }
        }),
        { numRuns: 50 }
      );
    });
  });

  describe("Product category reference", () => {
    const categoryArbitrary = fc.oneof(
      // Null
      fc.constant(null),
      // Populated Category
      fc.record({
        _id: fc.string({ minLength: 24, maxLength: 24 }),
        name: fc.string(),
        slug: fc.string(),
      })
    );

    it("should handle null category", () => {
      const category: Category | null = null;
      expect(getName(category as unknown as Category | string, "Uncategorized")).toBe("Uncategorized");
    });

    it("should extract category name safely", () => {
      fc.assert(
        fc.property(categoryArbitrary, (category) => {
          if (category === null) {
            // Null should use fallback
            return true;
          }
          
          const name = getName(category, "Uncategorized");
          expect(typeof name).toBe("string");
          expect(name.length).toBeGreaterThan(0);
        }),
        { numRuns: 50 }
      );
    });
  });

  describe("Order user/shop reference", () => {
    const userRefArbitrary = fc.oneof(
      // String ID
      fc.string({ minLength: 24, maxLength: 24 }),
      // Populated User (partial)
      fc.record({
        _id: fc.string({ minLength: 24, maxLength: 24 }),
        username: fc.string(),
        email: fc.emailAddress(),
      })
    );

    const shopRefArbitrary = fc.oneof(
      // String ID
      fc.string({ minLength: 24, maxLength: 24 }),
      // Populated Shop (partial)
      fc.record({
        _id: fc.string({ minLength: 24, maxLength: 24 }),
        name: fc.string(),
        slug: fc.string(),
      })
    );

    it("should handle both populated and string user reference", () => {
      fc.assert(
        fc.property(userRefArbitrary, (userRef) => {
          const id = getId(userRef);
          expect(typeof id).toBe("string");
          expect(id.length).toBe(24);
        }),
        { numRuns: 50 }
      );
    });

    it("should handle both populated and string shop reference", () => {
      fc.assert(
        fc.property(shopRefArbitrary, (shopRef) => {
          const id = getId(shopRef);
          expect(typeof id).toBe("string");
          expect(id.length).toBe(24);

          const name = getName(shopRef, "Shop");
          expect(typeof name).toBe("string");
        }),
        { numRuns: 50 }
      );
    });
  });

  describe("Generic reference handling", () => {
    it("should provide consistent ID extraction", () => {
      // Test with various reference types
      const stringId = "507f1f77bcf86cd799439011";
      const populatedObj = { _id: "507f1f77bcf86cd799439011", name: "Test" };

      expect(getId(stringId)).toBe(stringId);
      expect(getId(populatedObj)).toBe(populatedObj._id);
    });

    it("should provide consistent name extraction with fallback", () => {
      const stringId = "507f1f77bcf86cd799439011";
      const populatedWithName = { _id: "507f1f77bcf86cd799439011", name: "Test Name" };
      const populatedWithoutName = { _id: "507f1f77bcf86cd799439011" };

      expect(getName(stringId, "Default")).toBe("Default");
      expect(getName(populatedWithName, "Default")).toBe("Test Name");
      expect(getName(populatedWithoutName as { _id: string; name?: string }, "Default")).toBe("Default");
    });
  });
});
