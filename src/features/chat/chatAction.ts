import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SendMessagePayload, StartConversationPayload } from "@/types/chat";
import { extractApiData, extractApiError } from "@/api";

export const startConversation = createAsyncThunk(
  "chat/startConversation",
  async (data: StartConversationPayload, { rejectWithValue }) => {
    try {
      const response = await instance.post("/chat/start", data);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const getMyConversations = createAsyncThunk(
  "chat/getMyConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/chat/conversations");
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (
    { conversationId, page = 1, limit = 50 }: { conversationId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get(
        `/chat/messages/${conversationId}?page=${page}&limit=${limit}`
      );
      const data = extractApiData(response);
      return {
        conversationId,
        messages: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (data: SendMessagePayload, { rejectWithValue }) => {
    try {
      const response = await instance.post("/chat/message", data);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  "chat/markAsRead",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await instance.put(`/chat/conversations/${conversationId}/read`);
      return { conversationId, ...extractApiData(response) };
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

