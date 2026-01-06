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

// Get shop information by ID (public)
export const getShopById = createAsyncThunk(
  "shop/getById",
  async (shopId: string, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/shops/${shopId}`);
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không tìm thấy shop";
      return rejectWithValue({ message });
    }
  }
);
