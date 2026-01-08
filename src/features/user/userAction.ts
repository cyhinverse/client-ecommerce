import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { extractApiData, extractApiError } from "@/utils/api";

export const getProfile = createAsyncThunk(
  "user/profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/users/profile");
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "user/upload-avatar",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await instance.post("/users/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/update-profile",
  async (profileData: {
    username?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await instance.put("/users/profile", profileData);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete-user",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`/users/${userId}`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const createUser = createAsyncThunk(
  "user/create",
  async (userData: {
    name: string;
    email: string;
    phone: string;
    roles: string;
    isVerifiedEmail: boolean;
  }, { rejectWithValue }) => {
    try {
      const response = await instance.post("/users/create", userData);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async (userData: {
    username: string;
    email: string;
    id: string;
    isVerifiedEmail: boolean;
    roles: string;
  }, { rejectWithValue }) => {
    try {
      const response = await instance.post("/users/update", userData);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/all",
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isVerifiedEmail?: boolean;
  }, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        role = "",
        isVerifiedEmail,
      } = params;
      const response = await instance.get("/users", {
        params: { page, limit, search, role, isVerifiedEmail },
      });

      const data = extractApiData<{ data?: unknown[]; pagination?: unknown }>(response);
      return {
        users: data?.data || [],
        pagination: data?.pagination || null,
      };
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const createAddress = createAsyncThunk(
  "address/create",
  async (addressData: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    isDefault?: boolean;
  }, { rejectWithValue }) => {
    try {
      const response = await instance.post("/users/address", addressData);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const updateAddress = createAsyncThunk(
  "address/update",
  async (payload: {
    addressId: string;
    addressData: {
      fullName?: string;
      phone?: string;
      address?: string;
      city?: string;
      district?: string;
      ward?: string;
      isDefault?: boolean;
    };
  }, { rejectWithValue }) => {
    try {
      const response = await instance.put(
        `/users/address/${payload.addressId}`,
        payload.addressData
      );
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/delete",
  async (addressId: string, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`/users/address/${addressId}`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  "address/set-default",
  async (addressId: string, { rejectWithValue }) => {
    try {
      const response = await instance.put(`/users/address/${addressId}/default`);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/change-password",
  async (passwordData: {
    oldPassword: string;
    newPassword: string;
    confirmPassword?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await instance.put("/users/change-password", passwordData);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);
