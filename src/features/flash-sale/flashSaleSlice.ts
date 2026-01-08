import { createSlice } from "@reduxjs/toolkit";
import { FlashSaleState } from "@/types/flash-sale";
import {
  getActiveFlashSale,
  getFlashSaleSchedule,
  getFlashSaleBySlot,
  addToFlashSale,
  removeFromFlashSale,
} from "./flashSaleAction";

const initialState: FlashSaleState = {
  products: [],
  schedule: [],
  pagination: null,
  currentSlot: null,
  nextSaleTime: null,
  isLoading: false,
  error: null,
};

export const flashSaleSlice = createSlice({
  name: "flashSale",
  initialState,
  reducers: {
    resetFlashSaleState: () => initialState,
    clearFlashSaleError: (state) => {
      state.error = null;
    },
    updateCountdown: (state) => {
      // Update remaining seconds for all products
      state.products = state.products.map((product) => ({
        ...product,
        flashSaleInfo: {
          ...product.flashSaleInfo,
          remainingSeconds: Math.max(0, product.flashSaleInfo.remainingSeconds - 1),
        },
      }));
    },
  },
  extraReducers: (builder) => {
    // =========================== GET ACTIVE FLASH SALE ===========================
    builder.addCase(getActiveFlashSale.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getActiveFlashSale.fulfilled, (state, action) => {
      state.isLoading = false;
      // extractApiData already extracts the data
      const payload = action.payload;
      state.products = Array.isArray(payload) ? payload : (payload?.data || []);
      state.pagination = payload?.pagination || null;
      state.nextSaleTime = payload?.saleInfo?.nextSaleTime || null;
    });
    builder.addCase(getActiveFlashSale.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as { message: string })?.message || "Lỗi khi lấy flash sale";
    });

    // =========================== GET SCHEDULE ===========================
    builder.addCase(getFlashSaleSchedule.fulfilled, (state, action) => {
      state.schedule = action.payload || [];
    });
    builder.addCase(getFlashSaleSchedule.rejected, (state, action) => {
      state.error = (action.payload as { message: string })?.message || "Lỗi khi lấy lịch";
    });

    // =========================== GET BY SLOT ===========================
    builder.addCase(getFlashSaleBySlot.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getFlashSaleBySlot.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentSlot = action.payload;
    });
    builder.addCase(getFlashSaleBySlot.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as { message: string })?.message || "Lỗi khi lấy khung giờ";
    });

    // =========================== ADD TO FLASH SALE ===========================
    builder.addCase(addToFlashSale.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addToFlashSale.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addToFlashSale.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as { message: string })?.message || "Không thể thêm vào flash sale";
    });

    // =========================== REMOVE FROM FLASH SALE ===========================
    builder.addCase(removeFromFlashSale.fulfilled, (state, action) => {
      state.products = state.products.filter((p) => p._id !== action.payload);
    });
    builder.addCase(removeFromFlashSale.rejected, (state, action) => {
      state.error = (action.payload as { message: string })?.message || "Không thể xóa khỏi flash sale";
    });
  },
});

export const { resetFlashSaleState, clearFlashSaleError, updateCountdown } = flashSaleSlice.actions;
export default flashSaleSlice.reducer;
