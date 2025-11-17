import { createSlice } from "@reduxjs/toolkit";
import {
  createProduct,
  deleteProduct,
  deleteVariantByVariantId,
  getAllProducts,
  getFeaturedProducts,
  getNewArrivals,
  getOnSaleProducts,
  getProductById,
  getProductBySlug,
  getProductsByCategory,
  getProductsBySlugOfCategory,
  updateProduct,
  updateVariant,
} from "./productAction";
import { ProductState } from "@/types/product";

const initState: ProductState = {
  product: null,
  currentProduct: null,
  pagination: null,
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
      state.product = action.payload.data.data;
      state.pagination = action.payload.data.pagination;
      console.log("All Products:", action.payload.data);
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
      console.log("Featured Products:", action.payload);
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
      state.product = action.payload?.data.data;

      console.log(`Check data from products slice `, action.payload.data)
    });
    builder.addCase(getProductsBySlugOfCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        action.error.message || "Failed to fetch products by slug of category";
    });

    // Get products by id
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

    // Create new product
    builder.addCase(createProduct.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      // Optionally, you can add the newly created product to the product list
      if (state.product) {
        state.product.push(action.payload?.data);
      } else {
        state.product = [action.payload?.data];
      }
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to create new product";
    });

    //  update product by id
    builder.addCase(updateProduct.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to update product by id";
    });
    // delete product by id
    builder.addCase(deleteProduct.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;

      console.log("Delete payload:", action.payload);

      // CÁCH 1: Giả sử payload chính là productId (string)
      if (state.product && Array.isArray(state.product)) {
        const productId = action.payload;
        state.product = state.product.filter(
          (product) => product._id !== productId
        );
      }
    });

    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to delete product by id";
    });

    // delete variant by id
    builder.addCase(deleteVariantByVariantId.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteVariantByVariantId.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(deleteVariantByVariantId.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to delete variant by id";
    });

    // update variant by id
    builder.addCase(updateVariant.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateVariant.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updateVariant.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to update variant by id";
    });
  },
});
