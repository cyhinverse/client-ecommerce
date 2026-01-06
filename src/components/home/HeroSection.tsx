"use client";
import React from "react";
import CategorySidebar from "./CategorySidebar";
import Banner from "./Banner";
import SubsidySection from "./SubsidySection";
import UserCard from "./UserCard";
import PromoGrid from "./PromoGrid";

export default function HeroSection() {
  return (
    <div className="w-full bg-white py-4">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="flex gap-3 items-start">
          {/* Left: Category Sidebar - 220px fixed width */}
          <div className="hidden lg:block shrink-0 w-[220px]">
            <CategorySidebar className="h-[420px] rounded-lg overflow-hidden" />
          </div>

          {/* Right: Main Content Grid */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Top Row: Banner | Subsidy | User */}
            <div className="flex flex-col lg:flex-row gap-3 h-auto lg:h-[280px]">
              {/* Banner - 35% width on desktop */}
              <div className="w-full lg:w-[35%] h-[220px] lg:h-full rounded-lg overflow-hidden">
                <Banner />
              </div>

              {/* Subsidy Section - 40% width on desktop */}
              <div className="w-full lg:w-[40%] h-[220px] lg:h-full">
                <SubsidySection />
              </div>

              {/* User Card - 25% width, hidden on tablet and below */}
              <div className="hidden xl:block w-[25%] h-full">
                <UserCard />
              </div>
            </div>

            {/* Bottom Row: 4 Feature/Promo Boxes */}
            <div className="h-[130px]">
              <PromoGrid />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
