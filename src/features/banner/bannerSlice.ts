import { createSlice } from "@reduxjs/toolkit";
import { getBanners, getBannersAdmin, createBanner, updateBanner, deleteBanner } from "./bannerAction";
import { BannerItem } from "@/types/banner";

interface BannerState {
  banners: BannerItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BannerState = {
  banners: [],
  isLoading: false,
  error: null,
};

export const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Banners
    builder.addCase(getBanners.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getBanners.fulfilled, (state, action) => {
      state.isLoading = false;
      // extractApiData already extracts the data
      const payload = action.payload;
      state.banners = payload?.banners || (Array.isArray(payload) ? payload : []);
    });
    builder.addCase(getBanners.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch banners";
    });

    // Get Banners Admin
    builder.addCase(getBannersAdmin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getBannersAdmin.fulfilled, (state, action) => {
      state.isLoading = false;
      // extractApiData already extracts the data
      const payload = action.payload;
      state.banners = payload?.banners || (Array.isArray(payload) ? payload : []);
    });
    builder.addCase(getBannersAdmin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch banners";
    });

    // Create Banner
    builder.addCase(createBanner.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createBanner.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(createBanner.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to create banner";
    });

    // Update Banner
    builder.addCase(updateBanner.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateBanner.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateBanner.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to update banner";
    });

    // Delete Banner
    builder.addCase(deleteBanner.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteBanner.fulfilled, (state, action) => {
      state.isLoading = false;
      state.banners = state.banners.filter((b) => b._id !== action.payload.id);
    });
    builder.addCase(deleteBanner.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to delete banner";
    });
  },
});

export default bannerSlice.reducer;
