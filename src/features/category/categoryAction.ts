import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTreeCategories = createAsyncThunk("category/tree", async () => {
  const response = await instance.get(`/categories/tree`);
  if (!response) {
    throw new Error("Failed to fetch category tree");
  }
  return response.data;
});
