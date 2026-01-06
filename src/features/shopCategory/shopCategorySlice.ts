import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShopCategory, ShopCategoryState } from "@/types/shopCategory";
import {
  getShopCategories,
  createShopCategory,
  updateShopCategory,
  deleteShopCategory,
} from "./shopCategoryAction";

const initialState: ShopCategoryState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
};

export const shopCategorySlice = createSlice({
  name: "shopCategory",
  initialState,
  reducers: {
    clearShopCategoryError: (state) => {
      state.error = null;
    },
    setCurrentCategory: (state, action: PayloadAction<ShopCategory | null>) => {
      state.currentCategory = action.payload;
    },
    clearCategories: (state) => {
      state.categories = [];
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    // Get shop categories
    builder
      .addCase(getShopCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getShopCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getShopCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as { message: string })?.message || "Lỗi không xác định";
      });

    // Create shop category
    builder
      .addCase(createShopCategory.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createShopCategory.fulfilled, (state, action) => {
        state.isCreating = false;
        state.categories.push(action.payload);
      })
      .addCase(createShopCategory.rejected, (state, action) => {
        state.isCreating = false;
        state.error = (action.payload as { message: string })?.message || "Lỗi không xác định";
      });

    // Update shop category
    builder
      .addCase(updateShopCategory.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateShopCategory.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.categories.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory?._id === action.payload._id) {
          state.currentCategory = action.payload;
        }
      })
      .addCase(updateShopCategory.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = (action.payload as { message: string })?.message || "Lỗi không xác định";
      });

    // Delete shop category
    builder
      .addCase(deleteShopCategory.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteShopCategory.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.categories = state.categories.filter((c) => c._id !== action.payload);
        if (state.currentCategory?._id === action.payload) {
          state.currentCategory = null;
        }
      })
      .addCase(deleteShopCategory.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = (action.payload as { message: string })?.message || "Lỗi không xác định";
      });
  },
});

export const { clearShopCategoryError, setCurrentCategory, clearCategories } =
  shopCategorySlice.actions;
export default shopCategorySlice.reducer;
