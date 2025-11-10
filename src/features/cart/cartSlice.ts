import { createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "./cartAction";

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  images: string[];
  price: {
    currentPrice: number;
    discountPrice: number;
    currency: string;
    _id: string;
  };
  isActive: boolean;
}

interface CartItem {
  _id: string;
  productId: Product;
  variantId: string;
  quantity: number;
  price: {
    currentPrice: number;
    discountPrice: number;
    currency: string;
  };
}

interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface CartState {
  data: Cart | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  data: null,
  isLoading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Local cart actions (optional - for offline support)
    addToCartLocal: (state, action) => {
      if (!state.data) {
        state.data = {
          userId: "", // Will be set when synced with server
          items: [action.payload],
          totalAmount:
            action.payload.price.currentPrice * action.payload.quantity,
        };
      } else {
        const existingItemIndex = state.data.items.findIndex(
          (item) => item._id === action.payload._id,
        );

        if (existingItemIndex > -1) {
          // Update existing item
          state.data.items[existingItemIndex].quantity +=
            action.payload.quantity;
        } else {
          // Add new item
          state.data.items.push(action.payload);
        }

        // Recalculate total
        state.data.totalAmount = state.data.items.reduce(
          (sum, item) => sum + item.price.currentPrice * item.quantity,
          0,
        );
      }
    },
    removeFromCartLocal: (state, action) => {
      if (state.data) {
        const itemToRemove = state.data.items.find(
          (item) => item._id === action.payload,
        );
        if (itemToRemove) {
          state.data.items = state.data.items.filter(
            (item) => item._id !== action.payload,
          );
          state.data.totalAmount = state.data.items.reduce(
            (sum, item) => sum + item.price.currentPrice * item.quantity,
            0,
          );
        }
      }
    },
    clearCartLocal: (state) => {
      if (state.data) {
        state.data.items = [];
        state.data.totalAmount = 0;
      }
    },
    updateCartLocal: (state, action) => {
      if (state.data) {
        const { itemId, quantity } = action.payload;
        const itemIndex = state.data.items.findIndex(
          (item) => item._id === itemId,
        );

        if (itemIndex > -1) {
          state.data.items[itemIndex].quantity = quantity;
          state.data.totalAmount = state.data.items.reduce(
            (sum, item) => sum + item.price.currentPrice * item.quantity,
            0,
          );
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get Cart
    builder.addCase(getCart.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;

      // Handle different API response structures
      if (action.payload.data) {
        state.data = action.payload.data; // { data: cart, status, message }
      } else {
        state.data = action.payload; // Direct cart data
      }
    });
    builder.addCase(getCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Không thể lấy giỏ hàng";
    });

    // Add to Cart
    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;

      if (action.payload.data) {
        state.data = action.payload.data;
      } else {
        state.data = action.payload;
      }
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        action.error.message || "Không thể thêm sản phẩm vào giỏ hàng";
    });

    // Remove from Cart
    builder.addCase(removeFromCart.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;

      if (action.payload.data) {
        state.data = action.payload.data;
      } else {
        state.data = action.payload;
      }
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        action.error.message || "Không thể xóa sản phẩm khỏi giỏ hàng";
    });

    // Clear Cart
    builder.addCase(clearCart.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(clearCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;

      if (action.payload.data) {
        state.data = action.payload.data;
      } else {
        state.data = action.payload;
      }
    });
    builder.addCase(clearCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Không thể xóa giỏ hàng";
    });

    // Update Cart Item - FIXED VERSION
    builder.addCase(updateCartItem.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      // DON'T set state.data = null here - we want to keep current data
    });
    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;

      // Handle different response structures
      if (action.payload.data) {
        // Standard API response: { data: cart, status, message }
        state.data = action.payload.data;
      } else if (action.payload.cart) {
        // Alternative structure: { cart: cartData }
        state.data = action.payload.cart;
      } else if (action.payload.updatedItem) {
        // If API returns only the updated item, update it in current cart
        if (state.data?.items) {
          const itemIndex = state.data.items.findIndex(
            (item) => item._id === action.payload.updatedItem._id,
          );
          if (itemIndex > -1) {
            state.data.items[itemIndex] = action.payload.updatedItem;
            // Recalculate total
            state.data.totalAmount = state.data.items.reduce(
              (sum, item) => sum + item.price.currentPrice * item.quantity,
              0,
            );
          }
        }
      } else {
        // Direct cart data
        state.data = action.payload;
      }
    });
    builder.addCase(updateCartItem.rejected, (state, action) => {
      console.log("❌ updateCartItem.rejected:", action.error);
      state.isLoading = false;
      state.error = action.error.message || "Không thể cập nhật giỏ hàng";
    });
  },
});

export const {
  addToCartLocal,
  removeFromCartLocal,
  clearCartLocal,
  updateCartLocal,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;
