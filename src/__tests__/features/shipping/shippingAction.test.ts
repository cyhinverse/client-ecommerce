import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { shippingSlice } from "@/features/shipping/shippingSlice";
import {
  getMyShippingTemplates,
  createShippingTemplate,
  updateShippingTemplate,
  deleteShippingTemplate,
} from "@/features/shipping/shippingAction";
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
      shipping: shippingSlice.reducer,
    },
  });

describe("Shipping Actions", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
  });

  describe("getMyShippingTemplates", () => {
    it("should fetch shipping templates and update state", async () => {
      const mockTemplates = [
        { _id: "t1", name: "Standard", isDefault: true, rules: [] },
        { _id: "t2", name: "Express", isDefault: false, rules: [] },
      ];

      vi.mocked(instance.get).mockResolvedValueOnce({ data: { data: mockTemplates } });

      await store.dispatch(getMyShippingTemplates());

      expect(instance.get).toHaveBeenCalledWith("/shipping");
      expect(store.getState().shipping.templates).toEqual(mockTemplates);
      expect(store.getState().shipping.isLoading).toBe(false);
    });

    it("should handle error response", async () => {
      vi.mocked(instance.get).mockRejectedValueOnce({
        response: { data: { message: "Unauthorized" } },
      });

      await store.dispatch(getMyShippingTemplates());

      expect(store.getState().shipping.templates).toEqual([]);
      expect(store.getState().shipping.error).toBe("Unauthorized");
    });
  });

  describe("createShippingTemplate", () => {
    /**
     * Property 1: API Action Dispatch Correctness (Shipping)
     * For any valid shipping template payload, the action SHALL make POST request
     * to /shipping and add template to state on success
     * Validates: Requirements 4.2
     */
    it("should create template with valid payload", async () => {
      const mockTemplate = {
        _id: "t3",
        name: "New Template",
        isDefault: false,
        rules: [{ name: "Fixed", type: "fixed", baseFee: 30000 }],
      };

      vi.mocked(instance.post).mockResolvedValueOnce({ data: { data: mockTemplate } });

      const payload = {
        name: "New Template",
        rules: [{ name: "Fixed", type: "fixed" as const, baseFee: 30000 }],
      };
      await store.dispatch(createShippingTemplate(payload));

      expect(instance.post).toHaveBeenCalledWith("/shipping", payload);
      expect(store.getState().shipping.templates).toContainEqual(mockTemplate);
      expect(store.getState().shipping.isCreating).toBe(false);
    });

    it("should handle creation error", async () => {
      vi.mocked(instance.post).mockRejectedValueOnce({
        response: { data: { message: "Invalid rules" } },
      });

      await store.dispatch(createShippingTemplate({ name: "Bad", rules: [] }));

      expect(store.getState().shipping.error).toBe("Invalid rules");
    });
  });

  describe("updateShippingTemplate", () => {
    /**
     * Property 1: API Action Dispatch Correctness (Shipping)
     * For any valid update payload, the action SHALL make PUT request
     * to /shipping/:id and update template in state
     * Validates: Requirements 4.3
     */
    it("should update template with valid payload", async () => {
      // Pre-populate state with a template
      vi.mocked(instance.get).mockResolvedValueOnce({
        data: { data: [{ _id: "t1", name: "Old Name", isDefault: true, rules: [] }] },
      });
      await store.dispatch(getMyShippingTemplates());

      const updatedTemplate = { _id: "t1", name: "Updated Name", isDefault: true, rules: [] };
      vi.mocked(instance.put).mockResolvedValueOnce({ data: { data: updatedTemplate } });

      await store.dispatch(
        updateShippingTemplate({ templateId: "t1", data: { name: "Updated Name" } })
      );

      expect(instance.put).toHaveBeenCalledWith("/shipping/t1", { name: "Updated Name" });
      expect(store.getState().shipping.templates[0].name).toBe("Updated Name");
    });
  });

  describe("deleteShippingTemplate", () => {
    /**
     * Property 1: API Action Dispatch Correctness (Shipping)
     * For any valid template ID, the action SHALL make DELETE request
     * to /shipping/:id and remove template from state
     * Validates: Requirements 4.4
     */
    it("should delete template and remove from state", async () => {
      // Pre-populate state
      vi.mocked(instance.get).mockResolvedValueOnce({
        data: { data: [{ _id: "t1", name: "To Delete", isDefault: false, rules: [] }] },
      });
      await store.dispatch(getMyShippingTemplates());

      vi.mocked(instance.delete).mockResolvedValueOnce({});

      await store.dispatch(deleteShippingTemplate("t1"));

      expect(instance.delete).toHaveBeenCalledWith("/shipping/t1");
      expect(store.getState().shipping.templates).toHaveLength(0);
      expect(store.getState().shipping.isDeleting).toBe(false);
    });

    it("should handle delete error", async () => {
      vi.mocked(instance.delete).mockRejectedValueOnce({
        response: { data: { message: "Cannot delete default template" } },
      });

      await store.dispatch(deleteShippingTemplate("t1"));

      expect(store.getState().shipping.error).toBe("Cannot delete default template");
    });
  });
});
