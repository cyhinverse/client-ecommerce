import { createSlice } from "@reduxjs/toolkit";
import {
  cancelOrder,
  changeOrderStatus,
  getListOrders,
  getOrderById,
  getUserOrder,
  overviewOrders,
} from "./orderAction";

interface OrderData {}

interface Pagination {}

interface OrderState {
  order: OrderData | null;
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
}

const intitialState: OrderState = {
  order: null,
  pagination: null,
  isLoading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: "order",
  initialState: intitialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    createOrder: (state, action) => {
      state.order = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get user orders
    builder.addCase(getUserOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.order = action.payload;
    });
    builder.addCase(getUserOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch user orders";
    });

    // Get Order By ID
    builder.addCase(getOrderById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getOrderById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.order = action.payload;
    });
    builder.addCase(getOrderById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch order by ID";
    });

    // Cancel Order
    builder.addCase(cancelOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.order = action.payload;
    });
    builder.addCase(cancelOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to cancel order";
    });

    // Get list Orders
    builder.addCase(getListOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getListOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.order = action.payload;
    });
    builder.addCase(getListOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch orders";
    });

    // Change Order Status
    builder.addCase(changeOrderStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(changeOrderStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.order = action.payload;
    });
    builder.addCase(changeOrderStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to change order status";
    });

    // Overview Order
    builder.addCase(overviewOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(overviewOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.order = action.payload;
    });
    builder.addCase(overviewOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to overview orders";
    });
  },
});
