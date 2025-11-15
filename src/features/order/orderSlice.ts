import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  cancelOrder,
  changeOrderStatus,
  getListOrders,
  getOrderById,
  getUserOrder,
  getOrderStatistics,
} from "./orderAction";

// Import types từ file types/order.ts
import { Order, PaginationData } from "@/types/order";

interface OrderState {
  orders: Order[]; // Đổi từ 'order' sang 'orders' (mảng orders)
  currentOrder: Order | null; // Order hiện tại đang xem/chỉnh sửa
  pagination: PaginationData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [], // Danh sách orders
  currentOrder: null, // Order đơn lẻ
  pagination: null,
  isLoading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Cập nhật order trong danh sách
    updateOrderInList: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(order => order._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    // Xóa order khỏi danh sách
    removeOrderFromList: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(order => order._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Get user orders - trả về danh sách orders
    builder.addCase(getUserOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload.orders || action.payload;
      state.pagination = action.payload.pagination || null;
    });
    builder.addCase(getUserOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch user orders";
    });

    // Get Order By ID - trả về 1 order
    builder.addCase(getOrderById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getOrderById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentOrder = action.payload;
      // Cập nhật order trong danh sách nếu có
      const index = state.orders.findIndex(order => order._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    });
    builder.addCase(getOrderById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch order by ID";
    });

    // Cancel Order - cập nhật order cụ thể
    builder.addCase(cancelOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      const updatedOrder = action.payload;
      // Cập nhật trong danh sách
      const index = state.orders.findIndex(order => order._id === updatedOrder._id);
      if (index !== -1) {
        state.orders[index] = updatedOrder;
      }
      // Cập nhật currentOrder nếu đang xem order này
      if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
        state.currentOrder = updatedOrder;
      }
    });
    builder.addCase(cancelOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to cancel order";
    });

    // Get list Orders (admin) - trả về danh sách orders với pagination
    builder.addCase(getListOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getListOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload.orders || action.payload.data || action.payload;
      console.log(`Lấy danh sách order`, action.payload)
      state.pagination = action.payload.pagination || action.payload.meta || null;
    });
    builder.addCase(getListOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch orders";
    });

    // Change Order Status - cập nhật order cụ thể
    builder.addCase(changeOrderStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(changeOrderStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      const updatedOrder = action.payload;
      // Cập nhật trong danh sách
      const index = state.orders.findIndex(order => order._id === updatedOrder._id);
      if (index !== -1) {
        state.orders[index] = updatedOrder;
      }
      // Cập nhật currentOrder nếu đang xem order này
      if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
        state.currentOrder = updatedOrder;
      }
    });
    builder.addCase(changeOrderStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to change order status";
    });

    // Overview Order - thống kê, có thể trả về dạng khác
    builder.addCase(getOrderStatistics.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getOrderStatistics.fulfilled, (state, action) => {
      state.isLoading = false;
      // Tuỳ thuộc vào API trả về gì cho overview
      // Nếu là thống kê thì có thể lưu vào state riêng
      state.orders = action.payload.orders || action.payload;
    });
    builder.addCase(getOrderStatistics.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to overview orders";
    });
  },
});

export const {
  setLoading,
  setError,
  clearCurrentOrder,
  clearError,
  updateOrderInList,
  removeOrderFromList,
} = orderSlice.actions;

export default orderSlice.reducer;