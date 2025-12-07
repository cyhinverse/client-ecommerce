import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getListNotification = createAsyncThunk(
    "notification/getListNotification",
    async ({ page = 1, limit = 10 }: { page?: number, limit?: number } = {}, { rejectWithValue }) => {
        try{
            const response = await instance.get("/notifications", {
                params: { page, limit },
                withCredentials: true,
            });
            return response.data;
        }catch(error: any) {
            const message = error.response?.data?.message || "Lấy danh sách thông báo thất bại";
            return rejectWithValue({ message });
        }
    }
)

// Note: This endpoint does not appear in the provided notification.controller.js
export const markAsReadNotification = createAsyncThunk(
    "notification/markAsReadNotification",
    async (notificationId: string, { rejectWithValue }) => {
        try{
            const response = await instance.post(`/notifications/${notificationId}/read`, {}, {
                withCredentials: true,
            });
            return response.data;
        }catch(error: any) {
            const message = error.response?.data?.message || "Đánh dấu thông báo là đã đọc thất bại";
            return rejectWithValue({ message });
        }
    }
)

export const markAllAsReadNotification = createAsyncThunk(
    "notification/markAllAsReadNotification",
    async (_, { rejectWithValue }) => {
        try{
            // Fixed: Backend uses PATCH /read-all
            const response = await instance.patch(`/notifications/read-all`, {}, {
                withCredentials: true,
            });
            return response.data;
        }catch(error: any) {
            const message = error.response?.data?.message || "Đánh dấu tất cả thông báo là đã đọc thất bại";
            return rejectWithValue({ message });
        }
    }
)

export const cleanNotification = createAsyncThunk(
    "notification/cleanNotification",
    async (_, { rejectWithValue }) => {
        try{
            // Backend uses DELETE /
            const response = await instance.delete(`/notifications`, {
                withCredentials: true,
            });
            return response.data;
        }catch(error: any) {
            const message = error.response?.data?.message || "Xóa tất cả thông báo thất bại";
            return rejectWithValue({ message });
        }
    }
)

export const countUnreadNotification = createAsyncThunk(
    "notification/countUnreadNotification",
    async (_, { rejectWithValue }) => {
        try{
            // Backend uses GET /count
            const response = await instance.get(`/notifications/count`, {
                withCredentials: true,
            });
            return response.data;
        }catch(error: any) {
            const message = error.response?.data?.message || "Lấy số lượng thông báo chưa đọc thất bại";
            return rejectWithValue({ message });
        }
    }
)

export const createNotification = createAsyncThunk(
    "notification/createNotification",
    async (data: any, { rejectWithValue }) => {
        try{
            const response = await instance.post(`/notifications`, data, {
                withCredentials: true,
            });
            return response.data;
        }catch(error: any) {
            const message = error.response?.data?.message || "Tạo thông báo thất bại";
            return rejectWithValue({ message });
        }
    }
)

export const getNotificationById = createAsyncThunk(
    "notification/getDetails",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await instance.get(`/notifications/${id}`, { withCredentials: true });
            return response.data;
        } catch (error: any) {
            return rejectWithValue({ message: error.response?.data?.message || "Lấy chi tiết thông báo thất bại" });
        }
    }
);

export const updateNotification = createAsyncThunk(
    "notification/update",
    async ({ id, data }: { id: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await instance.patch(`/notifications/${id}`, data, { withCredentials: true });
            return response.data;
        } catch (error: any) {
            return rejectWithValue({ message: error.response?.data?.message || "Cập nhật thông báo thất bại" });
        }
    }
);
