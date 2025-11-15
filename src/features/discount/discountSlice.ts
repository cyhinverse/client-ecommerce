import { createSlice } from "@reduxjs/toolkit";
import { Discount } from "@/types/discount";
import {
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "./discountAction";

export interface PaginationData {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

interface DiscountState {
  discounts: Discount[];
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;
  statistics: any | null

}

const initState: DiscountState = {
  discounts: [],
  pagination: null,
  loading: false,
  error: null,
  statistics: null,

};

export const discountSlice = createSlice({
  name: "discount",
  initialState: initState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setDiscounts: (state, action) => {
      state.loading = false
      console.log(action.payload)
      state.discounts = action.payload
    },
    setLoading: (state) => {
      state.loading = true
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All Discounts
      .addCase(getAllDiscounts.pending, (state) => {
        console.log(`Peding loading discount`, state.loading)
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDiscounts.fulfilled, (state, action) => {
        state.loading = false;
        state.discounts = action.payload?.data?.data || [];// ✅ ĐÚNG
        console.log("discount", state.discounts)
        state.pagination = action.payload?.data?.pagination || null; // ✅ ĐÚNG
        console.log(`pagination`, state.pagination)
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

  },
});

