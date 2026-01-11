/**
 * Voucher React Query Hooks
 * Replaces voucherAction.ts async thunks with React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/api/api";
import { extractApiData, extractApiError } from "@/api";
import { voucherKeys } from "@/lib/queryKeys";
import { errorHandler } from "@/services/errorHandler";
import { STALE_TIME } from "@/constants/cache";
import {
  Voucher,
  CreateVoucherData,
  UpdateVoucherData,
  VoucherFilters,
  VoucherScope,
  ApplyVoucherResult,
  VoucherStatistics,
} from "@/types/voucher";

// ============ Types ============
export interface VoucherListResponse {
  vouchers: Voucher[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============ API Functions ============
const voucherApi = {
  getAll: async (
    params?: Partial<VoucherFilters>
  ): Promise<VoucherListResponse> => {
    const response = await instance.get("/vouchers", { params });
    const data = extractApiData(response);
    // Handle different response formats
    if (Array.isArray(data)) {
      return {
        vouchers: data,
        pagination: {
          page: 1,
          limit: data.length,
          total: data.length,
          totalPages: 1,
        },
      };
    }
    return {
      vouchers: data?.data || data?.vouchers || [],
      pagination: data?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  },

  getById: async (id: string): Promise<Voucher> => {
    const response = await instance.get(`/vouchers/${id}`);
    return extractApiData(response);
  },

  getAvailable: async (params: {
    orderTotal: number;
    shopId?: string;
    scope?: VoucherScope;
  }): Promise<Voucher[]> => {
    const response = await instance.get("/vouchers/available", { params });
    return extractApiData(response);
  },

  getStatistics: async (): Promise<VoucherStatistics> => {
    const response = await instance.get("/vouchers/statistics");
    return extractApiData(response);
  },

  create: async (data: CreateVoucherData): Promise<Voucher> => {
    const response = await instance.post("/vouchers", data);
    return extractApiData(response);
  },

  update: async ({
    id,
    ...data
  }: UpdateVoucherData & { id: string }): Promise<Voucher> => {
    const response = await instance.put(`/vouchers/${id}`, data);
    return extractApiData(response);
  },

  delete: async (id: string): Promise<string> => {
    await instance.delete(`/vouchers/${id}`);
    return id;
  },

  apply: async (params: {
    code: string;
    orderTotal: number;
    shopId?: string;
  }): Promise<ApplyVoucherResult> => {
    const response = await instance.post("/vouchers/apply", {
      code: params.code,
      orderValue: params.orderTotal,
      shopId: params.shopId,
    });
    return extractApiData(response);
  },
};

// ============ Query Hooks ============

/**
 * Get all vouchers with pagination and filters
 */
export function useVouchers(params?: Partial<VoucherFilters>) {
  return useQuery({
    queryKey: voucherKeys.list(params),
    queryFn: () => voucherApi.getAll(params),
    staleTime: STALE_TIME.LONG,
  });
}

/**
 * Get voucher by ID
 */
export function useVoucher(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: voucherKeys.detail(id),
    queryFn: () => voucherApi.getById(id),
    enabled: options?.enabled ?? !!id,
    staleTime: STALE_TIME.VERY_LONG,
  });
}

/**
 * Get available vouchers for checkout
 */
export function useAvailableVouchers(
  params: { orderTotal: number; shopId?: string; scope?: VoucherScope },
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: voucherKeys.available(params),
    queryFn: () => voucherApi.getAvailable(params),
    enabled: options?.enabled ?? params.orderTotal > 0,
    staleTime: STALE_TIME.MEDIUM,
  });
}

/**
 * Get voucher statistics (Admin)
 */
export function useVoucherStatistics() {
  return useQuery({
    queryKey: voucherKeys.statistics(),
    queryFn: voucherApi.getStatistics,
    staleTime: STALE_TIME.VERY_LONG,
  });
}

// ============ Mutation Hooks ============

/**
 * Create voucher mutation (Admin)
 */
export function useCreateVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voucherApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voucherKeys.lists() });
      queryClient.invalidateQueries({ queryKey: voucherKeys.statistics() });
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Create voucher failed" });
    },
  });
}

/**
 * Update voucher mutation (Admin)
 */
export function useUpdateVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voucherApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: voucherKeys.lists() });
      queryClient.setQueryData(voucherKeys.detail(data._id), data);
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Update voucher failed" });
    },
  });
}

/**
 * Delete voucher mutation (Admin)
 */
export function useDeleteVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voucherApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voucherKeys.lists() });
      queryClient.invalidateQueries({ queryKey: voucherKeys.statistics() });
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Delete voucher failed" });
    },
  });
}

/**
 * Apply voucher code mutation
 */
export function useApplyVoucher() {
  return useMutation({
    mutationFn: voucherApi.apply,
    onError: (error) => {
      errorHandler.log(error, { context: "Apply voucher failed" });
    },
  });
}
