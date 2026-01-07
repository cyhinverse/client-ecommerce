import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { AddToFlashSalePayload } from "@/types/flash-sale";

interface ApiErrorResponse {
  message?: string;
}

// Get active flash sale products
export const getActiveFlashSale = createAsyncThunk(
  "flashSale/getActive",
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await instance.get("/flash-sale", { params });
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy flash sale";
      return rejectWithValue({ message });
    }
  }
);

// Get flash sale schedule
export const getFlashSaleSchedule = createAsyncThunk(
  "flashSale/getSchedule",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/flash-sale/schedule");
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy lịch flash sale";
      return rejectWithValue({ message });
    }
  }
);

// Get flash sale by time slot
export const getFlashSaleBySlot = createAsyncThunk(
  "flashSale/getBySlot",
  async (timeSlot: string, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/flash-sale/slot/${timeSlot}`);
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy flash sale theo khung giờ";
      return rejectWithValue({ message });
    }
  }
);

// Add product to flash sale (Seller/Admin)
export const addToFlashSale = createAsyncThunk(
  "flashSale/addProduct",
  async (
    { productId, data }: { productId: string; data: AddToFlashSalePayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post(`/flash-sale/${productId}`, data);
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể thêm vào flash sale";
      return rejectWithValue({ message });
    }
  }
);

// Remove product from flash sale (Seller/Admin)
export const removeFromFlashSale = createAsyncThunk(
  "flashSale/removeProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      await instance.delete(`/flash-sale/${productId}`);
      return productId;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể xóa khỏi flash sale";
      return rejectWithValue({ message });
    }
  }
);

// Get flash sale statistics (Admin)
export const getFlashSaleStats = createAsyncThunk(
  "flashSale/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/flash-sale/stats");
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy thống kê";
      return rejectWithValue({ message });
    }
  }
);
