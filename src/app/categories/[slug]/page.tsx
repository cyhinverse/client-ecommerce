"use client";
import SpinnerLoading from "@/components/common/SpinerLoading";
import { Card, CardHeader } from "@/components/ui/card";
import { getTreeCategories } from "@/features/category/categoryAction";
import { getProductsBySlugOfCategory } from "@/features/product/productAction";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const path = usePathname();
  const [currentIndex, setIndex] = useState(0);
  const { isLoading, categories, error } = useAppSelector(
    (state) => state.category,
  );
  const { product } = useAppSelector((state) => state.product);


  useEffect(() => {
    dispatch(getTreeCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProductsBySlugOfCategory(path.split("/")[2]));
  }, [dispatch]);

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % categories.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [categories?.length]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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

  const randomColorIndex = useMemo(() => {
    return Math.floor(Math.random() * bgColor.length);
  }, [bgColor.length]);

  const handleMove = (index: number) => {
    setIndex(index);
  };

  return (
    <main className="w-full min-h-screen p-4 mx-auto max-w-7xl border border-gray-200 rounded-lg mb-20">
      <section className="m-10">
        <h1 className="text-5xl font-semibold mb-4 items-center justify-center flex">
          Product Categories
        </h1>
        {categories && categories.length > 0 ? (
          <div className="flex gap-4 flex-wrap items-center justify-center m-5 ">
            {categories.map((category, index) => (
              <div
                key={category._id}
                className={`w-fit h-fit p-5 border border-gray-200 rounded-xl ${currentIndex === index
                  ? bgColor[randomColorIndex]
                  : "bg-white"
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

      {isLoading && <SpinnerLoading />}
      <section className="mb-20">
        <h1 className="flex items-center justify-center font-semibold text-4xl mb-8">
          Products for this category
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 m-10">
          {product && product.length > 0 ? (
            product.map((p) => (
              <Card
                key={p._id}
                className="w-full shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Product Image */}
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  {p.images && p.images.length > 0 ? (
                    <Image
                      src={p.images[0].url}
                      alt={p.name}
                      width={200}
                      height={200}
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <span className="text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <CardHeader className="pb-2">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-2">
                    {p.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-red-600">
                      {p.price?.discountPrice?.toLocaleString("vi-VN")}đ
                    </span>
                    {p.price?.currentPrice !== p.price?.discountPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {p.price?.currentPrice?.toLocaleString("vi-VN")}đ
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/${p.slug}`}
                    className="w-full bg-black text-white text-center py-2 rounded hover:bg-gray-800 transition-colors block"
                  >
                    Xem chi tiết
                  </Link>
                </CardHeader>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <p className="text-gray-500 text-center py-10">
                No products found for this category
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
