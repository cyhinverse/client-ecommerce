"use client";
import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getTreeCategories } from "@/features/category/categoryAction";
import { cn } from "@/lib/utils";
import {
  Heart,
  ChevronRight,
  RotateCcw,
  Laptop,
  Smartphone,
  Home,
  Shirt,
  Watch,
  Baby,
  Car,
  Utensils,
  Dumbbell,
  Sparkles,
  Package,
} from "lucide-react";

// Icon mapping for categories (reused/inline for self-containment)
const categoryIcons: Record<string, React.ReactNode> = {
  electronics: <Laptop className="w-5 h-5" />,
  phones: <Smartphone className="w-5 h-5" />,
  home: <Home className="w-5 h-5" />,
  fashion: <Shirt className="w-5 h-5" />,
  men: <Shirt className="w-5 h-5" />,
  women: <Sparkles className="w-5 h-5" />,
  watches: <Watch className="w-5 h-5" />,
  jewelry: <Watch className="w-5 h-5" />,
  baby: <Baby className="w-5 h-5" />,
  kids: <Baby className="w-5 h-5" />,
  automotive: <Car className="w-5 h-5" />,
  food: <Utensils className="w-5 h-5" />,
  sports: <Dumbbell className="w-5 h-5" />,
  beauty: <Sparkles className="w-5 h-5" />,
  default: <Package className="w-5 h-5" />,
};

const getIcon = (slug: string) => {
  const normalizedSlug = slug.toLowerCase();
  for (const key of Object.keys(categoryIcons)) {
    if (normalizedSlug.includes(key)) {
      return categoryIcons[key];
    }
  }
  return categoryIcons.default;
};

interface CategoryProps {
  onSelectCategory: (slug: string | null) => void;
  selectedSlug: string | null;
}

export default function Category({
  onSelectCategory,
  selectedSlug,
}: CategoryProps) {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getTreeCategories());
  }, [dispatch]);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const resetScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 sm:gap-4 py-2">
        {/* Left Badge - Minimalist */}
        <div
          onClick={() => onSelectCategory(null)}
          className={cn(
            "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0 cursor-pointer transition-all duration-200 select-none",
            !selectedSlug
              ? "text-primary font-bold bg-transparent"
              : "text-muted-foreground hover:text-primary bg-transparent"
          )}
        >
          <Heart
            className={cn("w-4 h-4", !selectedSlug ? "fill-current" : "")}
          />
          <span className="text-[15px] whitespace-nowrap">Guess You Like</span>
        </div>

        {/* Separator */}
        <div className="hidden sm:block h-4 w-px bg-border/50 mx-1" />

        {/* Scrolling List */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-6 px-2 masking-fade"
        >
          {categories.map((cat) => {
            const isActive = selectedSlug === cat.slug;
            return (
              <div
                key={cat._id}
                onClick={() => onSelectCategory(cat.slug)}
                className="group flex items-center gap-1.5 min-w-fit py-1 cursor-pointer select-none"
              >
                {/* Icon - Only colored when active/hover */}
                <span
                  className={cn(
                    "transition-colors duration-200",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-primary"
                  )}
                >
                  {getIcon(cat.slug)}
                </span>

                <span
                  className={cn(
                    "text-[14px] font-medium transition-colors duration-200 relative",
                    isActive
                      ? "text-primary"
                      : "text-foreground/80 group-hover:text-primary"
                  )}
                >
                  {cat.name}
                  {/* Underline for active state if desired, or just Keep it bold/colored */}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Actions - Minimal */}
        <div className="flex items-center gap-1 pl-2 shrink-0">
          <button
            onClick={scrollRight}
            className="p-1.5 hover:bg-muted/50 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={resetScroll}
            className="p-1.5 hover:bg-muted/50 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
