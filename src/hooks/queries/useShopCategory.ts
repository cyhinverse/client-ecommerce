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

const normalizeCategory = (category: any): ShopCategory => ({
  _id: category?._id ?? "",
  shop: category?.shopId ?? category?.shop ?? "",
  name: category?.name ?? "",
  slug: category?.slug ?? "",
  description: category?.description ?? "",
  image: category?.image ?? "",
  productCount: category?.productCount ?? 0,
  isActive: typeof category?.isActive === "boolean" ? category.isActive : true,
  sortOrder:
    typeof category?.sortOrder === "number"
      ? category.sortOrder
      : typeof category?.displayOrder === "number"
        ? category.displayOrder
        : 0,
  createdAt: category?.createdAt ?? "",
  updatedAt: category?.updatedAt ?? "",
});

const normalizeCategoryList = (data: any): ShopCategory[] => {
  if (Array.isArray(data)) {
    return data.map(normalizeCategory);
  }
  if (data?.categories && Array.isArray(data.categories)) {
    return data.categories.map(normalizeCategory);
  }
  return [];
};

const mapCategoryPayload = (
  payload: CreateShopCategoryPayload | UpdateShopCategoryPayload
) => {
  const { sortOrder, ...rest } = payload;
  return {
    ...rest,
    ...(typeof sortOrder === "number" ? { displayOrder: sortOrder } : {}),
  };
};

// ============ API Functions ============
const shopCategoryApi = {
  // Get seller's own categories
  getMy: async (): Promise<ShopCategory[]> => {
    const response = await instance.get("/shop-categories/my");
    const data = extractApiData(response);
    return normalizeCategoryList(data);
  },

  // Get public shop categories by shop ID
  getByShop: async (shopId: string): Promise<ShopCategory[]> => {
    const response = await instance.get(`/shop-categories/${shopId}`);
    const data = extractApiData(response);
    return normalizeCategoryList(data);
  },

  create: async (data: CreateShopCategoryPayload): Promise<ShopCategory> => {
    const response = await instance.post(
      "/shop-categories",
      mapCategoryPayload(data)
    );
    const result = extractApiData(response);
    return normalizeCategory(result);
  },

  update: async (
    categoryId: string,
    data: UpdateShopCategoryPayload
  ): Promise<ShopCategory> => {
    const response = await instance.put(
      `/shop-categories/${categoryId}`,
      mapCategoryPayload(data)
    );
    const result = extractApiData(response);
    return normalizeCategory(result);
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
