import { useQuery } from "@tanstack/react-query";
import instance from "@/api/api";
import { extractApiData } from "@/api";
import { chatbotKeys } from "@/lib/queryKeys";
import { PaginationData } from "@/types/common";

export interface ChatSession {
  sessionId: string;
  lastMessage: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AdminChatbotSessionsResponse {
  data: ChatSession[];
  pagination: PaginationData | null;
}

export interface AdminChatbotHistoryResponse {
  sessionId: string;
  messages: ChatMessage[];
}

const chatbotApi = {
  getAdminSessions: async (params: {
    page: number;
    limit: number;
  }): Promise<AdminChatbotSessionsResponse> => {
    const response = await instance.get("/chatbot/admin/sessions", { params });
    return extractApiData(response);
  },

  getHistory: async (sessionId: string): Promise<AdminChatbotHistoryResponse> => {
    const response = await instance.get(`/chatbot/history/${sessionId}`);
    return extractApiData(response);
  },
};

export function useAdminChatbotSessions(params: { page: number; limit: number }) {
  return useQuery({
    queryKey: chatbotKeys.adminSessions(params),
    queryFn: () => chatbotApi.getAdminSessions(params),
  });
}

export function useAdminChatbotHistory(sessionId: string | null) {
  return useQuery({
    queryKey: chatbotKeys.history(sessionId ?? ""),
    queryFn: () => chatbotApi.getHistory(sessionId ?? ""),
    enabled: !!sessionId,
  });
}
