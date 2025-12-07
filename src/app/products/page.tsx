"use client";

import { useEffect, useState, useMemo, useCallback, Activity } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { getAllProducts } from "@/features/product/productAction";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import ProductFilter from "@/components/product/ProductFilter";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { Params , ProductFilters, ProductUrlFilters } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { isColorMatch } from "@/lib/color-mapping";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { all: products, isLoading } = useAppSelector(
    (state) => state.product
  );
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const { filters: urlFilters, updateFilters, resetFilters } = useUrlFilters<ProductUrlFilters>({
    defaultFilters: {
      search: "",
      minPrice: 0,
      maxPrice: 10000000,
      rating: "",
      colors: "",
      sizes: "",
      sortBy: "newest",
    },
    basePath: '/products',
  });

  // Convert URL filters to component filters
  const filters: ProductFilters = useMemo(() => ({
    search: urlFilters.search as string,
    minPrice: Number(urlFilters.minPrice),
    maxPrice: Number(urlFilters.maxPrice),
    rating: (urlFilters.rating as string)?.split(",").map(Number).filter(n => n > 0) || [],
    colors: (urlFilters.colors as string)?.split(",").filter(Boolean) || [],
    sizes: (urlFilters.sizes as string)?.split(",").filter(Boolean) || [],
    sortBy: urlFilters.sortBy as string,
  }), [urlFilters]);

  // Debounce API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params: Params= {
        page: 1,
        limit: 50,
      };

      if (filters.search) params.search = filters.search;
      if (filters.minPrice > 0) params.minPrice = filters.minPrice;
      if (filters.maxPrice < 10000000) params.maxPrice = filters.maxPrice;
      if (filters.sortBy !== "newest") params.sortBy = filters.sortBy;

      dispatch(getAllProducts(params));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dispatch, filters.search, filters.minPrice, filters.maxPrice, filters.sortBy]);

  const handleFilterChange = useCallback((newFilters: Partial<ProductFilters>) => {
    const updates: Partial<ProductUrlFilters> = {};
    
    if (newFilters.search !== undefined) updates.search = newFilters.search;
    if (newFilters.minPrice !== undefined) updates.minPrice = newFilters.minPrice;
    if (newFilters.maxPrice !== undefined) updates.maxPrice = newFilters.maxPrice;
    if (newFilters.rating !== undefined) updates.rating = newFilters.rating.join(",");
    if (newFilters.colors !== undefined) updates.colors = newFilters.colors.join(",");
    if (newFilters.sizes !== undefined) updates.sizes = newFilters.sizes.join(",");
    if (newFilters.sortBy !== undefined) updates.sortBy = newFilters.sortBy;

    updateFilters(updates);
  }, [updateFilters]);

  const handleClearFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    const filtered = products.filter((product) => {
      // Search filter
      if (filters.search && !product.name?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Price filter
      const price = product.price?.discountPrice || product.price?.currentPrice || 0;
      if (price < filters.minPrice || price > filters.maxPrice) {
        return false;
      }

      // Rating filter
      if (filters.rating.length > 0) {
        const productRating = Math.floor(product.averageRating || 0);
        if (!filters.rating.includes(productRating)) {
          return false;
        }
      }

      // Color filter - FIXED: Improved logic
      if (filters.colors.length > 0) {

        
        // Kiểm tra nếu product có variants
        if (!product.variants || product.variants.length === 0) {
          return false;
        }

        // Kiểm tra từng variant của product
        const hasMatchingColor = product.variants.some(variant => {
          if (!variant.color) return false;
          
          return filters.colors.some(filterColor => 
            isColorMatch(filterColor, variant.color)
          );
        });

        if (!hasMatchingColor) return false;
      }

      // Size filter
      if (filters.sizes.length > 0) {
        if (!product.variants || product.variants.length === 0) {
          return false;
        }
        const hasMatchingSize = product.variants?.some(variant =>
          filters.sizes.some(size => 
            variant.size?.toUpperCase() === size.toUpperCase()
          )
        );
        if (!hasMatchingSize) return false;
      }

      return true;
    });

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      const priceA = a.price?.discountPrice || a.price?.currentPrice || 0;
      const priceB = b.price?.discountPrice || b.price?.currentPrice || 0;

      switch (filters.sortBy) {
        case "price_asc": return priceA - priceB;
        case "price_desc": return priceB - priceA;
        case "name_asc": return (a.name || "").localeCompare(b.name || "");
        case "name_desc": return (b.name || "").localeCompare(a.name || "");
        case "rating_desc": return (b.averageRating || 0) - (a.averageRating || 0);
        case "newest":
        default:
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
      }
    });

    return sorted;
  }, [products, filters]);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tất cả sản phẩm</h1>
          <p className="text-muted-foreground mt-1">
            {filteredAndSortedProducts.length} sản phẩm
            {products && ` (${products.length} tổng cộng)`}
          </p>
        </div>

        <Button
          variant="outline"
          className="lg:hidden"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Bộ lọc
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <aside className="w-80 flex-shrink-0 hidden lg:block">
          <ProductFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isMobileOpen={false}
          />
        </aside>

        {/* Mobile Filter */}
        {isMobileFilterOpen && (
          <ProductFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isMobileOpen={true}
            onMobileClose={() => setIsMobileFilterOpen(false)}
          />
        )}

        {/* Products Grid */}
        <div className="flex-1 relative min-h-[400px]">
          {isLoading && <SpinnerLoading className="absolute inset-0 m-auto" />}
          <Activity mode={isLoading ? "hidden" : "visible"}>
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard 
                  key={product._id || index} 
                  product={product} 
                />
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-muted-foreground">Không tìm thấy sản phẩm nào</p>
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="mt-4"
              >
                Xóa tất cả bộ lọc
              </Button>
            </div>
          )}
          </Activity>
        </div>
      </div>
    </div>
  );
}

