import { createSlice } from "@reduxjs/toolkit";

interface subcategories {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  parentCategory: string;
}

interface category {
  _id: string;
  name: string;
  slug: string;
  images?: string[];
  subcategories?: subcategories[];
}

interface CategoryState {
  categories: category[] | null;
  isLoading: boolean;
  error: string | null;
}

const initState: CategoryState = {
  categories: null,
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
    builder.addCase("category/tree/pending", (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase("category/tree/fulfilled", (state, action: any) => {
      state.isLoading = false;
      state.categories = action.payload?.data;
    });
    builder.addCase("category/tree/rejected", (state, action: any) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch category tree";
    });
  },
});
