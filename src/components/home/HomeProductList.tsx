"use client";
import React from "react";
import { useAppSelector } from "@/hooks/hooks";
import {
  useProducts,
  useProductsByCategory,
} from "@/hooks/queries/useProducts";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { ProductCard } from "@/components/product/ProductCard";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HomeProductListProps {
  selectedCategorySlug: string | null;
}

export default function HomeProductList({
  selectedCategorySlug,
}: HomeProductListProps) {
  const { isOpen: isChatOpen } = useAppSelector((state) => state.chat);

  // Use category hook when a category is selected
  const {
    data: byCategory = [],
    isLoading: categoryLoading,
    error: categoryError,
  } = useProductsByCategory(selectedCategorySlug || "", {
    enabled: !!selectedCategorySlug,
  });

  // Use all products when no category is selected
  const {
    data: allProducts,
    isLoading: allLoading,
    error: allError,
  } = useProducts({ page: 1, limit: 20 });

  // Determine which list to show
  const isLoading = selectedCategorySlug ? categoryLoading : allLoading;
  const error = selectedCategorySlug ? categoryError : allError;
  const products = selectedCategorySlug
    ? byCategory
    : allProducts?.products || [];

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
    show: { opacity: 1, y: 0 },
  };

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        Something went wrong: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-[300px]">
      {isLoading && <SpinnerLoading className="absolute inset-0 m-auto z-10" />}

      <div
        className={
          isLoading
            ? "opacity-50 pointer-events-none transition-opacity"
            : "opacity-100 transition-opacity"
        }
      >
        <motion.div
          key={selectedCategorySlug || "all"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "grid gap-3 transition-all duration-300",
            isChatOpen
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          )}
        >
          {products && products.length > 0
            ? products.map((p) => (
                <motion.div key={p._id} layout>
                  <ProductCard product={p} />
                </motion.div>
              ))
            : !isLoading && (
                <div className="col-span-full text-center py-20">
                  <p className="text-muted-foreground text-lg">
                    No products found in this category.
                  </p>
                </div>
              )}
        </motion.div>
      </div>
    </div>
  );
}
