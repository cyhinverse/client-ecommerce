import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateShopCategoryPayload, UpdateShopCategoryPayload } from "@/types/shopCategory";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

// Get shop categories (by shop ID for public, or seller's own)
export const getShopCategories = createAsyncThunk(
  "shopCategory/getAll",
  async (shopId: string | undefined, { rejectWithValue }) => {
    try {
      const url = shopId ? `/shop-categories/shop/${shopId}` : "/shop-categories";
      const response = await instance.get(url);
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy danh mục shop";
      return rejectWithValue({ message });
    }
  }
);

// Create shop category
export const createShopCategory = createAsyncThunk(
  "shopCategory/create",
  async (data: CreateShopCategoryPayload, { rejectWithValue }) => {
    try {
      const response = await instance.post("/shop-categories", data);
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Tạo danh mục thất bại";
      return rejectWithValue({ message });
    }
  }
);

// Update shop category
export const updateShopCategory = createAsyncThunk(
  "shopCategory/update",
  async (
    { categoryId, data }: { categoryId: string; data: UpdateShopCategoryPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.put(`/shop-categories/${categoryId}`, data);
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Cập nhật danh mục thất bại";
      return rejectWithValue({ message });
    }
  }
);

// Delete shop category
export const deleteShopCategory = createAsyncThunk(
  "shopCategory/delete",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      await instance.delete(`/shop-categories/${categoryId}`);
      return categoryId;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Xóa danh mục thất bại";
      return rejectWithValue({ message });
    }
  }
);
