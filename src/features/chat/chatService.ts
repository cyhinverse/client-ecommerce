import axiosInstance from "@/api/api";

const BASE_URL = "/chatbot";

/**
 * Chatbot API Service
 */
export const chatbotService = {
    /**
     * Send message to chatbot
     */
    sendMessage: async (message: string, sessionId?: string | null) => {
        const response = await axiosInstance.post(`${BASE_URL}/message`, {
            message,
            sessionId,
        });
        return response.data;
    },

    /**
     * Get session history
     */
    getSessionHistory: async (sessionId: string) => {
        const response = await axiosInstance.get(`${BASE_URL}/session/${sessionId}`);
        return response.data;
    },

    /**
     * Clear session
     */
    clearSession: async (sessionId: string) => {
        const response = await axiosInstance.delete(
            `${BASE_URL}/session/${sessionId}`
        );
        return response.data;
    },

    /**
     * Get suggested quick replies
     */
    getSuggestions: async (sessionId?: string | null) => {
        const params = sessionId ? { sessionId } : {};
        const response = await axiosInstance.get(`${BASE_URL}/suggestions`, {
            params,
        });
        return response.data;
    },

    /**
     * Get user's chat sessions
     */
    getUserSessions: async () => {
        const response = await axiosInstance.get(`${BASE_URL}/sessions`);
        return response.data;
    },
};
