"use client";
import { getTreeCategories } from "@/features/category/categoryAction";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect } from "react";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Category() {
  const dispatch = useAppDispatch();
  const { categories, isLoading, error } = useAppSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(getTreeCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const hasCategories = categories && categories.length > 0;

  const getGradient = (index: number) => {
    const gradients = [
      "from-blue-600/20 to-indigo-600/20",
      "from-emerald-600/20 to-teal-600/20",
      "from-orange-600/20 to-red-600/20",
      "from-purple-600/20 to-pink-600/20",
      "from-cyan-600/20 to-blue-600/20",
      "from-yellow-600/20 to-orange-600/20",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="w-full relative min-h-[400px] py-16 lg:py-24">
      {isLoading && <SpinnerLoading className="absolute inset-0 m-auto" />}
      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
        {!hasCategories ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">No categories found</p>
          </div>
        ) : (
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                  Shop by Category
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl">
                  Explore our comprehensive collection of premium products,
                  curated just for you.
                </p>
              </div>
              <Link
                href="/categories"
                className="group flex items-center gap-2 text-sm font-semibold uppercase tracking-wider hover:text-primary transition-colors pb-2 border-b border-transparent hover:border-primary"
              >
                View all Collections
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]"
            >
              {categories.map((cat, i) => {
                const isLarge = i === 0;
                const isWide = i === 1 || i === 6;
                const gridClass = isLarge
                  ? "sm:col-span-2 sm:row-span-2"
                  : isWide
                  ? "sm:col-span-2"
                  : "";

                return (
                  <motion.div
                    key={cat._id}
                    variants={item}
                    className={`relative group rounded-3xl overflow-hidden cursor-pointer bg-gray-100 dark:bg-zinc-900 ${gridClass}`}
                  >
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="block w-full h-full"
                    >
                      {/* Background Gradient/Image Placeholder */}
                      <div
                        className={`absolute inset-0 bg-linear-to-br ${getGradient(
                          i
                        )} opacity-50 transition-opacity duration-500 group-hover:opacity-70`}
                      />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                        <div className="flex justify-between items-start">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-md text-foreground shadow-sm opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                          </span>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            Collection
                          </p>
                          <h3
                            className={`font-bold text-foreground leading-tight group-hover:translate-x-1 transition-transform duration-300 ${
                              isLarge
                                ? "text-4xl md:text-5xl"
                                : "text-2xl md:text-3xl"
                            }`}
                          >
                            {cat.name}
                          </h3>
                        </div>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10 rounded-3xl" />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
}
