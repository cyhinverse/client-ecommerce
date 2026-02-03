"use client";
import { useState } from "react";
import { useAppSelector } from "@/hooks/hooks";
import HeroSection from "@/components/home/HeroSection";
import Category from "@/components/category/Category";
import HomeProductList from "@/components/home/HomeProductList";
import { cn } from "@/lib/utils";

export default function Home() {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const { isOpen: isChatOpen } = useAppSelector((state) => state.chat);

  return (
    <main className="w-full min-h-screen bg-gray-50">
      <HeroSection />

      {/* Sticky Category Bar */}
      <div className="sticky top-[88px] z-30 w-full bg-white">
        <div className={cn(
          "mx-auto px-4 py-2 transition-all duration-300",
          isChatOpen ? "max-w-full" : "container max-w-[1400px]"
        )}>
          <Category
            selectedSlug={selectedCategorySlug}
            onSelectCategory={setSelectedCategorySlug}
          />
        </div>
      </div>

      <div className={cn(
        "mx-auto px-4 pb-20 min-h-[500px] mt-4 transition-all duration-300",
        isChatOpen ? "max-w-full" : "container max-w-[1400px]"
      )}>
        {/* Product List by Category */}
        <HomeProductList selectedCategorySlug={selectedCategorySlug} />
      </div>
    </main>
  );
}
