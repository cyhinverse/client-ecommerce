/**
 * Category React Query Hooks
 * Replaces categoryAction.ts async thunks with React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/api/api";
import { extractApiData, extractApiError } from "@/utils/api";
import { categoryKeys } from "@/lib/queryKeys";
import { Category, CategoriesResponse } from "@/types/category";

// ============ Types ============
export interface CategoryListParams {
  page?: number;
  limit?: number;
  search?: string;
  parentCategory?: string | null;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  images: string[];
  isActive?: boolean;
  parentCategory?: string;
}

export interface UpdateCategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  isFeatured?: boolean;
}

// Tree category type (with children)
export interface CategoryTree extends Category {
  children?: CategoryTree[];
}

// ============ API Functions ============
const categoryApi = {
  getTree: async (): Promise<CategoryTree[]> => {
    const response = await instance.get("/categories/tree");
    return extractApiData(response);
  },

  getAll: async (
    params: CategoryListParams = {}
  ): Promise<CategoriesResponse> => {
    const { page = 1, limit = 10, search = "", parentCategory } = params;
    let url = `/categories?page=${page}&limit=${limit}&search=${search}`;
    if (parentCategory !== undefined) {
      url += `&parentCategory=${parentCategory}`;
    }
    const response = await instance.get(url);
    return extractApiData(response);
  },

  getById: async (categoryId: string): Promise<Category> => {
    const response = await instance.get(`/categories/${categoryId}`);
    return extractApiData(response);
  },

  getStatistics: async (): Promise<{
    categories: Category[];
    totalProducts: number;
  }> => {
    const response = await instance.get("/categories/statistics");
    return extractApiData(response);
  },

  // Mutations
  create: async (data: CreateCategoryData): Promise<Category> => {
    const response = await instance.post("/categories", data);
    return extractApiData(response);
  },

  update: async (data: UpdateCategoryData): Promise<Category> => {
    const { id, ...updateData } = data;
    const response = await instance.put(`/categories/${id}`, updateData);
    return extractApiData(response);
  },

  delete: async (categoryId: string): Promise<void> => {
    await instance.delete(`/categories/${categoryId}`);
  },
};

// ============ Query Hooks ============

/**
 * Get category tree (hierarchical structure)
 * Used for navigation menus, category selectors
 */
export function useCategoryTree() {
  return useQuery({
    queryKey: categoryKeys.tree(),
    queryFn: categoryApi.getTree,
    staleTime: 30 * 60 * 1000, // 30 minutes - categories change rarely
    gcTime: 60 * 60 * 1000, // 1 hour cache
  });
}

/**
 * Get all categories with pagination and filters
 */
export function useCategories(params: CategoryListParams = {}) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryApi.getAll(params),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Get category by ID
 */
export function useCategory(
  categoryId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: categoryKeys.detail(categoryId),
    queryFn: () => categoryApi.getById(categoryId),
    enabled: options?.enabled ?? !!categoryId,
  });
}

/**
 * Get category statistics
 */
export function useCategoryStatistics() {
  return useQuery({
    queryKey: categoryKeys.statistics(),
    queryFn: categoryApi.getStatistics,
    staleTime: 5 * 60 * 1000,
  });
}

// ============ Mutation Hooks ============

/**
 * Create category mutation
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => {
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (error) => {
      console.error("Create category failed:", extractApiError(error));
    },
  });
}

/**
 * Update category mutation
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.update,
    onSuccess: (data, variables) => {
      // Update specific category in cache
      queryClient.setQueryData(categoryKeys.detail(variables.id), data);
      // Invalidate lists and tree
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
    },
    onError: (error) => {
      console.error("Update category failed:", extractApiError(error));
    },
  });
}

/**
 * Delete category mutation
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (error) => {
      console.error("Delete category failed:", extractApiError(error));
    },
  });
}
