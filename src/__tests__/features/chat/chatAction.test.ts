import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { chatSlice } from "@/features/chat/chatSlice";
import {
  startConversation,
  getMyConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
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
     * **Validates: Requirements 1.1**
     * WHEN the client starts a conversation, THE Chat_System SHALL call
     * `POST /api/chat/start` with `{ shopId, productId? }` payload
     */
    it("should call POST /chat/start with correct endpoint", async () => {
      const mockConversation = {
        _id: "conv1",
        user: { _id: "user1", name: "User" },
        shop: { _id: "shop1", shopId: "shop1", name: "Shop" },
        unreadCount: 0,
      };

      vi.mocked(instance.post).mockResolvedValueOnce({
        data: { status: "success", data: mockConversation },
      });

      await store.dispatch(startConversation({ shopId: "shop1" }));

      expect(instance.post).toHaveBeenCalledWith("/chat/start", {
        shopId: "shop1",
      });
    });

    /**
     * **Validates: Requirements 1.1**
     * Test payload structure with shopId only
     */
    it("should send payload with shopId only when productId not provided", async () => {
      vi.mocked(instance.post).mockResolvedValueOnce({
        data: { status: "success", data: { _id: "conv1" } },
      });

      await store.dispatch(startConversation({ shopId: "shop123" }));

      const [endpoint, payload] = vi.mocked(instance.post).mock.calls[0];
      expect(endpoint).toBe("/chat/start");
      expect(payload).toEqual({ shopId: "shop123" });
      expect(payload).not.toHaveProperty("productId");
    });

    /**
     * **Validates: Requirements 1.1**
     * Test payload structure with optional productId
     */
    it("should send payload with shopId and productId when both provided", async () => {
      vi.mocked(instance.post).mockResolvedValueOnce({
        data: { status: "success", data: { _id: "conv1" } },
      });

      await store.dispatch(startConversation({ shopId: "shop1", productId: "product123" }));

      const [endpoint, payload] = vi.mocked(instance.post).mock.calls[0];
      expect(endpoint).toBe("/chat/start");
      expect(payload).toEqual({
        shopId: "shop1",
        productId: "product123",
      });
    });

    it("should add conversation to state on success", async () => {
      const mockConversation = {
        _id: "conv1",
        user: { _id: "user1", name: "User" },
        shop: { _id: "shop1", shopId: "shop1", name: "Shop" },
        unreadCount: 0,
      };

      vi.mocked(instance.post).mockResolvedValueOnce({
        data: { status: "success", data: mockConversation },
      });

      await store.dispatch(startConversation({ shopId: "shop1" }));

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
    /**
     * **Validates: Requirements 1.2**
     * WHEN the client fetches conversations, THE Chat_System SHALL call
     * `GET /api/chat/conversations`
     */
    it("should call GET /chat/conversations with correct endpoint", async () => {
      const mockConversations = [
        { _id: "conv1", shop: { name: "Shop 1" }, unreadCount: 2 },
        { _id: "conv2", shop: { name: "Shop 2" }, unreadCount: 0 },
      ];

      vi.mocked(instance.get).mockResolvedValueOnce({
        data: { status: "success", data: mockConversations },
      });

      await store.dispatch(getMyConversations());

      expect(instance.get).toHaveBeenCalledWith("/chat/conversations");
    });

    it("should update state with fetched conversations", async () => {
      const mockConversations = [
        { _id: "conv1", shop: { name: "Shop 1" }, unreadCount: 2 },
        { _id: "conv2", shop: { name: "Shop 2" }, unreadCount: 0 },
      ];

      vi.mocked(instance.get).mockResolvedValueOnce({
        data: { status: "success", data: mockConversations },
      });

      await store.dispatch(getMyConversations());

      expect(store.getState().chat.conversations).toEqual(mockConversations);
    });

    it("should handle error when fetching conversations", async () => {
      vi.mocked(instance.get).mockRejectedValueOnce({
        response: { data: { message: "Unauthorized" } },
      });

      await store.dispatch(getMyConversations());

      expect(store.getState().chat.error).toBe("Unauthorized");
    });
  });

  describe("getMessages", () => {
    /**
     * **Validates: Requirements 1.3**
     * WHEN the client fetches messages, THE Chat_System SHALL call
     * `GET /api/chat/messages/:conversationId`
     */
    it("should call GET /chat/messages/:conversationId with correct endpoint", async () => {
      const mockMessages = [
        { _id: "m1", content: "Hello", sender: "user1" },
        { _id: "m2", content: "Hi there", sender: "shop1" },
      ];

      vi.mocked(instance.get).mockResolvedValueOnce({
        data: { status: "success", data: mockMessages },
      });

      await store.dispatch(getMessages({ conversationId: "conv123" }));

      expect(instance.get).toHaveBeenCalledWith(
        "/chat/messages/conv123?page=1&limit=50"
      );
    });

    /**
     * **Validates: Requirements 1.3**
     * Test that conversationId is correctly interpolated in the URL
     */
    it("should correctly interpolate conversationId in URL", async () => {
      vi.mocked(instance.get).mockResolvedValueOnce({
        data: { status: "success", data: [] },
      });

      await store.dispatch(getMessages({ conversationId: "abc-123-xyz" }));

      expect(instance.get).toHaveBeenCalledWith(
        "/chat/messages/abc-123-xyz?page=1&limit=50"
      );
    });

    it("should support pagination parameters", async () => {
      vi.mocked(instance.get).mockResolvedValueOnce({
        data: { status: "success", data: [] },
      });

      await store.dispatch(getMessages({ conversationId: "conv1", page: 2, limit: 20 }));

      expect(instance.get).toHaveBeenCalledWith(
        "/chat/messages/conv1?page=2&limit=20"
      );
    });

    it("should update state with fetched messages", async () => {
      const mockMessages = [
        { _id: "m1", content: "Hello", sender: "user1" },
        { _id: "m2", content: "Hi there", sender: "shop1" },
      ];

      vi.mocked(instance.get).mockResolvedValueOnce({
        data: { status: "success", data: mockMessages },
      });

      await store.dispatch(getMessages({ conversationId: "conv1" }));

      expect(store.getState().chat.messages).toEqual(mockMessages);
    });

    it("should handle error when fetching messages", async () => {
      vi.mocked(instance.get).mockRejectedValueOnce({
        response: { data: { message: "Conversation not found" } },
      });

      await store.dispatch(getMessages({ conversationId: "invalid" }));

      expect(store.getState().chat.error).toBe("Conversation not found");
    });
  });

  describe("sendMessage", () => {
    /**
     * **Validates: Requirements 1.4**
     * WHEN the client sends a message, THE Chat_System SHALL call
     * `POST /api/chat/message` with `{ conversationId, content, attachments? }` payload
     */
    it("should call POST /chat/message with correct endpoint", async () => {
      const mockMessage = {
        _id: "m3",
        conversation: "conv1",
        content: "New message",
        sender: "user1",
        messageType: "text",
      };

      vi.mocked(instance.post).mockResolvedValueOnce({
        data: { status: "success", data: mockMessage },
      });

      await store.dispatch(
        sendMessage({ conversationId: "conv1", content: "New message" })
      );

      expect(instance.post).toHaveBeenCalledWith("/chat/message", {
        conversationId: "conv1",
        content: "New message",
      });
    });

    /**
     * **Validates: Requirements 1.4**
     * Test payload structure with conversationId and content
     */
    it("should send payload with conversationId and content", async () => {
      vi.mocked(instance.post).mockResolvedValueOnce({
        data: { status: "success", data: { _id: "m1" } },
      });

      await store.dispatch(
        sendMessage({ conversationId: "conv-abc", content: "Hello world" })
      );

      const [endpoint, payload] = vi.mocked(instance.post).mock.calls[0];
      expect(endpoint).toBe("/chat/message");
      expect(payload).toHaveProperty("conversationId", "conv-abc");
      expect(payload).toHaveProperty("content", "Hello world");
    });

    /**
     * **Validates: Requirements 1.4**
     * Test payload structure with optional attachments
     */
    it("should include attachments in payload when provided", async () => {
      vi.mocked(instance.post).mockResolvedValueOnce({
        data: { status: "success", data: { _id: "m1" } },
      });

      await store.dispatch(
        sendMessage({
          conversationId: "conv1",
          content: "Check this out",
          attachments: ["image1.jpg", "image2.jpg"],
        })
      );

      const [endpoint, payload] = vi.mocked(instance.post).mock.calls[0];
      expect(endpoint).toBe("/chat/message");
      expect(payload).toEqual({
        conversationId: "conv1",
        content: "Check this out",
        attachments: ["image1.jpg", "image2.jpg"],
      });
    });

    it("should add message to state on success", async () => {
      const mockMessage = {
        _id: "m3",
        conversation: "conv1",
        content: "New message",
        sender: "user1",
        messageType: "text",
      };

      vi.mocked(instance.post).mockResolvedValueOnce({
        data: { status: "success", data: mockMessage },
      });

      await store.dispatch(
        sendMessage({ conversationId: "conv1", content: "New message" })
      );

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

  describe("markMessagesAsRead", () => {
    /**
     * **Validates: Requirements 1.5**
     * WHEN the client marks messages as read, THE Chat_System SHALL call
     * `PUT /api/chat/conversations/:conversationId/read`
     */
    it("should call PUT /chat/conversations/:conversationId/read with correct endpoint", async () => {
      vi.mocked(instance.put).mockResolvedValueOnce({
        data: { status: "success", data: { success: true, updatedCount: 5 } },
      });

      await store.dispatch(markMessagesAsRead("conv123"));

      expect(instance.put).toHaveBeenCalledWith("/chat/conversations/conv123/read");
    });

    /**
     * **Validates: Requirements 1.5**
     * Test that conversationId is correctly interpolated in the URL
     */
    it("should correctly interpolate conversationId in URL", async () => {
      vi.mocked(instance.put).mockResolvedValueOnce({
        data: { status: "success", data: { success: true } },
      });

      await store.dispatch(markMessagesAsRead("abc-123-xyz"));

      expect(instance.put).toHaveBeenCalledWith("/chat/conversations/abc-123-xyz/read");
    });

    it("should return conversationId in payload on success", async () => {
      vi.mocked(instance.put).mockResolvedValueOnce({
        data: { status: "success", data: { success: true, updatedCount: 5 } },
      });

      const result = await store.dispatch(markMessagesAsRead("conv1"));

      expect(result.meta.requestStatus).toBe("fulfilled");
      expect(result.payload).toHaveProperty("conversationId", "conv1");
    });

    it("should handle error when marking messages as read", async () => {
      vi.mocked(instance.put).mockRejectedValueOnce({
        response: { data: { message: "Forbidden" } },
      });

      const result = await store.dispatch(markMessagesAsRead("conv1"));

      expect(result.meta.requestStatus).toBe("rejected");
    });
  });
});
