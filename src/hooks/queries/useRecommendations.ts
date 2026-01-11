/**
 * Recommendation React Query Hooks
 * Replaces recommendationAction.ts async thunks with React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import instance from "@/api/api";
import { extractApiData, extractApiError } from "@/utils/api";
import { recommendationKeys } from "@/lib/queryKeys";
import { Product } from "@/types/product";
import { HomepageRecommendations } from "@/types/recommendation";

// ============ API Functions ============
const recommendationApi = {
  getForYou: async (limit?: number): Promise<Product[]> => {
    const response = await instance.get("/recommendations/for-you", {
      params: { limit },
    });
    return extractApiData(response);
  },

  getRecentlyViewed: async (limit?: number): Promise<Product[]> => {
    const response = await instance.get("/recommendations/recently-viewed", {
      params: { limit },
    });
    return extractApiData(response);
  },

  getSimilar: async (productId: string, limit?: number): Promise<Product[]> => {
    const response = await instance.get(
      `/recommendations/similar/${productId}`,
      {
        params: { limit },
      }
    );
    return extractApiData(response);
  },

  getFrequentlyBoughtTogether: async (
    productId: string,
    limit?: number
  ): Promise<Product[]> => {
    const response = await instance.get(`/recommendations/fbt/${productId}`, {
      params: { limit },
    });
    return extractApiData(response);
  },

  getCategoryRecommendations: async (
    categoryId: string,
    limit?: number
  ): Promise<Product[]> => {
    const response = await instance.get(
      `/recommendations/category/${categoryId}`,
      {
        params: { limit },
      }
    );
    return extractApiData(response);
  },

  getHomepage: async (): Promise<HomepageRecommendations> => {
    const response = await instance.get("/recommendations/homepage");
    return extractApiData(response);
  },

  // Track product view (mutation)
  trackView: async (productId: string): Promise<void> => {
    await instance.post(`/recommendations/track-view/${productId}`);
  },
};

// ============ Query Hooks ============

/**
 * Get personalized "For You" recommendations
 */
export function useForYouRecommendations(limit?: number) {
  return useQuery({
    queryKey: recommendationKeys.forYou(limit),
    queryFn: () => recommendationApi.getForYou(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get recently viewed products
 */
export function useRecentlyViewed(limit?: number) {
  return useQuery({
    queryKey: recommendationKeys.recentlyViewed(limit),
    queryFn: () => recommendationApi.getRecentlyViewed(limit),
    staleTime: 1 * 60 * 1000, // 1 minute - changes often
  });
}

/**
 * Get similar products
 */
export function useSimilarProducts(
  productId: string,
  limit?: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: recommendationKeys.similar(productId, limit),
    queryFn: () => recommendationApi.getSimilar(productId, limit),
    enabled: options?.enabled ?? !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get frequently bought together products
 */
export function useFrequentlyBoughtTogether(
  productId: string,
  limit?: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: recommendationKeys.frequentlyBoughtTogether(productId, limit),
    queryFn: () =>
      recommendationApi.getFrequentlyBoughtTogether(productId, limit),
    enabled: options?.enabled ?? !!productId,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Get category recommendations
 */
export function useCategoryRecommendations(
  categoryId: string,
  limit?: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: recommendationKeys.category(categoryId, limit),
    queryFn: () =>
      recommendationApi.getCategoryRecommendations(categoryId, limit),
    enabled: options?.enabled ?? !!categoryId,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Get homepage recommendations (all sections)
 */
export function useHomepageRecommendations() {
  return useQuery({
    queryKey: recommendationKeys.homepage(),
    queryFn: recommendationApi.getHomepage,
    staleTime: 5 * 60 * 1000,
  });
}

// ============ Mutation Hooks ============

/**
 * Track product view mutation
 * Call this when user views a product to improve recommendations
 */
export function useTrackProductView() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recommendationApi.trackView,
    onSuccess: () => {
      // Invalidate recently viewed to reflect new view
      queryClient.invalidateQueries({
        queryKey: recommendationKeys.recentlyViewed(),
      });
    },
    onError: (error) => {
      // Silent fail - don't interrupt user experience for tracking
      console.error("Track view failed:", extractApiError(error));
    },
  });
}

// ============ Composite Hooks ============

/**
 * Composite hook for all recommendation operations
 * Combines multiple query hooks for comprehensive recommendation functionality
 */
export function useRecommendation(options?: {
  productId?: string;
  limit?: number;
}) {
  const queryClient = useQueryClient();
  const { productId, limit } = options || {};

  // Track view debouncing
  const trackingQueue = useRef<Set<string>>(new Set());
  const trackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // React Query hooks
  const forYouQuery = useForYouRecommendations(limit);
  const recentlyViewedQuery = useRecentlyViewed(limit);
  const similarQuery = useSimilarProducts(productId || "", limit, {
    enabled: !!productId,
  });
  const fbtQuery = useFrequentlyBoughtTogether(productId || "", limit, {
    enabled: !!productId,
  });
  const homepageQuery = useHomepageRecommendations();

  // Track view mutation
  const trackViewMutation = useTrackProductView();

  // Extract data from queries
  const forYou = forYouQuery.data || [];
  const recentlyViewed = recentlyViewedQuery.data || [];
  const similar = similarQuery.data || [];
  const frequentlyBoughtTogether = fbtQuery.data || [];
  const homepage = homepageQuery.data || null;

  // Refetch functions
  const fetchForYou = useCallback(
    (newLimit?: number) => {
      return forYouQuery.refetch();
    },
    [forYouQuery]
  );

  const fetchRecentlyViewed = useCallback(
    (newLimit?: number) => {
      return recentlyViewedQuery.refetch();
    },
    [recentlyViewedQuery]
  );

  const fetchFBT = useCallback(
    (targetProductId: string, newLimit?: number) => {
      queryClient.invalidateQueries({
        queryKey: recommendationKeys.frequentlyBoughtTogether(
          targetProductId,
          newLimit
        ),
      });
    },
    [queryClient]
  );

  const fetchSimilar = useCallback(
    (targetProductId: string, newLimit?: number) => {
      queryClient.invalidateQueries({
        queryKey: recommendationKeys.similar(targetProductId, newLimit),
      });
    },
    [queryClient]
  );

  const fetchHomepage = useCallback(() => {
    return homepageQuery.refetch();
  }, [homepageQuery]);

  // Track product view - debounced
  const trackView = useCallback(
    (viewProductId: string) => {
      if (trackingQueue.current.has(viewProductId)) return;

      trackingQueue.current.add(viewProductId);

      if (trackTimeout.current) {
        clearTimeout(trackTimeout.current);
      }

      trackTimeout.current = setTimeout(() => {
        trackingQueue.current.forEach((id) => {
          trackViewMutation.mutate(id);
        });
        trackingQueue.current.clear();
      }, 500);
    },
    [trackViewMutation]
  );

  // Reset cache
  const resetCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: recommendationKeys.all });
  }, [queryClient]);

  // Combined loading state
  const isLoading =
    forYouQuery.isLoading ||
    recentlyViewedQuery.isLoading ||
    similarQuery.isLoading ||
    fbtQuery.isLoading ||
    homepageQuery.isLoading;

  // Combined error state
  const error =
    forYouQuery.error ||
    recentlyViewedQuery.error ||
    similarQuery.error ||
    fbtQuery.error ||
    homepageQuery.error;

  return {
    forYou,
    recentlyViewed,
    frequentlyBoughtTogether,
    similar,
    homepage,
    isLoading,
    error: error ? (error as Error).message : null,
    fetchForYou,
    fetchRecentlyViewed,
    fetchFBT,
    fetchSimilar,
    fetchHomepage,
    trackView,
    resetCache,
  };
}
