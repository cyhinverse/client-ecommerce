"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { getAllProducts } from "@/features/product/productAction";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import ProductFilter from "@/components/product/ProductFilter";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { Params, ProductFilters, ProductUrlFilters } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
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
};

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { all: products, isLoading } = useAppSelector((state) => state.product);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

  // Debounce API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params: Params = {
        page: 1,
        limit: 50,
      };

      if (filters.search) params.search = filters.search;
      if (filters.minPrice > 0) params.minPrice = filters.minPrice;
      if (filters.maxPrice < 10000000) params.maxPrice = filters.maxPrice;
      if (filters.sortBy !== "newest") params.sortBy = filters.sortBy;
      if (filters.rating.length > 0) params.rating = filters.rating.join(",");
      if (filters.colors.length > 0) params.colors = filters.colors.join(",");
      if (filters.sizes.length > 0) params.sizes = filters.sizes.join(",");

      dispatch(getAllProducts(params));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dispatch, filters]);

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
  }, [resetFilters]);

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 lg:mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground mt-1">
            {products?.length || 0} items
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Trigger */}
          <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden rounded-full">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <ProductFilter
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={handleClearFilters}
                >
                  Clear All
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 align-top">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 h-fit">
          <ProductFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-h-[500px] relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
              <SpinnerLoading />
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {products && products.length > 0
              ? products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              : !isLoading && (
                  <div className="col-span-full py-20 text-center text-muted-foreground">
                    <p className="text-lg">No products found.</p>
                    <Button variant="link" onClick={handleClearFilters}>
                      Clear all filters
                    </Button>
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
}
