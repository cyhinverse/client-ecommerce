import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateShopPayload, UpdateShopPayload } from "@/types/shop";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

// Register a new shop (become a seller)
export const registerShop = createAsyncThunk(
  "shop/register",
  async (data: CreateShopPayload, { rejectWithValue }) => {
    try {
      const response = await instance.post("/shops/register", data);
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Đăng ký shop thất bại";
      return rejectWithValue({ message });
    }
  }
);

// Get current user's shop information
export const getMyShop = createAsyncThunk(
  "shop/getMyShop",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/shops/me");
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy thông tin shop";
      return rejectWithValue({ message });
    }
  }
);

// Update current user's shop information
export const updateShop = createAsyncThunk(
  "shop/update",
  async (data: UpdateShopPayload, { rejectWithValue }) => {
    try {
      const response = await instance.put("/shops", data);
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Cập nhật shop thất bại";
      return rejectWithValue({ message });
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
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không tìm thấy shop";
      return rejectWithValue({ message });
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

      if (response.data?.data?.url) {
        return { type: params.type, url: response.data.data.url };
      }
      throw new Error("Upload failed - no URL returned");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || `Upload ${params.type} thất bại`;
      return rejectWithValue({ message, type: params.type });
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

      if (response.data?.data?.url) {
        return { type: params.type, url: response.data.data.url };
      }
      throw new Error("Upload failed - no URL returned");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || `Upload ${params.type} thất bại`;
      return rejectWithValue({ message, type: params.type });
    }
  }
);