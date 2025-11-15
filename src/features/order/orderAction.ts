import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Order } from "../../types/order"
interface GetListOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// User routes
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData: Order) => {
    const response = await instance.post("/orders", orderData);
    if (!response.data) {
      throw new Error("Failed to create order");
    }
    return response.data;
  }
);

export const getUserOrder = createAsyncThunk(
  "order/getUserOrder",
  async (params?: { page?: number; limit?: number }) => {
    const response = await instance.get("/orders", {
      params
    });
    if (!response.data) {
      throw new Error("Failed to fetch user orders");
    }
    return response.data;
  }
);

export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (orderId: string) => {
    const response = await instance.get(`/orders/${orderId}`);
    if (!response.data) {
      throw new Error("Failed to fetch order by ID");
    }
    return response.data;
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (orderId: string) => {
    const response = await instance.delete(`/orders/${orderId}/cancel`);
    if (!response.data) {
      throw new Error("Failed to cancel order");
    }
    return response.data;
  }
);

// Admin routes
export const getListOrders = createAsyncThunk(
  "order/getListOrders",
  async (params: GetListOrdersParams) => {
    const response = await instance.get("/orders/all/list", {
      params
    });
    if (!response.data) {
      throw new Error("Failed to fetch orders");
    }
    return response.data;
  }
);

export const changeOrderStatus = createAsyncThunk(
  "order/changeOrderStatus",
  async ({ orderId, status }: { orderId: string; status: string }) => {
    const response = await instance.put(`/orders/${orderId}/status`, {
      status,
    });
    if (!response.data) {
      throw new Error("Failed to change order status");
    }
    return response.data;
  }
);

export const getOrderStatistics = createAsyncThunk(
  "order/getOrderStatistics",
  async () => {
    try {
      const response = await instance.get("/orders/statistics/overview");
      if (!response.data) {
        throw new Error("Failed to fetch order statistics");
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Fallback: trả về dữ liệu mẫu hoặc tính toán từ orders
        throw new Error("Statistics endpoint not available");
      }
      throw error;
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (orderId: string) => {
    const response = await instance.delete(`/orders/${orderId}`);
    if (response.status === 200 || response.status === 204) {
      return orderId; // Trả về orderId để xóa khỏi state
    }
    throw new Error("Failed to delete order");
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ orderId, formData }: { orderId: string; formData: any }) => {
    const response = await instance.put(`/orders/${orderId}`, formData);
    if (!response.data) {
      throw new Error("Failed to update order");
    }
    return response.data;
  }
);
