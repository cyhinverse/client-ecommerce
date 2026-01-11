/**
 * Property Test: Component Null Safety
 * Validates: Requirements 5.3
 * 
 * Tests that utility functions handle null/undefined data gracefully
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { getCartItemPriceValue, groupCartItemsByShop, CartItem } from "@/types/cart";
import { Price } from "@/types/product";

describe("Property: Null Safety", () => {
  describe("getCartItemPriceValue", () => {
    it("should return 0 for undefined price", () => {
      expect(getCartItemPriceValue(undefined)).toBe(0);
    });

    it("should return the number directly for number price", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 10000000 }), (price) => {
          expect(getCartItemPriceValue(price)).toBe(price);
        }),
        { numRuns: 50 }
      );
    });

    it("should extract discountPrice or currentPrice from Price object", () => {
      fc.assert(
        fc.property(
          fc.record({
            currentPrice: fc.integer({ min: 0, max: 10000000 }),
            discountPrice: fc.option(fc.integer({ min: 0, max: 10000000 }), { nil: undefined }),
            currency: fc.constant("VND"),
          }),
          (price: Price) => {
            const result = getCartItemPriceValue(price);
            const expected = price.discountPrice ?? price.currentPrice;
            expect(result).toBe(expected);
          }
        ),
        { numRuns: 50 }
      );
    });

    it("should handle edge cases", () => {
      // Zero prices
      expect(getCartItemPriceValue(0)).toBe(0);
      expect(getCartItemPriceValue({ currentPrice: 0, currency: "VND" })).toBe(0);
      
      // Null discount price
      expect(getCartItemPriceValue({ currentPrice: 100, discountPrice: null, currency: "VND" })).toBe(100);
    });
  });

  describe("groupCartItemsByShop", () => {
    it("should return empty array for empty items", () => {
      expect(groupCartItemsByShop([])).toEqual([]);
    });

    it("should handle items with missing shop info", () => {
      const itemWithoutShop: CartItem = {
        _id: "item1",
        productId: "product1",
        quantity: 1,
        price: 100,
      };

      const result = groupCartItemsByShop([itemWithoutShop]);
      
      expect(result.length).toBe(1);
      expect(result[0].items.length).toBe(1);
      expect(result[0].shop._id).toBe("default-shop");
    });

    it("should group items by shop correctly", () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              _id: fc.string(),
              productId: fc.string(),
              shopId: fc.oneof(fc.constant("shop1"), fc.constant("shop2")),
              quantity: fc.integer({ min: 1, max: 10 }),
              price: fc.integer({ min: 100, max: 10000 }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (items) => {
            const result = groupCartItemsByShop(items as CartItem[]);
            
            // Total items should match
            const totalItems = result.reduce((sum, group) => sum + group.items.length, 0);
            expect(totalItems).toBe(items.length);
            
            // Each group should have items
            result.forEach(group => {
              expect(group.items.length).toBeGreaterThan(0);
              expect(group.itemCount).toBeGreaterThan(0);
            });
          }
        ),
        { numRuns: 30 }
      );
    });

    it("should calculate subtotal correctly", () => {
      const items: CartItem[] = [
        { _id: "1", productId: "p1", shopId: "shop1", quantity: 2, price: 100 },
        { _id: "2", productId: "p2", shopId: "shop1", quantity: 1, price: 200 },
      ];

      const result = groupCartItemsByShop(items);
      
      expect(result.length).toBe(1);
      expect(result[0].subtotal).toBe(2 * 100 + 1 * 200); // 400
      expect(result[0].itemCount).toBe(3); // 2 + 1
    });
  });
});
