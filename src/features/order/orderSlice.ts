import { createSlice } from "@reduxjs/toolkit";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStatistics,
} from "./orderAction";
import type { OrderState } from "@/types/order";


const initialState: OrderState = {
  userOrders: [],
  allOrders: [],
  currentOrder: null,
  statistics: null,
  pagination: null,
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
      state.pagination = null;
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
        if (action.payload) {
          state.userOrders.unshift(action.payload);
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
        state.userOrders = action.payload.orders;
        state.pagination = action.payload.pagination;
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
        state.currentOrder = action.payload;
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
        const updatedOrder = action.payload;
        if (updatedOrder) {
          const index = state.userOrders.findIndex(
            (order) => order._id === updatedOrder._id
          );
          if (index !== -1) {
            state.userOrders[index] = updatedOrder;
          }
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
        
        // Xử lý cả hai trường hợp API response
        if (action.payload && typeof action.payload === 'object') {
          if (Array.isArray(action.payload)) {
            // Nếu payload là mảng orders
            state.allOrders = action.payload;
            state.pagination = null;
          } else {
            // Nếu payload là object { data, pagination }
            state.allOrders = action.payload.data || [];
            state.pagination = action.payload.pagination || null;
          }
        } else {
          state.allOrders = [];
          state.pagination = null;
        }
        
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
        const updatedOrder = action.payload;
        if (updatedOrder) {
          const adminIndex = state.allOrders.findIndex(
            (order) => order._id === updatedOrder._id
          );
          if (adminIndex !== -1) {
            state.allOrders[adminIndex] = updatedOrder;
          }

          const userIndex = state.userOrders.findIndex(
            (order) => order._id === updatedOrder._id
          );
          if (userIndex !== -1) {
            state.userOrders[userIndex] = updatedOrder;
          }

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
        state.statistics = action.payload;
      })
      .addCase(getOrderStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch statistics";
      });
  },
});

