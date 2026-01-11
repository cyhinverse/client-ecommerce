"use client";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { useCategoryTree } from "@/hooks/queries/useCategories";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  ChevronRight,
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
  Flame,
  TrendingUp,
} from "lucide-react";

// Icon mapping for categories
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
  audio: <Headphones className="w-5 h-5" />,
  camera: <Camera className="w-5 h-5" />,
  gaming: <Gamepad2 className="w-5 h-5" />,
  books: <BookOpen className="w-5 h-5" />,
  garden: <Flower2 className="w-5 h-5" />,
  default: <Package className="w-5 h-5" />,
};

const getIcon = (slug: string) => {
  const normalizedSlug = slug?.toLowerCase() || "";
  for (const key of Object.keys(categoryIcons)) {
    if (normalizedSlug.includes(key)) {
      return categoryIcons[key];
    }
  }
  return categoryIcons.default;
};

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategoryTree();

  useEffect(() => {
    if (error) {
      toast.error(String(error));
    }
  }, [error]);

  return (
    <div className="w-full min-h-screen bg-background">
      {isLoading && <SpinnerLoading className="fixed inset-0 m-auto z-50" />}

      <div
        className={`container-taobao py-4 ${
          isLoading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Tất cả danh mục</span>
        </div>

        {/* Hot Categories Banner */}
        <div className="bg-gradient-to-r from-primary to-primary-hover rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-white">
            <Flame className="w-5 h-5" />
            <span className="font-bold text-sm">Danh mục hot</span>
            <TrendingUp className="w-4 h-4 ml-auto" />
          </div>
        </div>

        {/* Categories Grid - Taobao Style */}
        {categories && categories.length > 0 ? (
          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-card rounded-lg border border-border overflow-hidden"
              >
                {/* Category Header - Compact */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      {getIcon(category.slug ?? "")}
                    </div>
                    <div>
                      <Link
                        href={`/categories/${category.slug}`}
                        className="font-semibold text-sm text-foreground hover:text-primary transition-colors"
                      >
                        {category.name}
                      </Link>
                      <p className="text-[10px] text-muted-foreground">
                        {category.subcategories?.length || 0} danh mục con
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Xem tất cả
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Subcategories Grid - Always Visible */}
                {category.subcategories &&
                  category.subcategories.length > 0 && (
                    <div className="p-3">
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {category.subcategories.slice(0, 16).map((sub) => (
                          <Link
                            key={sub._id}
                            href={`/categories/${sub.slug}`}
                            className="group flex flex-col items-center p-2 rounded-lg hover:bg-primary/5 transition-all"
                          >
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-1.5 group-hover:bg-primary/10 transition-colors overflow-hidden">
                              <Package className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-[11px] text-center text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                              {sub.name}
                            </span>
                          </Link>
                        ))}
                        {category.subcategories.length > 16 && (
                          <Link
                            href={`/categories/${category.slug}`}
                            className="group flex flex-col items-center p-2 rounded-lg hover:bg-primary/5 transition-all"
                          >
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-1.5">
                              <span className="text-xs font-bold text-primary">
                                +{category.subcategories.length - 16}
                              </span>
                            </div>
                            <span className="text-[11px] text-center text-primary font-medium">
                              Xem thêm
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="flex flex-col items-center justify-center py-16 bg-card rounded-lg border border-border">
              <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-3">
                <Package className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Không có danh mục nào
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
