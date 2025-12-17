"use client";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { getTreeCategories } from "@/features/category/categoryAction";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import { Folder, ChevronRight, LayoutGrid } from "lucide-react";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { isLoading, categories, error } = useAppSelector(
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

  return (
    <div className="w-full relative min-h-[500px]">
      {isLoading && <SpinnerLoading className="fixed inset-0 m-auto" />}
      
      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          <div className="text-center mb-12">
             <h1 className="text-4xl font-bold tracking-tight mb-4">Browse Categories</h1>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our wide collection of products by category.
             </p>
          </div>

          {categories && categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  className="group relative flex flex-col items-center justify-center p-8 bg-muted/30 border border-border/50 rounded-2xl hover:bg-background hover:shadow-lg hover:border-border transition-all duration-300"
                >
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <LayoutGrid className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                        {category.name}
                    </h3>
                    <div className="absolute right-4 top-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600">
                        <ChevronRight className="w-5 h-5" />
                    </div>
                </Link>
              ))}
            </div>
          ) : (
            !isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Folder className="w-16 h-16 mb-4 opacity-20" />
                    <p>No categories found</p>
                </div>
            )
          )}
      </div>
    </div>
  );
}
