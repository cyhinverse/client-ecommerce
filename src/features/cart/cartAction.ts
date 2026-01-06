import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddToCartPayload, UpdateCartItemPayload } from "@/types/cart";

// Add to cart - Updated to use modelId instead of variantId
export const addToCart = createAsyncThunk(
  "add/cart",
  async ({
    productId,
    shopId,
    modelId,
    quantity = 1,
    // DEPRECATED: variantId kept for backward compatibility
    variantId,
  }: AddToCartPayload & { variantId?: string | null }) => {
    const response = await instance.post("/cart", {
      productId,
      shopId,
      modelId: modelId || variantId, // Use modelId, fallback to variantId
      quantity,
    });
    if (!response) {
      throw new Error("Failed to add item to cart");
    }

    return response.data;
  }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk(
  "remove/cart",
  async ({ itemId }: { itemId: string }) => {
    const response = await instance.delete(`/cart/${itemId}`);
    if (!response) {
      throw new Error("Failed to remove item from cart");
    }

    return response.data;
  }
);

// Clear entire cart
export const clearCart = createAsyncThunk("clear/cart", async () => {
  const response = await instance.delete("/cart");
  if (!response) {
    throw new Error("Failed to clear cart");
  }
  console.log("Cart cleared successfully", response);

  return response.data;
});

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  "update/cart",
  async ({ itemId, quantity }: UpdateCartItemPayload) => {
    const response = await instance.put(`/cart/${itemId}`, { quantity });
    if (!response) {
      throw new Error("Failed to update item in cart");
    }

    return response.data;
  }
);

// Get cart
export const getCart = createAsyncThunk("get/cart", async () => {
  const response = await instance.get("/cart");
  if (!response) {
    throw new Error("Failed to get cart");
  }

  return response.data;
});

// NEW: Remove items by shop
export const removeItemsByShop = createAsyncThunk(
  "remove/cart/shop",
  async ({ shopId }: { shopId: string }) => {
    const response = await instance.delete(`/cart/shop/${shopId}`);
    if (!response) {
      throw new Error("Failed to remove items by shop");
    }

    return response.data;
  }
);
