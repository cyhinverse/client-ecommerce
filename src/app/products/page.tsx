"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getAllProducts } from "@/features/product/productAction";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProductFilter, { ProductFilters } from "@/components/common/ProductFilter";
import SpinnerLoading from "@/components/common/SpinerLoading"; 

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { all: products, isLoading } = useAppSelector(
    (state) => state.product
  );

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const [filters, setFilters] = useState<ProductFilters>(() => ({
    search: searchParams.get("search") || "",
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 10000000,
    rating: searchParams.get("rating")?.split(",").map(Number).filter(Boolean) || [],
    colors: searchParams.get("colors")?.split(",").filter(Boolean) || [],
    sizes: searchParams.get("sizes")?.split(",").filter(Boolean) || [],
    sortBy: searchParams.get("sortBy") || "newest",
  }));

  // Debounce API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params: any = {
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

  // Debounce URL updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      
      if (filters.search) params.set("search", filters.search);
      if (filters.minPrice > 0) params.set("minPrice", filters.minPrice.toString());
      if (filters.maxPrice < 10000000) params.set("maxPrice", filters.maxPrice.toString());
      if (filters.rating.length > 0) params.set("rating", filters.rating.join(","));
      if (filters.colors.length > 0) params.set("colors", filters.colors.join(","));
      if (filters.sizes.length > 0) params.set("sizes", filters.sizes.join(","));
      if (filters.sortBy !== "newest") params.set("sortBy", filters.sortBy);

      const queryString = params.toString();
      const newUrl = queryString ? `/products?${queryString}` : "/products";
      
      router.replace(newUrl, { scroll: false });
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [filters, router]);

  const handleFilterChange = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: "",
      minPrice: 0,
      maxPrice: 10000000,
      rating: [],
      colors: [],
      sizes: [],
      sortBy: "newest",
    });
  }, []);

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
          
          const variantColor = variant.color.toLowerCase().trim();
          const match = filters.colors.some(filterColor => {
            const normalizedFilterColor = filterColor.toLowerCase().trim();
            return variantColor === normalizedFilterColor;
          });
          
          return match;
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

  if (isLoading) return <SpinnerLoading />;

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
        <div className="flex-1">
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
        </div>
      </div>
    </div>
  );
}

// ProductCard Component - Giống với ProductFeatures
const ProductCard = ({ product }: { product: any }) => (
  <Link href={`/products/${product.slug || product._id}`} className="group block">
    <Card className="overflow-hidden border-0 shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name || "Product image"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}

          {product.price?.discountPrice && product.price.discountPrice < product.price.currentPrice && (
            <Badge className="absolute top-2 right-2 bg-black text-white border-0 text-xs px-2 py-0.5">
              -{Math.round(((product.price.currentPrice - product.price.discountPrice) / product.price.currentPrice) * 100)}%
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="font-medium text-sm line-clamp-1 group-hover:underline">
            {product.name || "Product Name"}
          </h3>
          <p className="text-xs text-muted-foreground">{product.brand || "Brand"}</p>
          <div className="flex items-baseline gap-2 pt-1">
            {product.price?.discountPrice && product.price.discountPrice < product.price.currentPrice ? (
              <>
                <span className="font-semibold text-sm">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price.discountPrice)}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price.currentPrice)}
                </span>
              </>
            ) : (
              <span className="font-semibold text-sm">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price?.currentPrice || 0)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);