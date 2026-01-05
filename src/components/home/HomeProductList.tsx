"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  getAllProducts,
  getProductsBySlugOfCategory,
} from "@/features/product/productAction";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { ProductCard } from "@/components/product/ProductCard";
import { motion } from "framer-motion";

interface HomeProductListProps {
  selectedCategorySlug: string | null;
}

export default function HomeProductList({
  selectedCategorySlug,
}: HomeProductListProps) {
  const dispatch = useAppDispatch();
  const { all, byCategory, isLoading, error } = useAppSelector(
    (state) => state.product
  );

  // Determine which list to show
  const products = selectedCategorySlug ? byCategory : all;

  useEffect(() => {
    if (selectedCategorySlug) {
      // Fetch products for the selected category
      dispatch(getProductsBySlugOfCategory(selectedCategorySlug));
    } else {
      // Fetch all products (or recommendations)
      dispatch(getAllProducts({ page: 1, limit: 20 }));
    }
  }, [dispatch, selectedCategorySlug]);

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
        Something went wrong: {error}
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
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
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
