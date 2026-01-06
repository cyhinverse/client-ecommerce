import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateShippingTemplatePayload, UpdateShippingTemplatePayload } from "@/types/shipping";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

// Get seller's shipping templates
export const getMyShippingTemplates = createAsyncThunk(
  "shipping/getMyTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/shipping");
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy danh sách shipping templates";
      return rejectWithValue({ message });
    }
  }
);

// Create shipping template
export const createShippingTemplate = createAsyncThunk(
  "shipping/create",
  async (data: CreateShippingTemplatePayload, { rejectWithValue }) => {
    try {
      const response = await instance.post("/shipping", data);
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Tạo shipping template thất bại";
      return rejectWithValue({ message });
    }
  }
);

// Update shipping template
export const updateShippingTemplate = createAsyncThunk(
  "shipping/update",
  async (
    { templateId, data }: { templateId: string; data: UpdateShippingTemplatePayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.put(`/shipping/${templateId}`, data);
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Cập nhật shipping template thất bại";
      return rejectWithValue({ message });
    }
  }
);

// Delete shipping template
export const deleteShippingTemplate = createAsyncThunk(
  "shipping/delete",
  async (templateId: string, { rejectWithValue }) => {
    try {
      await instance.delete(`/shipping/${templateId}`);
      return templateId;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Xóa shipping template thất bại";
      return rejectWithValue({ message });
    }
  }
);
