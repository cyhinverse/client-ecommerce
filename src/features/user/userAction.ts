import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getProfile = createAsyncThunk("user/profile", async () => {
  const response = await instance.get("/users/profile");
  if (!response) {
    throw new Error("Failed to fetch user profile");
  }
  return response.data;
});

export const uploadAvatar = createAsyncThunk(
  "user/upload-avatar",
  async (formData: FormData) => {
    const response = await instance.post("/users/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (!response) {
      throw new Error("Failed to upload avatar");
    }
    return response.data;
  }
);

export const updateProfile = createAsyncThunk(
  "user/update-profile",
  async (profileData: {
    username?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  }) => {
    const response = await instance.put("/users/profile", profileData);
    if (!response) {
      throw new Error("Failed to update profile");
    }
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete-user",
  async (userId: string) => {
    const response = await instance.delete(`/users/${userId}`);
    if (!response) {
      throw new Error("Failed to delete user");
    }
    return response.data;
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
  }) => {
    const response = await instance.post("/users/create", userData);
    if (!response) {
      throw new Error("Failed to create user");
    }
    return response.data;
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
  }) => {
    const response = await instance.post("/users/update", userData);
    if (!response) {
      throw new Error("Failed to update user");
    }
    return response.data;
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
  }) => {
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

    if (!response) {
      throw new Error("Failed to fetch users");
    }
    return {
      users: response.data.data?.data || [],
      pagination: response.data.data?.pagination || null,
    };
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
  }) => {
    const response = await instance.post("/users/address", addressData);
    if (!response) {
      throw new Error("Failed to create address");
    }
    return response.data;
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
  }) => {
    const response = await instance.put(
      `/users/address/${payload.addressId}`,
      payload.addressData
    );
    if (!response) {
      throw new Error("Failed to update address");
    }
    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "address/delete",
  async (addressId: string) => {
    const response = await instance.delete(`/users/address/${addressId}`);
    if (!response.data) {
      throw new Error("Failed to delete address");
    }
    return response.data;
  }
);

export const setDefaultAddress = createAsyncThunk(
  "address/set-default",
  async (addressId: string) => {
    const response = await instance.put(`/users/address/${addressId}/default`);
    if (!response) {
      throw new Error("Failed to set default address");
    }
    return response.data;
  }
);

export const changePassword = createAsyncThunk(
  "user/change-password",
  async (passwordData: {
    oldPassword: string;
    newPassword: string;
    confirmPassword?: string;
  }) => {
    const response = await instance.put("/users/change-password", passwordData);
    if (!response) {
      throw new Error("Failed to change password");
    }
    return response.data;
  }
);

// NOTE: The following 2FA actions are commented out because the backend
// endpoints don't exist yet. Uncomment when backend implements 2FA.

// export const enableTwoFactor = createAsyncThunk(
//   "user/enable-2fa",
//   async () => {
//     const response = await instance.post("/users/enable-2fa");
//     if (!response) {
//       throw new Error("Failed to enable two-factor authentication");
//     }
//     return response.data;
//   }
// );

// export const verifyTwoFactor = createAsyncThunk(
//   "user/verify-2fa",
//   async (verificationCode: string) => {
//     const response = await instance.post("/users/verify-2fa", { verificationCode });
//     if (!response) {
//       throw new Error("Failed to verify two-factor authentication");
//     }
//     return response.data;
//   }
// );

// export const disableTwoFactor = createAsyncThunk(
//   "user/disable-2fa",
//   async () => {
//     const response = await instance.post("/users/disable-2fa");
//     if (!response) {
//       throw new Error("Failed to disable two-factor authentication");
//     }
//     return response.data;
//   }
// );

// NOTE: verifyEmail action is commented out because backend endpoint doesn't exist
// export const verifyEmail = createAsyncThunk(
//   "user/verify-email",
//   async () => {
//     const response = await instance.post("/users/verify-email");
//     if (!response) {
//       throw new Error("Failed to send verification email");
//     }
//     return response.data;
//   }
// );
