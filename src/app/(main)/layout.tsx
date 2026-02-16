"use client";
import { useAppSelector } from "@/hooks/hooks";
import HeaderLayout from "@/components/layout/header/layout";
import FooterLayout from "@/components/layout/footer/page";
import ChatWidgetWrapper from "@/components/chatbot/ChatWidgetWrapper";
import { cn } from "@/utils/cn";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen: isChatOpen } = useAppSelector((state) => state.chat);

  return (
    <div className="relative min-h-screen">
      {/* Main Content Area - shrinks when chat is open */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300 ease-in-out mr-0",
          isChatOpen && "lg:mr-[380px]"
        )}
      >
        <HeaderLayout />
        <main className="flex-1">{children}</main>
        <FooterLayout />
      </div>

      {/* AI Chat Sidebar */}
      <ChatWidgetWrapper />

    </div>
  );
}
