import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStatistics,
} from "./orderAction";

// Interfaces từ schema MongoDB
export interface OrderProduct {
  productId: string;
  variantId?: string;
  name: string;
  sku?: string;
  color?: string;
  size?: string;
  image?: string;
  quantity: number;
  price: {
    currentPrice: number;
    discountPrice?: number;
    currency: string;
  };
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
  ward?: string;
  note?: string;
}

export interface Order {
  _id: string;
  userId: string;
  products: OrderProduct[];
  shippingAddress: ShippingAddress;
  paymentMethod: "cod" | "vnpay";
  paymentStatus: "unpaid" | "paid" | "refunded";
  subtotal: number;
  shippingFee: number;
  discountCode?: string;
  discountAmount: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  revenueByPeriod: Array<{
    period: string;
    revenue: number;
    orders: number;
  }>;
}

export interface OrderState {
  // User orders
  userOrders: Order[];
  currentOrder: Order | null;

  // Admin orders
  allOrders: Order[];

  // Statistics
  statistics: OrderStatistics | null;

  // Pagination
  Pagination: PaginationData | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isCancelling: boolean;

  // Errors
  error: string | null;
}

const initialState: OrderState = {
  userOrders: [],
  allOrders: [],
  currentOrder: null,
  statistics: null,
  Pagination: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isCancelling: false,
  error: null,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearStatistics: (state) => {
      state.statistics = null;
    },
    clearAllOrders: (state) => {
      state.allOrders = [];
      state.Pagination = null;
    },

  },
  extraReducers: (builder) => {
    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isCreating = false;
        if (action.payload.data) {
          state.userOrders.unshift(action.payload.data);
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error.message || "Failed to create order";
      });

    // Get User Orders
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload.orders || [];
        console.log(`Check data ffrom orderslice `, action.payload)
        state.Pagination = action.payload.pagination;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch orders";
      });

    // Get Order By ID
    builder
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.data || null;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch order";
      });

    // Cancel Order
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.isCancelling = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isCancelling = false;
        const updatedOrder = action.payload.data;
        if (updatedOrder) {
          // Update in userOrders array
          const index = state.userOrders.findIndex(
            (order) => order._id === updatedOrder._id
          );
          if (index !== -1) {
            state.userOrders[index] = updatedOrder;
          }
          // Update currentOrder if it's the same order
          if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
            state.currentOrder = updatedOrder;
          }
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isCancelling = false;
        state.error = action.error.message || "Failed to cancel order";
      });

    // Admin: Get All Orders
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allOrders = action.payload.data || [];
        console.log(`Check order from orderSlice`, state.allOrders)
        state.Pagination = action.payload.pagination;
        console.log(`Check pagination from orderSlice`, state.Pagination)
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch all orders";
      });

    // Admin: Update Order Status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedOrder = action.payload.data;
        if (updatedOrder) {
          // Update in allOrders (admin)
          const adminIndex = state.allOrders.findIndex(
            (order) => order._id === updatedOrder._id
          );
          if (adminIndex !== -1) {
            state.allOrders[adminIndex] = updatedOrder;
          }

          // Update in userOrders (if exists)
          const userIndex = state.userOrders.findIndex(
            (order) => order._id === updatedOrder._id
          );
          if (userIndex !== -1) {
            state.userOrders[userIndex] = updatedOrder;
          }

          // Update currentOrder (if matches)
          if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
            state.currentOrder = updatedOrder;
          }
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message || "Failed to update order status";
      });

    // Admin: Get Order Statistics
    builder
      .addCase(getOrderStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statistics = action.payload.data || null;
      })
      .addCase(getOrderStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch statistics";
      });
  },
});

