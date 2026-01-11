import { BaseEntity } from "./common";

// ============ User-Shop Chat Types ============

// Message type enum
export type MessageType = "text" | "image" | "product";

// Sender type enum
export type SenderType = "user" | "shop";

// Message interface - for user-shop chat
export interface Message extends BaseEntity {
  conversation: string;
  sender: string;
  senderType: SenderType;
  content: string;
  messageType: MessageType;
  productRef?: string;
  isRead: boolean;
}

// Conversation participant
export interface ConversationParticipant {
  _id: string;
  name: string;
  avatar?: string;
}

// Shop participant with shopId
export interface ShopParticipant extends ConversationParticipant {
  shopId: string;
}

// Conversation interface
export interface Conversation extends BaseEntity {
  user: ConversationParticipant;
  shop: ShopParticipant;
  lastMessage?: Message;
  unreadCount: number;
}

// Start conversation payload
export interface StartConversationPayload {
  shopId: string;
  message?: string;
}

// Send message payload
export interface SendMessagePayload {
  conversationId: string;
  content: string;
  messageType?: MessageType;
  productRef?: string;
}

// ============ Chatbot Types ============

// Chatbot message role
export type ChatbotRole = "user" | "assistant";

// Chatbot message interface - for AI chatbot
export interface ChatbotMessage {
  role: ChatbotRole;
  content: string;
  timestamp?: string;
}

// ============ State Types ============

// Chat state for Redux
export interface ChatState {
  isOpen: boolean;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;
  error: string | null;
}

// Chatbot state
export interface ChatbotState {
  messages: ChatbotMessage[];
  isLoading: boolean;
  error: string | null;
}
