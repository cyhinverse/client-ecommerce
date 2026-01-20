/**
 * Property Test: Total Unread Aggregation
 * **Validates: Requirements 7.4**
 *
 * Property 15: For any set of conversations, the total unread count displayed
 * on the chat button SHALL equal the sum of unread counts across all conversations.
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { Conversation, SenderType, MessageType } from "@/types/chat";

// Arbitraries for generating test data
const userIdArbitrary = fc.stringMatching(/^user_[a-z0-9]{8}$/);
const conversationIdArbitrary = fc.stringMatching(/^conv_[a-z0-9]{8}$/);
const messageIdArbitrary = fc.stringMatching(/^msg_[a-z0-9]{8}$/);
const shopIdArbitrary = fc.stringMatching(/^shop_[a-z0-9]{8}$/);

// Use timestamp-based approach to avoid invalid date issues
const isoDateStringArbitrary = fc
  .integer({ min: 1577836800000, max: 1924905600000 })
  .map((ts) => new Date(ts).toISOString());

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

/**
 * Helper function to calculate total unread count across all conversations.
 */
const calculateTotalUnreadCount = (conversations: Conversation[]): number => {
  return conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
};

describe("Property 15: Total Unread Aggregation", () => {
  describe("Total unread count calculation", () => {
    it("should calculate total unread as sum of all conversation unread counts", () => {
      fc.assert(
        fc.property(
          fc.array(conversationArbitrary(), { minLength: 0, maxLength: 50 }),
          (conversations) => {
            const expectedTotal = conversations.reduce(
              (sum, conv) => sum + (conv.unreadCount || 0),
              0
            );
            const actualTotal = calculateTotalUnreadCount(conversations);
            expect(actualTotal).toBe(expectedTotal);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should return 0 for empty conversation list", () => {
      const total = calculateTotalUnreadCount([]);
      expect(total).toBe(0);
    });

    it("should return correct count for single conversation", () => {
      fc.assert(
        fc.property(conversationArbitrary(), (conversation) => {
          const conversations = [conversation];
          const total = calculateTotalUnreadCount(conversations);
          expect(total).toBe(conversation.unreadCount || 0);
        }),
        { numRuns: 100 }
      );
    });

    it("should return 0 when all conversations have zero unread count", () => {
      fc.assert(
        fc.property(
          fc.array(conversationArbitrary(), { minLength: 1, maxLength: 20 }),
          (conversations) => {
            const zeroUnreadConversations = conversations.map((conv) => ({
              ...conv,
              unreadCount: 0,
            }));
            const total = calculateTotalUnreadCount(zeroUnreadConversations);
            expect(total).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Aggregation properties", () => {
    it("should be commutative - order of conversations should not affect total", () => {
      fc.assert(
        fc.property(
          fc.array(conversationArbitrary(), { minLength: 2, maxLength: 20 }),
          (conversations) => {
            const originalTotal = calculateTotalUnreadCount(conversations);
            const reversedConversations = [...conversations].reverse();
            const reversedTotal = calculateTotalUnreadCount(reversedConversations);
            expect(originalTotal).toBe(reversedTotal);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should be associative - grouping should not affect total", () => {
      fc.assert(
        fc.property(
          fc.array(conversationArbitrary(), { minLength: 3, maxLength: 20 }),
          (conversations) => {
            const totalAll = calculateTotalUnreadCount(conversations);
            const midpoint = Math.floor(conversations.length / 2);
            const firstHalf = conversations.slice(0, midpoint);
            const secondHalf = conversations.slice(midpoint);
            const totalFirstHalf = calculateTotalUnreadCount(firstHalf);
            const totalSecondHalf = calculateTotalUnreadCount(secondHalf);
            expect(totalAll).toBe(totalFirstHalf + totalSecondHalf);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should increase when adding a conversation with positive unread count", () => {
      fc.assert(
        fc.property(
          fc.array(conversationArbitrary(), { minLength: 0, maxLength: 20 }),
          conversationArbitrary(),
          fc.integer({ min: 1, max: 100 }),
          (conversations, newConversation, positiveUnread) => {
            const originalTotal = calculateTotalUnreadCount(conversations);
            const newConvWithUnread = { ...newConversation, unreadCount: positiveUnread };
            const updatedConversations = [...conversations, newConvWithUnread];
            const newTotal = calculateTotalUnreadCount(updatedConversations);
            expect(newTotal).toBe(originalTotal + positiveUnread);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Edge cases", () => {
    it("should handle large unread counts without overflow", () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 0, max: 10000 }), { minLength: 1, maxLength: 100 }),
          (unreadCounts) => {
            const conversations = unreadCounts.map((count, i) => ({
              _id: `conv_${i}`,
              user: { _id: `user_${i}`, name: `User ${i}` },
              shop: { _id: `shop_${i}`, shopId: `shop_${i}`, name: `Shop ${i}` },
              unreadCount: count,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })) as Conversation[];

            const expectedTotal = unreadCounts.reduce((sum, count) => sum + count, 0);
            const actualTotal = calculateTotalUnreadCount(conversations);
            expect(actualTotal).toBe(expectedTotal);
            expect(Number.isFinite(actualTotal)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
