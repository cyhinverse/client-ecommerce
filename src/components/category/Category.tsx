"use client";
import { getTreeCategories } from "@/features/category/categoryAction";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect } from "react";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Category as CategoryType } from "@/types/category";

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
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight">
                Shop by Category
              </h2>
              <Link
                href="/categories"
                className="text-primary hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {categories.map((cat) => (
                <motion.div
                  key={cat._id}
                  variants={item}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">
                        <Link
                          href={`/categories/${cat.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {cat.name}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {cat.subcategories && cat.subcategories.length > 0 ? (
                        <ul className="space-y-2">
                          {cat.subcategories
                            .slice(0, 5)
                            .map((sub: CategoryType) => (
                              <li key={sub._id}>
                                <Link
                                  href={`/categories/${sub.slug}`}
                                  className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          {cat.subcategories.length > 5 && (
                            <li>
                              <Link
                                href={`/categories/${cat.slug}`}
                                className="text-sm font-medium text-primary hover:underline flex items-center gap-1 mt-2"
                              >
                                View {cat.subcategories.length - 5} more
                              </Link>
                            </li>
                          )}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          Explore {cat.name}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
}
