import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { Card, CardContent } from "../ui/card";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { toast } from "sonner";
import { useEffect, Activity } from "react";
import { getOnSaleProducts } from "@/features/product/productAction";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

export default function OnSaleProduct() {
  const dispatch = useAppDispatch();
  const { isLoading, onSale, error } = useAppSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getOnSaleProducts());
  }, [dispatch]);

  if (error) toast.error(error);

  const saleProducts = onSale?.filter(
    (p) =>
      p.onSale &&
      p.price?.discountPrice &&
      p.price?.currentPrice &&
      p.price.discountPrice < p.price.currentPrice
  ) || [];

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
    <div className="w-full relative min-h-[200px]">
       {isLoading && <SpinnerLoading className="absolute inset-0 m-auto" />}
       <Activity mode={isLoading ? "hidden" : "visible"}>
        <section className="w-full">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">On Sale</h2>
            <Link href="/products?filter=sale" className="text-sm hover:underline">
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
            {saleProducts.length > 0 ? (
            saleProducts.map((p) => {
                if (!p.price?.currentPrice || !p.price?.discountPrice) return null;

                const discountPercentage = Math.round(
                ((p.price.currentPrice - p.price.discountPrice) / p.price.currentPrice) * 100
                );

                return (
                <motion.div key={p._id} variants={item}>
                    <Link href={`/products/${p.slug}`} className="group block">
                    <Card className="overflow-hidden border-0 shadow-none bg-transparent">
                        <CardContent className="p-0">
                        <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-3">
                            {p.images && p.images.length > 0 ? (
                            <Image
                                src={p.images[0]}
                                alt={p.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                                <span className="text-muted-foreground text-xs">No Image</span>
                            </div>
                            )}

                            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground border-0 text-xs px-2 py-0.5">
                            -{discountPercentage}%
                            </Badge>
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-medium text-sm line-clamp-1 group-hover:underline">
                            {p.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">{p.brand}</p>
                            <div className="flex items-baseline gap-2 pt-1">
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
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                    </Link>
                </motion.div>
                );
            })
            ) : (
            <div className="col-span-full text-center py-20">
                <p className="text-muted-foreground">No products on sale at the moment</p>
            </div>
            )}
        </motion.div>
        </section>
      </Activity>
    </div>
  );
}