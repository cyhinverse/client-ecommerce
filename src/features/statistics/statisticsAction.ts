import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "@/api/api";

export const getDashboardStats = createAsyncThunk(
  "statistics/getDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/statistics/dashboard");
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      if (err.response && err.response.data && err.response.data.message) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue(err.message || "An unknown error occurred");
      }
    }
  }
);
