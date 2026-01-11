/**
 * Voucher React Query Hooks
 * Replaces voucherAction.ts async thunks with React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/api/api";
import { extractApiData, extractApiError } from "@/utils/api";
import {
  Voucher,
  CreateVoucherData,
  UpdateVoucherData,
  VoucherFilters,
  VoucherScope,
  ApplyVoucherResult,
  VoucherStatistics,
} from "@/types/voucher";

// ============ Query Keys ============
export const voucherKeys = {
  all: ["vouchers"] as const,
  lists: () => [...voucherKeys.all, "list"] as const,
  list: (params?: Partial<VoucherFilters>) =>
    [...voucherKeys.lists(), params] as const,
  detail: (id: string) => [...voucherKeys.all, "detail", id] as const,
  available: (params: {
    orderTotal: number;
    shopId?: string;
    scope?: VoucherScope;
  }) => [...voucherKeys.all, "available", params] as const,
  statistics: () => [...voucherKeys.all, "statistics"] as const,
};

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
    staleTime: 2 * 60 * 1000, // 2 minutes
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
    staleTime: 5 * 60 * 1000,
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
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Get voucher statistics (Admin)
 */
export function useVoucherStatistics() {
  return useQuery({
    queryKey: voucherKeys.statistics(),
    queryFn: voucherApi.getStatistics,
    staleTime: 5 * 60 * 1000,
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
      console.error("Create voucher failed:", extractApiError(error));
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
      console.error("Update voucher failed:", extractApiError(error));
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
      console.error("Delete voucher failed:", extractApiError(error));
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
      console.error("Apply voucher failed:", extractApiError(error));
    },
  });
}
