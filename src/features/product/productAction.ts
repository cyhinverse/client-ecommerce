import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getProductBySlug = createAsyncThunk(
  "product/:slug",
  async (slug: string) => {
    const response = await instance.get(`/products/slug/${slug}`);
    if (!response) {
      throw new Error("Failed to fetch product");
    }
    // API trả về { status, message, code, data } - ta cần lấy data.data
    return response.data;
  }
);

export const getAllProducts = createAsyncThunk("product/", async () => {
  const response = await instance.get(`/products`);
  if (!response) {
    throw new Error("Failed to fetch products");
  }
  return response.data;
});

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
    return response.data;
  }
);
