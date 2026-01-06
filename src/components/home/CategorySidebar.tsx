"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getTreeCategories } from "@/features/category/categoryAction";
import { cn } from "@/lib/utils";
import {
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
  Headphones,
  Camera,
  Gamepad2,
  BookOpen,
  Flower2,
  Clock,
  Ticket,
} from "lucide-react";

// Icon mapping for categories - Taobao style
const categoryIcons: Record<string, React.ReactNode> = {
  electronics: <Laptop className="w-4 h-4" />,
  phones: <Smartphone className="w-4 h-4" />,
  home: <Home className="w-4 h-4" />,
  fashion: <Shirt className="w-4 h-4" />,
  men: <Shirt className="w-4 h-4" />,
  women: <Sparkles className="w-4 h-4" />,
  watches: <Watch className="w-4 h-4" />,
  jewelry: <Watch className="w-4 h-4" />,
  baby: <Baby className="w-4 h-4" />,
  kids: <Baby className="w-4 h-4" />,
  automotive: <Car className="w-4 h-4" />,
  food: <Utensils className="w-4 h-4" />,
  sports: <Dumbbell className="w-4 h-4" />,
  beauty: <Sparkles className="w-4 h-4" />,
  audio: <Headphones className="w-4 h-4" />,
  camera: <Camera className="w-4 h-4" />,
  gaming: <Gamepad2 className="w-4 h-4" />,
  books: <BookOpen className="w-4 h-4" />,
  garden: <Flower2 className="w-4 h-4" />,
  default: <Package className="w-4 h-4" />,
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

interface CategorySidebarProps {
  className?: string;
}

export default function CategorySidebar({ className }: CategorySidebarProps) {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getTreeCategories());
  }, [dispatch]);

  const hasCategories = categories && categories.length > 0;

  if (!hasCategories) return null;

  const activeCategory = categories.find((c) => c._id === hoveredCategory);

  return (
    <div className="relative z-30">
      <div
        className={cn(
          "w-[220px] bg-[#f7f7f7] rounded-lg",
          className
        )}
        onMouseLeave={() => setHoveredCategory(null)}
      >
        {/* Promo Banner - First Row */}
        <Link 
          href="/vouchers"
          className="flex items-center gap-2 px-4 py-2.5 text-primary hover:bg-white/50 transition-colors border-b border-gray-200"
        >
          <Clock className="w-4 h-4" />
          <span className="text-[13px] font-medium">Flash Sale</span>
          <span className="text-[13px] text-muted-foreground">/</span>
          <span className="text-[13px] text-primary">Giảm đến 50%</span>
        </Link>

        {/* Category List - Taobao Style */}
        <ul className="py-1">
          {categories.slice(0, 10).map((category) => (
            <li
              key={category._id}
              className="relative"
              onMouseEnter={() => setHoveredCategory(category._id ?? null)}
            >
              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-[13px] transition-all duration-150 cursor-pointer",
                  hoveredCategory === category._id
                    ? "bg-white"
                    : "hover:bg-white/50"
                )}
              >
                {/* Icon */}
                <span
                  className={cn(
                    "transition-colors duration-150 flex-shrink-0",
                    hoveredCategory === category._id
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {getIcon(category.slug ?? '')}
                </span>
                
                {/* Category Name + Inline Subcategories */}
                <div className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
                  <Link
                    href={`/categories/${category.slug ?? ''}`}
                    className={cn(
                      "font-medium whitespace-nowrap transition-colors",
                      hoveredCategory === category._id
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    )}
                  >
                    {category.name}
                  </Link>
                  
                  {/* Inline Subcategories with / separator */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="flex items-center gap-1 text-muted-foreground overflow-hidden">
                      {category.subcategories.slice(0, 3).map((sub, idx) => (
                        <span key={sub._id} className="flex items-center gap-1 whitespace-nowrap">
                          <span className="text-border">/</span>
                          <Link
                            href={`/categories/${sub.slug}`}
                            className="hover:text-primary transition-colors truncate"
                          >
                            {sub.name}
                          </Link>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Mega Menu Popup - Shows on hover */}
      {activeCategory &&
        activeCategory.subcategories &&
        activeCategory.subcategories.length > 0 && (
          <div
            className="absolute left-[216px] top-0 pl-1 z-40"
            onMouseEnter={() => setHoveredCategory(activeCategory._id ?? null)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {/* Invisible bridge */}
            <div className="absolute left-0 top-0 w-2 h-full" />
            <div className="w-[500px] bg-white shadow-lg rounded-lg border border-[#E53935] p-4 max-h-[400px] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  {getIcon(activeCategory.slug ?? '')}
                  {activeCategory.name}
                </h3>
                <Link
                  href={`/categories/${activeCategory.slug}`}
                  className="text-xs text-primary hover:underline"
                >
                  Xem tất cả →
                </Link>
              </div>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-4 gap-2">
                {activeCategory.subcategories.map((child) => (
                  <Link
                    key={child._id}
                    href={`/categories/${child.slug}`}
                    className="px-2 py-1.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 rounded transition-colors text-center truncate"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
