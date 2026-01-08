import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { extractApiData, extractApiError } from "@/utils/api";

export const getTreeCategories = createAsyncThunk(
  "category/tree",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/categories/tree`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const getAllCategories = createAsyncThunk(
  "category/all",
  async (params: { page?: number; limit?: number; search?: string; parentCategory?: string | null } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = "", parentCategory } = params;
      let url = `/categories?page=${page}&limit=${limit}&search=${search}`;
      if (parentCategory !== undefined) {
        url += `&parentCategory=${parentCategory}`;
      }
      const response = await instance.get(url);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`/categories/${categoryId}`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
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
  }, { rejectWithValue }) => {
    try {
      const { id, ...data } = categoryData;
      const response = await instance.put(`/categories/${id}`, data);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const getCategoryById = createAsyncThunk(
  "category/:id",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/categories/${categoryId}`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const statisticsCategories = createAsyncThunk(
  "category/statistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/categories/statistics`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const creatCategory = createAsyncThunk(
  "category/create",
  async (category: {
    name: string;
    slug: string;
    description?: string;
    images: string[];
    isActive?: boolean;
    parentCategory?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/categories`, category);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);
