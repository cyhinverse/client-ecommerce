import instance from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SendMessagePayload, StartConversationPayload } from "@/types/chat";
import { extractApiData, extractApiError } from "@/api";

// Start a new conversation with a shop
export const startConversation = createAsyncThunk(
  "chat/startConversation",
  async (data: StartConversationPayload, { rejectWithValue }) => {
    try {
      const response = await instance.post("/chat/conversations", data);
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

// Get user's conversations
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
        messages: extractApiData(response),
        pagination: response.data.pagination,
      };
    } catch (error) {
      return rejectWithValue(extractApiError(error));
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
      return extractApiData(response);
    } catch (error) {
      return rejectWithValue(extractApiError(error));
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
      return rejectWithValue(extractApiError(error));
    }
  }
);
