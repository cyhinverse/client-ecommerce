"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  X,
  ChevronLeft,
  Store,
  Loader2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  getMyConversations,
  getMessages,
  markMessagesAsRead,
} from "@/features/chat/chatAction";
import { setChatOpen, setCurrentConversation } from "@/features/chat/chatSlice";
import { Conversation, Message } from "@/types/chat";
import MessageInput from "./MessageInput";
import { useSocket } from "@/context/SocketContext";
import { joinConversation, leaveConversation } from "@/socket/chat.socket";

export default function ChatPanel() {
  const dispatch = useAppDispatch();
  const {
    isOpen,
    conversations,
    currentConversation,
    messages,
    isLoadingConversations,
    isLoadingMessages,
  } = useAppSelector((state) => state.chat);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Socket connection (Requirement 8.4)
  const { socket } = useSocket();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      dispatch(getMyConversations());
    }
  }, [dispatch, isOpen, isAuthenticated]);

  useEffect(() => {
    if (currentConversation) {
      dispatch(getMessages({ conversationId: currentConversation._id }));
      dispatch(markMessagesAsRead(currentConversation._id));
    }
  }, [dispatch, currentConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup: Leave conversation room on unmount (Requirement 8.4)
  useEffect(() => {
    return () => {
      if (socket && currentConversation) {
        leaveConversation(socket, currentConversation._id);
      }
    };
  }, [socket, currentConversation]);

  const handleSelectConversation = (conv: Conversation) => {
    // Leave previous conversation room if there was one (Requirement 8.4)
    if (socket && currentConversation) {
      leaveConversation(socket, currentConversation._id);
    }

    dispatch(setCurrentConversation(conv));

    // Join new conversation room (Requirement 8.4)
    if (socket) {
      joinConversation(socket, conv._id);
    }
  };

  const handleBack = () => {
    // Leave conversation room when going back (Requirement 8.4)
    if (socket && currentConversation) {
      leaveConversation(socket, currentConversation._id);
    }
    dispatch(setCurrentConversation(null));
  };

  const handleClose = () => {
    // Leave conversation room when closing panel (Requirement 8.4)
    if (socket && currentConversation) {
      leaveConversation(socket, currentConversation._id);
    }
    dispatch(setChatOpen(false));
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return "Vừa xong";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ`;
    return date.toLocaleDateString("vi-VN");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-[360px] h-[500px] bg-white rounded-lg shadow-xl border border-[#f0f0f0] flex flex-col z-50">
      {/* Header */}
      <div className="p-3 border-b border-[#f0f0f0] flex items-center gap-2 bg-[#E53935] text-white rounded-t-lg">
        {currentConversation && (
          <button onClick={handleBack} className="p-1 hover:bg-white/20 rounded">
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <MessageCircle className="h-5 w-5" />
        <span className="font-medium flex-1">
          {currentConversation ? currentConversation.shop.name : "Tin nhắn"}
        </span>
        <button onClick={handleClose} className="p-1 hover:bg-white/20 rounded">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center p-4">
            <MessageCircle className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Đăng nhập để xem tin nhắn</p>
            <Link href="/login">
              <Button size="sm" className="mt-2 bg-[#E53935]">
                Đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      ) : currentConversation ? (
        // Messages View
        <>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoadingMessages ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#E53935]" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                Bắt đầu cuộc trò chuyện
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={cn(
                    "flex",
                    msg.senderType === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] px-3 py-2 rounded-lg text-sm",
                      msg.senderType === "user"
                        ? "bg-[#E53935] text-white"
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    <p>{msg.content}</p>
                    <span
                      className={cn(
                        "text-[10px] mt-1 block",
                        msg.senderType === "user" ? "text-white/70" : "text-gray-400"
                      )}
                    >
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <MessageInput conversationId={currentConversation._id} />
        </>
      ) : (
        // Conversations List
        <div className="flex-1 overflow-y-auto">
          {isLoadingConversations ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#E53935]" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              Chưa có cuộc trò chuyện nào
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => handleSelectConversation(conv)}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-[#f0f0f0]"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={conv.shop.avatar || "/images/default-shop.png"}
                    alt={conv.shop.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-gray-800 truncate">
                      {conv.shop.name}
                    </span>
                    {conv.lastMessage && (
                      <span className="text-[10px] text-gray-400">
                        {formatTime(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className="text-xs text-gray-500 truncate">
                      {conv.lastMessage.content}
                    </p>
                  )}
                </div>
                {conv.unreadCount > 0 && (
                  <span className="w-5 h-5 bg-[#E53935] text-white text-[10px] rounded-full flex items-center justify-center">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
