import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getProductBySlug = createAsyncThunk(
  "product/:slug",
  async (slug: string) => {
    const response = await instance.get(`/products/slug/${slug}`);
    if (!response) {
      throw new Error("Failed to fetch product");
    }
    return response.data;
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
  }) => {
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

    console.log("Final query params:", queryParams);

    const response = await instance.get("/products", {
      params: queryParams,
    });

    if (!response) {
      throw new Error("Failed to fetch products");
    }
    return response.data;
  }
);

export const getFeaturedProducts = createAsyncThunk(
  "product/featured",
  async () => {
    const response = await instance.get(`/products/featured`);
    if (!response) {
      throw new Error("Failed to fetch featured products");
    }
    // API trả về { status, message, code, data } - ta cần lấy data.data
    return response.data;
  }
);

export const getProductsByCategory = createAsyncThunk(
  "product/category/:categoryId",
  async (category: string) => {
    const response = await instance.get(`/products/category/${category}`);
    if (!response) {
      throw new Error("Failed to fetch products by category");
    }
    return response.data;
  }
);

export const getNewArrivals = createAsyncThunk(
  "product/new-arrivals",
  async () => {
    const response = await instance.get(`/products/new-arrivals`);
    if (!response) {
      throw new Error("Failed to fetch new arrivals");
    }
    // API trả về { status, message, code, data } - ta cần lấy data.data
    return response.data;
  }
);

export const getOnSaleProducts = createAsyncThunk(
  "product/on-sale",
  async () => {
    const response = await instance.get(`/products/on-sale`);
    if (!response) {
      throw new Error("Failed to fetch on sale products");
    }
    // API trả về { status, message, code, data } - ta cần lấy data.data
    return response.data;
  }
);

export const getProductsBySlugOfCategory = createAsyncThunk(
  "products/category/:slug",
  async (categorySlug: string) => {
    const response = await instance.get(`/products/category/${categorySlug}`);
    if (!response) {
      throw new Error("Failed to fetch products by category slug");
    }
    console.log(`Lay product by slug cua category`, response.data);
    return response.data;
  }
);

export const getProductById = createAsyncThunk(
  "product/id",
  async (productId: string) => {
    const res = await instance.get(`/products/${productId}`);
    if (!res) {
      throw new Error("Failed to fetch product by ID");
    }
    return res.data;
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
      return response.data;
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to create product"
      );
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
  }) => {
    const response = await instance.put(`/products/${productId}`, updateData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (!response) {
      throw new Error("Failed to update product");
    }
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "product/delete/:id",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await instance.delete(
        `/products/${productId}/permanent`
      );

      // Kiểm tra status code thành công (2xx)
      if (response.status >= 200 && response.status < 300) {
        return response.data; // Trả về data từ server
      } else {
        throw new Error(response.data?.message || "Xóa sản phẩm thất bại");
      }
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      // Sử dụng rejectWithValue để có structured error
      return rejectWithValue(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Xóa sản phẩm thất bại"
      );
    }
  }
);

// DEPRECATED: Old variant actions (kept for backward compatibility)
export const deleteVariantByVariantId = createAsyncThunk(
  "variant/delete/:variantId",
  async ({ productId, variantId }: { productId: string; variantId: string }) => {
    const res = await instance.delete(`/products/${productId}/variants/${variantId}`);
    if (!res) {
      throw new Error("Failed to delete variant");
    }
    return res.data;
  }
);

export const updateVariant = createAsyncThunk(
  "variant/update",
  async (data: { productId: string; variantId: string }) => {
    const { productId, variantId } = data;
    const response = await instance.put(
      `/products/${productId}/variants/${variantId}`
    );
    if (!response) {
      throw new Error("Failed to update variant");
    }
    return response.data;
  }
);

// NEW: Model actions for tier variation structure
export const deleteModelById = createAsyncThunk(
  "model/delete/:modelId",
  async ({ productId, modelId }: { productId: string; modelId: string }) => {
    const res = await instance.delete(`/products/${productId}/models/${modelId}`);
    if (!res) {
      throw new Error("Failed to delete model");
    }
    return res.data;
  }
);

export const updateModel = createAsyncThunk(
  "model/update",
  async (data: { productId: string; modelId: string; updateData: { price?: number; stock?: number; sku?: string } }) => {
    const { productId, modelId, updateData } = data;
    const response = await instance.put(
      `/products/${productId}/models/${modelId}`,
      updateData
    );
    if (!response) {
      throw new Error("Failed to update model");
    }
    return response.data;
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
      return response.data.data;
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to search products"
      );
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
      return response.data.data;
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to fetch related products"
      );
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
      // Response structure: { data: { data: [...], pagination: {...} } }
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to fetch shop products"
      );
    }
  }
);
