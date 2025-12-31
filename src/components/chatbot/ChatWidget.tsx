"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setChatOpen } from "@/features/chat/chatSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "Tìm áo thun nam",
  "Sản phẩm đang giảm giá",
  "Gợi ý sản phẩm hot",
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Load session từ localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem("chatbot_session");
    if (savedSession) {
      setSessionId(savedSession);
      loadHistory(savedSession);
    }
  }, []);

  // Auto scroll xuống cuối
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  // Focus input khi mở chat
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
          }))
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
        // Use streaming endpoint
        const res = await fetch(`${API_URL}/api/chatbot/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text.trim(),
            sessionId,
          }),
        });

        if (!res.ok) {
          throw new Error("Stream request failed");
        }

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
                    // Add complete message
                    const assistantMessage: Message = {
                      role: "assistant",
                      content: fullContent,
                      timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, assistantMessage]);
                    setStreamingContent("");
                  } else if (data.type === "error") {
                    throw new Error(data.message);
                  }
                } catch (e) {
                  // Skip invalid JSON
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
            content: "Không thể kết nối đến server. Vui lòng thử lại! 🙏",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, sessionId]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
    setStreamingContent("");
    localStorage.removeItem("chatbot_session");
  };

  return (
    <>
      {/* Chat Sidebar Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 backdrop-blur-sm",
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        )}
        onClick={() => dispatch(setChatOpen(false))}
      />

      {/* Chat Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[400px] z-50 bg-background shadow-2xl border-l border-border transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="h-full flex flex-col bg-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-foreground">
                  Mia - Trợ lý AI
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-muted-foreground">
                    Sẵn sàng hỗ trợ
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Làm mới cuộc hội thoại"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(setChatOpen(false))}
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Đóng chat"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/30"
            ref={scrollRef}
            style={{ overscrollBehavior: "contain" }}
          >
            {/* Same message content content... */}
            {messages.length === 0 && !streamingContent ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-2">
                  Xin chào! 👋
                </h4>
                <p className="text-muted-foreground mb-8 max-w-[280px]">
                  Em là Mia, trợ lý mua sắm AI thông minh. Em có thể giúp
                  anh/chị tìm kiếm sản phẩm hoặc tư vấn thời trang?
                </p>

                {/* Quick Suggestions */}
                <div className="w-full space-y-2.5">
                  {SUGGESTIONS.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(suggestion)}
                      className="w-full text-left px-5 py-3.5 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-4",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.role === "assistant" && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-card border border-border text-foreground rounded-bl-none"
                      )}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:mb-3 [&>ol]:mb-3 [&>li]:mb-1">
                          <ReactMarkdown
                            components={{
                              a: ({ href, children }) => (
                                <a
                                  href={href}
                                  className="text-primary hover:underline font-medium"
                                  target={
                                    href?.startsWith("http")
                                      ? "_blank"
                                      : undefined
                                  }
                                >
                                  {children}
                                </a>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-foreground">
                                  {children}
                                </strong>
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

                {/* Streaming message */}
                {streamingContent && (
                  <div className="flex gap-4 justify-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-bl-none px-5 py-3.5 text-sm leading-relaxed bg-card border border-border text-foreground shadow-sm">
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-3 [&>p:last-child]:mb-0">
                        <ReactMarkdown
                          components={{
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                className="text-primary hover:underline font-medium"
                              >
                                {children}
                              </a>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-foreground">
                                {children}
                              </strong>
                            ),
                          }}
                        >
                          {streamingContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading indicator */}
                {isLoading && !streamingContent && (
                  <div className="flex gap-4 justify-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-card border border-border rounded-2xl rounded-bl-none px-5 py-4 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-card">
            <form
              onSubmit={handleSubmit}
              className="flex gap-3 items-center bg-muted/50 rounded-full px-2 py-2 border border-border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập câu hỏi của bạn..."
                disabled={isLoading}
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 px-4 h-10 shadow-none"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                size="icon"
                className="rounded-full h-9 w-9 bg-primary hover:bg-primary/90 shrink-0 shadow-sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            <p className="text-[10px] text-center text-muted-foreground mt-2">
              Mia có thể mắc lỗi. Vui lòng kiểm tra lại thông tin quan trọng.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
