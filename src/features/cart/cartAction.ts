import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addToCart = createAsyncThunk(
  "add/cart",
  async ({
    productId,
    variantId,
    quantity = 1,
  }: {
    productId: string;
    variantId: string | null;
    quantity: number;
  }) => {
    const response = await instance.post("/cart", {
      productId,
      variantId,
      quantity,
    });
    if (!response) {
      throw new Error("Failed to add item to cart");
    }

    return response.data;
  }
);

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

export const clearCart = createAsyncThunk("clear/cart", async () => {
  const response = await instance.delete("/cart");
  if (!response) {
    throw new Error("Failed to clear cart");
  }
  console.log("Cart cleared successfully", response);

  return response.data;
});

export const updateCartItem = createAsyncThunk(
  "update/cart",
  async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
    const response = await instance.put(`/cart/${itemId}`, { quantity });
    if (!response) {
      throw new Error("Failed to update item in cart");
    }

    return response.data;
  }
);

export const getCart = createAsyncThunk("get/cart", async () => {
  const response = await instance.get("/cart");
  if (!response) {
    throw new Error("Failed to get cart");
  }

  return response.data;
});
