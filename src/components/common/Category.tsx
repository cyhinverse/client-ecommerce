import { getTreeCategories } from "@/features/category/categoryAction";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import SpinnerLoading from "./SpinerLoading";
import { toast } from "sonner";
import Link from "next/link";

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
      <div className="min-w-[300px] h-[400px] flex items-center justify-center border border-gray-200 p-10 rounded-xl">
        <p className="text-gray-500">No categories found</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-w-[300px] relative h-[400px] flex flex-col gap-3 border border-gray-200 p-6 rounded-xl overflow-y-auto no-scrollbar">
        {categories.map((cat, idx) => (
          <div
            key={cat._id}
            onMouseEnter={() => setHoverCategory(idx)}
            onMouseLeave={() => setHoverCategory(null)}
            className="cursor-pointer block p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-300 group"
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
            {hoverCategory === idx &&
              cat.subcategories &&
              cat.subcategories.length > 0 && (
                <div className="mt-3 ml-2 space-y-2 border-t pt-3 animate-in fade-in-0 zoom-in-95 duration-300">
                  {cat.subcategories.map((subCat) => (
                    <Link
                      href={`/categories/${subCat.slug}`}
                      key={subCat._id}
                      className="p-2 block rounded border border-gray-200 hover:bg-gray-100 cursor-pointer text-sm text-gray-600 transition-all duration-200 hover:translate-x-1 hover:border-gray-300"
                    >
                      {subCat.name}
                    </Link>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </>
  );
}
