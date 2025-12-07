import { createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "./cartAction";
import { CartItem, CartState } from "@/types/cart";



const initialState: CartState = {
  data: null,
  isLoading: false,
  error: null,
  selectedItems: [], 
  checkoutTotal: 0, 
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartLocal: (state, action) => {
      if (!state.data) {
        state.data = {
          userId: "",
          items: [action.payload],
          totalAmount:
            action.payload.price.currentPrice * action.payload.quantity,
        };
      } else {
        const existingItemIndex = state.data.items.findIndex(
          (item) =>
            item._id === action.payload._id ||
            (item.productId._id === action.payload.productId._id &&
              item.variantId === action.payload.variantId)
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
          (sum, item) => sum + (item.price.currentPrice || 0) * item.quantity,
          0
        );
      }
    },
    removeFromCartLocal: (state, action) => {
      if (state.data) {
        const itemToRemove = state.data.items.find(
          (item) => item._id === action.payload
        );
        if (itemToRemove) {
          state.data.items = state.data.items.filter(
            (item) => item._id !== action.payload
          );
          state.data.totalAmount = state.data.items.reduce(
            (sum, item) => sum + (item.price.currentPrice || 0) * item.quantity,
            0
          );

          // ✅ CẬP NHẬT SELECTED ITEMS NẾU XÓA ITEM ĐANG CHỌN
          state.selectedItems = state.selectedItems.filter(
            (item) => item._id !== action.payload
          );
          state.checkoutTotal = state.selectedItems.reduce(
            (sum, item) => sum + (item.price.currentPrice || 0) * item.quantity,
            0
          );
        }
      }
    },
    clearCartLocal: (state) => {
      if (state.data) {
        state.data.items = [];
        state.data.totalAmount = 0;
      }
      state.selectedItems = []; // ✅ XÓA SELECTED ITEMS
      state.checkoutTotal = 0;
    },
    updateCartLocal: (state, action) => {
      if (state.data) {
        const { itemId, quantity } = action.payload;
        const itemIndex = state.data.items.findIndex(
          (item) => item._id === itemId
        );

        if (itemIndex > -1) {
          state.data.items[itemIndex].quantity = quantity;
          state.data.totalAmount = state.data.items.reduce(
            (sum, item) => sum + (item.price.currentPrice || 0) * item.quantity,
            0
          );

          // ✅ CẬP NHẬT SELECTED ITEMS NẾU ITEM ĐANG CHỌN
          const selectedItemIndex = state.selectedItems.findIndex(
            (item) => item._id === itemId
          );
          if (selectedItemIndex > -1) {
            state.selectedItems[selectedItemIndex].quantity = quantity;
            state.checkoutTotal = state.selectedItems.reduce(
              (sum, item) => sum + (item.price.currentPrice || 0) * item.quantity,
              0
            );
          }
        }
      }
    },

    // ✅ THÊM REDUCERS MỚI CHO VIỆC CHỌN SẢN PHẨM
    toggleSelectItem: (state, action) => {
      const itemId = action.payload;
      if (!state.data) return;

      const itemIndex = state.data.items.findIndex(item => item._id === itemId);
      if (itemIndex > -1) {
        const item = state.data.items[itemIndex];
        const isSelected = !item.selected;

        // Cập nhật trạng thái selected trong cart items
        state.data.items[itemIndex].selected = isSelected;

        // Cập nhật selectedItems
        if (isSelected) {
          // Thêm vào selectedItems nếu chưa có
          if (!state.selectedItems.find(selectedItem => selectedItem._id === itemId)) {
            state.selectedItems.push(item);
          }
        } else {
          // Xóa khỏi selectedItems
          state.selectedItems = state.selectedItems.filter(
            selectedItem => selectedItem._id !== itemId
          );
        }

        // Tính lại checkout total
        state.checkoutTotal = state.selectedItems.reduce(
          (sum, item) => sum + (item.price.currentPrice || 0) * item.quantity,
          0
        );
      }
    },

    selectAllItems: (state) => {
      if (!state.data) return;

      // Chọn tất cả items
      state.data.items.forEach(item => {
        item.selected = true;
      });

      // Cập nhật selectedItems
      state.selectedItems = [...state.data.items];

      // Tính lại checkout total
      state.checkoutTotal = state.selectedItems.reduce(
        (sum, item) => sum + (item.price.currentPrice || 0) * item.quantity,
        0
      );
    },

    unselectAllItems: (state) => {
      if (!state.data) return;

      // Bỏ chọn tất cả items
      state.data.items.forEach(item => {
        item.selected = false;
      });

      // Xóa selectedItems
      state.selectedItems = [];
      state.checkoutTotal = 0;
    },

    // ✅ CHUẨN BỊ CHO CHECKOUT - CHỈ GIỮ LẠI SELECTED ITEMS
    prepareForCheckout: (state) => {
      if (!state.data) return;

      // Chỉ giữ lại selected items trong cart
      state.data.items = state.selectedItems;
      state.data.totalAmount = state.checkoutTotal;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get Cart
    builder.addCase(getCart.pending, (state) => {
      console.log("🔄 getCart.pending");
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;

      // Handle different API response structures
      let cartData = null;
      if (action.payload.data) {
        cartData = action.payload.data;
      } else {
        cartData = action.payload;
      }

      // ✅ THÊM TRƯỜNG SELECTED CHO MỖI ITEM KHI LẤY CART
      if (cartData && cartData.items) {
        cartData.items = cartData.items.map((item: CartItem) => ({
          ...item,
          selected: item.selected || false
        }));
      }

      state.data = cartData;

      // ✅ KHỞI TẠO SELECTED ITEMS TỪ CART DATA
      if (cartData && cartData.items) {
        state.selectedItems = cartData.items.filter((item: CartItem) => item.selected);
        state.checkoutTotal = state.selectedItems.reduce(
          (sum, item) => sum + (item.price.currentPrice || 0) * item.quantity,
          0
        );
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

      let cartData = null;
      if (action.payload.data) {
        cartData = action.payload.data;
      } else {
        cartData = action.payload;
      }

      // ✅ THÊM TRƯỜNG SELECTED CHO MỖI ITEM
      if (cartData && cartData.items) {
        cartData.items = cartData.items.map((item: CartItem) => ({
          ...item,
          selected: item.selected || false
        }));
      }

      state.data = cartData;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        action.error.message || "Không thể thêm sản phẩm vào giỏ hàng";
    });

    // Remove from Cart
    builder.addCase(removeFromCart.pending, (state) => {
      console.log("🔄 removeFromCart.pending");
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;

      let cartData = null;
      if (action.payload.data) {
        cartData = action.payload.data;
      } else if (action.payload) {
        cartData = action.payload;
      }

      // ✅ THÊM TRƯỜNG SELECTED CHO MỖI ITEM
      if (cartData && cartData.items) {
        cartData.items = cartData.items.map((item: CartItem) => ({
          ...item,
          selected: item.selected || false
        }));
      }

      state.data = cartData;

      // ✅ CẬP NHẬT SELECTED ITEMS
      if (cartData && cartData.items) {
        state.selectedItems = cartData.items.filter((item: CartItem) => item.selected);
        state.checkoutTotal = state.selectedItems.reduce(
          (sum, item) => sum + (item.price.currentPrice || 0) * item.quantity,
          0
        );
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

      let cartData = null;
      if (action.payload.data) {
        cartData = action.payload.data;
      } else {
        cartData = action.payload;
      }

      state.data = cartData;
      state.selectedItems = []; // ✅ XÓA SELECTED ITEMS
      state.checkoutTotal = 0;
    });
    builder.addCase(clearCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Không thể xóa giỏ hàng";
    });

    builder.addCase(updateCartItem.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      const oldItemsWithVariants = state.data?.items || [];

      let cartData = null;
      if (action.payload.data) {
        cartData = action.payload.data;
      } else if (action.payload) {
        cartData = action.payload;
      }

      if (cartData) {
        const updatedItems = cartData.items.map((newItem: Record<string,string>) => {
          const oldItem = oldItemsWithVariants.find(
            (item) => item._id === newItem._id
          );
          return {
            ...newItem,
            variant: oldItem?.variant,
            selected: oldItem?.selected || false // ✅ GIỮ LẠI TRẠNG THÁI SELECTED
          };
        });

        state.data = {
          ...cartData,
          items: updatedItems,
        };

        // ✅ CẬP NHẬT SELECTED ITEMS
        state.selectedItems = updatedItems.filter((item: CartItem) => item.selected);
        state.checkoutTotal = state.selectedItems.reduce(
          (sum, item) => sum + (item.price.currentPrice || 0) * item.quantity,
          0
        );
      }
    });
    builder.addCase(updateCartItem.rejected, (state, action) => {
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
  toggleSelectItem,
  selectAllItems,
  unselectAllItems,
  prepareForCheckout,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;