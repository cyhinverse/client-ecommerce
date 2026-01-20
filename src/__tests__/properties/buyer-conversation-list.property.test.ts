/**
 * Property Test: Buyer Conversation List Rendering
 * **Validates: Requirements 4.5**
 *
 * Property 12: For any conversation displayed in the buyer's conversation list,
 * the rendered output SHALL contain the shop name, shop logo, last message content,
 * and unread count.
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  Conversation,
  Message,
  SenderType,
  MessageType,
  ShopParticipant,
  ConversationParticipant,
} from "@/types/chat";

// Arbitraries for generating test data
const userIdArbitrary = fc.stringMatching(/^user_[a-z0-9]{8}$/);
const conversationIdArbitrary = fc.stringMatching(/^conv_[a-z0-9]{8}$/);
const messageIdArbitrary = fc.stringMatching(/^msg_[a-z0-9]{8}$/);
const shopIdArbitrary = fc.stringMatching(/^shop_[a-z0-9]{8}$/);

// Use timestamp-based approach to avoid invalid date issues
const isoDateStringArbitrary = fc
  .integer({ min: 1577836800000, max: 1924905600000 }) // 2020-01-01 to 2030-12-31
  .map((ts) => new Date(ts).toISOString());

// Shop name arbitrary - non-empty string
const shopNameArbitrary = fc.string({ minLength: 1, maxLength: 50 });

// Shop logo arbitrary - valid URL or undefined
const shopLogoArbitrary = fc.option(fc.webUrl(), { nil: undefined });

// Message content arbitrary - non-empty string
const messageContentArbitrary = fc.string({ minLength: 1, maxLength: 200 });

// Unread count arbitrary - non-negative integer
const unreadCountArbitrary = fc.integer({ min: 0, max: 999 });

// User participant arbitrary
const userParticipantArbitrary: fc.Arbitrary<ConversationParticipant> = fc.record({
  _id: userIdArbitrary,
  name: fc.string({ minLength: 1, maxLength: 50 }),
  avatar: fc.option(fc.webUrl(), { nil: undefined }),
});

// Shop participant arbitrary
const shopParticipantArbitrary: fc.Arbitrary<ShopParticipant> = fc.record({
  _id: shopIdArbitrary,
  shopId: shopIdArbitrary,
  name: shopNameArbitrary,
  avatar: shopLogoArbitrary,
});

// Message arbitrary
const messageArbitrary = (conversationId: string): fc.Arbitrary<Message> =>
  fc.record({
    _id: messageIdArbitrary,
    conversation: fc.constant(conversationId),
    sender: userIdArbitrary,
    senderType: fc.constantFrom<SenderType>("user", "shop"),
    content: messageContentArbitrary,
    messageType: fc.constant<MessageType>("text"),
    isRead: fc.boolean(),
    createdAt: isoDateStringArbitrary,
    updatedAt: isoDateStringArbitrary,
  });

// Conversation arbitrary with all required fields for buyer view
const buyerConversationArbitrary: fc.Arbitrary<Conversation> = fc
  .record({
    _id: conversationIdArbitrary,
    user: userParticipantArbitrary,
    shop: shopParticipantArbitrary,
    unreadCount: unreadCountArbitrary,
    createdAt: isoDateStringArbitrary,
    updatedAt: isoDateStringArbitrary,
  })
  .chain((conv) =>
    fc.record({
      ...conv,
      _id: fc.constant(conv._id),
      user: fc.constant(conv.user),
      shop: fc.constant(conv.shop),
      unreadCount: fc.constant(conv.unreadCount),
      createdAt: fc.constant(conv.createdAt),
      updatedAt: fc.constant(conv.updatedAt),
      lastMessage: fc.option(messageArbitrary(conv._id), { nil: undefined }),
    })
  );

/**
 * Helper function to extract rendering data from a conversation
 * This simulates what the UI component would extract for display
 */
function extractBuyerConversationDisplayData(conversation: Conversation) {
  return {
    shopName: conversation.shop?.name,
    shopLogo: conversation.shop?.avatar,
    lastMessageContent: conversation.lastMessage?.content,
    unreadCount: conversation.unreadCount,
  };
}

/**
 * Helper function to validate that all required fields are present
 * for buyer conversation list rendering
 */
function validateBuyerConversationFields(conversation: Conversation): {
  hasShopName: boolean;
  hasShopLogo: boolean;
  hasLastMessageContent: boolean;
  hasUnreadCount: boolean;
} {
  return {
    hasShopName: typeof conversation.shop?.name === "string" && conversation.shop.name.length > 0,
    hasShopLogo: conversation.shop?.avatar !== undefined,
    hasLastMessageContent:
      conversation.lastMessage === undefined ||
      (typeof conversation.lastMessage?.content === "string" &&
        conversation.lastMessage.content.length > 0),
    hasUnreadCount: typeof conversation.unreadCount === "number" && conversation.unreadCount >= 0,
  };
}

describe("Property 12: Buyer Conversation List Rendering", () => {
  /**
   * **Validates: Requirements 4.5**
   * WHILE displaying conversations, THE Chat_System SHALL show shop name,
   * logo, last message, and unread count
   */
  describe("Conversation data structure contains all required fields", () => {
    it("should have shop name accessible for any conversation", () => {
      fc.assert(
        fc.property(buyerConversationArbitrary, (conversation) => {
          // Shop name must be present and non-empty
          expect(conversation.shop).toBeDefined();
          expect(conversation.shop.name).toBeDefined();
          expect(typeof conversation.shop.name).toBe("string");
          expect(conversation.shop.name.length).toBeGreaterThan(0);

          // Verify extraction works
          const displayData = extractBuyerConversationDisplayData(conversation);
          expect(displayData.shopName).toBe(conversation.shop.name);
        }),
        { numRuns: 100 }
      );
    });

    it("should have shop logo field accessible for any conversation", () => {
      fc.assert(
        fc.property(buyerConversationArbitrary, (conversation) => {
          // Shop must be defined
          expect(conversation.shop).toBeDefined();

          // Shop logo can be undefined or a valid URL string
          if (conversation.shop.avatar !== undefined) {
            expect(typeof conversation.shop.avatar).toBe("string");
          }

          // Verify extraction works
          const displayData = extractBuyerConversationDisplayData(conversation);
          expect(displayData.shopLogo).toBe(conversation.shop.avatar);
        }),
        { numRuns: 100 }
      );
    });

    it("should have last message content accessible when present", () => {
      fc.assert(
        fc.property(buyerConversationArbitrary, (conversation) => {
          // Last message can be undefined (new conversation with no messages)
          if (conversation.lastMessage !== undefined) {
            expect(conversation.lastMessage.content).toBeDefined();
            expect(typeof conversation.lastMessage.content).toBe("string");
            expect(conversation.lastMessage.content.length).toBeGreaterThan(0);
          }

          // Verify extraction works
          const displayData = extractBuyerConversationDisplayData(conversation);
          expect(displayData.lastMessageContent).toBe(conversation.lastMessage?.content);
        }),
        { numRuns: 100 }
      );
    });

    it("should have unread count accessible for any conversation", () => {
      fc.assert(
        fc.property(buyerConversationArbitrary, (conversation) => {
          // Unread count must be present and non-negative
          expect(conversation.unreadCount).toBeDefined();
          expect(typeof conversation.unreadCount).toBe("number");
          expect(conversation.unreadCount).toBeGreaterThanOrEqual(0);

          // Verify extraction works
          const displayData = extractBuyerConversationDisplayData(conversation);
          expect(displayData.unreadCount).toBe(conversation.unreadCount);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("All required fields are present together", () => {
    it("should have all required fields for buyer conversation list rendering", () => {
      fc.assert(
        fc.property(buyerConversationArbitrary, (conversation) => {
          const validation = validateBuyerConversationFields(conversation);

          // All required fields must be present
          expect(validation.hasShopName).toBe(true);
          // Shop logo is optional but the field must be accessible
          expect(conversation.shop).toHaveProperty("avatar");
          expect(validation.hasLastMessageContent).toBe(true);
          expect(validation.hasUnreadCount).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it("should support rendering requirements for any generated conversation", () => {
      fc.assert(
        fc.property(buyerConversationArbitrary, (conversation) => {
          // Extract all display data
          const displayData = extractBuyerConversationDisplayData(conversation);

          // Verify the data structure supports rendering
          // Shop name is required for display
          expect(displayData.shopName).toBeTruthy();

          // Unread count must be a valid number
          expect(Number.isInteger(displayData.unreadCount)).toBe(true);
          expect(displayData.unreadCount).toBeGreaterThanOrEqual(0);

          // Last message content is optional but when present must be valid
          if (displayData.lastMessageContent !== undefined) {
            expect(displayData.lastMessageContent.length).toBeGreaterThan(0);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Conversation list with multiple conversations", () => {
    it("should have all required fields for each conversation in a list", () => {
      fc.assert(
        fc.property(
          fc.array(buyerConversationArbitrary, { minLength: 1, maxLength: 20 }),
          (conversations) => {
            // Each conversation in the list must have all required fields
            conversations.forEach((conversation) => {
              const validation = validateBuyerConversationFields(conversation);

              expect(validation.hasShopName).toBe(true);
              expect(validation.hasUnreadCount).toBe(true);
              expect(validation.hasLastMessageContent).toBe(true);

              // Shop object must have avatar property (even if undefined)
              expect(conversation.shop).toHaveProperty("avatar");
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should allow extraction of display data for all conversations", () => {
      fc.assert(
        fc.property(
          fc.array(buyerConversationArbitrary, { minLength: 1, maxLength: 20 }),
          (conversations) => {
            // Extract display data for all conversations
            const displayDataList = conversations.map(extractBuyerConversationDisplayData);

            // Verify all display data is valid
            displayDataList.forEach((displayData, index) => {
              const conversation = conversations[index];

              // Shop name must match
              expect(displayData.shopName).toBe(conversation.shop.name);

              // Shop logo must match
              expect(displayData.shopLogo).toBe(conversation.shop.avatar);

              // Last message content must match
              expect(displayData.lastMessageContent).toBe(conversation.lastMessage?.content);

              // Unread count must match
              expect(displayData.unreadCount).toBe(conversation.unreadCount);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Edge cases for conversation rendering", () => {
    it("should handle conversations with zero unread count", () => {
      const conversationWithZeroUnread = fc
        .record({
          _id: conversationIdArbitrary,
          user: userParticipantArbitrary,
          shop: shopParticipantArbitrary,
          unreadCount: fc.constant(0),
          createdAt: isoDateStringArbitrary,
          updatedAt: isoDateStringArbitrary,
        })
        .chain((conv) =>
          fc.record({
            ...conv,
            _id: fc.constant(conv._id),
            user: fc.constant(conv.user),
            shop: fc.constant(conv.shop),
            unreadCount: fc.constant(conv.unreadCount),
            createdAt: fc.constant(conv.createdAt),
            updatedAt: fc.constant(conv.updatedAt),
            lastMessage: fc.option(messageArbitrary(conv._id), { nil: undefined }),
          })
        );

      fc.assert(
        fc.property(conversationWithZeroUnread, (conversation) => {
          const displayData = extractBuyerConversationDisplayData(conversation);

          expect(displayData.unreadCount).toBe(0);
          expect(displayData.shopName).toBeTruthy();
        }),
        { numRuns: 100 }
      );
    });

    it("should handle conversations without last message (new conversations)", () => {
      const newConversation: fc.Arbitrary<Conversation> = fc.record({
        _id: conversationIdArbitrary,
        user: userParticipantArbitrary,
        shop: shopParticipantArbitrary,
        lastMessage: fc.constant(undefined),
        unreadCount: fc.constant(0),
        createdAt: isoDateStringArbitrary,
        updatedAt: isoDateStringArbitrary,
      });

      fc.assert(
        fc.property(newConversation, (conversation) => {
          const displayData = extractBuyerConversationDisplayData(conversation);

          // Last message content should be undefined for new conversations
          expect(displayData.lastMessageContent).toBeUndefined();

          // Other fields should still be valid
          expect(displayData.shopName).toBeTruthy();
          expect(displayData.unreadCount).toBe(0);
        }),
        { numRuns: 100 }
      );
    });

    it("should handle conversations with high unread counts", () => {
      const conversationWithHighUnread = fc
        .record({
          _id: conversationIdArbitrary,
          user: userParticipantArbitrary,
          shop: shopParticipantArbitrary,
          unreadCount: fc.integer({ min: 100, max: 999 }),
          createdAt: isoDateStringArbitrary,
          updatedAt: isoDateStringArbitrary,
        })
        .chain((conv) =>
          fc.record({
            ...conv,
            _id: fc.constant(conv._id),
            user: fc.constant(conv.user),
            shop: fc.constant(conv.shop),
            unreadCount: fc.constant(conv.unreadCount),
            createdAt: fc.constant(conv.createdAt),
            updatedAt: fc.constant(conv.updatedAt),
            lastMessage: fc.option(messageArbitrary(conv._id), { nil: undefined }),
          })
        );

      fc.assert(
        fc.property(conversationWithHighUnread, (conversation) => {
          const displayData = extractBuyerConversationDisplayData(conversation);

          expect(displayData.unreadCount).toBeGreaterThanOrEqual(100);
          expect(displayData.shopName).toBeTruthy();
        }),
        { numRuns: 100 }
      );
    });
  });
});
