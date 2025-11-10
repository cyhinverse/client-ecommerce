"use client";
import SpinnerLoading from "@/components/common/SpinerLoading";
import { getTreeCategories } from "@/features/category/categoryAction";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const [currentIndex, setIndex] = useState(0);
  const { isLoading, categories, error } = useAppSelector(
    (state) => state.category,
  );

  useEffect(() => {
    dispatch(getTreeCategories());
  }, [dispatch]);
  const handleMove = (index: number) => {
    setIndex(index);
  };
  useEffect(() => {
    handleMove(currentIndex);
  }, [currentIndex]);

  // useEffect(() => {
  //   if (!categories) return;
  //   const interval = setInterval(() => {
  //     setIndex((pre) => (pre + 1) % categories.length);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [categories]);

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

  const randomIndex: number = Math.floor(Math.random() * bgColor.length);

  return (
    <main className="w-full h-screen p-4 mt-10 mx-auto max-w-7xl border border-gray-200 rounded-lg">
      <section className="m-10">
        <h1 className="text-5xl font-semibold mb-4 items-center justify-center flex">
          Product Categories
        </h1>
        {categories && categories.length > 0 ? (
          <div className="flex gap-4 flex-wrap items-center justify-center m-5 ">
            {categories.map((category, index) => (
              <div
                key={category._id}
                className={`w-fit h-fit p-5 border border-gray-200 rounded-xl ${
                  currentIndex === index ? bgColor[randomIndex] : "bg-none"
                } hover:scale-105 transform transition-transform duration-300 cursor-pointer`}
                onMouseOver={() => handleMove(index)}
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
