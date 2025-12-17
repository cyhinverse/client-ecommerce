"use client";
import { getTreeCategories } from "@/features/category/categoryAction";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect } from "react";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="w-full relative min-h-[200px]">
      {isLoading && <SpinnerLoading className="absolute inset-0 m-auto" />}
      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
        {!hasCategories ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">No categories found</p>
          </div>
        ) : (
          <section className="w-full py-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-semibold tracking-tight">
                Shop by Category
              </h2>
              <Link
                href="/categories"
                className="text-primary hover:opacity-80 flex items-center gap-1 font-medium"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]"
            >
              {categories.map((cat, i) => (
                <motion.div
                  key={cat._id}
                  variants={item}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`${i === 0 || i === 3 ? "md:col-span-2" : "md:col-span-1"}`}
                >
                  <Link href={`/categories/${cat.slug}`} className="block h-full">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 relative overflow-hidden border-none bg-white dark:bg-[#1C1C1E]">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent dark:from-white/5 pointer-events-none" />
                        <CardHeader className="relative z-10 flex flex-col justify-end h-full pb-8">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">Collection</p>
                            <CardTitle className="text-3xl md:text-4xl font-semibold tracking-tight">
                                {cat.name}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
}
