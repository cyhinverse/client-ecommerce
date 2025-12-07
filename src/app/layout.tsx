import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./Provider";
import HeaderLayout from "@/components/layout/header/layout";
import FooterLayout from "@/components/layout/footer/page";
import { SocketProvider } from "@/context/SocketContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
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
