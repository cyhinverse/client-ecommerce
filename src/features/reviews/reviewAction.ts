import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface ApiErrorResponse {
  message?: string;
}

export const createReview = createAsyncThunk(
  "review/create",
  async (
    {
      productId,
      rating,
      comment,
    }: { productId: string; rating: number; comment: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post(
        `/reviews/`,
        { productId, rating, comment },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as { response?: { data?: ApiErrorResponse } };
      const message =
        axiosError.response?.data?.message || "Failed to create review";
      return rejectWithValue({ message });
    }
  }
);
