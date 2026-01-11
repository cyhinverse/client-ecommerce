/**
 * Wishlist React Query Hooks
 * Replaces wishlistAction.ts async thunks with React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import instance from "@/api/api";
import { extractApiData, extractApiError } from "@/utils/api";
import { wishlistKeys } from "@/lib/queryKeys";
import { toast } from "sonner";
import {
  WishlistItem,
  WishlistResponse,
  CheckWishlistResponse,
  CheckMultipleWishlistResponse,
} from "@/types/wishlist";

// ============ API Functions ============
const wishlistApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<WishlistResponse> => {
    const response = await instance.get("/wishlist", { params });
    return extractApiData(response);
  },

  getCount: async (): Promise<number> => {
    const response = await instance.get("/wishlist/count");
    const data = extractApiData<{ count?: number }>(response);
    return data?.count || 0;
  },

  check: async (productId: string): Promise<boolean> => {
    const response = await instance.get(`/wishlist/check/${productId}`);
    const data = extractApiData<CheckWishlistResponse>(response);
    return data?.isInWishlist || false;
  },

  checkMultiple: async (
    productIds: string[]
  ): Promise<CheckMultipleWishlistResponse> => {
    const response = await instance.post("/wishlist/check-multiple", {
      productIds,
    });
    return extractApiData(response) || {};
  },

  // Mutations
  add: async (
    productId: string
  ): Promise<{ productId: string; wishlistCount: number }> => {
    const response = await instance.post(`/wishlist/${productId}`);
    return { ...extractApiData(response), productId };
  },

  remove: async (productId: string): Promise<string> => {
    await instance.delete(`/wishlist/${productId}`);
    return productId;
  },

  clear: async (): Promise<void> => {
    await instance.delete("/wishlist");
  },
};

// ============ Query Hooks ============

/**
 * Get user's wishlist with pagination
 */
export function useWishlist(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: wishlistKeys.list(params),
    queryFn: () => wishlistApi.getAll(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get wishlist count (for badge display)
 */
export function useWishlistCount() {
  return useQuery({
    queryKey: wishlistKeys.count(),
    queryFn: wishlistApi.getCount,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Check if single product is in wishlist
 */
export function useCheckInWishlist(
  productId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: wishlistKeys.check(productId),
    queryFn: () => wishlistApi.check(productId),
    enabled: options?.enabled ?? !!productId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Check multiple products in wishlist (batch check)
 */
export function useCheckMultipleInWishlist(
  productIds: string[],
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: wishlistKeys.checkMultiple(productIds),
    queryFn: () => wishlistApi.checkMultiple(productIds),
    enabled: options?.enabled ?? productIds.length > 0,
    staleTime: 2 * 60 * 1000,
  });
}

// ============ Mutation Hooks ============

/**
 * Add product to wishlist
 */
export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishlistApi.add,
    onSuccess: (data, productId) => {
      // Update wishlist check cache
      queryClient.setQueryData(wishlistKeys.check(productId), true);
      // Invalidate lists and count
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.count() });
    },
    onError: (error) => {
      console.error("Add to wishlist failed:", extractApiError(error));
    },
  });
}

/**
 * Remove product from wishlist
 */
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishlistApi.remove,
    onSuccess: (productId) => {
      // Update wishlist check cache
      queryClient.setQueryData(wishlistKeys.check(productId), false);
      // Invalidate lists and count
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.count() });
    },
    onError: (error) => {
      console.error("Remove from wishlist failed:", extractApiError(error));
    },
  });
}

/**
 * Clear entire wishlist
 */
export function useClearWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishlistApi.clear,
    onSuccess: () => {
      // Invalidate all wishlist queries
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
    onError: (error) => {
      console.error("Clear wishlist failed:", extractApiError(error));
    },
  });
}

/**
 * Toggle wishlist (add if not in, remove if in)
 * Convenience hook combining add and remove
 */
export function useToggleWishlist() {
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  const toggle = async (productId: string, isInWishlist: boolean) => {
    if (isInWishlist) {
      return removeMutation.mutateAsync(productId);
    } else {
      return addMutation.mutateAsync(productId);
    }
  };

  return {
    toggle,
    isLoading: addMutation.isPending || removeMutation.isPending,
    error: addMutation.error || removeMutation.error,
  };
}

// ============ Composite Hooks ============

/**
 * Composite hook for Wishlist management with batch checking and toggle functionality
 * Provides all wishlist operations with toast notifications
 * @param isAuthenticated - Whether the user is authenticated (from Redux auth state)
 */
export function useWishlistManager(isAuthenticated: boolean) {
  const queryClient = useQueryClient();

  // React Query hooks
  const { data: count = 0, isLoading: isLoadingCount } = useWishlistCount();
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  // Track checked products for batch checking
  const checkedProductIds = useRef<string[]>([]);
  const checkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Use React Query to check multiple products
  const { data: wishlistMap = {} } = useCheckMultipleInWishlist(
    checkedProductIds.current,
    { enabled: checkedProductIds.current.length > 0 }
  );

  // Batch check products - debounced
  const batchCheckProducts = useCallback(
    (productIds: string[]) => {
      if (!isAuthenticated) return;

      const newIds = productIds.filter(
        (id) => !checkedProductIds.current.includes(id)
      );
      if (newIds.length === 0) return;

      checkedProductIds.current = [
        ...new Set([...checkedProductIds.current, ...newIds]),
      ];

      if (checkTimeout.current) {
        clearTimeout(checkTimeout.current);
      }

      checkTimeout.current = setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: wishlistKeys.checkMultiple(checkedProductIds.current),
        });
      }, 100);
    },
    [isAuthenticated, queryClient]
  );

  // Check if product is in wishlist
  const isInWishlist = useCallback(
    (productId: string): boolean => {
      const cached = queryClient.getQueryData<boolean>(
        wishlistKeys.check(productId)
      );
      if (cached !== undefined) return cached;
      return wishlistMap[productId] === true;
    },
    [wishlistMap, queryClient]
  );

  // Toggle wishlist with toast notifications
  const toggleWishlist = useCallback(
    async (productId: string, productName?: string) => {
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để sử dụng tính năng này");
        return false;
      }

      const currentlyInWishlist = isInWishlist(productId);

      try {
        if (currentlyInWishlist) {
          await removeMutation.mutateAsync(productId);
          toast.success("Đã xóa khỏi yêu thích");
          return false;
        } else {
          await addMutation.mutateAsync(productId);
          toast.success(
            productName
              ? `Đã thêm "${productName}" vào yêu thích`
              : "Đã thêm vào yêu thích"
          );
          return true;
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Có lỗi xảy ra";
        toast.error(errorMessage);
        return currentlyInWishlist;
      }
    },
    [isAuthenticated, isInWishlist, addMutation, removeMutation]
  );

  const isLoading =
    isLoadingCount || addMutation.isPending || removeMutation.isPending;

  return {
    isInWishlist,
    toggleWishlist,
    batchCheckProducts,
    count,
    isLoading,
    isAuthenticated,
  };
}
