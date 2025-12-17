"use client";

import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { ProductCard } from "./ProductCard";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import { getNewArrivals } from "@/features/product/productAction";

import { motion } from "framer-motion";


const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function NewArrivals() {
  const dispatch = useAppDispatch();
  const { isLoading, newArrivals, error } = useAppSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getNewArrivals());
  }, [dispatch]);
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Dùng useMemo để tối ưu việc lọc
  const newArrivalProducts = useMemo(() => {
    return newArrivals?.filter((p) => p.isNewArrival) || [];
  }, [newArrivals]);

  return (
    <div className="w-full relative min-h-[200px]">
      {isLoading && <SpinnerLoading className="absolute inset-0 m-auto" />}
      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
        <section className="w-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
            <Link
              href="/products?sort=newest"
              className="text-sm hover:underline"
            >
              View All
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {newArrivalProducts.length > 0 ? (
              newArrivalProducts.slice(0, 8).map((p) => (
                <motion.div key={p._id} variants={itemVariants}>
                  <ProductCard product={p} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-muted-foreground">
                  No new products available.
                </p>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
