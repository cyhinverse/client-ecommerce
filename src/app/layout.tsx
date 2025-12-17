import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./Provider";
import HeaderLayout from "@/components/layout/header/layout";
import FooterLayout from "@/components/layout/footer/page";
import { SocketProvider } from "@/context/SocketContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ecommerce",
  description: "Ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        <ReduxProvider>
          <SocketProvider>
            <HeaderLayout />
            <main className="flex-1">{children}</main>
            <FooterLayout />
          </SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
