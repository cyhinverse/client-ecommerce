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
