import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Create new order
export const createOrder = createAsyncThunk(
  "order/create",
  async (orderData: {
    cartItemIds: string[];
    shippingAddress: {
      fullName: string;
      phone: string;
      address: string;
      city: string;
      district: string;
      ward: string;
      note?: string;
    };
    paymentMethod: "cod" | "vnpay";
    discountCode?: string;
    note?: string;
  }) => {
    const response = await instance.post("/orders", orderData);
    if (!response.data) {
      throw new Error("Failed to create order");
    }
    return response.data;
  }
);

// Get user orders
export const getUserOrders = createAsyncThunk(
  "order/user-orders",
  async (params?: {
    page?: number;
    limit?: number;
    status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus?: "unpaid" | "paid" | "refunded";
    paymentMethod?: "cod" | "vnpay";
  }) => {
    const {
      page = 1,
      limit = 10,
      status = "",
      paymentStatus = "",
      paymentMethod = ""
    } = params || {};

    const response = await instance.get("/orders", {
      params: {
        page,
        limit,
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(paymentMethod && { paymentMethod })
      },
    });

    if (!response.data) {
      throw new Error("Failed to fetch user orders");
    }
    
    // Sửa lại theo cấu trúc API thực tế
    const responseData = response.data.data || response.data;
    return {
      orders: responseData.data || responseData.orders || [],
      pagination: responseData.pagination || null,
    };
  }
);

// Get order by ID
export const getOrderById = createAsyncThunk(
  "order/get-by-id",
  async (orderId: string) => {
    if (!/^[0-9a-fA-F]{24}$/.test(orderId)) {
      throw new Error("Invalid order ID format");
    }

    const response = await instance.get(`/orders/${orderId}`);
    if (!response.data) {
      throw new Error("Failed to fetch order");
    }
    return response.data.data || response.data;
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  "order/cancel",
  async (orderId: string) => {
    if (!/^[0-9a-fA-F]{24}$/.test(orderId)) {
      throw new Error("Invalid order ID format");
    }

    const response = await instance.delete(`/orders/${orderId}/cancel`);
    if (!response.data) {
      throw new Error("Failed to cancel order");
    }
    return response.data.data || response.data;
  }
);

// Admin: Get all orders
export const getAllOrders = createAsyncThunk(
  "order/admin/all",
  async (params?: {
    page?: number;
    limit?: number;
    status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus?: "unpaid" | "paid" | "refunded";
    paymentMethod?: "cod" | "vnpay";
    userId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const {
      page = 1,
      limit = 10,
      status = "",
      paymentStatus = "",
      paymentMethod = "",
      userId = "",
      search = "",
      startDate = "",
      endDate = "",
    } = params || {};

    const response = await instance.get("/orders/all/list", {
      params: {
        page,
        limit,
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(paymentMethod && { paymentMethod }),
        ...(userId && { userId }),
        ...(search && { search }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      },
    });

    if (!response.data) {
      throw new Error("Failed to fetch all orders");
    }
    
    // Sửa lại để phù hợp với API structure
    return response.data.data || response.data;
  }
);

// Admin: Update order status
export const updateOrderStatus = createAsyncThunk(
  "order/admin/update-status",
  async (payload: {
    orderId: string;
    status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  }) => {
    if (!/^[0-9a-fA-F]{24}$/.test(payload.orderId)) {
      throw new Error("Invalid order ID format");
    }

    const response = await instance.put(`/orders/${payload.orderId}/status`, {
      status: payload.status,
    });

    if (!response.data) {
      throw new Error("Failed to update order status");
    }
    return response.data.data || response.data;
  }
);

// Admin: Get order statistics
export const getOrderStatistics = createAsyncThunk(
  "order/admin/statistics",
  async (params?: {
    period?: "day" | "week" | "month" | "year";
    startDate?: string;
    endDate?: string;
  }) => {
    const { period = "month", startDate = "", endDate = "" } = params || {};

    const response = await instance.get("/orders/statistics/overview", {
      params: { period, ...(startDate && { startDate }), ...(endDate && { endDate }) },
    });

    if (!response.data) {
      throw new Error("Failed to fetch order statistics");
    }
    return response.data.data || response.data;
  }
);

// Apply discount code
export const applyDiscountCode = createAsyncThunk(
  "order/apply-discount",
  async (payload: {
    discountCode: string;
    cartItemIds: string[];
    totalAmount: number;
  }) => {
    const response = await instance.post("/orders/apply-discount", payload);
    if (!response.data) {
      throw new Error("Failed to apply discount code");
    }
    return response.data.data || response.data;
  }
);

// Get order by ID for admin
export const getOrderByIdAdmin = createAsyncThunk(
  "order/admin/get-by-id",
  async (orderId: string) => {
    if (!/^[0-9a-fA-F]{24}$/.test(orderId)) {
      throw new Error("Invalid order ID format");
    }

    const response = await instance.get(`/orders/admin/${orderId}`);
    if (!response.data) {
      throw new Error("Failed to fetch order details");
    }
    return response.data.data || response.data;
  }
);