import { createSlice } from "@reduxjs/toolkit";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getNewArrivals,
  getOnSaleProducts,
  getProductById,
  getProductBySlug,
  getProductsByCategory,
  getProductsBySlugOfCategory,
  getProductsByShop,
  searchProducts,
  updateProduct,
  deleteVariantByVariantId,
  getRelatedProducts,
} from "./productAction";
import { ProductState } from "@/types/product";

const initState: ProductState = {
  all: [],
  featured: [],
  newArrivals: [],
  onSale: [],
  byCategory: [],
  currentProduct: null,
  pagination: null,
  isLoading: false,
  error: null,
  searchResults: [],
  isSearching: false,
  searchError: null,
  related: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState: initState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },

  extraReducers: (builder) => {
    // =========================== GET PRODUCT BY SLUG ===========================
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

    // =========================== GET ALL PRODUCTS ===========================
    builder.addCase(getAllProducts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.all = action.payload.data.data || [];
      state.pagination = action.payload.data.pagination || null;
    });
    builder.addCase(getAllProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch products";
    });

    // =========================== FEATURED ===========================
    builder.addCase(getFeaturedProducts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getFeaturedProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.featured = action.payload?.data || [];
      console.log("Check data from product features: ", state.featured);
    });
    builder.addCase(getFeaturedProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch featured products";
    });

    // =========================== NEW ARRIVALS ===========================
    builder.addCase(getNewArrivals.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getNewArrivals.fulfilled, (state, action) => {
      state.isLoading = false;
      state.newArrivals = action.payload?.data || [];
    });
    builder.addCase(getNewArrivals.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch new arrivals";
    });

    // =========================== ON SALE ===========================
    builder.addCase(getOnSaleProducts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getOnSaleProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.onSale = action.payload?.data || [];
    });
    builder.addCase(getOnSaleProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch on sale products";
    });

    // =========================== CATEGORY ===========================
    builder.addCase(getProductsByCategory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getProductsByCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.byCategory = action.payload?.data || [];
    });
    builder.addCase(getProductsByCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch category products";
    });

    // =========================== PRODUCT BY SLUG OF CATEGORY ===========================
    builder.addCase(getProductsBySlugOfCategory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getProductsBySlugOfCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.byCategory = action.payload?.data.data || [];
    });
    builder.addCase(getProductsBySlugOfCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        action.error.message || "Failed to fetch products by category slug";
    });

    // =========================== PRODUCT BY ID ===========================
    builder.addCase(getProductById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getProductById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentProduct = action.payload?.data;
    });
    builder.addCase(getProductById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch product by id";
    });

    // =========================== CREATE PRODUCT ===========================
    builder.addCase(createProduct.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.all.push(action.payload?.data);
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to create new product";
    });

    // =========================== DELETE PRODUCT ===========================
    builder.addCase(deleteProduct.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      const deletedId = action.payload;
      state.all = state.all.filter((p) => p._id !== deletedId);
      state.featured = state.featured.filter((p) => p._id !== deletedId);
      state.newArrivals = state.newArrivals.filter((p) => p._id !== deletedId);
      state.onSale = state.onSale.filter((p) => p._id !== deletedId);
      state.byCategory = state.byCategory.filter((p) => p._id !== deletedId);
      state.isLoading = false;
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to delete product";
    });

    // =========================== SEARCH ===========================
    builder.addCase(searchProducts.pending, (state) => {
      state.isSearching = true;
      state.searchError = null;
    });
    builder.addCase(searchProducts.fulfilled, (state, action) => {
      state.isSearching = false;
      state.searchResults = action.payload || [];
    });
    builder.addCase(searchProducts.rejected, (state, action) => {
      state.isSearching = false;
      state.searchError = action.error.message || "Failed to search products";
    });

    // =========================== UPDATE PRODUCT ===========================
    builder.addCase(updateProduct.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      const updatedProduct = action.payload?.data;
      if (updatedProduct) {
        state.all = state.all.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        );
        state.featured = state.featured.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        );
        state.newArrivals = state.newArrivals.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        );
        state.onSale = state.onSale.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        );
        state.byCategory = state.byCategory.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        );
        if (state.currentProduct?._id === updatedProduct._id) {
          state.currentProduct = updatedProduct;
        }
      }
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to update product";
    });

    // =========================== DELETE VARIANT ===========================
    builder.addCase(deleteVariantByVariantId.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteVariantByVariantId.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload?.data) {
         state.currentProduct = action.payload.data;
      }
    });
    builder.addCase(deleteVariantByVariantId.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to delete variant";
    });

    // =========================== RELATED PRODUCTS ===========================
    builder.addCase(getRelatedProducts.pending, (state) => {
      state.error = null;
    });
    builder.addCase(getRelatedProducts.fulfilled, (state, action) => {
      state.related = action.payload || [];
    });
    builder.addCase(getRelatedProducts.rejected, (state, action) => {
      state.error = action.error.message || "Failed to load related products";
    });

    // =========================== PRODUCTS BY SHOP ===========================
    builder.addCase(getProductsByShop.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getProductsByShop.fulfilled, (state, action) => {
      state.isLoading = false;
      // Response structure: { data: [...], pagination: {...} }
      state.all = action.payload?.data || action.payload || [];
      state.pagination = action.payload?.pagination || null;
    });
    builder.addCase(getProductsByShop.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch shop products";
    });
  },
});
