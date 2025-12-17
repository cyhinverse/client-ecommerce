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
    <div className="w-full relative">
       {/* Category Navigation Pills */}
       <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-center mb-8">{currentCategoryName}</h1>
            
            {categories && categories.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map((category) => {
                        const isActive = category.slug === slug;
                        return (
                            <Link key={category._id} href={`/categories/${category.slug}`}>
                                <div className={cn(
                                    "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border",
                                    isActive 
                                        ? "bg-foreground text-background border-foreground shadow-md transform scale-105" 
                                        : "bg-background text-muted-foreground border-border/50 hover:border-foreground/50 hover:text-foreground"
                                )}>
                                    {category.name}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
       </div>

      {(isCategoryLoading || isProductLoading) && <SpinnerLoading className="fixed inset-0 m-auto" />}
      
      <div className={cn("transition-opacity", (isCategoryLoading || isProductLoading) ? "opacity-50" : "")}>
           
           {/* Products Grid */}
           <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {byCategory && byCategory.length > 0 ? (
              byCategory.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))
            ) : (
                !(isCategoryLoading || isProductLoading) && (
                  <div className="col-span-full text-center py-20 text-muted-foreground">
                    <p className="text-lg">No products found in this category</p>
                    <Button variant="link" asChild className="mt-2">
                        <Link href="/products">View all products</Link>
                    </Button>
                  </div>
                )
            )}
          </div>
      </div>
    </div>
  );
}
