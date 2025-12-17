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

  const getCategoryColor = (index: number) => {
      const colors = [
          "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
          "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
          "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
          "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400",
          "bg-pink-50 text-pink-600 dark:bg-pink-950/30 dark:text-pink-400",
          "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400",
      ];
      return colors[index % colors.length];
  };

  return (
    <div className="w-full relative min-h-screen bg-white dark:bg-black py-12 lg:py-20">
      {isLoading && <SpinnerLoading className="fixed inset-0 m-auto z-50" />}
      
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
          <div className="flex flex-col items-center text-center mb-16 space-y-4">
             <span className="text-sm font-bold tracking-widest text-primary uppercase">Collections</span>
             <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground">
                Browse Categories
             </h1>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Discover our curated collections. From everyday essentials to premium selections, find exactly what you&apos;re looking for.
             </p>
          </div>

          {categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {categories.map((category, index) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  className="group relative flex flex-col justify-between h-[280px] p-8 rounded-[2rem] bg-gray-50 dark:bg-zinc-900 border border-transparent dark:border-zinc-800 hover:border-gray-200 dark:hover:border-zinc-700 transition-all duration-500 overflow-hidden"
                >
                    {/* Hover Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/0 group-hover:from-gray-100/50 group-hover:via-transparent group-hover:to-transparent dark:group-hover:from-zinc-800/50 transition-all duration-500" />
                    
                    <div className="relative z-10 flex justify-between items-start">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${getCategoryColor(index)}`}>
                            <LayoutGrid className="w-7 h-7" />
                        </div>
                        <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-300">
                             <ChevronRight className="w-5 h-5 -ml-0.5 group-hover:ml-0.5 transition-all" />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:translate-x-1 transition-transform duration-300">
                            {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium group-hover:text-primary transition-colors">
                           Browse Collection
                        </p>
                    </div>
                </Link>
              ))}
            </div>
          ) : (
            !isLoading && (
                <div className="flex flex-col items-center justify-center py-32 text-muted-foreground space-y-6">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-900 rounded-3xl flex items-center justify-center">
                        <Folder className="w-10 h-10 opacity-20" />
                    </div>
                    <p className="text-lg font-medium">No categories found</p>
                </div>
            )
          )}
      </div>
    </div>
  );
}
