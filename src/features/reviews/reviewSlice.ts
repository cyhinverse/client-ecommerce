import { createSlice } from "@reduxjs/toolkit";
import { reviews } from "../../types/product";

interface ReviewState {
  reviews: reviews[];
  isLoading: boolean;
  error: string | null;
}

const initState: ReviewState = {
  reviews: [],
  isLoading: false,
  error: null,
};

export const reviewSlice = createSlice({
  name: "review",
  initialState: initState,
  reducers: {},
});
