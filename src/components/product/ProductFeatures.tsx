"use client";
import { useFeaturedProducts } from "@/hooks/queries/useProducts";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import { useEffect } from "react";

export default function ProductFeatures() {
  const { data: featured, isLoading, error } = useFeaturedProducts();

  useEffect(() => {
    if (error) toast.error(String(error));
  }, [error]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full relative min-h-[200px] py-8">
      {isLoading && <SpinnerLoading className="absolute inset-0 m-auto" />}
      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
        <section className="w-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Featured Products
            </h2>
            <Link
              href="/products?filter=featured"
              className="text-sm font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              View All
            </Link>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {featured && featured.length > 0 ? (
              featured.map((p) => (
                <motion.div key={p._id} variants={item}>
                  <ProductCard product={p} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-muted-foreground">
                  No featured products at the moment
                </p>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
