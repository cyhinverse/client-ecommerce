import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTreeCategories = createAsyncThunk("category/tree", async () => {
  const response = await instance.get(`/categories/tree`);
  if (!response) {
    throw new Error("Failed to fetch category tree");
  }
  return response.data;
});

export const getAllCategories = createAsyncThunk(
  "category/all",
  async (params: { page?: number; limit?: number; search?: string } = {}) => {
    const { page = 1, limit = 10, search = "" } = params;
    const response = await instance.get(
      `/categories?page=${page}&limit=${limit}&search=${search}`
    );
    if (!response) {
      throw new Error("Failed to fetch all categories");
    }
    return response.data;
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (categoryId: string) => {
    const response = await instance.delete(`/categories/${categoryId}`);
    if (!response) {
      throw new Error("Failed to delete category");
    }
    return response.data;
  }
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async (categoryData: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    isFeatured?: boolean;
  }) => {
    const { id, ...data } = categoryData;
    const response = await instance.put(`/categories/${id}`, data);
    if (!response) {
      throw new Error("Failed to update category");
    }
    return response.data;
  }
);

export const getCategoryById = createAsyncThunk(
  "category/:id",
  async (categoryId: string) => {
    const response = await instance.get(`/categories/${categoryId}`);
    if (!response) {
      throw new Error("Failed to fetch category");
    }
    return response.data;
  }
);
