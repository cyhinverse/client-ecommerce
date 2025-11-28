"use client";
import SpinnerLoading from "@/components/common/SpinerLoading";
import { Card, CardHeader } from "@/components/ui/card";
import { getTreeCategories } from "@/features/category/categoryAction";
import { getProductsBySlugOfCategory } from "@/features/product/productAction";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const path = usePathname();
  const [currentIndex, setIndex] = useState(0);
  const { isLoading, categories, error } = useAppSelector(
    (state) => state.category,
  );
  const { byCategory } = useAppSelector((state) => state.product);


  useEffect(() => {
    dispatch(getTreeCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProductsBySlugOfCategory(path.split("/")[2]));
  }, [dispatch, path]);

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

  const handleMove = (index: number) => {
    setIndex(index);
  };

  return (
    <main className="w-full min-h-screen p-4 mx-auto max-w-7xl mb-20">
      <section className="m-10">
        <h1 className="text-4xl font-bold mb-8 text-center tracking-tight">
          Product Categories
        </h1>
        {categories && categories.length > 0 ? (
          <div className="flex gap-4 flex-wrap items-center justify-center m-5 ">
            {categories.map((category, index) => (
              <div
                key={category._id}
                className={`p-4 border border-gray-200 transition-all duration-300 cursor-pointer hover:bg-gray-50 ${
                  currentIndex === index ? "bg-gray-100" : ""
                }`}
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
        <h1 className="text-3xl font-bold mb-8 text-center tracking-tight">
          Products
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-10">
          {byCategory && byCategory.length > 0 ? (
            byCategory.map((p) => (
              <Link key={p._id} href={`/products/${p.slug}`} className="group block">
                <Card className="overflow-hidden border-0 shadow-none bg-transparent">
                  {/* Product Image - 3:4 Aspect Ratio */}
                  <div className="relative aspect-[3/4] bg-gray-100 mb-3">
                    {p.images && p.images.length > 0 ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <CardHeader className="p-0 space-y-1">
                    <h3 className="font-medium text-sm line-clamp-1 group-hover:underline">
                      {p.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 pt-1">
                      {p.price?.discountPrice && p.price?.currentPrice !== p.price?.discountPrice ? (
                        <>
                          <span className="font-semibold text-sm">
                            {p.price.discountPrice.toLocaleString("vi-VN")}đ
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            {p.price.currentPrice.toLocaleString("vi-VN")}đ
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-sm">
                          {p.price?.currentPrice?.toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              </Link>
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
