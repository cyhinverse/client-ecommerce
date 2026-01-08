import { createSlice } from "@reduxjs/toolkit";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStatistics,
  getOrdersByShop,
  getSellerOrders,
  updateSellerOrderStatus,
  getSellerOrderStatistics,
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
  // Seller shop orders
  shopOrders: [],
  shopOrdersPagination: null,
  isLoadingShopOrders: false,
  shopOrdersError: null,
  // Seller statistics
  sellerStatistics: null,
  isLoadingSellerStats: false,
  sellerStatsError: null,
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
        
        // extractApiData already extracts the data
        // Xử lý cả hai trường hợp API response
        const payload = action.payload;
        if (payload && typeof payload === 'object') {
          if (Array.isArray(payload)) {
            // Nếu payload là mảng orders
            state.allOrders = payload;
            state.pagination = null;
          } else {
            // Nếu payload là object { data, pagination } hoặc trực tiếp
            state.allOrders = payload?.data || payload?.orders || [];
            state.pagination = payload?.pagination || null;
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

    // Seller: Get Orders By Shop
    builder
      .addCase(getOrdersByShop.pending, (state) => {
        state.isLoadingShopOrders = true;
        state.shopOrdersError = null;
      })
      .addCase(getOrdersByShop.fulfilled, (state, action) => {
        state.isLoadingShopOrders = false;
        state.shopOrders = action.payload.orders || [];
        state.shopOrdersPagination = action.payload.pagination;
      })
      .addCase(getOrdersByShop.rejected, (state, action) => {
        state.isLoadingShopOrders = false;
        state.shopOrdersError = action.payload as string || "Failed to fetch shop orders";
      });

    // Seller: Get Seller Orders (via seller endpoint)
    builder
      .addCase(getSellerOrders.pending, (state) => {
        state.isLoadingShopOrders = true;
        state.shopOrdersError = null;
      })
      .addCase(getSellerOrders.fulfilled, (state, action) => {
        state.isLoadingShopOrders = false;
        state.shopOrders = action.payload.orders || [];
        state.shopOrdersPagination = action.payload.pagination;
      })
      .addCase(getSellerOrders.rejected, (state, action) => {
        state.isLoadingShopOrders = false;
        state.shopOrdersError = action.payload as string || "Failed to fetch seller orders";
      });

    // Seller: Update Order Status
    builder
      .addCase(updateSellerOrderStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateSellerOrderStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedOrder = action.payload;
        if (updatedOrder) {
          // Update in shopOrders
          const shopIndex = state.shopOrders.findIndex(
            (order) => order._id === updatedOrder._id
          );
          if (shopIndex !== -1) {
            state.shopOrders[shopIndex] = updatedOrder;
          }
          // Update currentOrder if viewing
          if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
            state.currentOrder = updatedOrder;
          }
        }
      })
      .addCase(updateSellerOrderStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string || "Failed to update order status";
      });

    // Seller: Get Order Statistics
    builder
      .addCase(getSellerOrderStatistics.pending, (state) => {
        state.isLoadingSellerStats = true;
        state.sellerStatsError = null;
      })
      .addCase(getSellerOrderStatistics.fulfilled, (state, action) => {
        state.isLoadingSellerStats = false;
        state.sellerStatistics = action.payload;
      })
      .addCase(getSellerOrderStatistics.rejected, (state, action) => {
        state.isLoadingSellerStats = false;
        state.sellerStatsError = action.payload as string || "Failed to fetch seller statistics";
      });
  },
});

