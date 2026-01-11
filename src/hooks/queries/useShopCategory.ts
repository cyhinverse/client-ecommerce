/**
 * Shop Category React Query Hooks
 * Replaces shopCategoryAction.ts async thunks with React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/api/api";
import { extractApiData } from "@/api";
import { errorHandler } from "@/services/errorHandler";
import { STALE_TIME } from "@/constants/cache";
import { shopCategoryKeys } from "@/lib/queryKeys";
import {
  ShopCategory,
  CreateShopCategoryPayload,
  UpdateShopCategoryPayload,
} from "@/types/shopCategory";

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
    staleTime: STALE_TIME.VERY_LONG,
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
    staleTime: STALE_TIME.VERY_LONG,
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
      errorHandler.log(error, { context: "Create shop category failed" });
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
      errorHandler.log(error, { context: "Update shop category failed" });
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
      errorHandler.log(error, { context: "Delete shop category failed" });
    },
  });
}
