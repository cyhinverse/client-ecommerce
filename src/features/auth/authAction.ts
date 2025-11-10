import instance from "@/api/api";
import { AuthLogin, AuthRegister } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const login = createAsyncThunk(
  "auth/login",
  async (Credentials: AuthLogin, { rejectWithValue }) => {
    try {
      const response = await instance.post("/auth/login", Credentials, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Đăng nhập thất bại";
      return rejectWithValue({ message });
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (Credentials: AuthRegister, { rejectWithValue }) => {
    try {
      const response = await instance.post("/auth/register", Credentials, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Đăng ký thất bại";
      return rejectWithValue({ message });
    }
  }
);

export const sendCode = createAsyncThunk(
  "auth/verifyEmail",
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response = await instance.post(
        "/auth/send-verification-code",
        data,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Xác thực email thất bại";
      return rejectWithValue({ message });
    }
  }
);

export const verifyCode = createAsyncThunk(
  "auth/verify-email",
  async (code: string) => {
    const response = await instance.post("/auth/verify-code", { code });
    return response.data;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  const response = await instance.post("/auth/logout");
  return response.data;
});

export const forgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await instance.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Yêu cầu đặt lại mật khẩu thất bại";
      return rejectWithValue({ message });
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    {
      email,
      code,
      newPassword,
    }: { email: string; code: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post("/auth/reset-password", {
        email,
        code,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      console.error("Reset password error:", error.response?.data);
      return rejectWithValue(
        error.response?.data || { message: "Reset password failed" }
      );
    }
  }
);
