import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { SearchParams } from "@/types/search";

interface ApiErrorResponse {
  message?: string;
}

// Get search suggestions (autocomplete)
export const getSearchSuggestions = createAsyncThunk(
  "search/getSuggestions",
  async (params: { q: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await instance.get("/search/suggestions", { params });
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy gợi ý";
      return rejectWithValue({ message });
    }
  }
);

// Get trending searches
export const getTrendingSearches = createAsyncThunk(
  "search/getTrending",
  async (limit: number | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await instance.get("/search/trending", {
        params: { limit },
      });
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy xu hướng tìm kiếm";
      return rejectWithValue({ message });
    }
  }
);

// Get hot keywords
export const getHotKeywords = createAsyncThunk(
  "search/getHotKeywords",
  async (limit: number | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await instance.get("/search/hot-keywords", {
        params: { limit },
      });
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy từ khóa hot";
      return rejectWithValue({ message });
    }
  }
);

// Advanced search with filters
export const advancedSearch = createAsyncThunk(
  "search/advanced",
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const response = await instance.get("/search", { params });
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Tìm kiếm thất bại";
      return rejectWithValue({ message });
    }
  }
);
