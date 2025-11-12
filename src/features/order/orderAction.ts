import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUserOrder = createAsyncThunk(
  "order/getUserOrder",
  async (userId: string) => {
    const response = await instance.get(`/api/orders/${userId}`);
    if (!response) {
      throw new Error("Failed to fetch user orders");
    }
    return response.data;
  }
);

export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (orderId: string) => {
    const response = await instance.get(`/api/order/${orderId}`);
    if (!response) {
      throw new Error("Failed to fetch order by ID");
    }
    return response.data;
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (orderId: string) => {
    const response = await instance.delete(`/order/${orderId}`);
    if (!response) {
      throw new Error("Failed to cancel order");
    }
    return response.data;
  }
);

export const getListOrders = createAsyncThunk(
  "order/getListOrders",
  async ({
    search,
    status,
    createAt,
    updateAt,
  }: {
    search: string;
    status: string;
    createAt: string;
    updateAt: string;
  }) => {
    const response = await instance.get("/orders/all/list", {
      params: { search, status, createAt, updateAt },
    });
    if (!response) {
      throw new Error("Failed to fetch orders");
    }
    return response.data;
  }
);

export const changeOrderStatus = createAsyncThunk(
  "order/changeOrderStatus",
  async ({ orderId, status }: { orderId: string; status: string }) => {
    const response = await instance.patch(`/orders/${orderId}`, {
      status,
    });
    if (!response) {
      throw new Error("Failed to change order status");
    }
    return response.data;
  }
);

export const overviewOrders = createAsyncThunk(
  "order/overviewOrders",
  async () => {
    const response = await instance.get("/orders/overview");
    if (!response) {
      throw new Error("Failed to fetch order overview");
    }
    return response.data;
  }
);
