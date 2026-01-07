import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

// Get user's wishlist
export const getWishlist = createAsyncThunk(
  "wishlist/getAll",
  async (
    params: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get("/wishlist", { params });
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy danh sách yêu thích";
      return rejectWithValue({ message });
    }
  }
);

// Add product to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/wishlist/${productId}`);
      return { ...(response.data.data || response.data), productId };
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể thêm vào yêu thích";
      return rejectWithValue({ message });
    }
  }
);

// Remove product from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId: string, { rejectWithValue }) => {
    try {
      await instance.delete(`/wishlist/${productId}`);
      return productId;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể xóa khỏi yêu thích";
      return rejectWithValue({ message });
    }
  }
);

// Get wishlist count
export const getWishlistCount = createAsyncThunk(
  "wishlist/getCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/wishlist/count");
      return response.data.data?.count || 0;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy số lượng";
      return rejectWithValue({ message });
    }
  }
);

// Check if product is in wishlist
export const checkInWishlist = createAsyncThunk(
  "wishlist/check",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/wishlist/check/${productId}`);
      return { productId, isInWishlist: response.data.data?.isInWishlist || false };
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể kiểm tra";
      return rejectWithValue({ message });
    }
  }
);

// Check multiple products in wishlist
export const checkMultipleInWishlist = createAsyncThunk(
  "wishlist/checkMultiple",
  async (productIds: string[], { rejectWithValue }) => {
    try {
      const response = await instance.post("/wishlist/check-multiple", { productIds });
      return response.data.data || {};
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể kiểm tra";
      return rejectWithValue({ message });
    }
  }
);

// Clear entire wishlist
export const clearWishlist = createAsyncThunk(
  "wishlist/clear",
  async (_, { rejectWithValue }) => {
    try {
      await instance.delete("/wishlist");
      return true;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể xóa danh sách";
      return rejectWithValue({ message });
    }
  }
);
