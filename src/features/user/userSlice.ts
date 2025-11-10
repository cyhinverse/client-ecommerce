import { createSlice } from "@reduxjs/toolkit";
import { getProfile, uploadAvatar } from "./userAction";

interface address {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  address: address[];
  avatar: string;
  isVerifiedEmail: boolean;
  createdAt: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload?.data;
    });
    builder.addCase(getProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch user profile";
    });

    builder.addCase(uploadAvatar.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(uploadAvatar.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.user) {
        state.user.avatar = action.payload?.data.avatar;
      }
    });
    builder.addCase(uploadAvatar.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to upload avatar";
    });
  },
});
