import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { extractApiData, extractApiError } from "@/utils/api";

// Create VNPay Payment URL
export const createPaymentUrl = createAsyncThunk(
  "payment/createUrl",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await instance.post("/payment/create", { orderId });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Get Payment Details by Order ID
export const getPaymentByOrder = createAsyncThunk(
  "payment/getByOrder",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/payment/order/${orderId}`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);
