/**
 * Shop React Query Hooks
 * Replaces shopAction.ts async thunks with React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/api/api";
import { extractApiData, extractApiError } from "@/api";
import { errorHandler } from "@/services/errorHandler";
import { STALE_TIME } from "@/constants/cache";
import { shopKeys, productKeys } from "@/lib/queryKeys";
import { Shop, CreateShopPayload, UpdateShopPayload } from "@/types/shop";
import { PaginationData } from "@/types/common";

// ============ Types ============
export interface ShopListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "banned";
}

// ============ API Functions ============
const shopApi = {
  getMyShop: async (): Promise<Shop | null> => {
    try {
      const response = await instance.get("/shops/my");
      return extractApiData(response);
    } catch (error: unknown) {
      // If user doesn't have a shop, return null instead of throwing
      if (
        (error as { response?: { status?: number } })?.response?.status === 404
      ) {
        return null;
      }
      throw error;
    }
  },

  getById: async (shopId: string): Promise<Shop> => {
    const response = await instance.get(`/shops/${shopId}`);
    return extractApiData(response);
  },

  getBySlug: async (slug: string): Promise<Shop> => {
    const response = await instance.get(`/shops/slug/${slug}`);
    return extractApiData(response);
  },

  getCategories: async (
    shopId: string
  ): Promise<
    { _id: string; name: string; slug: string; isActive?: boolean }[]
  > => {
    const response = await instance.get(`/shop-categories/${shopId}`);
    return extractApiData(response);
  },

  // Admin: Get all shops
  getAll: async (
    params: ShopListParams = {}
  ): Promise<{ shops: Shop[]; pagination: PaginationData | null }> => {
    const { page = 1, limit = 10, search, status } = params;
    const response = await instance.get("/shops", {
      params: { page, limit, search, status },
    });
    const data = extractApiData<{
      data?: Shop[];
      shops?: Shop[];
      pagination?: PaginationData;
    }>(response);
    return {
      shops: data?.data || data?.shops || [],
      pagination: data?.pagination || null,
    };
  },

  // Mutations
  register: async (data: CreateShopPayload): Promise<Shop> => {
    const response = await instance.post("/shops/register", data);
    return extractApiData(response);
  },

  update: async (data: UpdateShopPayload): Promise<Shop> => {
    const response = await instance.put("/shops/my", data);
    return extractApiData(response);
  },

  uploadLogo: async (formData: FormData): Promise<{ logo: string }> => {
    const response = await instance.post("/shops/upload-logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return extractApiData(response);
  },

  uploadBanner: async (formData: FormData): Promise<{ banner: string }> => {
    const response = await instance.post("/shops/upload-banner", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return extractApiData(response);
  },

  // Admin mutations
  updateStatus: async (params: {
    shopId: string;
    status: "active" | "inactive" | "banned";
  }): Promise<Shop> => {
    const { shopId, status } = params;
    const response = await instance.put(`/shops/${shopId}/status`, { status });
    return extractApiData(response);
  },

  follow: async (shopId: string): Promise<void> => {
    await instance.post(`/shops/${shopId}/follow`);
  },

  unfollow: async (shopId: string): Promise<void> => {
    await instance.delete(`/shops/${shopId}/follow`);
  },
};

// ============ Query Hooks ============

/**
 * Get current user's shop (for sellers)
 */
export function useMyShop(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: shopKeys.myShop(),
    queryFn: shopApi.getMyShop,
    enabled: options?.enabled,
    staleTime: STALE_TIME.STATIC,
  });
}

/**
 * Get shop by ID
 */
export function useShop(shopId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: shopKeys.detail(shopId),
    queryFn: () => shopApi.getById(shopId),
    enabled: options?.enabled ?? !!shopId,
    staleTime: STALE_TIME.VERY_LONG,
  });
}

/**
 * Get shop by slug
 */
export function useShopBySlug(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: shopKeys.detailBySlug(slug),
    queryFn: () => shopApi.getBySlug(slug),
    enabled: options?.enabled ?? !!slug,
    staleTime: STALE_TIME.VERY_LONG,
  });
}

/**
 * Get shop categories
 */
export function useShopCategories(
  shopId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: shopKeys.categories(shopId),
    queryFn: () => shopApi.getCategories(shopId),
    enabled: options?.enabled ?? !!shopId,
    staleTime: STALE_TIME.STATIC,
  });
}

/**
 * Get all shops (Admin)
 */
export function useAllShops(params?: ShopListParams) {
  return useQuery({
    queryKey: [...shopKeys.all, "list", params] as const,
    queryFn: () => shopApi.getAll(params),
    staleTime: STALE_TIME.LONG,
  });
}

// ============ Mutation Hooks ============

/**
 * Register new shop
 */
export function useRegisterShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shopApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(shopKeys.myShop(), data);
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Register shop failed" });
    },
  });
}

/**
 * Update shop
 */
export function useUpdateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shopApi.update,
    onSuccess: (data) => {
      queryClient.setQueryData(shopKeys.myShop(), data);
      if (data._id) {
        queryClient.setQueryData(shopKeys.detail(data._id), data);
      }
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Update shop failed" });
    },
  });
}

/**
 * Upload shop logo
 */
export function useUploadShopLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shopApi.uploadLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopKeys.myShop() });
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Upload logo failed" });
    },
  });
}

/**
 * Upload shop banner
 */
export function useUploadShopBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shopApi.uploadBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopKeys.myShop() });
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Upload banner failed" });
    },
  });
}

/**
 * Update shop status (Admin)
 */
export function useUpdateShopStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shopApi.updateStatus,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(shopKeys.detail(variables.shopId), data);
      queryClient.invalidateQueries({ queryKey: shopKeys.all });
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Update shop status failed" });
    },
  });
}

/**
 * Follow shop
 */
export function useFollowShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shopApi.follow,
    onSuccess: (_, shopId) => {
      queryClient.invalidateQueries({ queryKey: shopKeys.detail(shopId) });
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Follow shop failed" });
    },
  });
}

/**
 * Unfollow shop
 */
export function useUnfollowShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shopApi.unfollow,
    onSuccess: (_, shopId) => {
      queryClient.invalidateQueries({ queryKey: shopKeys.detail(shopId) });
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Unfollow shop failed" });
    },
  });
}
