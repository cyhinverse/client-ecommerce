import { createSlice } from "@reduxjs/toolkit";
import { RecommendationState } from "@/types/recommendation";
import {
  getForYouRecommendations,
  getRecentlyViewed,
  getFrequentlyBoughtTogether,
  getSimilarProducts,
  getHomepageRecommendations,
} from "./recommendationAction";

const initialState: RecommendationState = {
  forYou: [],
  recentlyViewed: [],
  frequentlyBoughtTogether: [],
  similar: [],
  homepage: null,
  isLoading: false,
  error: null,
};

export const recommendationSlice = createSlice({
  name: "recommendation",
  initialState,
  reducers: {
    resetRecommendationState: () => initialState,
    clearRecommendationError: (state) => {
      state.error = null;
    },
    clearSimilar: (state) => {
      state.similar = [];
    },
    clearFBT: (state) => {
      state.frequentlyBoughtTogether = [];
    },
  },
  extraReducers: (builder) => {
    // =========================== GET FOR YOU ===========================
    builder.addCase(getForYouRecommendations.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getForYouRecommendations.fulfilled, (state, action) => {
      state.isLoading = false;
      state.forYou = action.payload || [];
    });
    builder.addCase(getForYouRecommendations.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as { message: string })?.message || "Lỗi khi lấy gợi ý";
    });

    // =========================== GET RECENTLY VIEWED ===========================
    builder.addCase(getRecentlyViewed.fulfilled, (state, action) => {
      state.recentlyViewed = action.payload || [];
    });
    builder.addCase(getRecentlyViewed.rejected, (state, action) => {
      state.error = (action.payload as { message: string })?.message || "Lỗi khi lấy sản phẩm đã xem";
    });

    // =========================== GET FBT ===========================
    builder.addCase(getFrequentlyBoughtTogether.fulfilled, (state, action) => {
      state.frequentlyBoughtTogether = action.payload || [];
    });
    builder.addCase(getFrequentlyBoughtTogether.rejected, (state, action) => {
      state.error = (action.payload as { message: string })?.message || "Lỗi khi lấy sản phẩm thường mua cùng";
    });

    // =========================== GET SIMILAR ===========================
    builder.addCase(getSimilarProducts.fulfilled, (state, action) => {
      state.similar = action.payload || [];
    });
    builder.addCase(getSimilarProducts.rejected, (state, action) => {
      state.error = (action.payload as { message: string })?.message || "Lỗi khi lấy sản phẩm tương tự";
    });

    // =========================== GET HOMEPAGE ===========================
    builder.addCase(getHomepageRecommendations.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getHomepageRecommendations.fulfilled, (state, action) => {
      state.isLoading = false;
      state.homepage = action.payload;
    });
    builder.addCase(getHomepageRecommendations.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as { message: string })?.message || "Lỗi khi lấy gợi ý trang chủ";
    });
  },
});

export const {
  resetRecommendationState,
  clearRecommendationError,
  clearSimilar,
  clearFBT,
} = recommendationSlice.actions;

export default recommendationSlice.reducer;
