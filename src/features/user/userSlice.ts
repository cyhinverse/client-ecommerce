import { createSlice } from "@reduxjs/toolkit";
import {
  getAllUsers,
  getProfile,
  updateUser,
  uploadAvatar,
  updateProfile,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  changePassword,
} from "./userAction";
import { User, UserState } from "@/types/user";

const initialState: UserState = {
  user: [],
  pagination: null,
  isLoading: false,
  error: null,
  isUploadingAvatar: false,
  isChangingPassword: false,
  isUpdatingProfile: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateAvatarLocal: (state, action) => {
      if (state.user.length > 0) {
        state.user[0].avatar = action.payload;
      }
    },
    clearUser: (state) => {
      state.user = [];
      state.pagination = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get Profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // extractApiData already extracts the data
        state.user = [action.payload];
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch user profile";
      });

    // Upload Avatar
    builder
      .addCase(uploadAvatar.pending, (state) => {
        state.isUploadingAvatar = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.isUploadingAvatar = false;
        // extractApiData already extracts the data
        // Cập nhật avatar ngay lập tức trong state
        if (state.user.length > 0) {
          state.user[0].avatar =
            action.payload?.avatar ||
            action.payload?.avatarUrl ||
            action.payload?.user?.avatar;
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isUploadingAvatar = false;
        state.error = action.error.message || "Failed to upload avatar";
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        // extractApiData already extracts the data
        if (state.user.length > 0 && action.payload) {
          state.user[0] = { ...state.user[0], ...action.payload };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdatingProfile = false;
        state.error = action.error.message || "Failed to update profile";
      });

    // Get All Users
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch users";
      });

    // Update User
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // extractApiData already extracts the data
        if (state.user.length > 0 && action.payload) {
          const index = state.user.findIndex(
            (u) => u._id === action.payload?._id
          );
          if (index !== -1) {
            state.user[index] = action.payload;
          }
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update user";
      });

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.isChangingPassword = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isChangingPassword = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isChangingPassword = false;
        state.error = action.error.message || "Failed to change password";
      });

    // Address Management
    builder
      .addCase(createAddress.fulfilled, (state, action) => {
        // extractApiData already extracts the data
        if (state.user.length > 0 && action.payload) {
          state.user[0].addresses.push(action.payload);
        }
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        // extractApiData already extracts the data
        if (state.user.length > 0 && action.payload) {
          const index = state.user[0].addresses.findIndex(
            (addr) => addr._id === action.payload?._id
          );
          if (index !== -1) {
            state.user[0].addresses[index] = action.payload;
          }
        }
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        if (state.user.length > 0) {
          state.user[0].addresses = state.user[0].addresses.filter(
            (addr) => addr._id !== action.meta.arg
          );
        }
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        // extractApiData already extracts the data
        if (state.user.length > 0 && action.payload) {
          // Set all addresses to non-default first
          state.user[0].addresses.forEach((addr) => {
            addr.isDefault = false;
          });
          // Set the specified address as default
          const index = state.user[0].addresses.findIndex(
            (addr) => addr._id === action.payload?._id
          );
          if (index !== -1) {
            state.user[0].addresses[index].isDefault = true;
          }
        }
      });
  },
});

export const { clearError, setUser, updateAvatarLocal, clearUser } =
  userSlice.actions;
export default userSlice.reducer;
