"use client";

import React from "react";
import type { Message } from "@/types/chat";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
    message: Message;
}

/**
 * Individual chat message component
 */
const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === "user";

    return (
        <div
            className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : "flex-row"
                }`}
        >
            {/* Avatar */}
            {!isUser && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                </div>
            )}

            {/* Message Bubble */}
            <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${isUser
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tr-sm"
                        : "bg-white text-gray-800 rounded-tl-sm"
                    }`}
            >
                <div className="whitespace-pre-wrap break-words text-sm">
                    {message.content}
                </div>

                {/* Timestamp */}
                {message.timestamp && (
                    <div
                        className={`text-xs mt-1 ${isUser ? "text-white/70" : "text-gray-400"
                            }`}
                    >
                        {new Date(message.timestamp).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                )}
            </div>

            {isUser && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
