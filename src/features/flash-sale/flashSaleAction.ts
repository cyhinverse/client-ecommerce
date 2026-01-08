import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddToFlashSalePayload } from "@/types/flash-sale";
import { extractApiData, extractApiError } from "@/utils/api";

// Get active flash sale products
export const getActiveFlashSale = createAsyncThunk(
  "flashSale/getActive",
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await instance.get("/flash-sale", { params });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Get flash sale schedule
export const getFlashSaleSchedule = createAsyncThunk(
  "flashSale/getSchedule",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/flash-sale/schedule");
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Get flash sale by time slot
export const getFlashSaleBySlot = createAsyncThunk(
  "flashSale/getBySlot",
  async (timeSlot: string, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/flash-sale/slot/${timeSlot}`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
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
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
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
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Get flash sale statistics (Admin)
export const getFlashSaleStats = createAsyncThunk(
  "flashSale/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/flash-sale/stats");
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);
