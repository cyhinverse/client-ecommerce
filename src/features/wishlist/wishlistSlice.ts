import { createSlice } from "@reduxjs/toolkit";
import { WishlistState } from "@/types/wishlist";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getWishlistCount,
  checkInWishlist,
  checkMultipleInWishlist,
  clearWishlist,
} from "./wishlistAction";

const initialState: WishlistState = {
  items: [],
  pagination: null,
  isLoading: false,
  error: null,
  count: 0,
  wishlistMap: {},
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlistState: () => initialState,
    clearWishlistError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // =========================== GET WISHLIST ===========================
    builder.addCase(getWishlist.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getWishlist.fulfilled, (state, action) => {
      state.isLoading = false;
      // extractApiData already extracts the data
      const payload = action.payload;
      const items = payload?.data || payload || [];
      state.items = Array.isArray(items) ? items : [];
      state.pagination = payload?.pagination || null;
      state.count = payload?.pagination?.totalItems || state.items.length;
      // Update wishlist map
      const map: Record<string, boolean> = {};
      state.items.forEach((item: { _id: string }) => {
        map[item._id] = true;
      });
      state.wishlistMap = map;
    });
    builder.addCase(getWishlist.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as { message: string })?.message || "Lỗi khi lấy danh sách yêu thích";
    });

    // =========================== ADD TO WISHLIST ===========================
    builder.addCase(addToWishlist.pending, (state) => {
      state.error = null;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      state.count = action.payload.wishlistCount || state.count + 1;
      state.wishlistMap[action.payload.productId] = true;
    });
    builder.addCase(addToWishlist.rejected, (state, action) => {
      state.error = (action.payload as { message: string })?.message || "Không thể thêm vào yêu thích";
    });

    // =========================== REMOVE FROM WISHLIST ===========================
    builder.addCase(removeFromWishlist.pending, (state) => {
      state.error = null;
    });
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.count = Math.max(0, state.count - 1);
      delete state.wishlistMap[action.payload];
    });
    builder.addCase(removeFromWishlist.rejected, (state, action) => {
      state.error = (action.payload as { message: string })?.message || "Không thể xóa khỏi yêu thích";
    });

    // =========================== GET COUNT ===========================
    builder.addCase(getWishlistCount.fulfilled, (state, action) => {
      state.count = action.payload;
    });

    // =========================== CHECK IN WISHLIST ===========================
    builder.addCase(checkInWishlist.fulfilled, (state, action) => {
      state.wishlistMap[action.payload.productId] = action.payload.isInWishlist;
    });

    // =========================== CHECK MULTIPLE ===========================
    builder.addCase(checkMultipleInWishlist.fulfilled, (state, action) => {
      state.wishlistMap = { ...state.wishlistMap, ...action.payload };
    });

    // =========================== CLEAR WISHLIST ===========================
    builder.addCase(clearWishlist.fulfilled, (state) => {
      state.items = [];
      state.count = 0;
      state.wishlistMap = {};
    });
  },
});

export const { resetWishlistState, clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
