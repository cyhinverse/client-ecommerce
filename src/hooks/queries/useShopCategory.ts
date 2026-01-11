/**
 * Shop Category React Query Hooks
 * Replaces shopCategoryAction.ts async thunks with React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/api/api";
import { extractApiData, extractApiError } from "@/utils/api";
import {
  ShopCategory,
  CreateShopCategoryPayload,
  UpdateShopCategoryPayload,
} from "@/types/shopCategory";

// Query keys for shop categories
export const shopCategoryKeys = {
  all: ["shop-categories"] as const,
  myCategories: () => [...shopCategoryKeys.all, "my"] as const,
  byShop: (shopId: string) =>
    [...shopCategoryKeys.all, "shop", shopId] as const,
};

// ============ API Functions ============
const shopCategoryApi = {
  // Get seller's own categories
  getMy: async (): Promise<ShopCategory[]> => {
    const response = await instance.get("/shop-categories/my");
    return extractApiData(response);
  },

  // Get public shop categories by shop ID
  getByShop: async (shopId: string): Promise<ShopCategory[]> => {
    const response = await instance.get(`/shop-categories/${shopId}`);
    return extractApiData(response);
  },

  create: async (data: CreateShopCategoryPayload): Promise<ShopCategory> => {
    const response = await instance.post("/shop-categories", data);
    return extractApiData(response);
  },

  update: async (
    categoryId: string,
    data: UpdateShopCategoryPayload
  ): Promise<ShopCategory> => {
    const response = await instance.put(`/shop-categories/${categoryId}`, data);
    return extractApiData(response);
  },

  delete: async (categoryId: string): Promise<string> => {
    await instance.delete(`/shop-categories/${categoryId}`);
    return categoryId;
  },
};

// ============ Query Hooks ============

/**
 * Get seller's own shop categories
 */
export function useMyShopCategories() {
  return useQuery({
    queryKey: shopCategoryKeys.myCategories(),
    queryFn: shopCategoryApi.getMy,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get shop categories by shop ID (public)
 */
export function useShopCategoriesByShop(
  shopId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: shopCategoryKeys.byShop(shopId),
    queryFn: () => shopCategoryApi.getByShop(shopId),
    enabled: options?.enabled ?? !!shopId,
    staleTime: 5 * 60 * 1000,
  });
}

// ============ Mutation Hooks ============

/**
 * Create shop category mutation
 */
export function useCreateShopCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shopCategoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopCategoryKeys.all });
    },
    onError: (error) => {
      console.error("Create shop category failed:", extractApiError(error));
    },
  });
}

/**
 * Update shop category mutation
 */
export function useUpdateShopCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: UpdateShopCategoryPayload;
    }) => shopCategoryApi.update(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopCategoryKeys.all });
    },
    onError: (error) => {
      console.error("Update shop category failed:", extractApiError(error));
    },
  });
}

/**
 * Delete shop category mutation
 */
export function useDeleteShopCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shopCategoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopCategoryKeys.all });
    },
    onError: (error) => {
      console.error("Delete shop category failed:", extractApiError(error));
    },
  });
}
