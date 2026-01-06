import { createSlice } from "@reduxjs/toolkit";
// Import from voucher types (with backward compatibility aliases)
import { 
  Voucher, 
  VoucherState, 
  ApplyVoucherResult,
  VoucherStatistics,
  // Backward compatibility aliases
  Discount 
} from "@/types/voucher";
import {
  getAllVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  applyVoucherCode,
  getVoucherStatistics,
  // Backward compatibility aliases
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  applyDiscountCode,
} from "./discountAction";

import { PaginationData } from "@/types/common";

// Extended state interface for Redux
interface DiscountSliceState {
  vouchers: Voucher[];
  // Backward compatibility alias
  discounts: Voucher[];
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;
  statistics: VoucherStatistics | null;
  // NEW: Applied vouchers for checkout
  appliedShopVoucher: ApplyVoucherResult | null;
  appliedPlatformVoucher: ApplyVoucherResult | null;
  // DEPRECATED: Old applied discount (kept for backward compatibility)
  appliedDiscount: ApplyVoucherResult | null;
}

const initState: DiscountSliceState = {
  vouchers: [],
  discounts: [], // Alias for vouchers
  pagination: null,
  loading: false,
  error: null,
  statistics: null,
  appliedShopVoucher: null,
  appliedPlatformVoucher: null,
  appliedDiscount: null,
};

export const discountSlice = createSlice({
  name: "discount",
  initialState: initState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setVouchers: (state, action) => {
      state.loading = false;
      state.vouchers = action.payload;
      state.discounts = action.payload; // Keep in sync
    },
    // DEPRECATED: Use setVouchers instead
    setDiscounts: (state, action) => {
      state.loading = false;
      state.vouchers = action.payload;
      state.discounts = action.payload;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    // NEW: Clear applied vouchers
    clearAppliedVouchers: (state) => {
      state.appliedShopVoucher = null;
      state.appliedPlatformVoucher = null;
      state.appliedDiscount = null;
      state.error = null;
    },
    // DEPRECATED: Use clearAppliedVouchers instead
    clearAppliedDiscount: (state) => {
      state.appliedShopVoucher = null;
      state.appliedPlatformVoucher = null;
      state.appliedDiscount = null;
      state.error = null;
    },
    // NEW: Set applied shop voucher
    setAppliedShopVoucher: (state, action) => {
      state.appliedShopVoucher = action.payload;
    },
    // NEW: Set applied platform voucher
    setAppliedPlatformVoucher: (state, action) => {
      state.appliedPlatformVoucher = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Vouchers (and backward compatible getAllDiscounts)
      .addCase(getAllVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVouchers.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.data?.data || action.payload?.data || [];
        state.vouchers = data;
        state.discounts = data; // Keep in sync
        state.pagination = action.payload?.data?.pagination || null;
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
        const newVoucher = action.payload?.data || action.payload;
        state.vouchers.unshift(newVoucher);
        state.discounts.unshift(newVoucher);
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
        const updated = action.payload?.data || action.payload;
        const index = state.vouchers.findIndex((v) => v._id === updated._id);
        if (index !== -1) {
          state.vouchers[index] = updated;
          state.discounts[index] = updated;
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
        state.discounts = state.discounts.filter((v) => v._id !== action.payload);
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
        const result = action.payload?.data || action.payload;
        // Set based on scope
        if (result?.scope === 'shop') {
          state.appliedShopVoucher = result;
        } else if (result?.scope === 'platform') {
          state.appliedPlatformVoucher = result;
        }
        // Also set legacy field
        state.appliedDiscount = result;
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
        state.statistics = action.payload?.data || action.payload;
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
  setDiscounts, // Backward compatibility
  setLoading, 
  clearAppliedVouchers,
  clearAppliedDiscount, // Backward compatibility
  setAppliedShopVoucher,
  setAppliedPlatformVoucher,
} = discountSlice.actions;

export default discountSlice.reducer;

// Re-export types for convenience
export type { Voucher, Discount, VoucherState, ApplyVoucherResult };
