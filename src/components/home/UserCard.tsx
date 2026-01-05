"use client";
import React from "react";
import Image from "next/image";
import { useAppSelector } from "@/hooks/hooks";
import {
  ShoppingBag,
  Wallet,
  Truck,
  CreditCard,
  MessageSquare,
  History,
  Store,
  Heart,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function UserCard() {
  const { data: user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Taobao-style order status
  const orderStatus = [
    { label: "My Cart", icon: <ShoppingBag className="w-5 h-5" />, count: 0 },
    { label: "To Receive", icon: <Truck className="w-5 h-5" />, count: 0 },
    { label: "To Ship", icon: <Truck className="w-5 h-5" />, count: 0 }, // Using truck as placeholder for ship
    { label: "To Pay", icon: <Wallet className="w-5 h-5" />, count: 0 },
    {
      label: "To Review",
      icon: <MessageSquare className="w-5 h-5" />,
      count: 0,
    },
  ];

  return (
    <div className="w-full h-full bg-card rounded-xl p-3 flex flex-col justify-between gap-1 overflow-visible">
      {/* 1. Header: Avatar & Info */}
      <div className="flex items-center gap-3 min-h-[48px]">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0 border border-muted">
          {isAuthenticated && user?.avatar ? (
            <Image src={user.avatar} alt="User" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              <span className="text-xs">Guest</span>
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground truncate">
            {isAuthenticated ? user?.username : "Hi, Visitor"}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="bg-muted px-1.5 py-0.5 rounded-full hover:bg-muted/80 cursor-pointer">
              Manage Account
            </span>
          </div>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="flex gap-2">
          <Link
            href="/login"
            className="flex-1 bg-primary text-primary-foreground text-center py-1 rounded-full text-xs font-bold hover:opacity-90"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="flex-1 bg-muted text-foreground text-center py-1 rounded-full text-xs font-bold hover:bg-muted/80"
          >
            Sign up
          </Link>
        </div>
      )}

      {/* 2. Order Status Grid */}
      <div className="grid grid-cols-5 gap-1 text-center py-2">
        {orderStatus.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="text-muted-foreground group-hover:text-primary transition-colors relative">
              {stat.icon}
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* 3. Assets Grid */}
      <div className="grid grid-cols-3 gap-1 py-1 rounded-lg">
        <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:bg-muted/50 rounded p-1">
          <span className="text-primary font-bold text-sm">¥0.00</span>
          <span className="text-[10px] text-muted-foreground">Red Packet</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:bg-muted/50 rounded p-1 relative">
          <span className="text-foreground font-bold text-sm">0</span>
          <span className="text-[10px] text-muted-foreground">Coupons</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:bg-muted/50 rounded p-1">
          <span className="text-foreground font-bold text-sm">0</span>
          <span className="text-[10px] text-muted-foreground">Coins</span>
        </div>
      </div>

      {/* 4. Promotional Banner (Red Strip) */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg py-1.5 px-2 flex items-center justify-between cursor-pointer border border-red-100 dark:border-red-900/30 hover:opacity-90">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground text-[9px] font-bold px-1 rounded-sm">
            HOT
          </div>
          <span className="text-xs text-primary font-medium">
            Limited Offer
          </span>
        </div>
        <ChevronRight className="w-3 h-3 text-primary" />
      </div>

      {/* 5. Footer / Check-in */}
      <div className="bg-[#FFF8E1] dark:bg-yellow-900/10 rounded-lg p-2 flex items-center gap-2 cursor-pointer mt-auto border border-[#FFE082]/30 hover:opacity-90">
        <div className="w-5 h-5 rounded-full bg-[#FFD54F] flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-amber-800 font-bold text-[10px]">¥</span>
        </div>
        <div className="flex flex-col leading-none gap-0.5">
          <span className="text-[11px] font-bold text-amber-800 dark:text-amber-500">
            Daily Check-in
          </span>
          <span className="text-[9px] text-amber-700/70 dark:text-amber-600">
            Get 50 coins
          </span>
        </div>
        <button className="ml-auto bg-[#FFD54F] text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          Go
        </button>
      </div>
    </div>
  );
}
