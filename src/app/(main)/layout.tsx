import HeaderLayout from "@/components/layout/header/layout";
import FooterLayout from "@/components/layout/footer/page";
import ChatWidgetWrapper from "@/components/chatbot/ChatWidgetWrapper";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderLayout />
      <main className="flex-1">{children}</main>
      <FooterLayout />
      <ChatWidgetWrapper />
    </>
  );
}
