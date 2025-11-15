import { authSlice } from "@/features/auth/authSlice";
import { cartSlice } from "@/features/cart/cartSlice";
import { categorySlice } from "@/features/category/categorySlice";
import { productSlice } from "@/features/product/productSlice";
import { userSlice } from "@/features/user/userSlice";
import { configureStore } from "@reduxjs/toolkit";
import { orderSlice } from "@/features/order/orderSlice"
import { discountSlice } from "@/features/discount/discountSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    product: productSlice.reducer,
    category: categorySlice.reducer,
    user: userSlice.reducer,
    cart: cartSlice.reducer,
    order: orderSlice.reducer,
    discount: discountSlice.reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
