import { createSlice } from "@reduxjs/toolkit";
import { Discount } from "@/types/discount";
import {
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  applyDiscountCode,
} from "./discountAction";

import { PaginationData } from "@/types/common";

interface DiscountStatistics {
  totalDiscounts: number;
  activeDiscounts: number;
  expiredDiscounts: number;
  highUsageDiscounts: number;
}

interface AppliedDiscount {
  discountId: string;
  code: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
  finalTotal: number;
  originalTotal: number;
}

interface DiscountState {
  discounts: Discount[];
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;
  statistics: DiscountStatistics | null;
  appliedDiscount: AppliedDiscount | null;
}

const initState: DiscountState = {
  discounts: [],
  pagination: null,
  loading: false,
  error: null,
  statistics: null,
  appliedDiscount: null,
};

export const discountSlice = createSlice({
  name: "discount",
  initialState: initState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setDiscounts: (state, action) => {
      state.loading = false;
      console.log(action.payload);
      state.discounts = action.payload;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    clearAppliedDiscount: (state) => {
      state.appliedDiscount = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Discounts
      .addCase(getAllDiscounts.pending, (state) => {
        console.log(`Peding loading discount`, state.loading);
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDiscounts.fulfilled, (state, action) => {
        state.loading = false;
        state.discounts = action.payload?.data?.data || [];
        console.log("discount", state.discounts);
        state.pagination = action.payload?.data?.pagination || null;
        console.log(`pagination`, state.pagination);
      })
      .addCase(getAllDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch discounts";
      })
      // Create Discount
      .addCase(createDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.discounts.unshift(action.payload);
      })
      .addCase(createDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create discount";
      })
      // Update Discount
      .addCase(updateDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDiscount.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.discounts.findIndex(
          (discount) => discount._id === action.payload._id
        );
        if (index !== -1) {
          state.discounts[index] = action.payload;
        }
      })
      .addCase(updateDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update discount";
      })
      // Delete Discount
      .addCase(deleteDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.discounts = state.discounts.filter(
          (discount) => discount._id !== action.payload
        );
      })
      .addCase(deleteDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete discount";
      })
      // Apply Discount
      .addCase(applyDiscountCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyDiscountCode.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedDiscount = action.payload?.data;
      })
      .addCase(applyDiscountCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to apply discount";
        state.appliedDiscount = null;
      });
  },
});

export const { clearError, setDiscounts, setLoading, clearAppliedDiscount } =
  discountSlice.actions;
export default discountSlice.reducer;
