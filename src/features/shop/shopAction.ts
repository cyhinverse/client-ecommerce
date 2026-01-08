import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateShopPayload, UpdateShopPayload } from "@/types/shop";
import { extractApiData, extractApiError } from "@/utils/api";

// Get all shops (admin only)
export const getAllShops = createAsyncThunk(
  "shop/getAllShops",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/shops");
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Register a new shop (become a seller)
export const registerShop = createAsyncThunk(
  "shop/register",
  async (data: CreateShopPayload, { rejectWithValue }) => {
    try {
      const response = await instance.post("/shops/register", data);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Get current user's shop information
export const getMyShop = createAsyncThunk(
  "shop/getMyShop",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/shops/me");
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Update current user's shop information
export const updateShop = createAsyncThunk(
  "shop/update",
  async (data: UpdateShopPayload, { rejectWithValue }) => {
    try {
      const response = await instance.put("/shops", data);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Get shop information by ID or slug (public)
export const getShopById = createAsyncThunk(
  "shop/getById",
  async (shopIdOrSlug: string, { rejectWithValue }) => {
    try {
      // Check if it's a MongoDB ObjectId (24 hex characters)
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(shopIdOrSlug);
      const url = isObjectId ? `/shops/${shopIdOrSlug}` : `/shops/slug/${shopIdOrSlug}`;
      const response = await instance.get(url);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Upload shop image (logo or banner) - for existing shops
export const uploadShopImage = createAsyncThunk(
  "shop/uploadImage",
  async (params: { file: File; type: "logo" | "banner" }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", params.file);
      formData.append("type", params.type);

      const response = await instance.post("/shops/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = extractApiData<{ url?: string }>(response);
      if (data?.url) {
        return { type: params.type, url: data.url };
      }
      throw new Error("Upload failed - no URL returned");
    } catch (error) {
      const apiError = extractApiError(error);
      return rejectWithValue({ ...apiError, type: params.type });
    }
  }
);

// Upload image during shop registration (doesn't require seller role)
export const uploadRegisterImage = createAsyncThunk(
  "shop/uploadRegisterImage",
  async (params: { file: File; type: "logo" | "banner" }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", params.file);
      formData.append("type", params.type);

      const response = await instance.post("/shops/upload-register-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = extractApiData<{ url?: string }>(response);
      if (data?.url) {
        return { type: params.type, url: data.url };
      }
      throw new Error("Upload failed - no URL returned");
    } catch (error) {
      const apiError = extractApiError(error);
      return rejectWithValue({ ...apiError, type: params.type });
    }
  }
);