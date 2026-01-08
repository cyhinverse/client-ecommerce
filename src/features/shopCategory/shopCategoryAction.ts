import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateShopCategoryPayload, UpdateShopCategoryPayload } from "@/types/shopCategory";
import { extractApiData, extractApiError } from "@/utils/api";

// Get shop categories (by shop ID for public, or seller's own)
export const getShopCategories = createAsyncThunk(
  "shopCategory/getAll",
  async (shopId: string | undefined, { rejectWithValue }) => {
    try {
      // If shopId provided, get public shop categories; otherwise get seller's own
      const url = shopId ? `/shop-categories/${shopId}` : "/shop-categories/my";
      const response = await instance.get(url);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Create shop category
export const createShopCategory = createAsyncThunk(
  "shopCategory/create",
  async (data: CreateShopCategoryPayload, { rejectWithValue }) => {
    try {
      const response = await instance.post("/shop-categories", data);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
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
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
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
      return rejectWithValue(extractApiError(error));
    }
  }
);
