"use client";
import React from "react";
import CategorySidebar from "./CategorySidebar";
import Banner from "./Banner";
import SubsidySection from "./SubsidySection";
import UserCard from "./UserCard";
import PromoGrid from "./PromoGrid";

export default function HeroSection() {
  return (
    <div className="w-full bg-gray-50 dark:bg-zinc-950 py-4">
      <div className="container mx-auto px-4">
        <div className="flex gap-4 items-start">
          {/* Left: Category Sidebar */}
          <div className="hidden lg:block shrink-0 w-[220px] h-[460px]">
            <CategorySidebar className="h-full" />
          </div>

          {/* Right: Main Content Grid */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Top Row: Banner | Subsidy | User */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Banner - Takes about 30% */}
              <div className="w-full lg:w-[35%] h-[244px] lg:h-auto min-h-[244px]">
                <Banner />
              </div>

              {/* Subsidy - Takes about 40% */}
              <div className="w-full lg:w-[40%] h-[200px] lg:h-auto min-h-[244px]">
                <SubsidySection />
              </div>

              {/* User Card - Takes about 25% */}
              <div className="hidden xl:block w-[25%]">
                <UserCard />
              </div>
            </div>

            {/* Bottom Row: 4 Feature Boxes */}
            <PromoGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
