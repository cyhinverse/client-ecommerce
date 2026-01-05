import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./Provider";
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
          <SocketProvider>{children}</SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
