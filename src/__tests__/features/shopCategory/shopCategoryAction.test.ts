import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { shopCategorySlice } from "@/features/shopCategory/shopCategorySlice";
import {
  getShopCategories,
  createShopCategory,
  updateShopCategory,
  deleteShopCategory,
} from "@/features/shopCategory/shopCategoryAction";
import instance from "@/api/api";

// Mock axios instance
vi.mock("@/api/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      shopCategory: shopCategorySlice.reducer,
    },
  });

describe("Shop Category Actions", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
  });

  describe("getShopCategories", () => {
    it("should fetch seller's own categories when no shopId provided", async () => {
      const mockCategories = [
        { _id: "c1", name: "Electronics", slug: "electronics", productCount: 10 },
        { _id: "c2", name: "Clothing", slug: "clothing", productCount: 5 },
      ];

      vi.mocked(instance.get).mockResolvedValueOnce({ data: { data: mockCategories } });

      await store.dispatch(getShopCategories(undefined));

      expect(instance.get).toHaveBeenCalledWith("/shop-categories");
      expect(store.getState().shopCategory.categories).toEqual(mockCategories);
    });

    it("should fetch shop categories by shopId", async () => {
      const mockCategories = [{ _id: "c1", name: "Books", slug: "books" }];

      vi.mocked(instance.get).mockResolvedValueOnce({ data: { data: mockCategories } });

      await store.dispatch(getShopCategories("shop123"));

      expect(instance.get).toHaveBeenCalledWith("/shop-categories/shop/shop123");
      expect(store.getState().shopCategory.categories).toEqual(mockCategories);
    });
  });

  describe("createShopCategory", () => {
    /**
     * Property 1: API Action Dispatch Correctness (ShopCategory)
     * For any valid category payload, the action SHALL make POST request
     * to /shop-categories and add category to state
     * Validates: Requirements 5.2
     */
    it("should create category with valid payload", async () => {
      const mockCategory = {
        _id: "c3",
        name: "New Category",
        slug: "new-category",
        productCount: 0,
      };

      vi.mocked(instance.post).mockResolvedValueOnce({ data: { data: mockCategory } });

      const payload = { name: "New Category", description: "Test description" };
      await store.dispatch(createShopCategory(payload));

      expect(instance.post).toHaveBeenCalledWith("/shop-categories", payload);
      expect(store.getState().shopCategory.categories).toContainEqual(mockCategory);
      expect(store.getState().shopCategory.isCreating).toBe(false);
    });

    it("should handle creation error", async () => {
      vi.mocked(instance.post).mockRejectedValueOnce({
        response: { data: { message: "Category name already exists" } },
      });

      await store.dispatch(createShopCategory({ name: "Duplicate" }));

      expect(store.getState().shopCategory.error).toBe("Category name already exists");
    });
  });

  describe("updateShopCategory", () => {
    /**
     * Property 1: API Action Dispatch Correctness (ShopCategory)
     * For any valid update payload, the action SHALL make PUT request
     * to /shop-categories/:id and update category in state
     * Validates: Requirements 5.3
     */
    it("should update category with valid payload", async () => {
      // Pre-populate state
      vi.mocked(instance.get).mockResolvedValueOnce({
        data: { data: [{ _id: "c1", name: "Old Name", slug: "old-name" }] },
      });
      await store.dispatch(getShopCategories(undefined));

      const updatedCategory = { _id: "c1", name: "Updated Name", slug: "updated-name" };
      vi.mocked(instance.put).mockResolvedValueOnce({ data: { data: updatedCategory } });

      await store.dispatch(
        updateShopCategory({ categoryId: "c1", data: { name: "Updated Name" } })
      );

      expect(instance.put).toHaveBeenCalledWith("/shop-categories/c1", { name: "Updated Name" });
      expect(store.getState().shopCategory.categories[0].name).toBe("Updated Name");
    });
  });

  describe("deleteShopCategory", () => {
    /**
     * Property 1: API Action Dispatch Correctness (ShopCategory)
     * For any valid category ID, the action SHALL make DELETE request
     * to /shop-categories/:id and remove category from state
     * Validates: Requirements 5.4
     */
    it("should delete category and remove from state", async () => {
      // Pre-populate state
      vi.mocked(instance.get).mockResolvedValueOnce({
        data: { data: [{ _id: "c1", name: "To Delete", slug: "to-delete" }] },
      });
      await store.dispatch(getShopCategories(undefined));

      vi.mocked(instance.delete).mockResolvedValueOnce({});

      await store.dispatch(deleteShopCategory("c1"));

      expect(instance.delete).toHaveBeenCalledWith("/shop-categories/c1");
      expect(store.getState().shopCategory.categories).toHaveLength(0);
    });

    it("should handle delete error when category has products", async () => {
      vi.mocked(instance.delete).mockRejectedValueOnce({
        response: { data: { message: "Cannot delete category with products" } },
      });

      await store.dispatch(deleteShopCategory("c1"));

      expect(store.getState().shopCategory.error).toBe("Cannot delete category with products");
    });
  });
});
