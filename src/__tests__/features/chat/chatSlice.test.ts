import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { chatSlice, addMessage, setCurrentConversation } from "@/features/chat/chatSlice";
import { ChatState, Conversation, Message } from "@/types/chat";

const createTestStore = (preloadedState?: Partial<ChatState>) =>
  configureStore({
    reducer: {
      chat: chatSlice.reducer,
    },
    preloadedState: preloadedState ? { chat: { ...chatSlice.getInitialState(), ...preloadedState } } : undefined,
  });

// Helper to create a mock conversation
const createMockConversation = (id: string, unreadCount = 0): Conversation => ({
  _id: id,
  user: { _id: "user1", name: "Test User" },
  shop: { _id: "shop1", shopId: "shop1", name: "Test Shop" },
  unreadCount,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Helper to create a mock message
const createMockMessage = (id: string, conversationId: string): Message => ({
  _id: id,
  conversation: conversationId,
  sender: "other-user",
  senderType: "shop",
  content: "Test message",
  messageType: "text",
  isRead: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

describe("Chat Slice Reducers", () => {
  describe("addMessage", () => {
    /**
     * **Validates: Requirements 3.4**
     * WHEN a new message is received via socket `new_message` event,
     * THE Chat_System SHALL add the message to the current conversation's message list
     */
    it("should add message to messages array when message is for active conversation", () => {
      const conversation = createMockConversation("conv1");
      const store = createTestStore({
        conversations: [conversation],
        currentConversation: conversation,
        messages: [],
      });

      const message = createMockMessage("msg1", "conv1");
      store.dispatch(addMessage(message));

      const state = store.getState().chat;
      expect(state.messages).toHaveLength(1);
      expect(state.messages[0]).toEqual(message);
    });

    /**
     * **Validates: Requirements 3.4**
     * Messages should NOT be added to messages array if they are for a non-active conversation
     */
    it("should NOT add message to messages array when message is for non-active conversation", () => {
      const activeConversation = createMockConversation("conv1");
      const otherConversation = createMockConversation("conv2");
      const store = createTestStore({
        conversations: [activeConversation, otherConversation],
        currentConversation: activeConversation,
        messages: [],
      });

      const message = createMockMessage("msg1", "conv2");
      store.dispatch(addMessage(message));

      const state = store.getState().chat;
      expect(state.messages).toHaveLength(0);
    });

    /**
     * **Validates: Requirements 3.6**
     * WHEN a new message is received, THE Chat_System SHALL update
     * the conversation's last message display
     */
    it("should update lastMessage in conversation when message is received", () => {
      const conversation = createMockConversation("conv1");
      const store = createTestStore({
        conversations: [conversation],
        currentConversation: conversation,
        messages: [],
      });

      const message = createMockMessage("msg1", "conv1");
      store.dispatch(addMessage(message));

      const state = store.getState().chat;
      expect(state.conversations[0].lastMessage).toEqual(message);
    });

    /**
     * **Validates: Requirements 3.5, 7.2**
     * WHEN a new message is received for a non-active conversation,
     * THE Chat_System SHALL increment the unread count for that conversation
     */
    it("should increment unreadCount when message is for non-active conversation", () => {
      const activeConversation = createMockConversation("conv1");
      const otherConversation = createMockConversation("conv2", 0);
      const store = createTestStore({
        conversations: [activeConversation, otherConversation],
        currentConversation: activeConversation,
        messages: [],
      });

      const message = createMockMessage("msg1", "conv2");
      store.dispatch(addMessage(message));

      const state = store.getState().chat;
      expect(state.conversations[1].unreadCount).toBe(1);
    });

    /**
     * **Validates: Requirements 3.5, 7.2**
     * Unread count should accumulate for multiple messages to non-active conversation
     */
    it("should accumulate unreadCount for multiple messages to non-active conversation", () => {
      const activeConversation = createMockConversation("conv1");
      const otherConversation = createMockConversation("conv2", 2);
      const store = createTestStore({
        conversations: [activeConversation, otherConversation],
        currentConversation: activeConversation,
        messages: [],
      });

      const message1 = createMockMessage("msg1", "conv2");
      const message2 = createMockMessage("msg2", "conv2");
      store.dispatch(addMessage(message1));
      store.dispatch(addMessage(message2));

      const state = store.getState().chat;
      expect(state.conversations[1].unreadCount).toBe(4);
    });

    /**
     * **Validates: Requirements 3.5, 7.2**
     * Unread count should NOT increment when message is for active conversation
     */
    it("should NOT increment unreadCount when message is for active conversation", () => {
      const conversation = createMockConversation("conv1", 0);
      const store = createTestStore({
        conversations: [conversation],
        currentConversation: conversation,
        messages: [],
      });

      const message = createMockMessage("msg1", "conv1");
      store.dispatch(addMessage(message));

      const state = store.getState().chat;
      expect(state.conversations[0].unreadCount).toBe(0);
    });

    /**
     * **Validates: Requirements 3.5, 7.2**
     * Unread count should increment when there is no active conversation
     */
    it("should increment unreadCount when there is no active conversation", () => {
      const conversation = createMockConversation("conv1", 0);
      const store = createTestStore({
        conversations: [conversation],
        currentConversation: null,
        messages: [],
      });

      const message = createMockMessage("msg1", "conv1");
      store.dispatch(addMessage(message));

      const state = store.getState().chat;
      expect(state.conversations[0].unreadCount).toBe(1);
    });

    it("should not add duplicate messages", () => {
      const conversation = createMockConversation("conv1");
      const store = createTestStore({
        conversations: [conversation],
        currentConversation: conversation,
        messages: [],
      });

      const message = createMockMessage("msg1", "conv1");
      store.dispatch(addMessage(message));
      store.dispatch(addMessage(message));

      const state = store.getState().chat;
      expect(state.messages).toHaveLength(1);
    });

    it("should handle message for conversation not in list", () => {
      const conversation = createMockConversation("conv1");
      const store = createTestStore({
        conversations: [conversation],
        currentConversation: conversation,
        messages: [],
      });

      const message = createMockMessage("msg1", "unknown-conv");
      store.dispatch(addMessage(message));

      const state = store.getState().chat;
      // Message should not be added since it's not for active conversation
      expect(state.messages).toHaveLength(0);
      // Conversation list should remain unchanged
      expect(state.conversations).toHaveLength(1);
    });
  });

  describe("setCurrentConversation", () => {
    it("should set current conversation and clear messages when set to null", () => {
      const conversation = createMockConversation("conv1");
      const message = createMockMessage("msg1", "conv1");
      const store = createTestStore({
        conversations: [conversation],
        currentConversation: conversation,
        messages: [message],
      });

      store.dispatch(setCurrentConversation(null));

      const state = store.getState().chat;
      expect(state.currentConversation).toBeNull();
      expect(state.messages).toHaveLength(0);
    });

    it("should set current conversation without clearing messages when set to new conversation", () => {
      const conversation1 = createMockConversation("conv1");
      const conversation2 = createMockConversation("conv2");
      const message = createMockMessage("msg1", "conv1");
      const store = createTestStore({
        conversations: [conversation1, conversation2],
        currentConversation: conversation1,
        messages: [message],
      });

      store.dispatch(setCurrentConversation(conversation2));

      const state = store.getState().chat;
      expect(state.currentConversation).toEqual(conversation2);
      // Messages are not cleared when switching to a new conversation
      // (they will be replaced when getMessages is dispatched)
      expect(state.messages).toHaveLength(1);
    });
  });
});
