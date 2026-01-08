import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { extractApiData, extractApiError } from "@/utils/api";

// Get personalized recommendations ("Guess You Like")
export const getForYouRecommendations = createAsyncThunk(
  "recommendation/getForYou",
  async (limit: number | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await instance.get("/recommendations/for-you", {
        params: { limit },
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
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
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
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
      return rejectWithValue(extractApiError(error));
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
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
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
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
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
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Get homepage recommendations
export const getHomepageRecommendations = createAsyncThunk(
  "recommendation/getHomepage",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/recommendations/homepage");
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);
