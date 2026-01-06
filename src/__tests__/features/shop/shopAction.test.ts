import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { shopSlice } from "@/features/shop/shopSlice";
import { registerShop, getMyShop, updateShop, getShopById } from "@/features/shop/shopAction";
import instance from "@/api/api";

// Mock axios instance
vi.mock("@/api/api", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  },
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      shop: shopSlice.reducer,
    },
  });

describe("Shop Actions", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
  });

  describe("registerShop", () => {
    /**
     * Property 1: API Action Dispatch Correctness (Shop)
     * For any valid shop registration payload, the action SHALL make POST request
     * to /shops/register and update state on success
     * Validates: Requirements 1.1
     */
    it("should dispatch correctly with valid payload and update state on success", async () => {
      const mockShop = {
        _id: "shop123",
        name: "Test Shop",
        slug: "test-shop",
        owner: "user123",
        status: "active",
        rating: 4.5,
        metrics: { responseRate: 100, shippingOnTime: 100, ratingCount: 0 },
        followers: 0,
      };

      vi.mocked(instance.post).mockResolvedValueOnce({ data: { data: mockShop } });

      const payload = { name: "Test Shop", description: "A test shop" };
      await store.dispatch(registerShop(payload));

      expect(instance.post).toHaveBeenCalledWith("/shops/register", payload);
      expect(store.getState().shop.myShop).toEqual(mockShop);
      expect(store.getState().shop.isRegistering).toBe(false);
      expect(store.getState().shop.error).toBeNull();
    });

    it("should handle error response correctly", async () => {
      const errorMessage = "Shop name already exists";
      vi.mocked(instance.post).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await store.dispatch(registerShop({ name: "Existing Shop" }));

      expect(store.getState().shop.myShop).toBeNull();
      expect(store.getState().shop.error).toBe(errorMessage);
    });
  });

  describe("getMyShop", () => {
    it("should fetch current user shop and update state", async () => {
      const mockShop = {
        _id: "shop123",
        name: "My Shop",
        slug: "my-shop",
        owner: "user123",
        status: "active",
      };

      vi.mocked(instance.get).mockResolvedValueOnce({ data: { data: mockShop } });

      await store.dispatch(getMyShop());

      expect(instance.get).toHaveBeenCalledWith("/shops/me");
      expect(store.getState().shop.myShop).toEqual(mockShop);
    });
  });

  describe("updateShop", () => {
    /**
     * Property 1: API Action Dispatch Correctness (Shop)
     * For any valid update payload, the action SHALL make PUT request
     * to /shops and update state on success
     * Validates: Requirements 2.2
     */
    it("should update shop with valid payload", async () => {
      const updatedShop = {
        _id: "shop123",
        name: "Updated Shop Name",
        description: "Updated description",
      };

      vi.mocked(instance.put).mockResolvedValueOnce({ data: { data: updatedShop } });

      const payload = { name: "Updated Shop Name", description: "Updated description" };
      await store.dispatch(updateShop(payload));

      expect(instance.put).toHaveBeenCalledWith("/shops", payload);
      expect(store.getState().shop.myShop).toEqual(updatedShop);
      expect(store.getState().shop.isUpdating).toBe(false);
    });
  });

  describe("getShopById", () => {
    it("should fetch shop by ID and update currentShop state", async () => {
      const mockShop = {
        _id: "shop456",
        name: "Public Shop",
        slug: "public-shop",
        status: "active",
      };

      vi.mocked(instance.get).mockResolvedValueOnce({ data: { data: mockShop } });

      await store.dispatch(getShopById("shop456"));

      expect(instance.get).toHaveBeenCalledWith("/shops/shop456");
      expect(store.getState().shop.currentShop).toEqual(mockShop);
    });

    it("should handle not found error", async () => {
      vi.mocked(instance.get).mockRejectedValueOnce({
        response: { data: { message: "Shop not found" } },
      });

      await store.dispatch(getShopById("nonexistent"));

      expect(store.getState().shop.currentShop).toBeNull();
      expect(store.getState().shop.error).toBe("Shop not found");
    });
  });
});
