import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SendMessagePayload, StartConversationPayload } from "@/types/chat";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

// Start a new conversation with a shop
export const startConversation = createAsyncThunk(
  "chat/startConversation",
  async (data: StartConversationPayload, { rejectWithValue }) => {
    try {
      const response = await instance.post("/chat/conversations", data);
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể bắt đầu cuộc trò chuyện";
      return rejectWithValue({ message });
    }
  }
);

// Get user's conversations
export const getMyConversations = createAsyncThunk(
  "chat/getMyConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/chat/conversations");
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy danh sách cuộc trò chuyện";
      return rejectWithValue({ message });
    }
  }
);

// Get messages in a conversation
export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (
    { conversationId, page = 1, limit = 50 }: { conversationId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get(
        `/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
      );
      return {
        conversationId,
        messages: response.data.data || response.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể lấy tin nhắn";
      return rejectWithValue({ message });
    }
  }
);

// Send a message
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (data: SendMessagePayload, { rejectWithValue }) => {
    try {
      const { conversationId, ...messageData } = data;
      const response = await instance.post(
        `/chat/conversations/${conversationId}/messages`,
        messageData
      );
      return response.data.data || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể gửi tin nhắn";
      return rejectWithValue({ message });
    }
  }
);

// Mark messages as read
export const markMessagesAsRead = createAsyncThunk(
  "chat/markAsRead",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      await instance.put(`/chat/conversations/${conversationId}/read`);
      return conversationId;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Không thể đánh dấu đã đọc";
      return rejectWithValue({ message });
    }
  }
);
