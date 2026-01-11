"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  MessageSquare,
  Search,
  Send,
  User,
  Phone,
  Video,
  Info,
  Smile,
  Paperclip,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMyShop } from "@/hooks/queries";
import { cn } from "@/lib/utils";

interface Message {
  _id: string;
  content: string;
  sender: "shop" | "customer";
  createdAt: string;
}

interface Conversation {
  _id: string;
  customer: { _id: string; name: string; avatar?: string };
  lastMessage?: { content: string; createdAt: string };
  unreadCount: number;
}

export default function SellerChatPage() {
  const { data: myShop } = useMyShop();
  const [conversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        content: newMessage,
        sender: "shop",
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewMessage("");
  };

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (!myShop) return null;

  return (
    <div className="bg-[#f7f7f7] rounded-2xl overflow-hidden h-[calc(100vh-180px)]">
      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-80 bg-white flex flex-col">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#f7f7f7] rounded-xl flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">Tin nhắn</h2>
                <p className="text-xs text-gray-500">
                  {conversations.length} cuộc hội thoại
                </p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-[#f7f7f7] border-0"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6">
                <MessageSquare className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm text-center">Chưa có tin nhắn nào</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    "w-full p-4 flex items-center gap-3 hover:bg-[#f7f7f7] transition-colors text-left",
                    selectedConversation?._id === conv._id && "bg-[#f7f7f7]"
                  )}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f7f7f7]">
                      {conv.customer.avatar ? (
                        <Image
                          src={conv.customer.avatar}
                          alt={conv.customer.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-800 truncate">
                        {conv.customer.name}
                      </p>
                      {conv.lastMessage && (
                        <span className="text-xs text-gray-400">
                          {formatTime(conv.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        {conv.lastMessage.content}
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#f7f7f7]">
          {selectedConversation ? (
            <>
              <div className="p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#f7f7f7]">
                    {selectedConversation.customer.avatar ? (
                      <Image
                        src={selectedConversation.customer.avatar}
                        alt={selectedConversation.customer.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {selectedConversation.customer.name}
                    </p>
                    <p className="text-xs text-green-500">Đang hoạt động</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="rounded-lg">
                    <Phone className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-lg">
                    <Video className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-lg">
                    <Info className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={cn(
                      "flex",
                      msg.sender === "shop" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] px-4 py-2.5 rounded-2xl",
                        msg.sender === "shop"
                          ? "bg-primary text-white rounded-br-md"
                          : "bg-white text-gray-800 rounded-bl-md"
                      )}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={cn(
                          "text-[10px] mt-1",
                          msg.sender === "shop"
                            ? "text-white/70"
                            : "text-gray-400"
                        )}
                      >
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 bg-white">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg shrink-0"
                  >
                    <Smile className="h-5 w-5 text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg shrink-0"
                  >
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg shrink-0"
                  >
                    <Paperclip className="h-5 w-5 text-gray-400" />
                  </Button>
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 h-11 rounded-xl bg-[#f7f7f7] border-0"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-primary hover:bg-primary/90 rounded-xl h-11 px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-10 w-10 opacity-50" />
              </div>
              <p className="text-lg font-medium text-gray-600">
                Chọn một cuộc hội thoại
              </p>
              <p className="text-sm mt-1">
                Chọn từ danh sách bên trái để bắt đầu chat
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
