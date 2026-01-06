import { createSlice } from "@reduxjs/toolkit";
import { ShopState } from "@/types/shop";
import { registerShop, getMyShop, updateShop, getShopById } from "./shopAction";

const initialState: ShopState = {
  myShop: null,
  currentShop: null,
  isLoading: false,
  isRegistering: false,
  isUpdating: false,
  error: null,
};

export const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    clearShopError: (state) => {
      state.error = null;
    },
    clearCurrentShop: (state) => {
      state.currentShop = null;
    },
  },
  extraReducers: (builder) => {
    // Register Shop
    builder
      .addCase(registerShop.pending, (state) => {
        state.isRegistering = true;
        state.error = null;
      })
      .addCase(registerShop.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.myShop = action.payload;
        state.error = null;
      })
      .addCase(registerShop.rejected, (state, action) => {
        state.isRegistering = false;
        state.error = (action.payload as { message: string })?.message || "Đăng ký shop thất bại";
      });

    // Get My Shop
    builder
      .addCase(getMyShop.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyShop.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myShop = action.payload;
        state.error = null;
      })
      .addCase(getMyShop.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as { message: string })?.message || "Không thể lấy thông tin shop";
      });

    // Update Shop
    builder
      .addCase(updateShop.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateShop.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.myShop = action.payload;
        state.error = null;
      })
      .addCase(updateShop.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = (action.payload as { message: string })?.message || "Cập nhật shop thất bại";
      });

    // Get Shop By ID
    builder
      .addCase(getShopById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getShopById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentShop = action.payload;
        state.error = null;
      })
      .addCase(getShopById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as { message: string })?.message || "Không tìm thấy shop";
      });
  },
});

export const { clearShopError, clearCurrentShop } = shopSlice.actions;
export default shopSlice.reducer;
