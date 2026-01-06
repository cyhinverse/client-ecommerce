// MessagesPage - Taobao Light Style
"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  MessageCircle, 
  Send, 
  Search, 
  MoreVertical,
  Image as ImageIcon,
  Smile,
  Store,
  Package,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  _id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  _id: string;
  shop: {
    _id: string;
    name: string;
    logo: string;
  };
  lastMessage: {
    content: string;
    senderId: string;
    createdAt: string;
  };
  unreadCount: number;
  context?: {
    product?: {
      _id: string;
      name: string;
      image: string;
      price: number;
    };
  };
}

// Mock data
const mockConversations: Conversation[] = [
  {
    _id: "conv1",
    shop: {
      _id: "shop1",
      name: "Apple Store",
      logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100",
    },
    lastMessage: {
      content: "Dạ, sản phẩm này còn hàng ạ",
      senderId: "shop1",
      createdAt: new Date().toISOString(),
    },
    unreadCount: 2,
    context: {
      product: {
        _id: "p1",
        name: "iPhone 15 Pro Max",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100",
        price: 34990000,
      },
    },
  },
  {
    _id: "conv2",
    shop: {
      _id: "shop2",
      name: "Samsung Official",
      logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100",
    },
    lastMessage: {
      content: "Cảm ơn bạn đã mua hàng!",
      senderId: "shop2",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    unreadCount: 0,
  },
];

const mockMessages: Message[] = [
  {
    _id: "m1",
    senderId: "user",
    content: "Chào shop, sản phẩm này còn hàng không ạ?",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    isRead: true,
  },
  {
    _id: "m2",
    senderId: "shop1",
    content: "Chào bạn, cảm ơn bạn đã quan tâm đến sản phẩm của shop!",
    createdAt: new Date(Date.now() - 7000000).toISOString(),
    isRead: true,
  },
  {
    _id: "m3",
    senderId: "shop1",
    content: "Dạ, sản phẩm này còn hàng ạ",
    createdAt: new Date(Date.now() - 6800000).toISOString(),
    isRead: true,
  },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(mockConversations[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConv) return;

    const message: Message = {
      _id: `m${Date.now()}`,
      senderId: "user",
      content: newMessage,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return "Vừa xong";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ`;
    return date.toLocaleDateString('vi-VN');
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConv(conv);
    setShowMobileChat(true);
  };

  return (
    <div className="h-[calc(100vh-140px)] bg-background -mt-4 -mx-4 flex">
      {/* Conversations List */}
      <div className={cn(
        "w-full md:w-[320px] bg-white border-r border-[#f0f0f0] flex flex-col",
        showMobileChat && "hidden md:flex"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="h-5 w-5 text-[#E53935]" />
            <h1 className="text-lg font-bold text-gray-800">Tin nhắn</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 border-gray-200 focus:border-[#E53935]"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => handleSelectConversation(conv)}
              className={cn(
                "flex items-start gap-3 p-3 cursor-pointer transition-colors border-b border-border",
                selectedConv?._id === conv._id ? "bg-[#FFEBEE]" : "hover:bg-[#fafafa]"
              )}
            >
              {/* Shop Avatar */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                <Image
                  src={conv.shop.logo}
                  alt={conv.shop.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800 text-sm truncate">
                    {conv.shop.name}
                  </span>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {formatTime(conv.lastMessage.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {conv.lastMessage.content}
                </p>
                {conv.context?.product && (
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                    <Package className="h-3 w-3" />
                    <span className="truncate">{conv.context.product.name}</span>
                  </div>
                )}
              </div>

              {/* Unread Badge */}
              {conv.unreadCount > 0 && (
                <span className="w-5 h-5 bg-[#E53935] text-white text-[10px] rounded-full flex items-center justify-center shrink-0">
                  {conv.unreadCount}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      <div className={cn(
        "flex-1 flex flex-col bg-white",
        !showMobileChat && "hidden md:flex"
      )}>
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-3 border-b border-[#f0f0f0] flex items-center gap-3">
              <button
                onClick={() => setShowMobileChat(false)}
                className="md:hidden p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={selectedConv.shop.logo}
                  alt={selectedConv.shop.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="font-medium text-gray-800">{selectedConv.shop.name}</h2>
                <span className="text-xs text-[#4CAF50]">Đang hoạt động</span>
              </div>
              <Link href={`/shop/${selectedConv.shop._id}`}>
                <Button variant="outline" size="sm" className="text-xs border-gray-200">
                  <Store className="h-3.5 w-3.5 mr-1" />
                  Xem Shop
                </Button>
              </Link>
            </div>

            {/* Product Context */}
            {selectedConv.context?.product && (
              <div className="p-3 bg-[#fafafa] border-b border-[#f0f0f0]">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded overflow-hidden">
                    <Image
                      src={selectedConv.context.product.image}
                      alt={selectedConv.context.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">
                      {selectedConv.context.product.name}
                    </p>
                    <p className="text-sm text-[#E53935] font-medium">
                      ₫{selectedConv.context.product.price.toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={cn(
                    "flex",
                    msg.senderId === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] px-3 py-2 rounded-lg text-sm",
                      msg.senderId === "user"
                        ? "bg-[#E53935] text-white"
                        : "bg-muted text-gray-800"
                    )}
                  >
                    <p>{msg.content}</p>
                    <span className={cn(
                      "text-[10px] mt-1 block",
                      msg.senderId === "user" ? "text-white/70" : "text-gray-400"
                    )}>
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[#f0f0f0]">
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <ImageIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <Smile className="h-5 w-5" />
                </button>
                <Input
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 border-gray-200 focus:border-[#E53935]"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-[#E53935] hover:bg-[#D32F2F]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Chọn một cuộc trò chuyện</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
