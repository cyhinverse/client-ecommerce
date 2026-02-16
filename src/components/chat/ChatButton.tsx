"use client";
import { MessageCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { toggleChat } from "@/features/chat/chatSlice";
import { useChatConversations } from "@/hooks/queries";

export default function ChatButton() {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.chat);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: conversations = [] } = useChatConversations({
    enabled: isAuthenticated,
  });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={() => dispatch(toggleChat())}
      className={`fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all z-40 ${
        isOpen ? "bg-gray-200 text-gray-600" : "bg-[#E53935] text-white hover:bg-[#D32F2F]"
      }`}
    >
      <MessageCircle className="h-6 w-6" />
      {totalUnread > 0 && !isOpen && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-gray-800 text-xs font-bold rounded-full flex items-center justify-center">
          {totalUnread > 9 ? "9+" : totalUnread}
        </span>
      )}
    </button>
  );
}
