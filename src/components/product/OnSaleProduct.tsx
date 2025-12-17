import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { ProductCard } from "./ProductCard";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { toast } from "sonner";
import { useEffect } from "react";
import { getOnSaleProducts } from "@/features/product/productAction";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OnSaleProduct() {
  const dispatch = useAppDispatch();
  const { isLoading, onSale, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(getOnSaleProducts());
  }, [dispatch]);

  if (error) toast.error(error);

  const saleProducts =
    onSale?.filter(
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
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full relative min-h-[200px]">
      {isLoading && <SpinnerLoading className="absolute inset-0 m-auto" />}
      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
        <section className="w-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">On Sale</h2>
            <Link
              href="/products?filter=sale"
              className="text-sm hover:underline"
            >
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
              saleProducts.slice(0, 8).map((p) => {
                 if (!p.price?.currentPrice || !p.price?.discountPrice) return null;
                 return (
                   <motion.div key={p._id} variants={item}>
                     <ProductCard product={p} />
                   </motion.div>
                 );
              })
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-muted-foreground">
                  No products on sale at the moment
                </p>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
