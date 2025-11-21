import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { chatbotService } from "./chatService";
import type { ChatState, Message, ChatResponse } from "@/types/chat";

const initialState: ChatState = {
    isOpen: false,
    messages: [],
    isTyping: false,
    sessionId: null,
    suggestions: ["Tìm sản phẩm", "Xem giỏ hàng", "Đơn hàng của tôi", "Mã giảm giá"],
    isLoading: false,
    error: null,
};

/**
 * Async thunk to send message
 */
export const sendMessage = createAsyncThunk<
    ChatResponse,
    string,
    { state: { chat: ChatState } }
>("chat/sendMessage", async (message, { getState }) => {
    const { chat } = getState();
    const response = await chatbotService.sendMessage(message, chat.sessionId);
    return response;
});

/**
 * Async thunk to load suggestions
 */
export const loadSuggestions = createAsyncThunk<
    string[],
    void,
    { state: { chat: ChatState } }
>("chat/loadSuggestions", async (_, { getState }) => {
    const { chat } = getState();
    const response = await chatbotService.getSuggestions(chat.sessionId);
    return response.data || response;
});

/**
 * Async thunk to clear session
 */
export const clearSession = createAsyncThunk<
    void,
    void,
    { state: { chat: ChatState } }
>("chat/clearSession", async (_, { getState }) => {
    const { chat } = getState();
    if (chat.sessionId) {
        await chatbotService.clearSession(chat.sessionId);
    }
});

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        // Toggle chat window
        toggleChat: (state) => {
            state.isOpen = !state.isOpen;
        },

        // Open chat window
        openChat: (state) => {
            state.isOpen = true;
        },

        // Close chat window
        closeChat: (state) => {
            state.isOpen = false;
        },

        // Add message to chat (for local state)
        addMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },

        // Set typing indicator
        setTyping: (state, action: PayloadAction<boolean>) => {
            state.isTyping = action.payload;
        },

        // Set session ID
        setSessionId: (state, action: PayloadAction<string>) => {
            state.sessionId = action.payload;
        },

        // Clear all messages
        clearMessages: (state) => {
            state.messages = [];
            state.sessionId = null;
        },

        // Set suggestions
        setSuggestions: (state, action: PayloadAction<string[]>) => {
            state.suggestions = action.payload;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Send message
        builder.addCase(sendMessage.pending, (state) => {
            state.isLoading = true;
            state.isTyping = true;
            state.error = null;
        });
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isTyping = false;

            const response = action.payload;

            // Update session ID if new
            if (response.sessionId) {
                state.sessionId = response.sessionId;
            }

            // Add assistant's message
            if (response.message) {
                const assistantMessage: Message = {
                    role: "assistant",
                    content: response.message,
                    data: response.data,
                    timestamp: new Date().toISOString(),
                    metadata: response.metadata,
                };
                state.messages.push(assistantMessage);
            }

            // Update error if failed
            if (!response.success) {
                state.error = response.error || "Đã có lỗi xảy ra";
            }
        });
        builder.addCase(sendMessage.rejected, (state, action) => {
            state.isLoading = false;
            state.isTyping = false;
            state.error = action.error.message || "Không thể gửi tin nhắn";
        });

        // Load suggestions
        builder.addCase(loadSuggestions.fulfilled, (state, action) => {
            state.suggestions = action.payload;
        });

        // Clear session
        builder.addCase(clearSession.fulfilled, (state) => {
            state.messages = [];
            state.sessionId = null;
            state.suggestions = initialState.suggestions;
        });
    },
});

export const {
    toggleChat,
    openChat,
    closeChat,
    addMessage,
    setTyping,
    setSessionId,
    clearMessages,
    setSuggestions,
    clearError,
} = chatSlice.actions;

export default chatSlice.reducer;
