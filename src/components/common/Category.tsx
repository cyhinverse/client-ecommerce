import { getTreeCategories } from "@/features/category/categoryAction";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import SpinnerLoading from "./SpinerLoading";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Category() {
  const dispatch = useAppDispatch();
  const [hoverCategory, setHoverCategory] = useState<number | null>(null);
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

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (!categories || categories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-w-[300px] h-[400px] flex items-center justify-center border border-gray-200 p-10 rounded-xl"
      >
        <p className="text-gray-500">No categories found</p>
      </motion.div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="min-w-[300px] relative h-[400px] flex flex-col gap-3 border border-gray-200 p-6 rounded-xl overflow-y-auto no-scrollbar"
      >
        {categories.map((cat, idx) => (
          <motion.div
            key={cat._id}
            variants={item}
            onMouseEnter={() => setHoverCategory(idx)}
            onMouseLeave={() => setHoverCategory(null)}
            className="cursor-pointer block p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-300 group"
            whileHover={{ scale: 1.02, x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href={`/categories/${cat.slug}`}
              className="flex justify-between items-center"
            >
              <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {cat.name}
              </span>
              {cat.subcategories && cat.subcategories.length > 0 && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 group-hover:bg-gray-200 transition-colors">
                  {cat.subcategories.length}
                </span>
              )}
            </Link>

            {/* Hiển thị subcategories với animation */}
            <AnimatePresence>
              {hoverCategory === idx &&
                cat.subcategories &&
                cat.subcategories.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2 space-y-2 border-t border-gray-100 overflow-hidden"
                  >
                    {cat.subcategories.map((subCat, subIdx: number) => (
                      <motion.div
                        key={subCat._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: subIdx * 0.05 }}
                      >
                        <Link
                          href={`/categories/${subCat.slug}`}
                          className="p-2 block rounded border border-gray-200 hover:bg-gray-100 cursor-pointer text-sm text-gray-600 transition-colors hover:border-gray-300"
                        >
                          {subCat.name}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
