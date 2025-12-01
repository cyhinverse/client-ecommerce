"use client";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { getTreeCategories } from "@/features/category/categoryAction";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { isLoading, categories, error } = useAppSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(getTreeCategories());
  }, [dispatch]);
  // const handleMove = (index: number) => {
  //   setIndex(index);
  // };
  // useEffect(() => {
  //   handleMove(currentIndex);
  // }, [currentIndex]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  return (
    <main className="w-full min-h-screen p-4 mt-10 mx-auto max-w-7xl">
      <section className="m-10">
        <h1 className="text-4xl font-bold mb-8 text-center tracking-tight">
          Product Categories
        </h1>
        {categories && categories.length > 0 ? (
          <div className="flex gap-4 flex-wrap items-center justify-center m-5 ">
            {categories.map((category) => (
              <div
                key={category._id}
                className={`p-4 border border-border transition-all duration-300 cursor-pointer hover:bg-muted/50`}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-lg font-medium text-muted-foreground hover:text-foreground  transition-colors duration-300"
                >
                  {category.name}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No categories found</p>
        )}
      </section>

      <section></section>
    </main>
  );
}
