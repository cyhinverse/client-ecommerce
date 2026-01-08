import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { extractApiData, extractApiError } from "@/utils/api";

// Get reviews for a product
export const getProductReviews = createAsyncThunk(
  "review/getByProduct",
  async (
    { 
      productId, 
      page = 1, 
      limit = 10 
    }: { 
      productId: string; 
      page?: number; 
      limit?: number 
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get(`/reviews/product/${productId}`, {
        params: { page, limit }
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

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
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);
