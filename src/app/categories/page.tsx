"use client";
import SpinnerLoading from "@/components/common/SpinerLoading";
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

  const bgColor = [
    "bg-red-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-indigo-100",
    "bg-teal-100",
  ];

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
                className={`p-4 border border-gray-200 transition-all duration-300 cursor-pointer hover:bg-gray-50`}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-lg font-medium text-gray-700 hover:text-gray-900  transition-colors duration-300"
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
