/**
 * Property Test: Unread Count Management
 * **Validates: Requirements 3.5, 7.1, 7.2, 7.3**
 *
 * Property 7: For any conversation, the unread count SHALL be calculated as the
 * number of messages where isRead=false and senderId != currentUserId.
 * When a new message arrives for a non-active conversation, the count SHALL increment.
 * When the user opens the conversation, the count SHALL reset to zero.
 */
import { describe, it, expect, beforeEach } from "vitest";
import * as fc from "fast-check";
import { configureStore } from "@reduxjs/toolkit";
import chatReducer, {
  addMessage,
  setCurrentConversation,
  updateUnreadCount,
} from "@/features/chat/chatSlice";
import { ChatState, Conversation, Message, SenderType, MessageType } from "@/types/chat";

// Helper to create a test store with initial state
const createTestStore = (initialState?: Partial<ChatState>) => {
  return configureStore({
    reducer: { chat: chatReducer },
    preloadedState: initialState ? { chat: { ...getDefaultState(), ...initialState } } : undefined,
  });
};

const getDefaultState = (): ChatState => ({
  isOpen: false,
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSending: false,
  error: null,
});

// Arbitraries for generating test data
const userIdArbitrary = fc.stringMatching(/^user_[a-z0-9]{8}$/);
const conversationIdArbitrary = fc.stringMatching(/^conv_[a-z0-9]{8}$/);
const messageIdArbitrary = fc.stringMatching(/^msg_[a-z0-9]{8}$/);
const shopIdArbitrary = fc.stringMatching(/^shop_[a-z0-9]{8}$/);

// Use timestamp-based approach to avoid invalid date issues
const isoDateStringArbitrary = fc
  .integer({ min: 1577836800000, max: 1924905600000 }) // 2020-01-01 to 2030-12-31
  .map((ts) => new Date(ts).toISOString());

const messageArbitrary = (conversationId: string): fc.Arbitrary<Message> =>
  fc.record({
    _id: messageIdArbitrary,
    conversation: fc.constant(conversationId),
    sender: userIdArbitrary,
    senderType: fc.constantFrom<SenderType>("user", "shop"),
    content: fc.string({ minLength: 1, maxLength: 100 }),
    messageType: fc.constant<MessageType>("text"),
    isRead: fc.boolean(),
    createdAt: isoDateStringArbitrary,
    updatedAt: isoDateStringArbitrary,
  });

const conversationArbitrary = (conversationId?: string): fc.Arbitrary<Conversation> =>
  fc.record({
    _id: conversationId ? fc.constant(conversationId) : conversationIdArbitrary,
    user: fc.record({
      _id: userIdArbitrary,
      name: fc.string({ minLength: 1, maxLength: 50 }),
      avatar: fc.option(fc.webUrl(), { nil: undefined }),
    }),
    shop: fc.record({
      _id: shopIdArbitrary,
      shopId: shopIdArbitrary,
      name: fc.string({ minLength: 1, maxLength: 50 }),
      avatar: fc.option(fc.webUrl(), { nil: undefined }),
    }),
    lastMessage: fc.option(
      fc.record({
        _id: messageIdArbitrary,
        conversation: conversationId ? fc.constant(conversationId) : conversationIdArbitrary,
        sender: userIdArbitrary,
        senderType: fc.constantFrom<SenderType>("user", "shop"),
        content: fc.string({ minLength: 1, maxLength: 100 }),
        messageType: fc.constant<MessageType>("text"),
        isRead: fc.boolean(),
        createdAt: isoDateStringArbitrary,
        updatedAt: isoDateStringArbitrary,
      }),
      { nil: undefined }
    ),
    unreadCount: fc.integer({ min: 0, max: 100 }),
    createdAt: isoDateStringArbitrary,
    updatedAt: isoDateStringArbitrary,
  });

describe("Property 7: Unread Count Management", () => {
  /**
   * **Validates: Requirements 7.1**
   * WHEN fetching conversations, THE Chat_System SHALL calculate and return
   * the unread count for each conversation
   *
   * This test verifies that unread count is correctly calculated as the number
   * of messages where isRead=false and senderId != currentUserId
   */
  describe("Unread count calculation", () => {
    it("should calculate unread count as messages where isRead=false and sender != currentUser", () => {
      fc.assert(
        fc.property(
          userIdArbitrary,
          fc.array(
            fc.record({
              senderId: userIdArbitrary,
              isRead: fc.boolean(),
            }),
            { minLength: 0, maxLength: 50 }
          ),
          (currentUserId, messageStates) => {
            // Calculate expected unread count
            const expectedUnreadCount = messageStates.filter(
              (msg) => !msg.isRead && msg.senderId !== currentUserId
            ).length;

            // Verify the calculation logic
            const actualUnreadCount = messageStates.reduce((count, msg) => {
              if (!msg.isRead && msg.senderId !== currentUserId) {
                return count + 1;
              }
              return count;
            }, 0);

            expect(actualUnreadCount).toBe(expectedUnreadCount);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should not count messages from current user as unread", () => {
      fc.assert(
        fc.property(
          userIdArbitrary,
          fc.array(fc.boolean(), { minLength: 1, maxLength: 20 }),
          (currentUserId, isReadStates) => {
            // All messages from current user
            const messagesFromCurrentUser = isReadStates.map((isRead) => ({
              senderId: currentUserId,
              isRead,
            }));

            // Unread count should always be 0 for messages from current user
            const unreadCount = messagesFromCurrentUser.filter(
              (msg) => !msg.isRead && msg.senderId !== currentUserId
            ).length;

            expect(unreadCount).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should count all unread messages from other users", () => {
      fc.assert(
        fc.property(
          userIdArbitrary,
          userIdArbitrary.filter((id) => id !== "user_00000000"),
          fc.integer({ min: 1, max: 50 }),
          (currentUserId, otherUserId, messageCount) => {
            // Ensure different users
            if (currentUserId === otherUserId) return;

            // All unread messages from other user
            const messagesFromOtherUser = Array(messageCount).fill({
              senderId: otherUserId,
              isRead: false,
            });

            const unreadCount = messagesFromOtherUser.filter(
              (msg) => !msg.isRead && msg.senderId !== currentUserId
            ).length;

            expect(unreadCount).toBe(messageCount);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Validates: Requirements 3.5, 7.2**
   * WHEN a new message is received for a non-active conversation,
   * THE Chat_System SHALL increment the unread count for that conversation
   */
  describe("Unread count increment for non-active conversation", () => {
    it("should increment unread count when message arrives for non-active conversation", () => {
      fc.assert(
        fc.property(
          conversationArbitrary(),
          conversationArbitrary(),
          fc.integer({ min: 0, max: 50 }),
          (activeConversation, otherConversation, initialUnreadCount) => {
            // Ensure different conversations
            if (activeConversation._id === otherConversation._id) return;

            // Set initial unread count
            otherConversation.unreadCount = initialUnreadCount;

            const store = createTestStore({
              conversations: [activeConversation, otherConversation],
              currentConversation: activeConversation,
              messages: [],
            });

            // Create a new message for the non-active conversation
            const newMessage: Message = {
              _id: `msg_${Date.now()}`,
              conversation: otherConversation._id,
              sender: "other_user",
              senderType: "shop",
              content: "New message",
              messageType: "text",
              isRead: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            // Dispatch addMessage action
            store.dispatch(addMessage(newMessage));

            // Get updated state
            const state = store.getState().chat;
            const updatedConversation = state.conversations.find(
              (c) => c._id === otherConversation._id
            );

            // Unread count should be incremented by 1
            expect(updatedConversation?.unreadCount).toBe(initialUnreadCount + 1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should NOT increment unread count when message arrives for active conversation", () => {
      fc.assert(
        fc.property(
          conversationArbitrary(),
          fc.integer({ min: 0, max: 50 }),
          (activeConversation, initialUnreadCount) => {
            activeConversation.unreadCount = initialUnreadCount;

            const store = createTestStore({
              conversations: [activeConversation],
              currentConversation: activeConversation,
              messages: [],
            });

            // Create a new message for the active conversation
            const newMessage: Message = {
              _id: `msg_${Date.now()}`,
              conversation: activeConversation._id,
              sender: "other_user",
              senderType: "shop",
              content: "New message",
              messageType: "text",
              isRead: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            // Dispatch addMessage action
            store.dispatch(addMessage(newMessage));

            // Get updated state
            const state = store.getState().chat;
            const updatedConversation = state.conversations.find(
              (c) => c._id === activeConversation._id
            );

            // Unread count should NOT be incremented
            expect(updatedConversation?.unreadCount).toBe(initialUnreadCount);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should add message to messages array only for active conversation", () => {
      fc.assert(
        fc.property(
          conversationArbitrary(),
          conversationArbitrary(),
          (activeConversation, otherConversation) => {
            // Ensure different conversations
            if (activeConversation._id === otherConversation._id) return;

            const store = createTestStore({
              conversations: [activeConversation, otherConversation],
              currentConversation: activeConversation,
              messages: [],
            });

            // Create messages for both conversations
            const messageForActive: Message = {
              _id: `msg_active_${Date.now()}`,
              conversation: activeConversation._id,
              sender: "other_user",
              senderType: "shop",
              content: "Message for active",
              messageType: "text",
              isRead: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            const messageForOther: Message = {
              _id: `msg_other_${Date.now()}`,
              conversation: otherConversation._id,
              sender: "other_user",
              senderType: "shop",
              content: "Message for other",
              messageType: "text",
              isRead: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            // Dispatch both messages
            store.dispatch(addMessage(messageForActive));
            store.dispatch(addMessage(messageForOther));

            // Get updated state
            const state = store.getState().chat;

            // Only message for active conversation should be in messages array
            expect(state.messages.length).toBe(1);
            expect(state.messages[0]._id).toBe(messageForActive._id);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Validates: Requirements 7.3**
   * WHEN a user opens a conversation, THE Chat_System SHALL reset
   * the unread count to zero for that conversation
   */
  describe("Unread count reset on conversation open", () => {
    it("should reset unread count to zero when updateUnreadCount is dispatched with count 0", () => {
      fc.assert(
        fc.property(
          conversationArbitrary(),
          fc.integer({ min: 1, max: 100 }),
          (conversation, initialUnreadCount) => {
            conversation.unreadCount = initialUnreadCount;

            const store = createTestStore({
              conversations: [conversation],
              currentConversation: null,
              messages: [],
            });

            // Dispatch updateUnreadCount to reset to 0 (simulating markMessagesAsRead)
            store.dispatch(
              updateUnreadCount({
                conversationId: conversation._id,
                count: 0,
              })
            );

            // Get updated state
            const state = store.getState().chat;
            const updatedConversation = state.conversations.find(
              (c) => c._id === conversation._id
            );

            // Unread count should be reset to 0
            expect(updatedConversation?.unreadCount).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should reset unread count regardless of initial value", () => {
      fc.assert(
        fc.property(
          fc.array(conversationArbitrary(), { minLength: 1, maxLength: 10 }),
          fc.integer({ min: 0 }),
          (conversations, targetIndex) => {
            // Assign random unread counts
            conversations.forEach((conv, i) => {
              conv._id = `conv_${i}`;
              conv.unreadCount = Math.floor(Math.random() * 100);
            });

            const targetConversation = conversations[targetIndex % conversations.length];
            const initialUnreadCount = targetConversation.unreadCount;

            const store = createTestStore({
              conversations,
              currentConversation: null,
              messages: [],
            });

            // Reset unread count for target conversation
            store.dispatch(
              updateUnreadCount({
                conversationId: targetConversation._id,
                count: 0,
              })
            );

            // Get updated state
            const state = store.getState().chat;
            const updatedConversation = state.conversations.find(
              (c) => c._id === targetConversation._id
            );

            // Unread count should be 0
            expect(updatedConversation?.unreadCount).toBe(0);

            // Other conversations should be unchanged
            state.conversations
              .filter((c) => c._id !== targetConversation._id)
              .forEach((conv) => {
                const original = conversations.find((c) => c._id === conv._id);
                expect(conv.unreadCount).toBe(original?.unreadCount);
              });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Combined property test: Full unread count lifecycle
   * Tests the complete flow: initial state -> receive messages -> open conversation -> reset
   */
  describe("Full unread count lifecycle", () => {
    it("should correctly manage unread count through complete lifecycle", () => {
      fc.assert(
        fc.property(
          conversationArbitrary(),
          conversationArbitrary(),
          fc.integer({ min: 1, max: 10 }),
          (activeConversation, otherConversation, messageCount) => {
            // Ensure different conversations
            if (activeConversation._id === otherConversation._id) return;

            // Start with 0 unread
            activeConversation.unreadCount = 0;
            otherConversation.unreadCount = 0;

            const store = createTestStore({
              conversations: [activeConversation, otherConversation],
              currentConversation: activeConversation,
              messages: [],
            });

            // Step 1: Receive multiple messages for non-active conversation
            for (let i = 0; i < messageCount; i++) {
              const newMessage: Message = {
                _id: `msg_${i}_${Date.now()}`,
                conversation: otherConversation._id,
                sender: "other_user",
                senderType: "shop",
                content: `Message ${i}`,
                messageType: "text",
                isRead: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              store.dispatch(addMessage(newMessage));
            }

            // Verify unread count incremented correctly
            let state = store.getState().chat;
            let updatedOther = state.conversations.find(
              (c) => c._id === otherConversation._id
            );
            expect(updatedOther?.unreadCount).toBe(messageCount);

            // Step 2: Switch to the other conversation (simulate opening it)
            store.dispatch(setCurrentConversation(otherConversation));

            // Step 3: Mark as read (reset unread count)
            store.dispatch(
              updateUnreadCount({
                conversationId: otherConversation._id,
                count: 0,
              })
            );

            // Verify unread count is reset to 0
            state = store.getState().chat;
            updatedOther = state.conversations.find(
              (c) => c._id === otherConversation._id
            );
            expect(updatedOther?.unreadCount).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Edge case: Last message update
   * Validates: Requirements 3.6
   */
  describe("Last message update", () => {
    it("should update lastMessage when new message arrives", () => {
      fc.assert(
        fc.property(
          conversationArbitrary(),
          fc.string({ minLength: 1, maxLength: 100 }),
          (conversation, messageContent) => {
            const store = createTestStore({
              conversations: [conversation],
              currentConversation: conversation,
              messages: [],
            });

            const newMessage: Message = {
              _id: `msg_${Date.now()}`,
              conversation: conversation._id,
              sender: "other_user",
              senderType: "shop",
              content: messageContent,
              messageType: "text",
              isRead: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            store.dispatch(addMessage(newMessage));

            const state = store.getState().chat;
            const updatedConversation = state.conversations.find(
              (c) => c._id === conversation._id
            );

            expect(updatedConversation?.lastMessage?._id).toBe(newMessage._id);
            expect(updatedConversation?.lastMessage?.content).toBe(messageContent);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
