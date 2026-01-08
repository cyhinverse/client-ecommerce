import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { extractApiData, extractApiError } from "@/utils/api";

export interface CreateNotificationData {
  title: string;
  message: string;
  type?: string;
  userId?: string;
  link?: string;
  orderId?: string;
}

interface UpdateNotificationData {
  title?: string;
  message?: string;
  type?: string;
  isRead?: boolean;
  link?: string;
  orderId?: string;
}

export const getListNotification = createAsyncThunk(
  "notification/getListNotification",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get("/notifications", {
        params: { page, limit },
        withCredentials: true,
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Mark single notification as read - Uses PATCH to update isRead field
export const markAsReadNotification = createAsyncThunk(
  "notification/markAsReadNotification",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await instance.patch(
        `/notifications/${notificationId}`,
        { isRead: true },
        {
          withCredentials: true,
        }
      );
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const markAllAsReadNotification = createAsyncThunk(
  "notification/markAllAsReadNotification",
  async (_, { rejectWithValue }) => {
    try {
      // Fixed: Backend uses PATCH /read-all
      const response = await instance.patch(
        `/notifications/read-all`,
        {},
        {
          withCredentials: true,
        }
      );
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const cleanNotification = createAsyncThunk(
  "notification/cleanNotification",
  async (_, { rejectWithValue }) => {
    try {
      // Backend uses DELETE /
      const response = await instance.delete(`/notifications`, {
        withCredentials: true,
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const countUnreadNotification = createAsyncThunk(
  "notification/countUnreadNotification",
  async (_, { rejectWithValue }) => {
    try {
      // Backend uses GET /count
      const response = await instance.get(`/notifications/count`, {
        withCredentials: true,
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const createNotification = createAsyncThunk(
  "notification/createNotification",
  async (data: CreateNotificationData, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/notifications`, data, {
        withCredentials: true,
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const getNotificationById = createAsyncThunk(
  "notification/getDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/notifications/${id}`, {
        withCredentials: true,
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const updateNotification = createAsyncThunk(
  "notification/update",
  async (
    { id, data }: { id: string; data: UpdateNotificationData },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.patch(`/notifications/${id}`, data, {
        withCredentials: true,
      });
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);
