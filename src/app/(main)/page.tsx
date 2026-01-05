"use client";
import React, { useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import Category from "@/components/category/Category";
import HomeProductList from "@/components/home/HomeProductList";

export default function Home() {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<
    string | null
  >(null);

  return (
    <>
      <main className="w-full min-h-screen bg-gray-50 dark:bg-background">
        <HeroSection />

        <div className="container mx-auto px-4 mt-2 mb-8 sticky top-[64px] z-30 bg-gray-50 dark:bg-background py-2">
          <Category
            selectedSlug={selectedCategorySlug}
            onSelectCategory={setSelectedCategorySlug}
          />
        </div>

        <div className="container mx-auto px-4 pb-20 min-h-[500px]">
          <HomeProductList selectedCategorySlug={selectedCategorySlug} />
        </div>
      </main>
    </>
  );
}
