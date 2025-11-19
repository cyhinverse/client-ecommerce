import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Create VNPay Payment URL
export const createPaymentUrl = createAsyncThunk(
    "payment/createUrl",
    async (orderId: string) => {
        const response = await instance.post("/payment/create", { orderId });
        if (!response.data) {
            throw new Error("Failed to create payment URL");
        }
        return response.data.data || response.data;
    }
);

// Get Payment Details by Order ID
export const getPaymentByOrder = createAsyncThunk(
    "payment/getByOrder",
    async (orderId: string) => {
        const response = await instance.get(`/payment/order/${orderId}`);
        if (!response.data) {
            throw new Error("Failed to fetch payment details");
        }
        return response.data.data || response.data;
    }
);
