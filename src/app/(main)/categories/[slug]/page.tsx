"use client";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { getTreeCategories } from "@/features/category/categoryAction";
import { getProductsBySlugOfCategory } from "@/features/product/productAction";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const path = usePathname();
  const slug = path.split("/")[2]; // Get slug from path
  const { isLoading: isCategoryLoading, categories, error } = useAppSelector(
    (state) => state.category
  );
  const { byCategory, isLoading: isProductLoading } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(getTreeCategories());
  }, [dispatch]);

  useEffect(() => {
    if (slug) {
        dispatch(getProductsBySlugOfCategory(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const currentCategoryName = categories?.find(c => c.slug === slug)?.name || "Category";

  return (

    <div className="w-full relative bg-white dark:bg-black min-h-screen">
       {(isCategoryLoading || isProductLoading) && <SpinnerLoading className="fixed inset-0 m-auto z-50" />}
       
       <div className={cn("transition-opacity duration-300", (isCategoryLoading || isProductLoading) ? "opacity-30" : "opacity-100")}>
           
           {/* Hero Section */}
           <div className="relative w-full py-20 lg:py-32 bg-[#F5F5F7] dark:bg-[#1C1C1E] flex flex-col items-center justify-center text-center px-4 overflow-hidden mb-8">
                {/* Background Pattern */}
               <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
               
               <div className="relative z-10 space-y-4 max-w-4xl mx-auto">
                   <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
                     {currentCategoryName}
                   </h1>
                   <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                      Explore the latest collection designed to inspire and perform.
                   </p>
               </div>
           </div>

           {/* Sticky Category Navigation */}
           <div className="sticky top-[60px] z-40 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 mb-10">
               <div className="max-w-[1400px] mx-auto px-4 py-4 overflow-x-auto no-scrollbar">
                  <div className="flex gap-2 min-w-max">
                        {categories && categories.length > 0 && categories.map((category) => {
                            const isActive = category.slug === slug;
                            return (
                                <Link key={category._id} href={`/categories/${category.slug}`} scroll={false}>
                                    <div className={cn(
                                        "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300",
                                        isActive 
                                            ? "bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/5" 
                                            : "bg-gray-100 dark:bg-zinc-800 text-muted-foreground hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-foreground"
                                    )}>
                                        {category.name}
                                    </div>
                                </Link>
                            )
                        })}
                  </div>
               </div>
           </div>
           
           {/* Products Grid */}
           <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
               <div className="flex items-center justify-between mb-8">
                  <span className="text-sm font-medium text-muted-foreground">
                      Showing {byCategory?.length || 0} products
                  </span>
                  {/* Sort Controls could go here */}
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                {byCategory && byCategory.length > 0 ? (
                  byCategory.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))
                ) : (
                    !(isCategoryLoading || isProductLoading) && (
                      <div className="col-span-full flex flex-col items-center justify-center py-32 text-center">
                         <div className="w-24 h-24 bg-gray-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                            <span className="text-4xl">🔍</span>
                         </div>
                        <h3 className="text-xl font-bold mb-2">No products found</h3>
                        <p className="text-muted-foreground mb-6">We couldn&apos;t find any products in this category.</p>
                        <Button asChild className="rounded-full px-8">
                            <Link href="/products">Browse All Products</Link>
                        </Button>
                      </div>
                    )
                )}
              </div>
          </div>
      </div>
    </div>
  );
}
