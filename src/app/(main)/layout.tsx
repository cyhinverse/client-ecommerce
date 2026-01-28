"use client";
import { useAppSelector } from "@/hooks/hooks";
import HeaderLayout from "@/components/layout/header/layout";
import FooterLayout from "@/components/layout/footer/page";
import ChatWidgetWrapper from "@/components/chatbot/ChatWidgetWrapper";
import ChatButton from "@/components/chat/ChatButton";
import { cn } from "@/lib/utils";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen: isChatOpen } = useAppSelector((state) => state.chat);

  return (
    <div className="relative min-h-screen">
      {/* Main Content Area - shrinks when chat is open */}
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        isChatOpen ? "mr-[380px]" : "mr-0"
      )}>
        <HeaderLayout />
        <main className="flex-1">{children}</main>
        <FooterLayout />
      </div>

      {/* AI Chat Sidebar */}
      <ChatWidgetWrapper />

      {/* User-Shop Chat Components */}
      <ChatButton />
    </div>
  );
}
