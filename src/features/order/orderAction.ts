import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { extractApiData, extractApiError } from "@/utils/api";

// Create new order - Updated to support shop/platform vouchers
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
    paymentMethod: "cod" | "vnpay" | "momo";
    // NEW: Support for shop and platform vouchers
    voucherShopCode?: string;
    voucherPlatformCode?: string;
    // DEPRECATED: Old discount code (kept for backward compatibility)
    discountCode?: string;
    note?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await instance.post("/orders", orderData);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Get user orders
export const getUserOrders = createAsyncThunk(
  "order/user-orders",
  async (params: {
    page?: number;
    limit?: number;
    status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus?: "unpaid" | "paid" | "refunded";
    paymentMethod?: "cod" | "vnpay";
  } | undefined, { rejectWithValue }) => {
    try {
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

      const responseData = extractApiData(response);
      return {
        orders: responseData.data || responseData.orders || [],
        pagination: responseData.pagination || null,
      };
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Get order by ID
export const getOrderById = createAsyncThunk(
  "order/get-by-id",
  async (orderId: string, { rejectWithValue }) => {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(orderId)) {
        throw new Error("Invalid order ID format");
      }

      const response = await instance.get(`/orders/${orderId}`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  "order/cancel",
  async (orderId: string, { rejectWithValue }) => {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(orderId)) {
        throw new Error("Invalid order ID format");
      }

      const response = await instance.delete(`/orders/${orderId}/cancel`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Admin: Get all orders
export const getAllOrders = createAsyncThunk(
  "order/admin/all",
  async (params: {
    page?: number;
    limit?: number;
    status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus?: "unpaid" | "paid" | "refunded";
    paymentMethod?: "cod" | "vnpay";
    userId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  } | undefined, { rejectWithValue }) => {
    try {
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

      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Admin: Update order status
export const updateOrderStatus = createAsyncThunk(
  "order/admin/update-status",
  async (payload: {
    orderId: string;
    status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  }, { rejectWithValue }) => {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(payload.orderId)) {
        throw new Error("Invalid order ID format");
      }

      const response = await instance.put(`/orders/${payload.orderId}/status`, {
        status: payload.status,
      });

      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Admin: Get order statistics
export const getOrderStatistics = createAsyncThunk(
  "order/admin/statistics",
  async (params: {
    period?: "day" | "week" | "month" | "year";
    startDate?: string;
    endDate?: string;
  } | undefined, { rejectWithValue }) => {
    try {
      const { period = "month", startDate = "", endDate = "" } = params || {};

      const response = await instance.get("/orders/statistics/overview", {
        params: { period, ...(startDate && { startDate }), ...(endDate && { endDate }) },
      });

      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Apply discount code - Uses voucher endpoint
// UPDATED: Now uses voucher endpoint instead of discount
export const applyDiscountCode = createAsyncThunk(
  "order/apply-discount",
  async (payload: {
    discountCode: string;
    cartItemIds: string[];
    totalAmount: number;
    shopId?: string; // NEW: For shop vouchers
  }, { rejectWithValue }) => {
    try {
      const response = await instance.post("/vouchers/apply", {
        code: payload.discountCode,
        orderTotal: payload.totalAmount,
        productIds: payload.cartItemIds,
        shopId: payload.shopId,
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// NEW: Apply voucher (shop or platform)
export const applyVoucher = createAsyncThunk(
  "order/apply-voucher",
  async (payload: {
    code: string;
    orderTotal: number;
    shopId?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await instance.post("/vouchers/apply", payload);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Get order by ID for admin - Uses same endpoint as regular getOrderById
// The backend checks if user is admin and returns full details
export const getOrderByIdAdmin = createAsyncThunk(
  "order/admin/get-by-id",
  async (orderId: string, { rejectWithValue }) => {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(orderId)) {
        throw new Error("Invalid order ID format");
      }

      // Use the same endpoint - backend handles admin access
      const response = await instance.get(`/orders/${orderId}`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Seller: Get orders for shop
export const getOrdersByShop = createAsyncThunk(
  "order/shop/list",
  async (params: {
    shopId: string;
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }, { rejectWithValue }) => {
    try {
      const { shopId, page = 1, limit = 10, status, search } = params;
      
      const queryParams: Record<string, string | number> = {
        shop: shopId,
        page,
        limit,
      };
      
      if (status && status !== "all") {
        queryParams.status = status;
      }
      if (search) {
        queryParams.search = search;
      }

      const response = await instance.get("/orders/shop", { params: queryParams });
      
      const responseData = extractApiData(response);
      return {
        orders: responseData.orders || [],
        pagination: responseData.pagination || null,
      };
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Seller: Get orders for seller's shop (uses seller endpoint)
export const getSellerOrders = createAsyncThunk(
  "order/seller/list",
  async (
    params: {
      page?: number;
      limit?: number;
      status?: string;
      paymentStatus?: string;
    } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const { page = 1, limit = 10, status, paymentStatus } = params || {};

      const queryParams: Record<string, string | number> = { page, limit };
      if (status && status !== "all") queryParams.status = status;
      if (paymentStatus && paymentStatus !== "all") queryParams.paymentStatus = paymentStatus;

      const response = await instance.get("/orders/seller/list", {
        params: queryParams,
      });

      const responseData = extractApiData(response);
      return {
        orders: responseData.data || responseData.orders || responseData || [],
        pagination: responseData.pagination || null,
      };
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Seller: Update order status
export const updateSellerOrderStatus = createAsyncThunk(
  "order/seller/update-status",
  async (
    payload: {
      orderId: string;
      status: "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    },
    { rejectWithValue }
  ) => {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(payload.orderId)) {
        throw new Error("Invalid order ID format");
      }

      const response = await instance.put(
        `/orders/seller/${payload.orderId}/status`,
        { status: payload.status }
      );

      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Seller: Get order statistics for shop
export const getSellerOrderStatistics = createAsyncThunk(
  "order/seller/statistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/orders/seller/statistics");
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);