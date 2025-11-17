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
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
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
  order: orderSlice.reducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart"],
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

export const persistor = persistStore(store);
