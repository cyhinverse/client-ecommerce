import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { authSlice } from "@/features/auth/authSlice";
import { cartSlice } from "@/features/cart/cartSlice";
import { categorySlice } from "@/features/category/categorySlice";
import { productSlice } from "@/features/product/productSlice";
import { userSlice } from "@/features/user/userSlice";
import { discountSlice } from "@/features/discount/discountSlice";
import { orderSlice } from "@/features/order/orderSlice";
import { paymentSlice } from "@/features/payment/paymentSlice";
import { notificationSlice } from "@/features/notification/notificationSlice";
import { reviewSlice } from "@/features/reviews/reviewSlice";
import { statisticsSlice } from "@/features/statistics/statisticsSlice";
import { bannerSlice } from "@/features/banner/bannerSlice";
import { injectStore } from "@/api/api";

const createNoopStorage = () => {
  return {
    getItem(_key: string): Promise<null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string): Promise<string> {
      return Promise.resolve(value);
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export const rootReducer = combineReducers({
  auth: authSlice.reducer,
  category: categorySlice.reducer,
  cart: cartSlice.reducer,
  user: userSlice.reducer,
  product: productSlice.reducer,
  discount: discountSlice.reducer,
  order: orderSlice.reducer,
  payment: paymentSlice.reducer,
  notification: notificationSlice.reducer,
  reviews: reviewSlice.reducer,
  statistics: statisticsSlice.reducer,
  banner: bannerSlice.reducer,
});

const persistConfig = {
  key: "root_ecommerce_v1",
  storage,
  whitelist: ["auth", "cart", "order"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }),
});

injectStore(store);

export const persistor = persistStore(store);

// QUAN TRỌNG: Export types đúng cách
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
