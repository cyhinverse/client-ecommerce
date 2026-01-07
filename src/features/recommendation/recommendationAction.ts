import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

// Get personalized recommendations ("Guess You Like")
export const getForYouRecommendations = createAsyncThunk(
  "recommendation/getForYou",
  async (limit: number | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await instance.get("/recommendations/for-you", {
        params: { limit },
      });
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy gợi ý";
      return rejectWithValue({ message });
    }
  }
);

// Get recently viewed products
export const getRecentlyViewed = createAsyncThunk(
  "recommendation/getRecentlyViewed",
  async (limit: number | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await instance.get("/recommendations/recently-viewed", {
        params: { limit },
      });
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy sản phẩm đã xem";
      return rejectWithValue({ message });
    }
  }
);

// Track product view
export const trackProductView = createAsyncThunk(
  "recommendation/trackView",
  async (productId: string, { rejectWithValue }) => {
    try {
      await instance.post(`/recommendations/track-view/${productId}`);
      return productId;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể theo dõi";
      return rejectWithValue({ message });
    }
  }
);

// Get frequently bought together
export const getFrequentlyBoughtTogether = createAsyncThunk(
  "recommendation/getFBT",
  async (
    { productId, limit }: { productId: string; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get(`/recommendations/fbt/${productId}`, {
        params: { limit },
      });
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy sản phẩm thường mua cùng";
      return rejectWithValue({ message });
    }
  }
);

// Get similar products
export const getSimilarProducts = createAsyncThunk(
  "recommendation/getSimilar",
  async (
    { productId, limit }: { productId: string; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get(`/recommendations/similar/${productId}`, {
        params: { limit },
      });
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy sản phẩm tương tự";
      return rejectWithValue({ message });
    }
  }
);

// Get category recommendations
export const getCategoryRecommendations = createAsyncThunk(
  "recommendation/getCategory",
  async (
    { categoryId, limit }: { categoryId: string; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get(`/recommendations/category/${categoryId}`, {
        params: { limit },
      });
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy gợi ý theo danh mục";
      return rejectWithValue({ message });
    }
  }
);

// Get homepage recommendations
export const getHomepageRecommendations = createAsyncThunk(
  "recommendation/getHomepage",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/recommendations/homepage");
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy gợi ý trang chủ";
      return rejectWithValue({ message });
    }
  }
);
