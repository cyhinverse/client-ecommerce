import { createSlice } from "@reduxjs/toolkit";
import {
  getAllProducts,
  getFeaturedProducts,
  getNewArrivals,
  getOnSaleProducts,
  getProductBySlug,
  getProductsByCategory,
  getProductsBySlugOfCategory,
} from "./productAction";
import { ProductState } from "@/types/product";

const initState: ProductState = {
  product: null,
  currentProduct: null,
  isLoading: false,
  error: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState: initState,
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Get Product By Slug
    builder.addCase(getProductBySlug.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getProductBySlug.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentProduct = action.payload?.data;
    });
    builder.addCase(getProductBySlug.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch product";
    });
    // Get All Products
    builder.addCase(getAllProducts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
    });
    builder.addCase(getAllProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch products";
    });

    // Get Featured Products
    builder.addCase(getFeaturedProducts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getFeaturedProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.product = action.payload?.data;
    });
    builder.addCase(getFeaturedProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch featured products";
    });

    // Get Products By Category
    builder.addCase(getProductsByCategory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getProductsByCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.product = action.payload?.data;
    });
    builder.addCase(getProductsByCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        action.error.message || "Failed to fetch products by category";
    });

    // Get New Arrivals
    builder.addCase(getNewArrivals.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getNewArrivals.fulfilled, (state, action) => {
      state.isLoading = false;
      state.product = action.payload?.data;
    });
    builder.addCase(getNewArrivals.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch new arrivals";
    });

    // Get On Sale Products
    builder.addCase(getOnSaleProducts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getOnSaleProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.product = action.payload?.data;
    });
    builder.addCase(getOnSaleProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch on sale products";
    });

    //Get product by slug of category
    builder.addCase(getProductsBySlugOfCategory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(getProductsBySlugOfCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.product = action.payload?.data.products;
    });
    builder.addCase(getProductsBySlugOfCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        action.error.message || "Failed to fetch products by slug of category";
    });
  },
});
