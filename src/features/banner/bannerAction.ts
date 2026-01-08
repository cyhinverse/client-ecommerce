import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateBannerPayload, UpdateBannerPayload } from "@/types/banner";
import { extractApiData, extractApiError } from "@/utils/api";

export const getBanners = createAsyncThunk(
  "banner/getAll",
  async (params: { limit?: number; page?: number; isActive?: boolean } = {}, { rejectWithValue }) => {
    try {
      const response = await instance.get("/banners", { params });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const getBannersAdmin = createAsyncThunk(
  "banner/getAllAdmin",
  async (params: { limit?: number; page?: number; search?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await instance.get("/banners/admin/all", { params });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const createBanner = createAsyncThunk(
  "banner/create",
  async (data: CreateBannerPayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("subtitle", data.subtitle);
      formData.append("theme", data.theme);
      formData.append("order", data.order.toString());
      formData.append("isActive", data.isActive.toString());
      if (data.link) formData.append("link", data.link);
      if (data.imageFile) {
        formData.append("image", data.imageFile);
      }

      const response = await instance.post("/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const updateBanner = createAsyncThunk(
  "banner/update",
  async ({ id, data }: { id: string; data: UpdateBannerPayload }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "imageFile") {
          if (value) formData.append("image", value as File);
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const response = await instance.put(`/banners/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const deleteBanner = createAsyncThunk(
  "banner/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`/banners/${id}`);
      return { id, message: extractApiData<{ message: string }>(response).message || "Deleted" };
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);
