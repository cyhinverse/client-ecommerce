"use client";

import { useEffect, useState } from "react";
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
import { motion } from "framer-motion";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { product: products, isLoading } = useAppSelector(
    (state) => state.product
  );

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    search: searchParams.get("search") || "",
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 10000000,
    rating: searchParams.get("rating")?.split(",").map(Number).filter(Boolean) || [],
    colors: searchParams.get("colors")?.split(",").filter(Boolean) || [],
    sizes: searchParams.get("sizes")?.split(",").filter(Boolean) || [],
    sortBy: searchParams.get("sortBy") || "newest",
  });

  useEffect(() => {
    dispatch(getAllProducts({ page: 1, limit: 50 }));
  }, [dispatch]);

  useEffect(() => {
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
  }, [filters, router]);

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      minPrice: 0,
      maxPrice: 10000000,
      rating: [],
      colors: [],
      sizes: [],
      sortBy: "newest",
    });
  };

  // Filter products based on filters
  const filteredProducts = products
    ? products.filter((product) => {
        // Search filter
        if (
          filters.search &&
          !product.name.toLowerCase().includes(filters.search.toLowerCase())
        ) {
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

        // Color filter
        if (filters.colors.length > 0) {
          if (!product.variants || product.variants.length === 0) {
            return false;
          }
          const productColors = product.variants
            .map((v) => v.color?.toLowerCase())
            .filter((color): color is string => Boolean(color));
          const hasMatchingColor = filters.colors.some((color) =>
            productColors.includes(color)
          );
          if (!hasMatchingColor) {
            return false;
          }
        }

        // Size filter
        if (filters.sizes.length > 0) {
          if (!product.variants || product.variants.length === 0) {
            return false;
          }
          const productSizes = product.variants
            .map((v) => v.size?.toUpperCase())
            .filter((size): size is string => Boolean(size));
          const hasMatchingSize = filters.sizes.some((size) =>
            productSizes.includes(size)
          );
          if (!hasMatchingSize) {
            return false;
          }
        }

        return true;
      })
    : [];

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.price?.discountPrice || a.price?.currentPrice || 0;
    const priceB = b.price?.discountPrice || b.price?.currentPrice || 0;

    switch (filters.sortBy) {
      case "price_asc":
        return priceA - priceB;
      case "price_desc":
        return priceB - priceA;
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "rating_desc":
        return (b.averageRating || 0) - (a.averageRating || 0);
      case "newest":
      default:
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    }
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 50, damping: 20 },
    },
  };

  if (isLoading) return <SpinnerLoading />;

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tất cả sản phẩm</h1>
          <p className="text-muted-foreground mt-1">
            {sortedProducts.length} sản phẩm
          </p>
        </div>

        {/* Mobile Filter Button */}
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
        {/* Filter Sidebar - Desktop */}
        <aside className="w-80 flex-shrink-0 hidden lg:block">
          <ProductFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isMobileOpen={false}
          />
        </aside>

        {/* Mobile Filter Overlay */}
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
          {sortedProducts.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              {sortedProducts.map((product) => (
                <motion.div key={product._id} variants={item}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white rounded-xl shadow-sm h-full">
                    <Link href={`/products/${product.slug}`}>
                      <CardContent className="p-0">
                        <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-t-xl">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <svg
                                  className="w-5 h-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}

                          {product.price?.discountPrice &&
                            product.price.discountPrice <
                              product.price.currentPrice && (
                              <Badge className="absolute top-3 right-3 bg-black hover:bg-gray-800 text-white border-0 text-xs px-2 py-1 shadow-md">
                                -
                                {Math.round(
                                  ((product.price.currentPrice -
                                    product.price.discountPrice) /
                                    product.price.currentPrice) *
                                    100
                                )}
                                %
                              </Badge>
                            )}

                          {product.isNewArrival && (
                            <Badge className="absolute top-3 left-3 bg-black hover:bg-gray-800 text-white border-0 text-xs px-2 py-1 shadow-md">
                              MỚI
                            </Badge>
                          )}
                        </div>

                        <div className="p-4 space-y-3">
                          <div className="space-y-2">
                            <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                              {product.name}
                            </h3>
                            <p className="text-xs text-gray-500 font-medium">
                              {product.brand}
                            </p>
                          </div>

                          {/* Rating */}
                          {product.averageRating && product.averageRating > 0 && (
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < Math.floor(product.averageRating || 0)
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                              <span className="text-xs text-muted-foreground ml-1">
                                ({product.numberOfReviews || 0})
                              </span>
                            </div>
                          )}

                          <div className="space-y-1">
                            {product.price?.discountPrice &&
                            product.price.discountPrice <
                              product.price.currentPrice ? (
                              <div className="flex items-baseline gap-2">
                                <span className="text-base font-semibold text-gray-900">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(product.price.discountPrice)}
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(product.price.currentPrice)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-base font-semibold text-gray-900">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(product.price?.currentPrice || 0)}
                              </span>
                            )}
                          </div>

                          <Button
                            size="sm"
                            className="w-full bg-black hover:bg-gray-800 text-white border-0 text-xs transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 shadow-md"
                          >
                            Xem chi tiết
                          </Button>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy sản phẩm
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Thử điều chỉnh bộ lọc để xem nhiều sản phẩm hơn
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                Xóa tất cả bộ lọc
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}