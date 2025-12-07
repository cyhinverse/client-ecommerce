"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { Card, CardContent } from "../ui/card";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { toast } from "sonner";
import { useEffect, useMemo, Activity } from "react";
import { getNewArrivals } from "@/features/product/productAction";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function NewArrivals() {
  const dispatch = useAppDispatch();
  const { isLoading, newArrivals, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(getNewArrivals());
  }, []);
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Dùng useMemo để tối ưu việc lọc
  const newArrivalProducts = useMemo(() => {
    return newArrivals?.filter((p) => p.isNewArrival) || [];
  }, [newArrivals]);

  return (
    <div className="w-full relative min-h-[200px]">
      {isLoading && <SpinnerLoading className="absolute inset-0 m-auto" />}
      <Activity mode={isLoading ? "hidden" : "visible"}>
        <section className="w-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
            <Link href="/products?sort=newest" className="text-sm hover:underline">
              View All
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {newArrivalProducts.length > 0 ? (
              newArrivalProducts.slice(0, 8).map((p) => (
                <motion.div key={p._id} variants={itemVariants}>
                  <Link href={`/products/${p.slug}`} className="group block h-full">
                    <Card className="h-full overflow-hidden border-0 shadow-none bg-transparent">
                      <CardContent className="p-0 h-full flex flex-col">
                        <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-3 rounded-lg">
                          {p.images && p.images.length > 0 ? (
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <span className="text-muted-foreground text-xs">No Image</span>
                            </div>
                          )}

                          {p.price?.discountPrice && p.price.discountPrice < p.price.currentPrice && (
                            <Badge className="absolute top-2 right-2 bg-red-500 text-white border-0 text-xs px-2 py-0.5 shadow-sm">
                              -{Math.round(((p.price.currentPrice - p.price.discountPrice) / p.price.currentPrice) * 100)}%
                            </Badge>
                          )}
                          
                          {p.isNewArrival && (
                             <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] h-5 px-1.5 backdrop-blur-sm bg-white/80">
                               NEW
                             </Badge>
                          )}
                        </div>

                        <div className="space-y-1 flex-1 flex flex-col">
                          <h3 className="font-medium text-sm line-clamp-2 group-hover:underline min-h-[40px]">
                            {p.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{p.brand}</p>
                          <div className="flex items-baseline gap-2 pt-1 mt-auto">
                            {p.price?.discountPrice && p.price.discountPrice < p.price.currentPrice ? (
                              <>
                                <span className="font-semibold text-base">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(p.price.discountPrice)}
                                </span>
                                <span className="text-xs text-muted-foreground line-through">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(p.price.currentPrice)}
                                </span>
                              </>
                            ) : (
                              <span className="font-semibold text-base">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND"
                                }).format(p.price?.currentPrice || 0)}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-muted-foreground">No new products available.</p>
              </div>
            )}
          </motion.div>
        </section>
      </Activity>
    </div>
  );
}
