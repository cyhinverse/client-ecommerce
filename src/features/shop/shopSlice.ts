import { createSlice } from "@reduxjs/toolkit";
import { ShopState } from "@/types/shop";
import { registerShop, getMyShop, updateShop, getShopById, uploadShopImage, uploadRegisterImage, getAllShops } from "./shopAction";

const initialState: ShopState = {
  myShop: null,
  currentShop: null,
  shops: [],
  isLoading: false,
  isRegistering: false,
  isUpdating: false,
  error: null,
  // Image upload states
  isUploadingLogo: false,
  isUploadingBanner: false,
  uploadError: null,
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
    clearUploadError: (state) => {
      state.uploadError = null;
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

    // Upload Shop Image (for existing shops)
    builder
      .addCase(uploadShopImage.pending, (state, action) => {
        if (action.meta.arg.type === "logo") {
          state.isUploadingLogo = true;
        } else {
          state.isUploadingBanner = true;
        }
        state.uploadError = null;
      })
      .addCase(uploadShopImage.fulfilled, (state, action) => {
        if (action.payload.type === "logo") {
          state.isUploadingLogo = false;
          if (state.myShop) {
            state.myShop.logo = action.payload.url;
          }
        } else {
          state.isUploadingBanner = false;
          if (state.myShop) {
            state.myShop.banner = action.payload.url;
          }
        }
      })
      .addCase(uploadShopImage.rejected, (state, action) => {
        const payload = action.payload as { message: string; type: string } | undefined;
        if (payload?.type === "logo") {
          state.isUploadingLogo = false;
        } else {
          state.isUploadingBanner = false;
        }
        state.uploadError = payload?.message || "Upload thất bại";
      });

    // Upload Register Image (for new shop registration)
    builder
      .addCase(uploadRegisterImage.pending, (state, action) => {
        if (action.meta.arg.type === "logo") {
          state.isUploadingLogo = true;
        } else {
          state.isUploadingBanner = true;
        }
        state.uploadError = null;
      })
      .addCase(uploadRegisterImage.fulfilled, (state, action) => {
        if (action.payload.type === "logo") {
          state.isUploadingLogo = false;
        } else {
          state.isUploadingBanner = false;
        }
        // Note: Don't update myShop here as shop doesn't exist yet
      })
      .addCase(uploadRegisterImage.rejected, (state, action) => {
        const payload = action.payload as { message: string; type: string } | undefined;
        if (payload?.type === "logo") {
          state.isUploadingLogo = false;
        } else {
          state.isUploadingBanner = false;
        }
        state.uploadError = payload?.message || "Upload thất bại";
      });

    // Get All Shops (admin)
    builder
      .addCase(getAllShops.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllShops.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shops = action.payload || [];
        state.error = null;
      })
      .addCase(getAllShops.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as { message: string })?.message || "Không thể lấy danh sách shop";
      });
  },
});

export const { clearShopError, clearCurrentShop, clearUploadError } = shopSlice.actions;
export default shopSlice.reducer;
