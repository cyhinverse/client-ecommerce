// Chat Types
export interface Message {
    _id?: string;
    role: "user" | "assistant" | "system";
    content: string;
    data?: any;
    timestamp?: string;
    metadata?: {
        functionCalled?: string | boolean;
        functionResult?: any;
        intent?: string;
    };
}

export interface ChatSession {
    sessionId: string;
    userId: string;
    messages: Message[];
    context: {
        currentIntent?: string;
        entities?: Record<string, any>;
        conversationState?: string;
        lastMentionedProduct?: string;
        lastMentionedOrder?: string;
        cartContext?: any;
    };
    createdAt: Date;
    lastActiveAt: Date;
}

export interface ProductSuggestion {
    _id: string;
    name: string;
    slug: string;
    price: {
        currentPrice: number;
        originalPrice?: number;
        discountPrice?: number;
    };
    images: string[];
    stock?: number;
}

export interface VoucherSuggestion {
    _id: string;
    code: string;
    description: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    minOrderValue?: number;
    maxDiscountAmount?: number;
    expiryDate: Date;
}

export interface ActionButton {
    label: string;
    action: string;
    payload?: any;
    variant?: "primary" | "secondary" | "outline";
}

export interface ChatResponse {
    success: boolean;
    sessionId?: string;
    message: string;
    data?: any;
    metadata?: {
        intent?: string;
        functionCalled?: boolean;
    };
    error?: string;
}

export interface ChatState {
    isOpen: boolean;
    messages: Message[];
    isTyping: boolean;
    sessionId: string | null;
    suggestions: string[];
    isLoading: boolean;
    error: string | null;
}
