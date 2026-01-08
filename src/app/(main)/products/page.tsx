// ProductsPage - Taobao Style with Sticky Category Tabs
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { getAllProducts } from "@/features/product/productAction";
import { getAllCategories } from "@/features/category/categoryAction";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import ProductFilter from "@/components/product/ProductFilter";
import ProductGrid from "@/components/product/ProductGrid";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { Params, ProductFilters, ProductUrlFilters } from "@/types/product";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const DEFAULT_FILTERS: ProductUrlFilters = {
  search: "",
  minPrice: 0,
  maxPrice: 10000000,
  rating: "",
  colors: "",
  sizes: "",
  sortBy: "newest",
  category: "",
};

// Sort tabs for Taobao style
const SORT_TABS = [
  { label: "Phổ biến", value: "popular" },
  { label: "Mới nhất", value: "newest" },
  { label: "Bán chạy", value: "best_selling" },
  { label: "Giá", value: "price", hasDropdown: true },
];

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { all: products, isLoading } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.category);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(getAllCategories({}));
  }, [dispatch]);

  const {
    filters: urlFilters,
    updateFilters,
    resetFilters,
  } = useUrlFilters<ProductUrlFilters>({
    defaultFilters: DEFAULT_FILTERS,
    basePath: "/products",
  });

  const filters: ProductFilters = useMemo(
    () => ({
      search: urlFilters.search as string,
      minPrice: Number(urlFilters.minPrice),
      maxPrice: Number(urlFilters.maxPrice),
      rating:
        (urlFilters.rating as string)
          ?.split(",")
          .map(Number)
          .filter((n) => n > 0) || [],
      colors: (urlFilters.colors as string)?.split(",").filter(Boolean) || [],
      sizes: (urlFilters.sizes as string)?.split(",").filter(Boolean) || [],
      sortBy: urlFilters.sortBy as string,
    }),
    [urlFilters]
  );

  // Debounced filters using custom hook
  const debouncedFilters = useDebounce(filters, 300);
  const debouncedCategory = useDebounce(activeCategory, 300);

  // API call with debounced values
  useEffect(() => {
    const params: Params = {
      page: 1,
      limit: 50,
    };

    if (debouncedFilters.search) params.search = debouncedFilters.search;
    if (debouncedFilters.minPrice > 0) params.minPrice = debouncedFilters.minPrice;
    if (debouncedFilters.maxPrice < 10000000) params.maxPrice = debouncedFilters.maxPrice;
    if (debouncedFilters.sortBy !== "newest") params.sortBy = debouncedFilters.sortBy;
    if (debouncedFilters.rating.length > 0) params.rating = debouncedFilters.rating.join(",");
    if (debouncedFilters.colors.length > 0) params.colors = debouncedFilters.colors.join(",");
    if (debouncedFilters.sizes.length > 0) params.sizes = debouncedFilters.sizes.join(",");
    if (debouncedCategory) params.category = debouncedCategory;

    dispatch(getAllProducts(params));
  }, [dispatch, debouncedFilters, debouncedCategory]);

  const handleFilterChange = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      const updates: Partial<ProductUrlFilters> = {};

      if (newFilters.search !== undefined) updates.search = newFilters.search;
      if (newFilters.minPrice !== undefined)
        updates.minPrice = newFilters.minPrice;
      if (newFilters.maxPrice !== undefined)
        updates.maxPrice = newFilters.maxPrice;
      if (newFilters.rating !== undefined)
        updates.rating = newFilters.rating.join(",");
      if (newFilters.colors !== undefined)
        updates.colors = newFilters.colors.join(",");
      if (newFilters.sizes !== undefined)
        updates.sizes = newFilters.sizes.join(",");
      if (newFilters.sortBy !== undefined) updates.sortBy = newFilters.sortBy;

      updateFilters(updates);
    },
    [updateFilters]
  );

  const handleClearFilters = useCallback(() => {
    resetFilters();
    setActiveCategory(null);
    setPriceSort(null);
  }, [resetFilters]);

  const handleSortTabClick = (value: string) => {
    if (value === "price") {
      const newSort = priceSort === "asc" ? "desc" : "asc";
      setPriceSort(newSort);
      handleFilterChange({ sortBy: `price_${newSort}` });
    } else {
      setPriceSort(null);
      handleFilterChange({ sortBy: value });
    }
  };

  const handleCategoryClick = (categoryId: string | null | undefined) => {
    setActiveCategory(categoryId ?? null);
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Sticky Category & Sort Tabs */}
      <div className="sticky top-[91px] z-40 bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !activeCategory
                  ? "bg-[#E53935] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tất cả
            </button>
            {categories?.slice(0, 8).map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category._id
                    ? "bg-[#E53935] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort Tabs */}
          <div className="flex items-center gap-1 py-2 border-t border-gray-100">
            <span className="text-sm text-gray-500 mr-2">Sắp xếp theo</span>
            {SORT_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleSortTabClick(tab.value)}
                className={`flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded transition-colors ${
                  filters.sortBy === tab.value ||
                  (tab.value === "price" && filters.sortBy?.startsWith("price"))
                    ? "bg-[#E53935] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
                {tab.hasDropdown && (
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      priceSort === "desc" ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
            ))}

            {/* Mobile Filter Button */}
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden ml-auto rounded h-8 border-gray-200"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-1.5" />
                  Lọc
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] overflow-y-auto p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Bộ lọc</SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <ProductFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Product Count */}
            <div className="hidden lg:flex items-center ml-auto text-sm text-gray-500">
              <span className="font-medium text-gray-800">{products?.length || 0}</span>
              <span className="ml-1">sản phẩm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        <div className="flex gap-4">
          {/* Desktop Sidebar */}
          <ProductFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {/* Product Grid */}
          <div className="flex-1 min-h-[500px] relative">
            {isLoading && (
              <div className="absolute inset-0 z-10 bg-white/60 flex items-center justify-center rounded-lg">
                <SpinnerLoading />
              </div>
            )}

            <div className="bg-[#f7f7f7] rounded-lg p-4">
              <ProductGrid products={products || []} isLoading={isLoading && !products?.length} />
            </div>

            {/* Load More */}
            {products && products.length > 0 && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  className="px-8 h-10 rounded border-[#E53935] text-[#E53935] hover:bg-[#E53935]/5"
                >
                  Xem thêm sản phẩm
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
