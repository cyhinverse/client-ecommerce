import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { extractApiData, extractApiError } from "@/utils/api";

export const getProductBySlug = createAsyncThunk(
  "product/:slug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/products/slug/${slug}`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const getAllProducts = createAsyncThunk(
  "product/getAll",
  async (params: {
    page: number;
    limit: number;
    sort?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    search?: string;
    isActive?: boolean;
    rating?: string;
    colors?: string;
    sizes?: string;
  }, { rejectWithValue }) => {
    try {
      const {
        page,
        limit,
        sort,
        category,
        brand,
        minPrice,
        maxPrice,
        tags,
        search,
        isActive,
        rating,
        colors,
        sizes,
      } = params;

      // Lọc bỏ các giá trị undefined/null/empty
      const queryParams: Record<string, string | number | boolean | string[]> = {
        page,
        limit,
      };

      // Chỉ thêm các param có giá trị
      if (sort) queryParams.sort = sort;
      if (category) queryParams.category = category;
      if (brand) queryParams.brand = brand;
      if (minPrice) queryParams.minPrice = minPrice;
      if (maxPrice) queryParams.maxPrice = maxPrice;
      if (tags && tags.length > 0) queryParams.tags = tags.join(",");
      if (search) queryParams.search = search;
      if (isActive !== undefined) queryParams.isActive = isActive;
      if (rating) queryParams.rating = rating;
      if (colors) queryParams.colors = colors;
      if (sizes) queryParams.sizes = sizes;

      const response = await instance.get("/products", {
        params: queryParams,
      });

      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const getFeaturedProducts = createAsyncThunk(
  "product/featured",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/products/featured`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const getProductsByCategory = createAsyncThunk(
  "product/category/:categoryId",
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/products/category/${category}`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const getNewArrivals = createAsyncThunk(
  "product/new-arrivals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/products/new-arrivals`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const getOnSaleProducts = createAsyncThunk(
  "product/on-sale",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/products/on-sale`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const getProductsBySlugOfCategory = createAsyncThunk(
  "products/category/:slug",
  async (categorySlug: string, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/products/category/${categorySlug}`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const getProductById = createAsyncThunk(
  "product/id",
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await instance.get(`/products/${productId}`);
      return extractApiData(res);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await instance.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/update/:id",
  async ({
    productId,
    updateData,
  }: {
    productId: string;
    updateData: FormData;
  }, { rejectWithValue }) => {
    try {
      const response = await instance.put(`/products/${productId}`, updateData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/delete/:id",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await instance.delete(
        `/products/${productId}/permanent`
      );
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// DEPRECATED: Old variant actions (kept for backward compatibility)
export const deleteVariantByVariantId = createAsyncThunk(
  "variant/delete/:variantId",
  async ({ productId, variantId }: { productId: string; variantId: string }, { rejectWithValue }) => {
    try {
      const res = await instance.delete(`/products/${productId}/variants/${variantId}`);
      return extractApiData(res);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const updateVariant = createAsyncThunk(
  "variant/update",
  async (data: { productId: string; variantId: string }, { rejectWithValue }) => {
    try {
      const { productId, variantId } = data;
      const response = await instance.put(
        `/products/${productId}/variants/${variantId}`
      );
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// NEW: Model actions for tier variation structure
export const deleteModelById = createAsyncThunk(
  "model/delete/:modelId",
  async ({ productId, modelId }: { productId: string; modelId: string }, { rejectWithValue }) => {
    try {
      const res = await instance.delete(`/products/${productId}/models/${modelId}`);
      return extractApiData(res);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const updateModel = createAsyncThunk(
  "model/update",
  async (data: { productId: string; modelId: string; updateData: { price?: number; stock?: number; sku?: string } }, { rejectWithValue }) => {
    try {
      const { productId, modelId, updateData } = data;
      const response = await instance.put(
        `/products/${productId}/models/${modelId}`,
        updateData
      );
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Search products
export const searchProducts = createAsyncThunk(
  "product/search",
  async (
    { keyword, limit = 10 }: { keyword: string; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get(`/products/search`, {
        params: {
          q: keyword,
          limit: limit,
        },
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const getRelatedProducts = createAsyncThunk(
  "product/related",
  async (
    {
      productId,
    }: { productId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get(`/products/related/${productId}`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);


// Get products by shop ID
export const getProductsByShop = createAsyncThunk(
  "product/shop",
  async (
    { shopId, page = 1, limit = 20 }: { shopId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get(`/products`, {
        params: { shop: shopId, page, limit },
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Seller: Update own product
export const updateSellerProduct = createAsyncThunk(
  "product/seller/update",
  async (
    { productId, updateData }: { productId: string; updateData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.put(
        `/products/seller/${productId}`,
        updateData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Seller: Delete own product
export const deleteSellerProduct = createAsyncThunk(
  "product/seller/delete",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`/products/seller/${productId}`);
      return { productId, data: extractApiData(response) };
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);
