import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateDiscountData, UpdateDiscountData } from "@/types/discount";
import instance from "@/api/api";

export const getAllDiscounts = createAsyncThunk(
  "discount/getAllDiscounts",
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    discountType?: string;
    isActive?: boolean;
  }) => {
    const response = await instance.get("/discounts", { params });

    console.log("Check data res from discount action", response.data)
    return response.data
  }
);

export const getDiscountById = createAsyncThunk(
  "discount/getDiscountById",
  async (discountId: string) => {
    const response = await instance.get(`/discounts/${discountId}`);
    return response.data;
  }
);

export const createDiscount = createAsyncThunk(
  "discount/createDiscount",
  async (discountData: CreateDiscountData) => {
    const response = await instance.post("/discounts", discountData);
    return response.data;
  }
);

export const updateDiscount = createAsyncThunk(
  "discount/updateDiscount",
  async ({ id, ...updateData }: UpdateDiscountData & { id: string }) => {
    const response = await instance.put(`/discounts/${id}`, updateData);
    return response.data;
  }
);

export const deleteDiscount = createAsyncThunk(
  "discount/deleteDiscount",
  async (discountId: string) => {
    await instance.delete(`/discounts/${discountId}`);
    return discountId;
  }
);

export const getDiscountStatistics = createAsyncThunk(
  "discount/getDiscountStatistics",
  async () => {
    const response = await instance.get("/discounts/statistics");
    return response.data;
  }
);

export const applyDiscountCode = createAsyncThunk(
  "discount/applyDiscountCode",
  async ({
    code,
    orderTotal,
    productIds,
  }: {
    code: string;
    orderTotal: number;
    productIds: string[];
  }) => {
    const response = await instance.post("/discounts/apply", {
      code,
      orderTotal,
      productIds,
    });
    return response.data;
  }
);
