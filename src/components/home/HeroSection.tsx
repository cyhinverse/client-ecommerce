"use client";
import React from "react";
import { useAppSelector } from "@/hooks/hooks";
import CategorySidebar from "./CategorySidebar";
import Banner from "./Banner";
import SubsidySection from "./SubsidySection";
import UserCard from "./UserCard";
import PromoGrid from "./PromoGrid";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  const { isOpen: isChatOpen } = useAppSelector((state) => state.chat);

  return (
    <div className="w-full bg-white py-4">
      <div className={cn(
        "mx-auto px-4 transition-all duration-300",
        isChatOpen ? "max-w-full" : "max-w-[1400px]"
      )}>
        <div className="flex gap-3 items-start">
          {/* Left: Category Sidebar - Hidden when chat is open on smaller screens */}
          <div className={cn(
            "shrink-0 w-[220px] transition-all duration-300",
            isChatOpen ? "hidden xl:block" : "hidden lg:block"
          )}>
            <CategorySidebar className="h-[420px] rounded-lg overflow-hidden" />
          </div>

          {/* Right: Main Content Grid */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            {/* Top Row: Banner | Subsidy | User */}
            <div className={cn(
              "flex flex-col gap-3 h-auto",
              isChatOpen ? "lg:flex-row lg:h-[280px]" : "lg:flex-row lg:h-[280px]"
            )}>
              {/* Banner */}
              <div className={cn(
                "h-[220px] lg:h-full rounded-lg overflow-hidden transition-all duration-300",
                isChatOpen ? "w-full lg:w-[45%]" : "w-full lg:w-[35%]"
              )}>
                <Banner />
              </div>

              {/* Subsidy Section */}
              <div className={cn(
                "h-[220px] lg:h-full transition-all duration-300",
                isChatOpen ? "w-full lg:w-[55%]" : "w-full lg:w-[40%]"
              )}>
                <SubsidySection />
              </div>

              {/* User Card - Hidden when chat is open */}
              <div className={cn(
                "h-full transition-all duration-300",
                isChatOpen ? "hidden" : "hidden xl:block w-[25%]"
              )}>
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
