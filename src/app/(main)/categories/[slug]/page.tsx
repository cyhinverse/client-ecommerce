"use client";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { useCategoryTree } from "@/hooks/queries/useCategories";
import { useProductsByCategory } from "@/hooks/queries/useProducts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/utils/cn";
import {
  ChevronRight,
  ChevronLeft,
  Grid3X3,
  LayoutList,
  ChevronDown,
  Package,
} from "lucide-react";
import { getSafeErrorMessage } from "@/api";

type SortType = "default" | "sales" | "price-asc" | "price-desc" | "newest";

export default function CategoryDetailPage() {
  const path = usePathname();
  const slug = path.split("/")[2];

  const {
    data: categories,
    isLoading: isCategoryLoading,
    error,
  } = useCategoryTree();
  const { data: byCategory = [], isLoading: isProductLoading } =
    useProductsByCategory(slug || "", { enabled: !!slug });

  const [sortBy, setSortBy] = useState<SortType>("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (error) {
      toast.error(getSafeErrorMessage(error, "Không thể tải danh mục"));
    }
  }, [error]);

  const currentCategory = categories?.find((c) => c.slug === slug);

  // Sort products
  const sortedProducts = [...(byCategory || [])].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return (a.price?.currentPrice || 0) - (b.price?.currentPrice || 0);
      case "price-desc":
        return (b.price?.currentPrice || 0) - (a.price?.currentPrice || 0);
      case "newest":
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      default:
        return 0;
    }
  });

  const isLoading = isCategoryLoading || isProductLoading;

  return (
    <div className="w-full min-h-screen bg-background">
      {isLoading && <SpinnerLoading className="fixed inset-0 m-auto z-50" />}

      <div
        className={cn(
          "transition-opacity duration-200",
          isLoading ? "opacity-50" : "opacity-100"
        )}
      >
        {/* Subcategory Tabs with Images - Taobao Style */}
        {currentCategory?.subcategories &&
          currentCategory.subcategories.length > 0 && (
            <div className="bg-card">
              <div className="container-taobao py-3">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <button className="p-1.5 rounded-full bg-muted hover:bg-muted/80 shrink-0">
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </button>

                  {currentCategory.subcategories.slice(0, 12).map((sub) => (
                    <Link
                      key={sub._id}
                      href={`/categories/${sub.slug}`}
                      className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors shrink-0 min-w-[80px]"
                    >
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <span className="text-[11px] text-foreground text-center line-clamp-1 max-w-[70px]">
                        {sub.name}
                      </span>
                    </Link>
                  ))}

                  <button className="p-1.5 rounded-full bg-muted hover:bg-muted/80 shrink-0">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Main Tabs */}
        <div className="bg-card">
          <div className="container-taobao">
            <div className="flex items-center gap-4 py-2">
              <span className="text-sm font-medium text-primary border-b-2 border-primary pb-2 -mb-2">
                Tất cả sản phẩm
              </span>
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer pb-2 -mb-2">
                Chính hãng
              </span>
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer pb-2 -mb-2">
                Shop Mall
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Sort Bar - Taobao Style */}
        <div className="bg-card sticky top-[60px] z-40">
          <div className="container-taobao py-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              {/* Sort Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setSortBy("default")}
                  className={cn(
                    "px-4 py-1.5 text-xs font-medium rounded-sm transition-colors shrink-0",
                    sortBy === "default"
                      ? "bg-primary text-white"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  Tổng hợp
                </button>
                <button
                  onClick={() => setSortBy("sales")}
                  className={cn(
                    "px-4 py-1.5 text-xs font-medium transition-colors shrink-0",
                    sortBy === "sales"
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  Bán chạy
                </button>
                <button
                  onClick={() =>
                    setSortBy(
                      sortBy === "price-asc" ? "price-desc" : "price-asc"
                    )
                  }
                  className={cn(
                    "px-4 py-1.5 text-xs font-medium transition-colors flex items-center gap-0.5 shrink-0",
                    sortBy === "price-asc" || sortBy === "price-desc"
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  Giá
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 transition-transform",
                      sortBy === "price-asc" && "rotate-180"
                    )}
                  />
                </button>

                {/* Price Range */}
                <div className="flex items-center gap-1 ml-2 text-xs text-muted-foreground shrink-0">
                  <span className="text-primary">Khoảng giá</span>
                  <ChevronDown className="w-3 h-3" />
                </div>

                {/* Brand filter */}
                <div className="flex items-center gap-1 ml-3 text-xs text-muted-foreground shrink-0">
                  <span>Thương hiệu</span>
                  <ChevronDown className="w-3 h-3" />
                </div>

                {/* More filters */}
                <button
                  onClick={() => setSortBy("newest")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors ml-2 shrink-0",
                    sortBy === "newest"
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  Mới nhất
                </button>
              </div>

              {/* Right side - View mode & count */}
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <span className="text-xs text-muted-foreground">
                  {sortedProducts.length} sản phẩm
                </span>
                <div className="flex items-center overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-1.5 transition-colors",
                      viewMode === "grid"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-1.5 transition-colors",
                      viewMode === "list"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Filter Tags */}
        <div className="bg-card">
          <div className="container-taobao py-2">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full whitespace-nowrap">
                Miễn phí vận chuyển
              </span>
              <span className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full whitespace-nowrap hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">
                Giảm giá sốc
              </span>
              <span className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full whitespace-nowrap hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">
                Hàng mới về
              </span>
              <span className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full whitespace-nowrap hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">
                Đánh giá cao
              </span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container-taobao py-4">
          {sortedProducts.length > 0 ? (
            <div
              className={cn(
                "grid gap-2",
                viewMode === "grid"
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                  : "grid-cols-1"
              )}
            >
              {sortedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            !isLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Danh mục này chưa có sản phẩm nào
                </p>
                <Link
                  href="/products"
                  className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Xem tất cả sản phẩm
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
