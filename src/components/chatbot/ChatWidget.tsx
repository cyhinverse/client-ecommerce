"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, RotateCcw, Search } from "lucide-react";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setChatOpen } from "@/features/chat/chatSlice";
import { ChatbotMessage } from "@/types/chat";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Extended ChatbotMessage with Date timestamp for local state
interface Message extends Omit<ChatbotMessage, "timestamp"> {
  timestamp: Date;
}

const QUICK_ACTIONS = [
  {
    icon: <Search className="h-4 w-4" />,
    label: "Tìm sản phẩm",
    query: "Tìm sản phẩm",
  },
  { icon: "🏷️", label: "Khuyến mãi", query: "Sản phẩm đang giảm giá" },
  { icon: "🔥", label: "Bán chạy", query: "Sản phẩm bán chạy nhất" },
  { icon: "👕", label: "Thời trang", query: "Gợi ý thời trang" },
];

export default function ChatWidget() {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.chat);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem("chatbot_session");
    if (savedSession) {
      setSessionId(savedSession);
      loadHistory(savedSession);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const loadHistory = async (sid: string) => {
    try {
      const res = await fetch(`${API_URL}/api/chatbot/history/${sid}`);
      const data = await res.json();
      if (data.success && data.data?.messages) {
        setMessages(
          data.data.messages.map((m: Message) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        );
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: Message = {
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setStreamingContent("");

      try {
        const res = await fetch(`${API_URL}/api/chatbot/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text.trim(), sessionId }),
        });

        if (!res.ok) throw new Error("Stream request failed");

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.type === "session" && data.sessionId) {
                    if (data.sessionId !== sessionId) {
                      setSessionId(data.sessionId);
                      localStorage.setItem("chatbot_session", data.sessionId);
                    }
                  } else if (data.type === "token") {
                    fullContent += data.content;
                    setStreamingContent(fullContent);
                  } else if (data.type === "done") {
                    setMessages((prev) => [
                      ...prev,
                      {
                        role: "assistant",
                        content: fullContent,
                        timestamp: new Date(),
                      },
                    ]);
                    setStreamingContent("");
                  } else if (data.type === "error") {
                    throw new Error(data.message);
                  }
                } catch (e) {
                  console.error("Invalid JSON:", e);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
        setStreamingContent("");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Xin lỗi, không thể kết nối. Vui lòng thử lại! 🙏",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, sessionId],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
    setStreamingContent("");
    localStorage.removeItem("chatbot_session");
  };

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-full w-[380px] z-40 bg-white border-l border-gray-100 transform transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      {/* Top Bar - Match với TopBar của header chính */}
      <div className="h-8 bg-[#fafafa] border-b border-gray-100 flex items-center justify-between px-4">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
          <span className="text-[11px] text-gray-500">Sẵn sàng hỗ trợ</span>
        </div>
        <button
          onClick={() => dispatch(setChatOpen(false))}
          className="text-[11px] text-gray-500 hover:text-[#E53935] transition-colors"
        >
          Đóng
        </button>
      </div>

      {/* Header - Match với header chính (cùng chiều cao ~91px) */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#E53935] flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-gray-800">
                Mia - Trợ lý AI
              </h3>
              <p className="text-xs text-gray-500">Hỗ trợ mua sắm 24/7</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#E53935] hover:bg-gray-50 transition-colors"
              title="Làm mới"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto bg-[#f7f7f7]"
        ref={scrollRef}
        style={{ overscrollBehavior: "contain" }}
      >
        {messages.length === 0 && !streamingContent ? (
          <div className="p-4">
            {/* Welcome Card */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-800 mb-1">
                <span className="font-medium">Xin chào! 👋</span>
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Em là trợ lý mua sắm AI, có thể giúp bạn tìm kiếm sản phẩm, tư
                vấn thời trang, hoặc trả lời các câu hỏi về đơn hàng.
              </p>
            </div>

            {/* Quick Actions - Grid 2x2 */}
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((action, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(action.query)}
                  className="flex items-center gap-2 p-3 bg-white rounded-lg hover:bg-[#E53935]/5 transition-colors text-left group"
                >
                  <span className="text-gray-500 group-hover:text-[#E53935]">
                    {typeof action.icon === "string"
                      ? action.icon
                      : action.icon}
                  </span>
                  <span className="text-sm text-gray-700 group-hover:text-[#E53935]">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {msg.role === "assistant" && (
                  <div className="h-6 w-6 rounded-full bg-[#E53935] flex items-center justify-center shrink-0 mr-2 mt-1">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    msg.role === "user"
                      ? "bg-[#E53935] text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm",
                  )}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mb-2 [&>li]:mb-0.5">
                      <ReactMarkdown
                        components={{
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              className="text-[#E53935] hover:underline"
                              target={
                                href?.startsWith("http") ? "_blank" : undefined
                              }
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Streaming */}
            {streamingContent && (
              <div className="flex justify-start">
                <div className="h-6 w-6 rounded-full bg-[#E53935] flex items-center justify-center shrink-0 mr-2 mt-1">
                  <Bot className="h-3 w-3 text-white" />
                </div>
                <div className="max-w-[80%] rounded-lg rounded-bl-sm px-3 py-2 text-sm bg-white text-gray-800">
                  <ReactMarkdown>{streamingContent}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Loading */}
            {isLoading && !streamingContent && (
              <div className="flex justify-start">
                <div className="h-6 w-6 rounded-full bg-[#E53935] flex items-center justify-center shrink-0 mr-2 mt-1">
                  <Bot className="h-3 w-3 text-white" />
                </div>
                <div className="bg-white rounded-lg rounded-bl-sm px-3 py-2">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              disabled={isLoading}
              rows={1}
              className="w-full resize-none rounded-lg border-0 bg-[#f7f7f7] px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#E53935]/30 disabled:opacity-50"
              style={{ minHeight: "40px", maxHeight: "100px" }}
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-10 w-10 rounded-lg bg-[#E53935] hover:bg-[#D32F2F] shrink-0"
          >
            {isLoading ? (
              <SpinnerLoading size={16} noWrapper />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
