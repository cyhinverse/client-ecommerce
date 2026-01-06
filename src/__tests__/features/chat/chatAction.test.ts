import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { chatSlice } from "@/features/chat/chatSlice";
import {
  startConversation,
  getMyConversations,
  getMessages,
  sendMessage,
} from "@/features/chat/chatAction";
import instance from "@/api/api";

// Mock axios instance
vi.mock("@/api/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      chat: chatSlice.reducer,
    },
  });

describe("Chat Actions", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
  });

  describe("startConversation", () => {
    /**
     * Property 1: API Action Dispatch Correctness (Chat)
     * For any valid shop ID, the action SHALL make POST request
     * to /chat/conversations and add conversation to state
     * Validates: Requirements 6.1
     */
    it("should start conversation with shop", async () => {
      const mockConversation = {
        _id: "conv1",
        user: { _id: "user1", name: "User" },
        shop: { _id: "shop1", shopId: "shop1", name: "Shop" },
        unreadCount: 0,
      };

      vi.mocked(instance.post).mockResolvedValueOnce({ data: { data: mockConversation } });

      await store.dispatch(startConversation({ shopId: "shop1", message: "Hello" }));

      expect(instance.post).toHaveBeenCalledWith("/chat/conversations", {
        shopId: "shop1",
        message: "Hello",
      });
      expect(store.getState().chat.conversations).toContainEqual(mockConversation);
      expect(store.getState().chat.currentConversation).toEqual(mockConversation);
    });

    it("should handle error when starting conversation", async () => {
      vi.mocked(instance.post).mockRejectedValueOnce({
        response: { data: { message: "Shop not found" } },
      });

      await store.dispatch(startConversation({ shopId: "invalid" }));

      expect(store.getState().chat.error).toBe("Shop not found");
    });
  });

  describe("getMyConversations", () => {
    it("should fetch user conversations", async () => {
      const mockConversations = [
        { _id: "conv1", shop: { name: "Shop 1" }, unreadCount: 2 },
        { _id: "conv2", shop: { name: "Shop 2" }, unreadCount: 0 },
      ];

      vi.mocked(instance.get).mockResolvedValueOnce({ data: { data: mockConversations } });

      await store.dispatch(getMyConversations());

      expect(instance.get).toHaveBeenCalledWith("/chat/conversations");
      expect(store.getState().chat.conversations).toEqual(mockConversations);
    });
  });

  describe("getMessages", () => {
    it("should fetch messages for conversation", async () => {
      const mockMessages = [
        { _id: "m1", content: "Hello", sender: "user1" },
        { _id: "m2", content: "Hi there", sender: "shop1" },
      ];

      vi.mocked(instance.get).mockResolvedValueOnce({ data: { data: mockMessages } });

      await store.dispatch(getMessages({ conversationId: "conv1" }));

      expect(instance.get).toHaveBeenCalledWith(
        "/chat/conversations/conv1/messages?page=1&limit=50"
      );
      expect(store.getState().chat.messages).toEqual(mockMessages);
    });

    it("should support pagination", async () => {
      vi.mocked(instance.get).mockResolvedValueOnce({ data: { data: [] } });

      await store.dispatch(getMessages({ conversationId: "conv1", page: 2, limit: 20 }));

      expect(instance.get).toHaveBeenCalledWith(
        "/chat/conversations/conv1/messages?page=2&limit=20"
      );
    });
  });

  describe("sendMessage", () => {
    /**
     * Property 1: API Action Dispatch Correctness (Chat)
     * For any valid message payload, the action SHALL make POST request
     * to /chat/conversations/:id/messages and add message to state
     * Validates: Requirements 7.1
     */
    it("should send message and add to state", async () => {
      const mockMessage = {
        _id: "m3",
        conversation: "conv1",
        content: "New message",
        sender: "user1",
        messageType: "text",
      };

      vi.mocked(instance.post).mockResolvedValueOnce({ data: { data: mockMessage } });

      await store.dispatch(
        sendMessage({ conversationId: "conv1", content: "New message" })
      );

      expect(instance.post).toHaveBeenCalledWith("/chat/conversations/conv1/messages", {
        content: "New message",
      });
      expect(store.getState().chat.messages).toContainEqual(mockMessage);
      expect(store.getState().chat.isSending).toBe(false);
    });

    it("should handle send error", async () => {
      vi.mocked(instance.post).mockRejectedValueOnce({
        response: { data: { message: "Message too long" } },
      });

      await store.dispatch(
        sendMessage({ conversationId: "conv1", content: "x".repeat(10000) })
      );

      expect(store.getState().chat.error).toBe("Message too long");
      expect(store.getState().chat.isSending).toBe(false);
    });
  });
});
