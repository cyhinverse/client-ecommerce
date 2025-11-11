import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "@/types/auth";
import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  sendCode,
  verifyCode,
} from "./authAction";

const initState: AuthState = {
  loading: false,
  isAuthenticated: false,
  token: null,
  data: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setUserData: (state, action: PayloadAction<User | null>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login actions
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload?.data.accessToken;
      localStorage.setItem(
        "accessToken",
        action.payload?.data.accessToken || ""
      );
      state.data = action.payload?.data;
      if (state.data) {
        state.data = {
          ...state.data,
          avatar: state.data.avatar,
        };
      }
    });
    builder.addCase(login.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.data = null;
    });

    // Register actions
    builder.addCase(register.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(register.rejected, (state) => {
      state.loading = false;
    });

    // Logout actions
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.data = null;
    });
    builder.addCase(logout.rejected, (state) => {
      state.loading = false;
    });

    // Verify Email actions can be added here similarly
    builder.addCase(sendCode.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(sendCode.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(sendCode.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(verifyCode.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(verifyCode.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(verifyCode.rejected, (state) => {
      state.loading = false;
    });

    // forgot password actions can be added here similarly
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(forgotPassword.rejected, (state) => {
      state.loading = false;
    });

    // reset password actions can be added here similarly
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(resetPassword.rejected, (state) => {
      state.loading = false;
    });
  },
});
