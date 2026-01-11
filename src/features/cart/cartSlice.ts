import { createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
  removeItemsByShop,
} from "./cartAction";
import { CartItem, CartState, groupCartItemsByShop } from "@/types/cart";

const initialState: CartState = {
  data: null,
  isLoading: false,
  error: null,
  selectedItems: [],
  checkoutTotal: 0,
  itemsByShop: [], // NEW: Items grouped by shop
};

const calculateCartTotals = (items: CartItem[], selectedItems: CartItem[]) => {
  const totalAmount = items.reduce((sum, item) => {
    const price =
      item.price?.discountPrice &&
      item.price.discountPrice > 0 &&
      item.price.discountPrice < item.price.currentPrice
        ? item.price.discountPrice
        : item.price?.currentPrice || 0;
    return sum + (price || 0) * item.quantity;
  }, 0);

  const checkoutTotal = selectedItems.reduce((sum, item) => {
    const price =
      item.price?.discountPrice &&
      item.price.discountPrice > 0 &&
      item.price.discountPrice < item.price.currentPrice
        ? item.price.discountPrice
        : item.price?.currentPrice || 0;
    return sum + (price || 0) * item.quantity;
  }, 0);

  return { totalAmount, checkoutTotal };
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
            (item.productId &&
              typeof item.productId === "object" &&
              item.productId._id === action.payload.productId._id &&
              (item.modelId === action.payload.modelId ||
                item.variantId === action.payload.variantId))
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
        const { totalAmount } = calculateCartTotals(
          state.data.items,
          state.selectedItems
        );
        state.data.totalAmount = totalAmount;
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

          state.selectedItems = state.selectedItems.filter(
            (item) => item._id !== action.payload
          );

          const { totalAmount, checkoutTotal } = calculateCartTotals(
            state.data.items,
            state.selectedItems
          );
          state.data.totalAmount = totalAmount;
          state.checkoutTotal = checkoutTotal;
        }
      }
    },
    clearCartLocal: (state) => {
      if (state.data) {
        state.data.items = [];
        state.data.totalAmount = 0;
      }
      state.selectedItems = [];
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

          const selectedItemIndex = state.selectedItems.findIndex(
            (item) => item._id === itemId
          );
          if (selectedItemIndex > -1) {
            state.selectedItems[selectedItemIndex].quantity = quantity;
          }

          const { totalAmount, checkoutTotal } = calculateCartTotals(
            state.data.items,
            state.selectedItems
          );
          state.data.totalAmount = totalAmount;
          state.checkoutTotal = checkoutTotal;
        }
      }
    },

    toggleSelectItem: (state, action) => {
      const itemId = action.payload;
      if (!state.data) return;

      const itemIndex = state.data.items.findIndex(
        (item) => item._id === itemId
      );
      if (itemIndex > -1) {
        const item = state.data.items[itemIndex];
        const isSelected = !item.selected;

        // Cập nhật trạng thái selected trong cart items
        state.data.items[itemIndex].selected = isSelected;

        // Cập nhật selectedItems
        if (isSelected) {
          // Thêm vào selectedItems nếu chưa có
          if (
            !state.selectedItems.find(
              (selectedItem) => selectedItem._id === itemId
            )
          ) {
            state.selectedItems.push(item);
          }
        } else {
          // Xóa khỏi selectedItems
          state.selectedItems = state.selectedItems.filter(
            (selectedItem) => selectedItem._id !== itemId
          );
        }

        // Tính lại checkout total
        const { checkoutTotal } = calculateCartTotals(
          state.data.items,
          state.selectedItems
        );
        state.checkoutTotal = checkoutTotal;
      }
    },

    selectAllItems: (state) => {
      if (!state.data) return;

      // Chọn tất cả items
      state.data.items.forEach((item) => {
        item.selected = true;
      });

      // Cập nhật selectedItems
      state.selectedItems = [...state.data.items];

      // Tính lại checkout total
      const { checkoutTotal } = calculateCartTotals(
        state.data.items,
        state.selectedItems
      );
      state.checkoutTotal = checkoutTotal;
    },

    unselectAllItems: (state) => {
      if (!state.data) return;

      // Bỏ chọn tất cả items
      state.data.items.forEach((item) => {
        item.selected = false;
      });

      // Xóa selectedItems
      state.selectedItems = [];
      state.checkoutTotal = 0;
    },

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
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;

      // extractApiData already extracts the data
      const cartData = action.payload;

      if (cartData && cartData.items) {
        cartData.items = cartData.items.map((item: CartItem) => ({
          ...item,
          selected: item.selected || false,
        }));
      }

      state.data = cartData;

      if (cartData && cartData.items) {
        state.selectedItems = cartData.items.filter(
          (item: CartItem) => item.selected
        );
        const { checkoutTotal } = calculateCartTotals(
          cartData.items,
          state.selectedItems
        );
        state.checkoutTotal = checkoutTotal;
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

      // extractApiData already extracts the data
      const cartData = action.payload;

      if (cartData && cartData.items) {
        cartData.items = cartData.items.map((item: CartItem) => ({
          ...item,
          selected: item.selected || false,
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
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;

      // extractApiData already extracts the data
      const cartData = action.payload;

      if (cartData && cartData.items) {
        cartData.items = cartData.items.map((item: CartItem) => ({
          ...item,
          selected: item.selected || false,
        }));
      }

      state.data = cartData;

      if (cartData && cartData.items) {
        state.selectedItems = cartData.items.filter(
          (item: CartItem) => item.selected
        );
        const { checkoutTotal } = calculateCartTotals(
          cartData.items,
          state.selectedItems
        );
        state.checkoutTotal = checkoutTotal;
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

      // extractApiData already extracts the data
      const cartData = action.payload;

      state.data = cartData;
      state.selectedItems = [];
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

      // extractApiData already extracts the data
      const cartData = action.payload;

      if (cartData) {
        // Optimize: Create map for O(1) lookup instead of O(N) find
        const oldItemsMap = new Map(
          oldItemsWithVariants.map((item) => [item._id, item])
        );

        const updatedItems = cartData.items.map(
          (newItem: Record<string, string>) => {
            const oldItem = oldItemsMap.get(newItem._id);
            return {
              ...newItem,
              variant: oldItem?.variant,
              selected: oldItem?.selected || false,
            };
          }
        );

        state.data = {
          ...cartData,
          items: updatedItems,
        };

        state.selectedItems = updatedItems.filter(
          (item: CartItem) => item.selected
        );
        const { checkoutTotal } = calculateCartTotals(
          updatedItems,
          state.selectedItems
        );
        state.checkoutTotal = checkoutTotal;
      }
    });
    builder.addCase(updateCartItem.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Không thể cập nhật giỏ hàng";
    });

    // NEW: Remove items by shop
    builder.addCase(removeItemsByShop.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(removeItemsByShop.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;

      // extractApiData already extracts the data
      const cartData = action.payload;

      if (cartData && cartData.items) {
        cartData.items = cartData.items.map((item: CartItem) => ({
          ...item,
          selected: item.selected || false,
        }));
        state.itemsByShop = groupCartItemsByShop(cartData.items);
      }

      state.data = cartData;
    });
    builder.addCase(removeItemsByShop.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Không thể xóa sản phẩm theo shop";
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
