/**
 * Review React Query Hooks
 * Replaces reviewAction.ts async thunks with React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/api/api";
import { extractApiData, extractApiError } from "@/api";
import { errorHandler } from "@/services/errorHandler";
import { STALE_TIME } from "@/constants/cache";
import { reviewKeys, productKeys } from "@/lib/queryKeys";
import { PaginationData } from "@/types/common";

// ============ Types ============
export interface Review {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar?: string;
  };
  product:
    | string
    | {
        _id: string;
        name: string;
        slug?: string;
        images?: string[];
      };
  rating: number;
  comment: string;
  reply?: string;
  replyAt?: string;
  images?: string[];
  createdAt: string;

  updatedAt: string;
}

export interface ReviewListParams {
  page?: number;
  limit?: number;
  rating?: number;
}

export interface ReviewListResponse {
  reviews: Review[];
  pagination: PaginationData | null;
  averageRating?: number;
  totalReviews?: number;
  ratingDistribution?: Record<number, number>;
}

export interface CreateReviewData {
  productId: string;
  rating: number;
  comment: string;
  images?: string[];
}

export interface UpdateReviewData {
  reviewId: string;
  rating?: number;
  comment?: string;
  images?: string[];
}

// ============ API Functions ============
const reviewApi = {
  getByProduct: async (
    productId: string,
    params: ReviewListParams = {}
  ): Promise<ReviewListResponse> => {
    const { page = 1, limit = 10 } = params;
    const response = await instance.get(`/reviews/product/${productId}`, {
      params: { page, limit },
    });
    const data = extractApiData<
      ReviewListResponse & {
        data?: Review[];
        metadata?: {
          ratingDistribution?: Record<number, number>;
          averageRating?: number;
          totalReviews?: number;
        };
      }
    >(response);
    // Handle both old format (flat) and new format (metadata object)
    const metadata = data?.metadata;
    return {
      reviews: data?.reviews || data?.data || [],
      pagination: data?.pagination || null,
      averageRating: metadata?.averageRating ?? data?.averageRating,
      totalReviews: metadata?.totalReviews ?? data?.totalReviews,
      ratingDistribution:
        metadata?.ratingDistribution ?? data?.ratingDistribution,
    };
  },

  getByShop: async (
    shopId: string,
    params: ReviewListParams = {}
  ): Promise<ReviewListResponse> => {
    const { page = 1, limit = 10 } = params;
    const response = await instance.get(`/reviews/shop/${shopId}`, {
      params: { page, limit },
    });
    const data = extractApiData<ReviewListResponse & { data?: Review[] }>(
      response
    );
    return {
      reviews: data?.reviews || data?.data || [],
      pagination: data?.pagination || null,
    };
  },

  getUserReviews: async (): Promise<Review[]> => {
    const response = await instance.get("/reviews/user/me");
    return extractApiData(response);
  },

  // Seller APIs
  getMyShopReviews: async (params: ReviewListParams = {}): Promise<ReviewListResponse> => {
    const { page = 1, limit = 10, rating } = params;
    const response = await instance.get("/reviews/seller/me", {
      params: { page, limit, rating },
    });
    return extractApiData(response);
  },

  replyReview: async (data: { reviewId: string; content: string }) => {
    const response = await instance.post(
      `/reviews/seller/${data.reviewId}/reply`,
      { content: data.content }
    );
    return extractApiData(response);
  },

  // Mutations

  create: async (data: CreateReviewData): Promise<Review> => {
    const response = await instance.post("/reviews", data);
    return extractApiData(response);
  },

  update: async (data: UpdateReviewData): Promise<Review> => {
    const { reviewId, ...updateData } = data;
    const response = await instance.put(`/reviews/${reviewId}`, updateData);
    return extractApiData(response);
  },

  delete: async (reviewId: string): Promise<void> => {
    await instance.delete(`/reviews/${reviewId}`);
  },
};

// ============ Query Hooks ============

/**
 * Get reviews for a product
 */
export function useProductReviews(
  productId: string,
  params?: ReviewListParams
) {
  return useQuery({
    queryKey: reviewKeys.product(productId, params),
    queryFn: () => reviewApi.getByProduct(productId, params),
    enabled: !!productId,
    staleTime: STALE_TIME.VERY_LONG,
  });
}

/**
 * Get reviews for a shop
 */
export function useShopReviews(shopId: string, params?: ReviewListParams) {
  return useQuery({
    queryKey: reviewKeys.shop(shopId, params),
    queryFn: () => reviewApi.getByShop(shopId, params),
    enabled: !!shopId,
    staleTime: STALE_TIME.VERY_LONG,
  });
}

/**
 * Get current user's reviews
 */
export function useUserReviews() {
  return useQuery({
    queryKey: reviewKeys.user(),
    queryFn: reviewApi.getUserReviews,
    staleTime: STALE_TIME.VERY_LONG,
  });
}

/**
 * Get reviews for seller's own shop
 */
export function useMyShopReviews(params?: ReviewListParams) {
  return useQuery({
    queryKey: reviewKeys.seller(params),
    queryFn: () => reviewApi.getMyShopReviews(params),
    staleTime: STALE_TIME.SHORT,
  });
}

/**
 * Reply to review mutation
 */
export function useReplyReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApi.replyReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.seller() });
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Reply review failed" });
    },
  });
}

// ============ Mutation Hooks ============


/**
 * Create review mutation
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApi.create,
    onSuccess: (_, variables) => {
      // Invalidate product reviews
      queryClient.invalidateQueries({
        queryKey: reviewKeys.product(variables.productId),
      });
      // Invalidate product detail to update rating
      queryClient.invalidateQueries({
        queryKey: productKeys.detailById(variables.productId),
      });
      // Invalidate user reviews
      queryClient.invalidateQueries({ queryKey: reviewKeys.user() });
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Create review failed" });
    },
  });
}

/**
 * Update review mutation
 */
export function useUpdateReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.product(productId),
      });
      queryClient.invalidateQueries({ queryKey: reviewKeys.user() });
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Update review failed" });
    },
  });
}

/**
 * Delete review mutation
 */
export function useDeleteReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.product(productId),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.detailById(productId),
      });
      queryClient.invalidateQueries({ queryKey: reviewKeys.user() });
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Delete review failed" });
    },
  });
}
