"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { Card, CardContent } from "../ui/card";
import SpinnerLoading from "./SpinerLoading";
import { toast } from "sonner";
import { useEffect } from "react";
import { getNewArrivals } from "@/features/product/productAction";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

export default function NewArrivals() {
  const dispatch = useAppDispatch();
  const { isLoading,newArrivals, error } = useAppSelector(
    (state) => state.product
  );

  useEffect(() => {
    async function getData() {
      await dispatch(getNewArrivals());
    }
    getData();
  }, [dispatch]);

  if (isLoading) return <SpinnerLoading />;
  if (error) toast.error(error);

  const newArrivalProducts = newArrivals?.filter((p) => p.isNewArrival) || [];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
        <Link href="/products?filter=new" className="text-sm hover:underline">
          View All
        </Link>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {newArrivalProducts.length > 0 ? (
          newArrivalProducts.map((p) => (
            <motion.div key={p._id} variants={item}>
              <Link href={`/products/${p.slug}`} className="group block">
                <Card className="overflow-hidden border-0 shadow-none bg-transparent">
                  <CardContent className="p-0">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                      {p.images && p.images.length > 0 ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}

                      {p.isNewArrival && (
                        <Badge className="absolute top-2 left-2 bg-black text-white border-0 text-xs px-2 py-0.5">
                          NEW
                        </Badge>
                      )}

                      {p.price?.discountPrice && p.price.discountPrice < p.price.currentPrice && (
                        <Badge className="absolute top-2 right-2 bg-black text-white border-0 text-xs px-2 py-0.5">
                          -{Math.round(((p.price.currentPrice - p.price.discountPrice) / p.price.currentPrice) * 100)}%
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-medium text-sm line-clamp-1 group-hover:underline">
                        {p.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{p.brand}</p>
                      <div className="flex items-baseline gap-2 pt-1">
                        {p.price?.discountPrice && p.price.discountPrice < p.price.currentPrice ? (
                          <>
                            <span className="font-semibold text-sm">
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
                          <span className="font-semibold text-sm">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
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
            <p className="text-muted-foreground">No new arrivals at the moment</p>
          </div>
        )}
      </motion.div>
    </section>
  );
}