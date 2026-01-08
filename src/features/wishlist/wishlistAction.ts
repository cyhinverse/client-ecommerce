import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { extractApiData, extractApiError } from "@/utils/api";

// Get user's wishlist
export const getWishlist = createAsyncThunk(
  "wishlist/getAll",
  async (
    params: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get("/wishlist", { params });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Add product to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/wishlist/${productId}`);
      return { ...extractApiData(response), productId };
    } catch (error) {
      return rejectWithValue(extractApiError(error));
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
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Get wishlist count
export const getWishlistCount = createAsyncThunk(
  "wishlist/getCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/wishlist/count");
      const data = extractApiData<{ count?: number }>(response);
      return data?.count || 0;
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Check if product is in wishlist
export const checkInWishlist = createAsyncThunk(
  "wishlist/check",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/wishlist/check/${productId}`);
      const data = extractApiData<{ isInWishlist?: boolean }>(response);
      return { productId, isInWishlist: data?.isInWishlist || false };
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Check multiple products in wishlist
export const checkMultipleInWishlist = createAsyncThunk(
  "wishlist/checkMultiple",
  async (productIds: string[], { rejectWithValue }) => {
    try {
      const response = await instance.post("/wishlist/check-multiple", { productIds });
      return extractApiData(response) || {};
    } catch (error) {
      return rejectWithValue(extractApiError(error));
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
      return rejectWithValue(extractApiError(error));
    }
  }
);
