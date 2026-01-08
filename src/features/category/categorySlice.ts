import { createSlice } from "@reduxjs/toolkit";
import {
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getTreeCategories,
  statisticsCategories,
  updateCategory,
} from "./categoryAction";
import { Category, PaginationData } from "@/types/category";

interface CategoryState {
  categories: Category[];
  pagination: PaginationData | null;
  isLoading: boolean;
  error: string | null;
}

const initState: CategoryState = {
  categories: [],
  pagination: null,
  isLoading: false,
  error: null,
};

export const categorySlice = createSlice({
  name: "category",
  initialState: initState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Get Tree Categories
    builder.addCase(getTreeCategories.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getTreeCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      // extractApiData already extracts the data
      const newData = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      if (JSON.stringify(newData) !== JSON.stringify(state.categories)) {
        state.categories = newData;
      }
    });
    builder.addCase(getTreeCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch category tree";
    });

    // Get All Categories
    builder.addCase(getAllCategories.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAllCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      // extractApiData already extracts the data
      const payload = action.payload;
      state.pagination = payload?.pagination || null;
      state.categories = payload?.data || payload || [];
    });
    builder.addCase(getAllCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch all categories";
    });

    // Delete Category
    builder.addCase(deleteCategory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.isLoading = false;

      state.categories = state.categories.filter(
        (category) => category._id !== action.meta.arg
      );
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to delete category";
    });

    // Update Category
    builder.addCase(updateCategory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      // extractApiData already extracts the data
      const updatedCategory = action.payload;
      const index = state.categories.findIndex(
        (category) => category._id === updatedCategory._id
      );
      if (index !== -1) {
        state.categories[index] = updatedCategory;
      }
    });
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to update category";
    });
    // Get Category By ID
    builder.addCase(getCategoryById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCategoryById.fulfilled, (state, action) => {
      state.isLoading = false;
      // extractApiData already extracts the data
      state.categories = Array.isArray(action.payload) ? action.payload : [action.payload];
    });
    builder.addCase(getCategoryById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch category";
    });

    // statistics Categories
    builder.addCase(statisticsCategories.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(statisticsCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      // extractApiData already extracts the data
      state.categories = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
    });
    builder.addCase(statisticsCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        action.error.message || "Failed to fetch category statistics";
    });
  },
});
