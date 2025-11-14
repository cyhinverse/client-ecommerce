import { createSlice } from "@reduxjs/toolkit";
import {
  getAllUsers,
  getProfile,
  updateUser,
  uploadAvatar,
} from "./userAction";
import { UserState } from "@/types/user";
import { Pagination } from "@/components/ui/pagination";

const initialState: UserState = {
  user: [],
  pagination: null,
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
    // setUploadAvatar: (state, action) => {
    //   if (state.user) {
    //     state.user.avatar = action.payload;
    //   }
    // },
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
    // Get all users
    builder.addCase(getAllUsers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.users;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch users";
    });

    // Upload user
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.user) {
        const index = state.user.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) {
          state.user[index] = action.payload;
        }
      }
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to update user";
    });
  },
});
