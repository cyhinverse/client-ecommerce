import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@/api/api";
import { extractApiData, extractApiError } from "@/utils/api";

export const getDashboardStats = createAsyncThunk(
  "statistics/getDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/statistics/dashboard");
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);
