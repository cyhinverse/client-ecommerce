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
  ChevronRight,
  Package,
} from "lucide-react";

// Icon mapping for categories
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
    <div
      className={cn(
        "w-[220px] bg-card rounded-xl relative border border-none", // Removed shadow
        className
      )}
    >
      <ul className="py-1 h-full overflow-y-auto">
        {categories.slice(0, 12).map((category) => (
          <li
            key={category._id}
            className="relative"
            onMouseEnter={() => setHoveredCategory(category._id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Link
              href={`/categories/${category.slug}`}
              className={cn(
                "flex items-center justify-between px-4 py-2.5 text-sm transition-all rounded-lg mx-1",
                hoveredCategory === category._id
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "transition-colors",
                    hoveredCategory === category._id
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {getIcon(category.slug)}
                </span>
                <span className="truncate font-medium">{category.name}</span>
              </div>

              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Subcategory Popup - Shows on hover */}
      {activeCategory &&
        activeCategory.subcategories &&
        activeCategory.subcategories.length > 0 && (
          <div
            className="absolute left-full top-0 ml-1 w-[600px] bg-white dark:bg-zinc-900 shadow-xl rounded-lg border border-red-500 dark:border-red-600 z-[100] min-h-[460px] max-h-[460px] overflow-y-auto p-6"
            onMouseEnter={() => setHoveredCategory(activeCategory._id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-zinc-700">
              {activeCategory.name}
            </h3>
            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
              {activeCategory.subcategories.map((child) => (
                <div key={child._id} className="space-y-2">
                  <Link
                    href={`/categories/${child.slug}`}
                    className="text-sm font-semibold text-red-600 hover:text-red-700 hover:underline block"
                  >
                    {child.name}
                  </Link>
                  {child.subcategories && child.subcategories.length > 0 && (
                    <ul className="space-y-1.5">
                      {child.subcategories.slice(0, 6).map((subChild) => (
                        <li key={subChild._id}>
                          <Link
                            href={`/categories/${subChild.slug}`}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors block"
                          >
                            {subChild.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
