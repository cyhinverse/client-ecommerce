import { createSlice } from "@reduxjs/toolkit";
import { 
  Voucher, 
  ApplyVoucherResult,
  VoucherStatistics,
} from "@/types/voucher";
import {
  getAllVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  applyVoucherCode,
  getVoucherStatistics,
} from "./voucherAction";
import { PaginationData } from "@/types/common";

interface VoucherSliceState {
  vouchers: Voucher[];
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;
  statistics: VoucherStatistics | null;
  appliedShopVoucher: ApplyVoucherResult | null;
  appliedPlatformVoucher: ApplyVoucherResult | null;
}

const initState: VoucherSliceState = {
  vouchers: [],
  pagination: null,
  loading: false,
  error: null,
  statistics: null,
  appliedShopVoucher: null,
  appliedPlatformVoucher: null,
};

export const voucherSlice = createSlice({
  name: "voucher",
  initialState: initState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setVouchers: (state, action) => {
      state.loading = false;
      state.vouchers = action.payload;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    clearAppliedVouchers: (state) => {
      state.appliedShopVoucher = null;
      state.appliedPlatformVoucher = null;
      state.error = null;
    },
    setAppliedShopVoucher: (state, action) => {
      state.appliedShopVoucher = action.payload;
    },
    setAppliedPlatformVoucher: (state, action) => {
      state.appliedPlatformVoucher = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Vouchers
      .addCase(getAllVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVouchers.fulfilled, (state, action) => {
        state.loading = false;
        // extractApiData already extracts the data
        const payload = action.payload;
        const data = Array.isArray(payload) ? payload : (payload?.data || []);
        state.vouchers = data;
        state.pagination = payload?.pagination || null;
      })
      .addCase(getAllVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch vouchers";
      })
      // Create Voucher
      .addCase(createVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVoucher.fulfilled, (state, action) => {
        state.loading = false;
        // extractApiData already extracts the data
        const newVoucher = action.payload;
        state.vouchers.unshift(newVoucher);
      })
      .addCase(createVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create voucher";
      })
      // Update Voucher
      .addCase(updateVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVoucher.fulfilled, (state, action) => {
        state.loading = false;
        // extractApiData already extracts the data
        const updated = action.payload;
        const index = state.vouchers.findIndex((v) => v._id === updated._id);
        if (index !== -1) {
          state.vouchers[index] = updated;
        }
      })
      .addCase(updateVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update voucher";
      })
      // Delete Voucher
      .addCase(deleteVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = state.vouchers.filter((v) => v._id !== action.payload);
      })
      .addCase(deleteVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete voucher";
      })
      // Apply Voucher
      .addCase(applyVoucherCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyVoucherCode.fulfilled, (state, action) => {
        state.loading = false;
        // extractApiData already extracts the data
        const result = action.payload;
        if (result?.scope === 'shop') {
          state.appliedShopVoucher = result;
        } else if (result?.scope === 'platform') {
          state.appliedPlatformVoucher = result;
        }
      })
      .addCase(applyVoucherCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to apply voucher";
      })
      // Get Voucher Statistics
      .addCase(getVoucherStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVoucherStatistics.fulfilled, (state, action) => {
        state.loading = false;
        // extractApiData already extracts the data
        state.statistics = action.payload;
      })
      .addCase(getVoucherStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch statistics";
      });
  },
});

export const { 
  clearError, 
  setVouchers,
  setLoading, 
  clearAppliedVouchers,
  setAppliedShopVoucher,
  setAppliedPlatformVoucher,
} = voucherSlice.actions;

export default voucherSlice.reducer;

export type { Voucher, ApplyVoucherResult };
