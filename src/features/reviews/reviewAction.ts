import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

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
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create review";
      return rejectWithValue({ message });
    }
  }
);
