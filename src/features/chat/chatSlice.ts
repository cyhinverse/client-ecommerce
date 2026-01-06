import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatState, Conversation, Message } from "@/types/chat";
import {
  startConversation,
  getMyConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from "./chatAction";

const initialState: ChatState = {
  isOpen: false,
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSending: false,
  error: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    setChatOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
      if (!action.payload) {
        state.messages = [];
      }
    },
    clearChatError: (state) => {
      state.error = null;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      // Add message from socket
      const exists = state.messages.some((m) => m._id === action.payload._id);
      if (!exists) {
        state.messages.push(action.payload);
      }
      // Update last message in conversation
      const convIndex = state.conversations.findIndex(
        (c) => c._id === action.payload.conversation
      );
      if (convIndex !== -1) {
        state.conversations[convIndex].lastMessage = action.payload;
      }
    },
    updateUnreadCount: (state, action: PayloadAction<{ conversationId: string; count: number }>) => {
      const conv = state.conversations.find((c) => c._id === action.payload.conversationId);
      if (conv) {
        conv.unreadCount = action.payload.count;
      }
    },
  },
  extraReducers: (builder) => {
    // Start conversation
    builder
      .addCase(startConversation.pending, (state) => {
        state.isLoadingConversations = true;
        state.error = null;
      })
      .addCase(startConversation.fulfilled, (state, action) => {
        state.isLoadingConversations = false;
        const exists = state.conversations.some((c) => c._id === action.payload._id);
        if (!exists) {
          state.conversations.unshift(action.payload);
        }
        state.currentConversation = action.payload;
      })
      .addCase(startConversation.rejected, (state, action) => {
        state.isLoadingConversations = false;
        state.error = (action.payload as { message: string })?.message || "Lỗi không xác định";
      });

    // Get conversations
    builder
      .addCase(getMyConversations.pending, (state) => {
        state.isLoadingConversations = true;
        state.error = null;
      })
      .addCase(getMyConversations.fulfilled, (state, action) => {
        state.isLoadingConversations = false;
        state.conversations = action.payload;
      })
      .addCase(getMyConversations.rejected, (state, action) => {
        state.isLoadingConversations = false;
        state.error = (action.payload as { message: string })?.message || "Lỗi không xác định";
      });

    // Get messages
    builder
      .addCase(getMessages.pending, (state) => {
        state.isLoadingMessages = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoadingMessages = false;
        state.messages = action.payload.messages;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoadingMessages = false;
        state.error = (action.payload as { message: string })?.message || "Lỗi không xác định";
      });

    // Send message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        state.messages.push(action.payload);
        // Update last message in conversation
        const convIndex = state.conversations.findIndex(
          (c) => c._id === action.payload.conversation
        );
        if (convIndex !== -1) {
          state.conversations[convIndex].lastMessage = action.payload;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = (action.payload as { message: string })?.message || "Lỗi không xác định";
      });

    // Mark as read
    builder
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const conv = state.conversations.find((c) => c._id === action.payload);
        if (conv) {
          conv.unreadCount = 0;
        }
      });
  },
});

export const {
  toggleChat,
  setChatOpen,
  setCurrentConversation,
  clearChatError,
  addMessage,
  updateUnreadCount,
} = chatSlice.actions;
export default chatSlice.reducer;
