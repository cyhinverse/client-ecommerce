// Message interface
export interface Message {
  _id: string;
  conversation: string;
  sender: string;
  senderType: "user" | "shop";
  content: string;
  messageType: "text" | "image" | "product";
  productRef?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// Conversation participant
export interface ConversationParticipant {
  _id: string;
  name: string;
  avatar?: string;
}

// Conversation interface
export interface Conversation {
  _id: string;
  user: ConversationParticipant;
  shop: ConversationParticipant & { shopId: string };
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
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
  messageType?: "text" | "image" | "product";
  productRef?: string;
}

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
