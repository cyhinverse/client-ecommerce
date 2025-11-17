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
    } = params;

    // Lọc bỏ các giá trị undefined/null/empty
    const queryParams: any = {
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
    console.log(`Lay product by slug cua category`, response.data)
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
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
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
    } catch (error: any) {
      // Sử dụng rejectWithValue để có structured error
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Xóa sản phẩm thất bại"
      );
    }
  }
);

export const deleteVariantByVariantId = createAsyncThunk(
  "vairant/delete/:variantId",
  async (variantId: string) => {
    const res = await instance.delete(`products/:id/variant/${variantId}`);
    if (!res) {
      throw new Error("Failed to delete variant");
    }
    return res.data;
  }
);

export const updateVariant = createAsyncThunk(
  "variant/delete",
  async (data: { productId: string; variantId: string }) => {
    const { productId, variantId } = data;
    const response = await instance.put(
      `/products/${productId}/variant/${variantId}`
    );
    if (!response) {
      throw new Error("Failed to update variant");
    }
    return response.data;
  }
);
